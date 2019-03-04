<template>
  <div class="step1">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>发送药检单</base-top>
    </div>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'name'">查&emsp;询</search-input>
    <div>
      <div class="list">
        <send-step-list fatherPage="send_step1" :lists="lists"></send-step-list>
      </div>
    </div>
    <p :class="noMoreData" v-if="!more">
      {{text}}
    </p>
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
      searchUrl: '/api/enterprise/list/'
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
    jump () {
      wx.navigateTo({
        url: '/pages/send_step2/main'
      })
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
<style lang="scss">
._search_input {
  width: 528rpx;
}
</style>
