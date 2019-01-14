<template>
<div class="root">
  <!--<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">获取权限</button>-->
  <div class="index_section">
    <!--@change="bindDateChangeStart($event)"-->
    <picker mode="date"
            :value="startDate"
            :start="pickerStart" end="2217-09-01" @change="bindDateChange($event)"  >
      <div class="index_picker">
        <div class="">起始日期</div>
        <div class="">{{ startDate }}</div>
      </div>
    </picker>
  </div>
  <div @click="up">上传</div>
  <img :src="imgUrl" alt="">
  <div @click="look">预览</div>
  <div @click="fingerpriter">指纹认证</div>
  <div @click="password">密码输入</div>
  <alert :tips="tips" :placeholder='placeholder' :hidden="isShow"  @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert>
</div>
</template>
<script>
  import Alert from '@/components/alert'

  export default {
    components: {
      Alert
    },
    data () {
      return {
        tips: '签章密码',
        placeholder: '输入签章密码',
        isShow: false,
        reason: '',
        imgUrl: '',
        urls: [],
        startDate: '2018-05-9',
        endDate: '2018-02-21',
        pickerStart: '2018-05-6'
      }
    },
    mounted () {
      // 设置时间
      let today = this.getToday()
      this.startDate = today
      this.endDate = today
      this.pickerStart = today
    },
    methods: {
      cancelShow (msg) {
        this.isShow = msg
        this.reason = ''
      },
      alertConfirm (msg) {
      },
      password () {
        this.isShow = true
        /* let text = '<div class="inputList">' +
          '<input id="i1" autofocus type="password">' +
          '<input id="i2" type="password">' +
          '<input id="i3" type="password">' +
          '<input id="i4" type="password">' +
          '<input id="i5" type="password">' +
          '<input id="i6" type="password">' +
          '</div>'
        wx.showModal({
          title: '',
          content: '<input id="i1" autofocus type="password">' + text,
          showCancel: false,
          success (res) {
          }
        }) */
      },
      getToday () {
        let myDate = new Date()
        let myMonth = myDate.getMonth() + 1
        if (myMonth < 10) {
          myMonth = '0' + myMonth
        }
        let mydate = myDate.getDate()
        if (myDate.getDate() < 10) {
          mydate = '0' + myDate.getDate()
        }
        let today = myDate.getFullYear() + '-' + myMonth + '-' + mydate
        return today
      },
      bindDateChange (e) {
        // console.log('picker发送选择改变，携带值为', e.mp.detail.value)
        this.startDate = e.mp.detail.value
        /* this.setData({
          date: e.mp.detail.value
        }) */
      },
      /* bindDateChangeStart (e) {
        this.region = e.mp.detail.value
      }, */
      up () {
        var vm = this
        wx.chooseImage({
          success (res) {
            const tempFilePaths = res.tempFilePaths
            vm.imgUrl = tempFilePaths
            vm.urls.push(tempFilePaths[0])
            // console.log(typeof vm.urls)
            /* wx.uploadFile({
              url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                user: 'test'
              },
              success(res) {
                const data = res.data
                // do something
              }
            }) */
          }
        })
      },
      look () {
        if (!this.imgUrl) {
          wx.showToast({
            icon: 'none',
            title: '未上传图片'
          })
          return
        }
        var vm = this
        wx.previewImage({
          current: vm.imgUrl, // 当前显示图片的http链接
          urls: vm.imgUrl // vm.urls // 需要预览的图片http链接列表
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
      },
      fingerprint () {
        wx.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请用指纹解锁',
          success (res) {
          }
        })
      },
      fingerpriter (e) {
        // console.log(wx.canIUse('checkIsSupportSoterAuthentication'))
        if (wx.canIUse('checkIsSupportSoterAuthentication')) { // 判断此接口是否可用
          // console.log('接口可用')
          wx.checkIsSupportSoterAuthentication({
            fail: function () {
              // console.log('调用失败')
            },
            success: function (res) {
              // console.log('本机支持的 SOTER 生物认证', res)
              if (res.supportMode === []) {
                // console.log('不具备任何被SOTER支持的生物识别方式')
              } else if (res.supportMode[0] === 'fingerPrint') {
                wx.startSoterAuthentication({
                  requestAuthModes: ['fingerPrint'],
                  challenge: '123456',
                  authContent: '请用指纹解锁',
                  success: function (res) {
                    // console.log('js', res)
                  },
                  fail: function (res) {
                    // console.log('用户取消了指纹识别，或调用出现错误')
                  }
                })
              } else {
                // console.log('当前该设备不支持指纹识别')
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
