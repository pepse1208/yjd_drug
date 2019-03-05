<template>
  <div class="step2">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>选择药检单</base-top>
    </div>
    <search-input :url="listUrl" @renderData="recvData" :placeholder='"请输入品种名称"' searchName="drug_name">查&emsp;询</search-input>
    <div class="list">
      <send-step-list fatherPage="send_step2" :lists="lists"  @controlModal="controlModal"></send-step-list>
    </div>
    <p :class="noMoreData" v-if="!more">
      {{text}}
    </p>
    <bottom-to-top-modal :showModalStatus="showModalStatus" @hideModal="hideModal" :height="height" :lists="drugs"></bottom-to-top-modal>
    <div class="foot flex flexrow">
      <div class="selected-text" @click="toSelectedList">查看已选药检单</div>
      <div class="next-step flex flexrow" @click="toSetSendCount">
        <span class="next-text">下一步</span>
        <img class="next-icon" src="../../images/next-step.png" />
      </div>
    </div>
    <div class="placeholder"></div>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import SearchInput from '@/components/searchInput'
import SendStepList from '@/components/send_step_list'
import BottomToTopModal from '@/components/bottom_to_top_modal'
import $store from '../../store/index'
import {mapActions} from 'vuex'
import {get} from '../../utils.js'
export default {
  components: {
    NavigationBar,
    BaseTop,
    SearchInput,
    SendStepList,
    BottomToTopModal
  },
  data () {
    return {
      listNextUrl: '',
      drugNextUrl: '',
      drugIndex: 0,
      drugs: {},
      lists: {},
      more: true,
      text: '暂无数据',
      noMoreData: 'no_datas',
      listUrl: '/api/drugReport/report/list/',
      drugUrl: '/api/drugReport/report/drug/',
      showModalStatus: false,
      height: 0
    }
  },
  methods: {
    async getListData (nextUrl) {
      wx.stopPullDownRefresh()
      var self = this
      var url = self.listUrl
      if (nextUrl) {
        url = nextUrl
      }
      var resp = await get({
        url,
        data: {
          status: 0
        }
      })
      var code = resp.statusCode
      if (code >= 200 && code < 300) {
        var data = resp.data
        let result = $store.state.sendStepTwoListData
        self.listNextUrl = data.next
        self.initSendStepTwoListData(data.results)
        self.lists = result
        if (Object.keys(result).length === 0) {
          self.more = false
        } else {
          self.more = true
        }
        self.text = '暂无更多数据'
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none'
        })
      }
    },
    async getDrugData ({nextUrl}) {
      wx.stopPullDownRefresh()
      var self = this
      let uuid = $store.state.sendStepTwoDrugId
      var url = self.drugUrl + uuid
      if (nextUrl) {
        url = nextUrl
      }
      var resp = await get({
        url
      })
      var code = resp.statusCode
      if (code >= 200 && code < 300) {
        var data = resp.data
        let res
        self.drugNextUrl = data.next
        if (nextUrl) {
          res = self.drugs.concat(data.results)
        } else {
          res = data.results
        }
        self.initSendStepTwoDrugData({data: res})
        if (data.results.length === 0) {
          self.more = false
        } else {
          self.more = true
        }
        self.more = false
        self.text = '暂无更多数据'
        self.drugs = $store.state.sendStepTwoDrugData
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none'
        })
      }
    },
    recvData (data) {
      this.initSendStepTwoListData(data.results)
      if (data.count === 0) {
        this.more = false
      } else {
        this.more = true
      }
      this.lists = $store.state.searchObj
      this.listNextUrl = data.next
    },
    toSendStep2 () {
      wx.navigateTo({
        url: '/pages/send_step2/main'
      })
    },
    toSelectedList () {
      this.initSelectedDrug()
      wx.navigateTo({
        url: '/pages/selected_list/main'
      })
    },
    toSetSendCount () {
      this.initSelectedDrug()
      if (Object.keys($store.state.selectedList).length === 0) {
        wx.showToast({
          title: '请先选择药检单，再操作下一步',
          icon: 'none',
          duration: 4000,
          success () {
            // wx.reLaunch({
            //   url: '/pages/send_record/main'
            // })
          }
        })
        return
      }
      wx.navigateTo({
        url: '/pages/set_send_count/main'
      })
    },
    hideModal (bool) {
      let self = this
      self.height = 0
      setTimeout(function () { self.showModalStatus = bool }, 300)
    },
    controlModal (data) {
      let self = this
      self.showModalStatus = data.showModalStatus
      setTimeout(function () { self.height = data.height }, 300)
    },
    ...mapActions({
      initSendStepTwoDrugData: 'initSendStepTwoDrugData',
      initSendStepTwoListData: 'initSendStepTwoListData',
      initSelectedDrug: 'initSelectedDrug'
    })
  },
  updated () {
    if (!this.listNextUrl) {
      this.more = false
      this.text = '暂无更多数据'
      this.noMoreData = 'no_more_data'
      return false
    }
  },
  // beforeMount () {
  //   this.getListData()
  // },
  onShow () {
    this.getListData()
  },
  onPullDownRefresh () {
    // 下拉刷新
    if (!this.loading && !this.showModalStatus) {
      this.getListData()
    } else {
      wx.stopPullDownRefresh()
    }
    // this.$forceUpdate()
  },
  onReachBottom () {
    // 上啦触底
    if (!this.loading && this.listNextUrl) {
      this.getListData(this.listNextUrl)
    }
  },
  onUnload: function () {
    this.more = true
    this.listNextUrl = ''
    this.drugNextUrl = ''
    this.drugs = {}
    this.lists = {}
    this.text = '暂无数据'
    this.noMoreData = 'no_datas'
    this.showModalStatus = false
  }
}
</script>
<style>
._search_input {
  width: 528rpx;
}
</style>

<style scoped lang="scss">
.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 32rpx 0 56rpx;
  font-size: 24rpx;
  box-sizing: border-box;
  background: #FFF;
  box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
  .selected-text {
    color: #1E9EFF;
  }
  .next-step {
    justify-content: center;
    width: 162rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    color: #FFF;
    background: #1E9EFF;
    .next-icon {
      width: 26rpx;
      height: 12rpx;
      margin-left: 8rpx;
    }
  }
}
.foot, .placeholder {
  width: 100%;
  height: 98rpx;
}
</style>
