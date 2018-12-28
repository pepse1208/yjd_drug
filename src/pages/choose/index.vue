<template>
  <div class="drugmanage">
    <nav-bar>新建药检单</nav-bar>
    <div class="alldruglist _container">
      <search-input :url="searchUrl" @renderData="recvData">查询</search-input>
      <manage-list message="modify" :lists="lists" router="choose"></manage-list>
    </div>
    <p class="no_more_data" v-if="!more">
      暂无更多数据
    </p>
  </div>
</template>
<script>
  import NavBar from '@/components/base_top'
  import SearchInput from '@/components/searchInput'
  import ManageList from '@/components/managelist'
  import {get} from '../../utils.js'

  export default {
    components: {
      NavBar,
      SearchInput,
      ManageList
    },
    data () {
      return {
        id: '',
        next: null,
        more: true,
        is_upload: true,
        clickFlag: false,
        lists: [],
        searchUrl: '/api/common/drug/list/'
      }
    },
    onLoad (options) {
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.lists.length = 0
      this.next = null
      this.is_upload = true
      this.clickFlag = false
    },
    onShow () {},
    methods: {
      async getList (_url) {
        var url
        if (_url) {
          url = _url
        } else {
          url = this.searchUrl
        }
        await get({
          url
        }).then((resp) => {
          var data = resp.data
          if (_url) {
            this.lists = this.lists.concat(data.result)
          } else {
            this.lists = data.result
            wx.stopPullDownRefresh()
            this.more = true
          }
          if (data.result.length === 0) {
            this.more = false
          } else {
            this.more = true
          }
          this.next = data.next // 获取下页路径
        })
      },
      recvData (data) {
        if (data.count === 0) {
          this.more = false
        } else {
          this.more = true
        }
        this.lists = data.result
        this.next = data.next
      }
    },
    mounted () {
      this.id = this.$root.$mp.query.id
      this.getList()
    },
    onPullDownRefresh () {
      // 下拉刷新
      this.getList()
    },
    onReachBottom () {
      // 上拉加载
      if (!this.next) {
        this.more = false
        return false
      }
      this.getList(this.next)
    }
  }
</script>
<style lang="scss" scoped>
  @import url(../../common/base.scss);
  .drugmanage{
    margin-bottom: 56rpx;
  }
  .alldruglist {
    padding: 40rpx 30rpx 0 32rpx;
  }
</style>
