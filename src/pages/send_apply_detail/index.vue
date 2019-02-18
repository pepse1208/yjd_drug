<template>
  <div class="apply-detail">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>待签章列表详情</base-top>
    applydetail
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import {get} from '../../utils.js'
export default {
  components: {
    BaseTop,
    NavigationBar
  },
  data () {
    return {
      lists: [],
      next: '',
      more: true,
      uuid: '',
      searchUrl: '/api/drugReport/send/info/list/'
    }
  },
  beforeMount () {
    this.uuid = this.$root.$mp.query.uuid
    console.log(this.uuid)
    this.getData()
  },
  methods: {
    async getData (_url) {
      wx.stopPullDownRefresh()
      var self = this
      var url = self.searchUrl + this.uuid + '/'
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
    },
    searchDrug () {
      this.getData()
    }
  }
}
</script>
<style scoped lang="scss">
</style>
