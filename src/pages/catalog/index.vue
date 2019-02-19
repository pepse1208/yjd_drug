<template>
<div class="root">
  <navigation-bar :back="false"></navigation-bar>
  <base-top>首页</base-top>
  <div class="catalog flex">
    <!-- <block  v-for="(item, index) in lists" :key="index">
      <div class="item" @click="jump(item.url, item.isMustLogin)">
        <div class="text">
          <span>{{item.title}}</span>
          <img src="../../images/enter_white2x.png" alt="">
        </div>
      </div>
    </block> -->
    <div v-for="(item, index) in lists" :key="index">
      <p class="module">{{item.title}}</p>
      <div class="list flex">
        <div class="item flex" v-for="(subItem, subIndex) in item.list" :key="subIndex" @click="jump(subItem.url)">
          <span class="icon" :style="'background-position:'+ subItem.position"></span>
          <p class="text">{{subItem.title}}</p>
        </div>
      </div>
    </div>
    <!-- <div>
      <p class="module">药检单管理</p>
      <div class="list flex">
        <div class="item flex">
          <span class="icon"></span>
          <p class="text">我的药检单</p>
        </div>
        <div class="item flex">
          <span class="icon"></span>
          <p class="text">药检单云文件柜</p>
        </div>
      </div>
    </div>
    <div>
      <p class="module">发送药检单</p>
      <div class="list flex">
        <div class="item flex">
          <span class="icon"></span>
          <p class="text">申请发送</p>
        </div>
        <div class="item flex">
          <span class="icon"></span>
          <p class="text">待签章列表</p>
        </div>
        <div class="item flex">
          <span class="icon"></span>
          <p class="text">发送记录</p>
        </div>
      </div>
    </div> -->
  </div>
  <!--<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">获取权限</button>-->
</div>
</template>
<script>
  // import {getStorageOpenid, get} from '../../utils.js'
  import {get} from '../../utils.js'
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import $store from '../../store/index'
  export default {
    data () {
      return {
        productionLists: [
          {title: '药检单管理', url: '/pages/drugmanage/main', isMustLogin: false},
          {title: '药检单索取记录', url: '/pages/askfor/main', isMustLogin: false}
        ],
        all: [
          {title: '查收药检单', url: '/pages/recv/main', isMustLogin: false},
          {title: '药检单管理', url: '/pages/drugmanage/main', isMustLogin: false},
          {title: '药检单查询', url: '/pages/drugsearch/main', isMustLogin: false},
          {title: '药检单索取记录', url: '/pages/askfor/main', isMustLogin: false}
        ],
        lists: []
      }
    },
    components: {
      NavigationBar,
      BaseTop
    },
    onShow () {
      wx.getStorage({
        key: 'sessionid',
        success (res) {
        }
      })
      this.randomModified()
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.lists = []
    },
    methods: {
      async randomModified  () { // 将判断是否修改密码存入缓存
        var resultData = await get({
          url: '/api/users/detail/'
        })
        console.log(resultData.data)
        if (!resultData) return
        if (resultData.statusCode >= 400) {
          wx.showToast({
            icon: 'none',
            title: resultData.data.errmsg
          })
        } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
          let result = resultData.data.result
          // let permission = result.permissions
          let sidebar = result.sidebar
          let randomModified = result.random_modified
          $store.commit('initSideBar', sidebar)
          this.lists = $store.state.sidebar
          if (randomModified === undefined) return
          wx.setStorage({
            key: 'random_modified',
            data: randomModified
          })
        }
      },
      jump (url) {
        console.log(url)
        wx.navigateTo({
          url
        })
      },
      getSetting () {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  // console.log('用户已经授权过')
                }
              })
            } else {
              // console.log('用户还未授权过')
            }
          }
        })
      },
      getUserInfo1 () {
        // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
        if (wx.canIUse('button.open-type.getUserInfo')) {
          // 用户版本可用
        } else {
          // console.log('请升级微信版本')
        }
      },
      bindGetUserInfo (e) {
        if (e.mp.detail.rawData) {
          // console.log('用户按了允许授权按钮')
        } else {
          // console.log('用户按了拒绝按钮')
        }
      }
      // jump (url, flag) {
      //   getStorageOpenid(url, flag)
      // }
    },
    mounted () {
      // this.lists = []
      // let type = wx.getStorageSync('type')
      // if (type === '生产企业') {
      //   this.lists = this.productionLists
      // } else {
      //   this.lists = this.all
      // }
    }
  }
</script>
<style lang="scss" scoped>
.catalog {
  position: absolute;
  left: 0;
  width: 100%;
  align-items: flex-start;
  > div {
    width: 100%;
  }
}
.module {
  width: 100%;
  height: 54rpx;
  line-height: 54rpx;
  background: #F6F6F6;
  padding-left: 24rpx;
}
.list {
  flex-direction: row;
  justify-content: flex-start;
  margin: 40rpx 0;
  padding-left: 24rpx;
  .item {
    align-items: center;
    white-space: nowrap;
    margin-right: 48rpx;
  }
  .icon {
    display: inline-block;
    width: 41px;
    height: 40px;
    margin-bottom: 24rpx;
    background: url(../../images/catalog_icon.png) no-repeat -5px -2px;
  }
  .text {}
}
</style>
