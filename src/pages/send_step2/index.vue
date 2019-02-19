<template>
  <div class="step2">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>选择药检单</base-top>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'name'">查&emsp;询</search-input>
    <div class="list">
      <send-step-list fatherPage="send_step2" :lists="lists"></send-step-list>
    </div>
    <p :class="noMoreData" v-if="!more">
      {{text}}
    </p>
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
import {get} from '../../utils.js'
export default {
  components: {
    NavigationBar,
    BaseTop,
    SearchInput,
    SendStepList
  },
  data () {
    return {
      next: '',
      lists: [],
      more: true,
      text: '暂无数据',
      noMoreData: 'no_datas',
      searchUrl: '/api/drugReport/report/list/'
    }
  },
  methods: {
    async getData (_url) {
      wx.stopPullDownRefresh()
      var self = this
      var url = self.searchUrl
      if (_url) {
        url = _url
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
        self.next = data.next
        console.log(data)
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
    },
    recvData (data) {
      if (data.count === 0) {
        this.more = false
      } else {
        this.more = true
      }
      this.lists = data.results
      this.next = data.next
    },
    toSendStep2 () {
      wx.navigateTo({
        url: '/pages/send_step2/main'
      })
    },
    toSelectedList () {
      wx.navigateTo({
        url: '/pages/selected_list/main'
      })
    },
    toSetSendCount () {
      wx.navigateTo({
        url: '/pages/set_send_count/main'
      })
    }
  },
  beforeMount () {
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
    this.next = ''
    this.lists = []
    this.text = '暂无数据'
    this.noMoreData = 'no_datas'
  }
}
</script>
<style>
._search_input {
  width: 528rpx;
}
</style>

<style scoped lang="scss">
.list {
  margin-bottom: 50rpx;
}
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
