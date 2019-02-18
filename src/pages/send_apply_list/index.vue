<template>
  <div class="applylist">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>待签章列表</base-top>
    <div class="_search flex flexrow">
      <input v-model="enterprise_name" placeholder="请输入企业全称" type="text" class="_search_input">
      <span class="_search_text" @click="searchDrug">查&emsp;询</span>
    </div>
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
import {get} from '../../utils.js'
import {throttle} from '../../utils/index.js'
export default {
  components: {
    BaseTop,
    NavigationBar,
    sendApplyList
  },
  data () {
    return {
      next: '',
      lists: [],
      more: true,
      text: '暂无数据',
      noMoreData: 'no_datas',
      searchUrl: '/api/drugReport/send/list/',
      enterprise_name: ''
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
          enterprise_name: this.enterprise_name,
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
    searchDrug: throttle(function () {
      this.getData()
    }, 300)
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
    this.enterprise_name = ''
  }
}
</script>
<style scoped lang="scss">
._search_input {
  width: 528rpx;
}
</style>
