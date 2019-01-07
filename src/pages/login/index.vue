<template>
  <div class="login_bg">
    <div class="login">
      <img src="../../images/logo2x.png" alt="">
      <p class="title">欢迎登录药检通平台！</p>
      <p>
        <i class="icon user"></i>
        <input type="text"  v-model="userName" id="userName" placeholder="请输入用户名(邮箱)">
      </p>
      <p>
        <i class="icon pwd"></i>
        <input type="password" v-model="pwd" id="pwd" minlength="6" maxlength="12" placeholder="请输入6-12位密码">
      </p>
      <span @click="login">登 录</span>
    </div>
  </div>
</template>
<script>
  import {post, get} from '../../utils.js'
  import config from '../../config'

  export default {
    data () {
      return {
        pageName: '', // 跳转过来页面的名字
        url: '', // 跳转下个页面的路径
        userName: '', // 用户名
        pwd: '', // 密码
        sessionid: '',
        unitedid: '',
        csrftoken: '',
        code: '',
        backName: '',
        type: '', // 公司类型
        logUrl: config.host + '/api/users/wxlogin/',
        // logUrl: config.wqhost + '/user/api/druglist_wxlogin/',
        sessionidUrl: config.wqhost + '/system/api/changelog/'
      }
    },
    onLoad (options) {
      this.pageName = options.name // 获取将要跳转的页面
    },
    onUnload: function () { // 如果页面被卸载时被执行
    },
    onReady () {
      wx.setStorage({ //
        key: 'isLogin',
        data: false
      })
      wx.setStorage({ //
        key: 'type',
        data: ''
      })
      /* let vm = this
      get({ // 获取sessionid 的接口
        url: this.sessionidUrl
      }).then((data) => {
        this.sessionid = vm.getWord(data, 'sessionid')
        wx.setStorage({ // 将sessionid存到缓存
          key: 'sessionid',
          data: this.sessionid
        })
      }) */
    },
    onShow () {
      this.userName = '' // 清空输入框的内容
      this.pwd = ''
      var vm = this
      wx.login({
        success (res) {
          vm.code = res.code
        }
      })
    },
    mounted () {
      this.backName = this.$root.$mp.query.name
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
            this.type = resultData.data.result.enterprise.type
            wx.setStorage({
              key: 'type',
              data: this.type
            })
            if (this.pageName === 'recv') {
              if (this.type === '生产企业') {
                wx.showToast({
                  icon: 'none',
                  title: '生产企业无查收药检单功能',
                  duration: 2000
                })
                return
              }
            }
            if (this.pageName) {
              this.url = '/pages/' + this.pageName + '/main'
            } else {
              this.url = '/pages/catalog/main'
            }
            var vm = this
            wx.redirectTo({
              url: vm.url,
              success () {
                // vm.randomModified()
                wx.setStorageSync('loginDate', Date.parse(new Date())) // 存下当前登录时间
                wx.setStorage({ // 判断登录
                  key: 'isLogin',
                  data: true
                })
              }
            })
            if (resultData.data.result.random_modified === undefined) return
            wx.setStorage({ //
              key: 'random_modified',
              data: resultData.data.result.random_modified
            })
          }
        }
      },
      getWord (data, word) { // 获取sessionid、_united_id、csrftoken
        if (!data.header['Set-Cookie']) return
        var str = data.header['Set-Cookie']
        if (str.indexOf(word) > -1) {
          var len = str.indexOf(word)
          len += (word.length + 1)
          str = str.slice(len)
          if (str.indexOf(';') > -1) {
            str = str.split(';')[0]
          }
          return str
        }
      },
      tip (text) {
        wx.showToast({
          title: text,
          icon: 'none',
          duration: 2000
        })
      },
      check () {
        this.userName = this.userName.trim()
        this.pwd = this.pwd.trim()
        this.userName = '67444758@tianzhu.com'
        this.pwd = '67444758'
        if (!this.userName) {
          this.tip('请输入用户名')
          return false
        }
        if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.userName)) {
          this.tip('请输入合法的用户名')
          return false
        }
        if (!this.pwd) {
          this.tip('请输入密码')
          return false
        }
        if (!/.{6,12}/.test(this.pwd)) {
          this.tip('请输入6-12位密码')
          return false
        }
        return true
      },
      async login () {
        if (!this.check()) return
        var me = this
        wx.login({
          success (res) {
            me.code = res.code
          }
        })
        var resultData = await post({
          data: {
            account: this.userName,
            password: this.pwd,
            code: this.code
          },
          url: this.logUrl,
          header: {
            'Cookie': 'sessionid=' + this.sessionid
          }
        })
        if (resultData) {
          if (resultData.statusCode >= 400) {
            var tip = resultData.data.detail || resultData.data.errmsg
            wx.showToast({
              icon: 'none',
              title: tip
            })
          } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
            this.sessionid = this.getWord(resultData, 'sessionid')
            this.unitedid = this.getWord(resultData, '_united_id')
            this.csrftoken = this.getWord(resultData, 'csrftoken')
            console.log(this.sessionid)
            console.log(this.unitedid)
            wx.setStorage({ //
              key: 'sessionid',
              data: this.sessionid
            })
            wx.setStorage({ //
              key: 'unitedid',
              data: this.unitedid
            })
            var mes = this
            wx.setStorage({ //
              key: 'Authorization',
              data: 'bearer ' + this.unitedid,
              success (res) {
                mes.randomModified()
              }
            })
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import url(../../common/page.scss);
  *{
    box-sizing: border-box;
  }
  .login_bg{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('http://192.168.1.239:8000/static/images/mobile/login_bg.jpg') center/100% no-repeat;
  }
  .login{
    $unit: 2rpx;
    margin-top: -50*$unit;
    display: flex;
    font-size: 16*$unit;
    flex-direction: column;
    align-items: center;
    background: #fff;
    width: 313*$unit;
    height: 320*$unit;
    img{
      width: 232*$unit;
      height: 41*$unit;
      margin-top: 30*$unit;
      margin-bottom: 40*$unit;
    }
    p.title{
      border: none;
      color: #3E3A39;
      height: 20*$unit;
      font-size: 12*$unit;
      margin-bottom: 16*$unit;
    }
    p{
      box-sizing: border-box;
      font-size: 12*$unit;
      color: #3E3A39;
      width: 255*$unit;
      height: 40*$unit;
      display: flex;
      align-items: center;
      margin-bottom: 20*$unit;
      border: 1px solid #C7C7C7;
      .icon{
        display: inline-block;
        width: 26*$unit;
        height: 15*$unit;
        border-right: 1px solid #C7C7C7;
      }
      i.user{
        background: url(../../images/user2x.png) center/50% no-repeat;
      }
      i.pwd{
        background: url(../../images/pwd2x.png) center/50% no-repeat;
      }
      input{
        box-sizing: border-box;
        display: inline-block;
        border: none;
        height: 100%;
        padding: 6*$unit;
        flex-grow: 1;
      }
    }
    span{
      width: 255*$unit;
      height: 40*$unit;
      font-size: 18*$unit;
      text-align: center;
      line-height: 40*$unit;
      background: #1E9EFF;
      color: #fff;
      border-radius: 8rpx;
      margin-top: 10*$unit;
      margin-bottom: 20*$unit;
      display: inline-block;
    }
  }
</style>
