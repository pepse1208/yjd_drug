<template>
  <div>
    <base-top>查收药检单</base-top>
    <div class="alldruglist _container">
      <block v-for="(item, index) in lists" :key="index">
        <div class="druglist" @click="toCheck(item.uuid)">
          <div class="supply_enterprise">
            <span class="enterprise_txt">供应企业：</span>
            <span class="enterprise">{{item.sender}}</span>
          </div>
          <div class="second_line flex flexrow">
            <div class="send_time">
              <span class="time_txt">发送时间：</span>
              <span class="time">{{item.create_time}}</span>
            </div>
            <div class="status flex flexrow">
              <div :class="item.status === '待查收' ? 'orange': (item.status === '已接收' ? 'green' : (item.status === '已退回' ? 'red' : 'gray'))">{{item.status}}</div>
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
  import {get} from '../../utils.js'
  import {changePwd} from '../../utils/tochangepwd.js'
  import {throttle} from '../../utils/index.js'
//  import config from '../../config.js'
  export default {
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
    components: {
      BaseTop
    },
    methods: {
      toCheck: throttle(function (id) { // 查看pdf
        wx.navigateTo({
          url: '/pages/check_detail/main?id=' + id
        })
      }, 2000),
      async getData (_url) {
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/drugReport/receive/list'
        if (_url) {
          url = _url
        }
        var resp = await get({
          url,
          header: {
            'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjowLCJuYW1lIjoiXHU2NzZkXHU1ZGRlXHU2ZDRiXHU4YmQ1IiwidHlwZSI6OSwiZXhwIjoxNTQ0MjI3MTk5LCJ1dWlkIjoiMDA5MGMyZmQtYTIzMi00MjljLWJkY2MtNTdlNmI4YjcyMTRmIn0.b09oLbva_kElkuYGBNPQzkh18BWnJtVgNgcnBdGZ75c'
          }
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
    },
    onLoad (options) {
      // this.tip = options.tip
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
      changePwd('recv')
    },
    mounted () {
      this.getData()
      /* if (this.tip === 'success') {
        wx.showToast({
          icon: 'none',
          title: '修改成功',
          duration: 4000,
          success () {
            console.log('提示修改成功')
          }
        })
      } */
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
      /* wx.reLaunch({
        url: config.indexUrl
      }) */
    }
  }
</script>
<style lang="scss" scoped>
  .alldruglist {
    margin-top: 10rpx;
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

</style>
