<template>
  <div class="drugmanage">
    <nav-bar>药检单管理</nav-bar>
    <div class="_container mart" v-if="lists.length > 0">
      <manage-list message="druglist" :lists="lists" :isUpload="is_upload"></manage-list>
    </div>
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
    <div class="addNew" @click="addNew" v-if="is_upload"></div>
    <vue-tab-bar @fetchIndex="clickIndexNav" :selectNavIndex="selectNavIndex" :navList="navList" :type="type" v-if="isShow"></vue-tab-bar>
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
        navList: [],
        isShow: false
      }
    },
    onLoad (options) {
      // this.tip = options.tip
      this.type = wx.getStorageSync('type')
      if (this.type === '商业公司') {
        this.isShow = true
      }
      this.navList = [
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/upload_black.png'),
          selectedIconPath: require('../../images/upload_blue.png'),
          text: '我的药检单'
        },
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/recv_black.png'),
          selectedIconPath: require('../../images/recv_blue.png'),
          text: '药检单云文件柜'
        }
      ]
      if (this.type !== '生产企业' && this.type !== '商业公司') {
        this.is_upload = false
        this.selectNavIndex = 1
      }
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.is_upload = true
      this.lists.length = 0
      this.selectNavIndex = 0
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
        var resp = await get({
          url
        })
        var data = resp.data
        if (_url) {
          this.lists = this.lists.concat(data.results)
        } else {
          this.lists = data.results
          wx.stopPullDownRefresh()
          this.more = true
        }
        if (!data.next) {
          this.more = false
          this.next = null
        } else {
          this.more = true
          this.next = data.next // 获取下页路径
        }
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
      addNew () {
        wx.navigateTo({
          url: '/pages/choose/main'
        })
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
    .addNew {
      position: fixed;
      bottom: 146rpx;
      right: 48rpx;
      width: 134rpx;
      height: 134rpx;
      background: url(../../images/addNew.png);
      background-size: 134rpx 134rpx;
      color: #fff;
      border-radius: 50%;
      text-align: center;
    }
  }
</style>
