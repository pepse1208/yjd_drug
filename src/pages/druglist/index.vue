<template>
  <div class="druglist" :class="{bottom: is_upload === 'true'}">
    <nav-bar>药检单列表</nav-bar>
    <list-details :info="info"></list-details>
    <div class="list">
      <manage-list message="druglistdetail" :lists="lists"></manage-list>
    </div>
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
    <vue-tab-bar @fetchIndex="clickIndexNav" @handButton="createNew" v-if="isShow && is_upload === 'true'" :selectNavIndex="selectNavIndex" :navList="navList" :needButton="needButton" :btnText="'添加药检单'" :jumpUrl="'/pages/modify/main?drug=' + this.drug"></vue-tab-bar>
  </div>
</template>
<script>
  import ManageList from '@/components/managelist'
  import NavBar from '@/components/base_top'
  import ListDetails from '@/components/listdetails'
  import VueTabBar from '@/components/vueTabBar'
  import {get} from '../../utils.js'

  export default {
    components: {
      ManageList,
      ListDetails,
      NavBar,
      VueTabBar
    },
    data () {
      return {
        info: {}, // 详情信息
        next: null, // 下一页路径
        more: true, // 是否有更多数据
        loading: false,
        drug: '', // 药品id
        lists: [], // 列表数据
        selectNavIndex: -1,
        needButton: true,
        navList: [],
        isBack: '',
        isShow: false,
        is_upload: false
      }
    },
    onLoad (options) {
      var type = wx.getStorageSync('type')
      this.isShow = type === '生产企业' || type === '商业公司'
      // console.log('isShow : ' + this.isShow)
    },
    onShow () {
      this.is_upload = this.$root.$mp.query.is_upload
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.info = {}
      this.lists.length = 0
      this.isShow = false
      this.is_upload = false
      if (this.isBack === 'true') {
        wx.navigateBack({
          delta: 2
        })
      }
    },
    methods: {
      getList (_url) {
        // console.log('====', this.drug)
        var url = '/api/drugReport/report/drug/' + this.drug + '?is_upload=' + this.is_upload
        if (_url) {
          url = _url
        }
        // url += '?_rt=' + Math.random()
        get({
          url
        }).then((resp) => {
          var data = resp.data
          if (_url) {
            this.lists = this.lists.concat(data.results)
          } else {
            this.lists = data.results
            wx.stopPullDownRefresh()
            this.more = true
          }
          if (data.results.length === 0) {
            this.more = false
          } else {
            this.more = true
          }
          this.info = resp.data.results[0].drug // 获取药品信息
          this.next = data.next // 获取下页路径
        })
      },
      clickIndexNav () {},
      createNew () {}
    },
    beforeMount () {
      this.drug = this.$root.$mp.query.drug
      this.isBack = this.$root.$mp.query.isBack
      this.is_upload = this.$root.$mp.query.is_upload
      this.getList()
    },
    mounted () {},
    onPullDownRefresh () {
      // 下拉刷新
      this.getList()
    },
    onReachBottom () {
      // 上拉加载
      console.log('加载……', this.next)
      console.log(!this.next)
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
  .bottom{
    padding-bottom: 120rpx;
  }
  .druglist{
    $unit: 2rpx;
    .list{
      margin-top: -22*$unit;
    }
  }
</style>
