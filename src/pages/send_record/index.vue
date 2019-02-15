<template>
  <div class="send_record">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>发送记录</base-top>
    </div>
    <div class="_container mart">
      <block v-for="(item, index) in lists" :key="index">
        <div class="druglist" @click="toCheck(item.uuid)">
          <div class="supply_enterprise">
            <span class="enterprise_txt">供应企业：</span>
            <span class="enterprise">{{item.receiver}}</span>
          </div>
          <div class="second_line flex flexrow">
            <div class="send_time">
              <span class="time_txt">发送时间：</span>
              <span class="time">{{item.create_time}}</span>
            </div>
            <div class="status flex flexrow">
              <div :class="item.status === '待对方查收' ? 'orange': (item.status === '对方已接收' ? 'green' : (item.status === '对方已退回' ? 'red' : (item.status === '已处理' ? 'gray' : 'red')))">{{item.status}}</div>
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
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import {get} from '../../utils.js'
  import {changePwd} from '../../utils/tochangepwd.js'
  import {throttle} from '../../utils/index.js'

  export default {
    components: {
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        lists: [],
        next: null,
        more: true,
        text: '暂无数据',
        tip: '',
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
      toCheck: throttle(function (id) { // 查看pdf drugReport/send/info/list
        wx.navigateTo({
          url: '/pages/send_record_details/main?id=' + id
        })
      }, 2000),
      async getData (_url) {
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/drugReport/send/list'
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
    .orange{
      color: #FF821D;
    }
    .green{
      color: #16AB24;
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
    .supply_enterprise {
      height: 30rpx;
      line-height: 30rpx;
      font-size: 30rpx;
      margin-bottom: 30rpx;
      color: #3E3A39;
    }
    .second_line {
      height: 24rpx;
      line-height: 24rpx;
      font-size: 24rpx;
      color: #3E3A39;
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
  }
</style>
