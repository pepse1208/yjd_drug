<template>
  <div class="drugmanage ">
    <nav-bar>药检单管理</nav-bar>
    <div class="alldruglist _container" v-if="lists.length > 0">
      <manage-list message="druglist" :lists="lists" :isUpload="is_upload"></manage-list>
    </div>
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
    <vue-tab-bar @fetchIndex="clickIndexNav" @handButton="createNew" :selectNavIndex="selectNavIndex" :navList="navList" :needButton="needButton" :btnText="'新建药检单'" :jumpUrl="'/pages/choose/main'" :type="type"></vue-tab-bar>
  </div>
</template>
<script>
  import NavBar from '@/components/base_top'
  import ManageList from '@/components/managelist'
  import VueTabBar from '@/components/vueTabBar'
  import {get} from '../../utils.js'
  import {changePwd} from '../../utils/tochangepwd.js'
  // import config from '../../config'

  export default {
    components: {
      NavBar,
      ManageList,
      VueTabBar
    },
    data () {
      return {
        next: null,
        more: true,
        is_upload: true,
        clickFlag: false,
        tip: '',
        type: '',
        lists: [],
        selectNavIndex: 0,
        needButton: true,
        navList: []
      }
    },
    onLoad (options) {
      // this.tip = options.tip
      this.type = wx.getStorageSync('type')
      this.navList = [
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/upload_black.png'),
          selectedIconPath: require('../../images/upload_blue.png'),
          text: '我的药检单',
          isShow: (this.type === '生产企业' || this.type === '商业公司')
        },
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/recv_black.png'),
          selectedIconPath: require('../../images/recv_blue.png'),
          text: '药检单云文件柜',
          isShow: this.type !== '生产企业'
        }
      ]
      if (this.type !== '生产企业' && this.type !== '商业公司') {
        this.needButton = false
        this.is_upload = false
        this.selectNavIndex = 1
      }
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.is_upload = true
      this.lists.length = 0
      this.selectNavIndex = 0
      this.needButton = true
      /* wx.reLaunch({
        url: config.indexUrl
      }) */
    },
    onShow () {
      changePwd('drugmanage')
    },
    methods: {
      async getList (_url) {
        var url = '/api/drugReport/report/list/?is_upload=' + this.is_upload
        if (_url) {
          url = _url
        }
        // url += '?_rt=' + Math.random()
        await get({
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
          this.next = data.next // 获取下页路径
        })
      },
      clickIndexNav (msg) {
        this.selectNavIndex = msg
        if (msg === 0) {
          this.is_upload = true
        } else {
          this.is_upload = false
        }
        this.getList()
      },
      createNew (msg) {
        this.needButton = msg
      }
    },
    mounted () {
      this.getList()
      /* if (this.tip === 'success') {
        wx.showToast({
          icon: 'none',
          title: '修改成功',
          duration: 4500,
          success () {
            console.log('提示修改成功')
          }
        })
      } */
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
    padding-bottom: 120rpx;
    
  }
</style>
