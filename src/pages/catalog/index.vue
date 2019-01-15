<template>
<div class="root">
  <div class="catalog flex">
    <block  v-for="(item, index) in lists" :key="index">
      <div class="item" @click="jump(item.url, item.isMustLogin)">
        <div class="text">
          <span>{{item.title}}</span>
          <img src="../../images/enter_white2x.png" alt="">
        </div>
      </div>
    </block>
  </div>
  <!--<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">获取权限</button>-->
</div>
</template>
<script>
  import {getStorageOpenid, get} from '../../utils.js'

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
    onShow () {
      wx.getStorage({
        key: 'sessionid',
        success (res) {
        }
      })
      // this.randomModified()
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.lists = []
    },
    methods: {
      async randomModified  () { // 将判断是否修改密码存入缓存
        var resultData = await get({
          url: '/api/users/detail/'
        })
        if (resultData) {
          if (resultData.statusCode >= 400) {
            wx.showToast({
              icon: 'none',
              title: resultData.data.errmsg
            })
          } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
            if (resultData.data.result.random_modified === undefined) return
            // console.log(resultData.data.result.random_modified + '模块')
            wx.setStorage({ //
              key: 'random_modified',
              data: resultData.data.result.random_modified
            })
          }
        }
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
      },
      jump (url, flag) {
        getStorageOpenid(url, flag)
      }
    },
    mounted () {
      this.lists = []
      let type = wx.getStorageSync('type')
      if (type === '生产企业') {
        this.lists = this.productionLists
      } else {
        this.lists = this.all
      }
    }
  }
</script>
<style lang="scss" scoped>
.root {
  padding: 0 64rpx 0 60rpx;
}
.catalog {
  width: 100%;
}
.item {
  box-sizing: border-box;
  width: 100%;
  height: 200rpx;
  margin-top: 64rpx;
  text-align: center;
  border-radius: 8rpx;
  background: linear-gradient(to right,#1E58FF, #1E8CFF , #2CA1FF);
  border-radius: 8rpx;
  box-shadow:0px 20rpx 30rpx rgba(30,140,255,.3);
  /*background: url(../../images/colorBg.jpg);*/
  color: #fff;
  .text {
    width:100%;
    height:60rpx;
    margin-top:75rpx;
  }
  span {
    font-size: 34rpx;
  }
  img {
    width: 42rpx;
    height: 14rpx;
    vertical-align: middle;
    margin-top: -12rpx;
    margin-left: 18rpx;
  }
}
</style>
