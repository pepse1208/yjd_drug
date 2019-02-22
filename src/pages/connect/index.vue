<template>
  <div class="send_record">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>企业通讯录</base-top>
    </div>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'enterprise_name'">查&emsp;询</search-input>
    <statements  :lists="stateList"></statements>
    <div class="_container mart">
      <block v-for="(item, index) in lists" :key="index">
        <div class="druglist" @click="edit(item)">
          <div class="supply_enterprise">
            <span class="enterprise_dot" :class="{green_bg: !item.is_temp}"></span>
            <span class="enterprise">{{item.enterprise_name}}</span>
          </div>
          <div class="second_line flex flexrow">
            <div>
              <span >联系人：</span>
              <span >{{item.linkman}}</span>
            </div>
          </div>
          <div class="second_line flex flexrow">
            <div>
              <span >联系人手机号：</span>
              <span >{{item.phone}}</span>
            </div>
            <div class="status flex flexrow">
              <div class="icon">
                <img src="../../images/enter2x.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </block>
    </div>
    <p :class="noMoreData" v-if="!more">
      {{text}}
    </p>
    <div class="addNew" @click="addNew"></div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import Statements from '@/components/statements'
  import SearchInput from '@/components/searchInput'
  import {get} from '../../utils.js'
  import {changePwd} from '../../utils/tochangepwd.js'

  export default {
    components: {
      BaseTop,
      SearchInput,
      Statements,
      NavigationBar
    },
    data () {
      return {
        lists: [],
        next: null,
        more: true,
        text: '暂无数据',
        tip: '',
        stateList: [
          {
            text: '已认证',
            color: 'green_bg'
          },
          {
            text: '未认证',
            color: 'orange2_bg'
          }
        ],
        searchUrl: '/api/enterprise/enterpriseAddressBook/',
        noMoreData: 'no_datas'
      }
    },
    updated () {
      if (!this.next) {
        this.more = false
        this.text = '暂无更多数据'
        this.noMoreData = 'no_more_data'
        return false
      }
    },
    onShow () {
      this.getData()
      changePwd('send_record')
    },
    mounted () {
      this.getData()
    },
    onPullDownRefresh () {
      // 下拉刷新
      if (!this.loading) {
        this.getData()
      }
    },
    onReachBottom () {
      // 上啦触底
      if (!this.loading && this.next) {
        this.getData(this.next)
      }
    },
    onUnload: function () {
      this.more = true
      this.noMoreData = 'no_datas'
    },
    methods: {
      recvData (data) {
        if (data.count === 0) {
          this.more = false
        } else {
          this.more = true
        }
        this.lists = data.results
        this.next = data.next
      },
      edit (item) {
        wx.navigateTo({
          url: '/pages/connect_edit/main?operate=edit&data=' + JSON.stringify(item)
        })
      },
      addNew () {
        wx.navigateTo({
          url: '/pages/connect_edit/main?operate=new'
        })
      },
      async getData (_url) {
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/enterprise/enterpriseAddressBook'
        if (_url) {
          url = _url
        }
        var resp = await get({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
          self.next = data.next
          if (_url) {
            self.lists = this.lists.concat(data.results)
          } else {
            self.lists = data.results
          }
          if (data.results.length === 0) {
            self.more = false
          } else {
            self.more = true
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .send_record{
    $unit: 2rpx;
    ._search_input {
      width: 528rpx;
    }
    .orange{
      color: #FF821D;
    }
    .green{
      color: #16AB24;
    }
    .green_bg{
      background: #16AB24;
    }
    .red{
      color: #E71F10;
    }
    .gray{
      color: #A5A5A5;
    }
    .druglist {
      border-bottom: 1px solid #EEEEEE;
      padding: 30rpx 0;
    }
    .druglist:last-child {
      border-bottom: 0;
    }
    .enterprise_dot{
      width: 8*$unit;
      height: 8*$unit;
      border-radius: 50%;
      background: #FF821D;
      margin-right: 9*$unit;
    }
    .supply_enterprise {
      height: 30rpx;
      line-height: 30rpx;
      font-size: 30rpx;
      margin-bottom: 12*$unit;
      color: #3E3A39FF;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .second_line {
      height: 24rpx;
      line-height: 24rpx;
      font-size: 24rpx;
      color: #A5A5A5FF;
      margin-bottom: 12*$unit;
      &:last-child{
        margin-bottom: 0;
      }
    }
    .flexcolumn{
      display: flex;
      flex-direction: column;
    }
    .status {
      .icon {
        width: 26rpx;
        height: 12rpx;
        margin-left: 12rpx;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
          margin-top: -18rpx;
        }
      }
    }
    .addNew {
      position: fixed;
      bottom: 146rpx;
      right: 48rpx;
      width: 134rpx;
      height: 134rpx;
      background: url(../../images/addNew.png);
      background-size: 134rpx 134rpx;
      color: #fff;
      border-radius: 50%;
      text-align: center;
    }
  }
</style>
