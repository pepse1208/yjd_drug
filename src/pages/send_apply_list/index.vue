<template>
  <div class="applylist">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>待签章列表</base-top>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'enterprise_name'">查&emsp;询</search-input>
    <div class="list">
      <send-apply-list :lists="lists"></send-apply-list>
    </div>
    <p :class="noMoreData" v-if="!more">
      {{text}}
    </p>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import sendApplyList from '@/components/send_apply_list'
import SearchInput from '@/components/searchInput'
import {get} from '../../utils.js'
export default {
  components: {
    BaseTop,
    NavigationBar,
    sendApplyList,
    SearchInput
  },
  data () {
    return {
      next: '',
      lists: [],
      more: true,
      text: '暂无数据',
      noMoreData: 'no_datas',
      searchUrl: '/api/drugReport/send/list/?status=0'
    }
  },
  beforeMount () {
    this.getData()
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
    }
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
