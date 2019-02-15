<template>
  <div class="passwd">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>修改密码</base-top>
    </div>
    <div class="box">
      <div class="panel">
        <p>
          <span>旧密码：</span>
          <input v-model="oldPwd" minlength="6" maxlength="12"  type="password" placeholder="请输入您的旧密码">
        </p>
        <p>
          <span>新密码：</span>
          <input v-model="newPwd" minlength="6" maxlength="12" type="password" placeholder="请输入您的新密码">
        </p>
        <p>
          <span>确认密码：</span>
          <input v-model="affirmPwd" minlength="6" maxlength="12" type="password" placeholder="请再输入一遍以确认您的新密码">
        </p>
      </div>
      <span @click="confirm" class="button">保  存</span>
    </div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import {put} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        oldPwd: '',
        newPwd: '',
        affirmPwd: '',
        sessionid: '',
        pageName: ''
      }
    },
    onLoad (options) {
      this.pageName = options.name // 获取将要跳转的页面
    },
    onShow () {
      this.oldPwd = ''
      this.newPwd = ''
      this.affirmPwd = ''
    },
    methods: {
      check () {
        this.oldPwd = this.oldPwd.trim()
        this.newPwd = this.newPwd.trim()
        this.affirmPwd = this.affirmPwd.trim()
        if (!this.oldPwd) {
          wx.showToast({
            title: '请输入旧密码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (!this.newPwd) {
          wx.showToast({
            title: '请输入新密码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (!/.{6,12}/.test(this.newPwd)) {
          wx.showToast({
            title: '请输入6-12位新密码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (!this.affirmPwd) {
          wx.showToast({
            title: '请输入密码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (!/.{6,12}/.test(this.affirmPwd)) {
          wx.showToast({
            title: '请输入6-12位密码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        if (this.newPwd !== this.affirmPwd) {
          wx.showToast({
            title: '两次密码输入不一致',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        return true
      },
      async confirm () {
        if (!this.check()) { // 密码校验
          return
        }
        var resultData = await put({
          data: {
            old_password: this.oldPwd,
            new_password: this.affirmPwd
          },
          url: '/api/users/password'
        })
        if (resultData) {
          if (resultData.statusCode >= 400) {
            wx.showToast({
              icon: 'none',
              title: resultData.data.errmsg
            })
          } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
            var pageName = this.pageName
            wx.showToast({
              icon: 'none',
              title: '修改成功',
              duration: 2000,
              success () {
                setTimeout(function () {
                  wx.navigateBack({
                    url: '/pages/' + pageName + '/main?tip=success',
                    success () {
                    }
                  })
                }, 1000)
              }
            })
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .passwd{
    $unit: 2rpx;
    .box{
      display: flex;
      flex-direction: column;
      align-items: center;
      .panel{
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        width: 351*$unit;
        height: 160*$unit;
        padding: 20*$unit 20*$unit 0 15*$unit;
        box-shadow:0px 0px 11px 0px rgba(139,139,139,0.14);
        p{
          height: 30*$unit;
          line-height: 30*$unit;
          display: flex;
          margin-bottom: 15*$unit;
          span{
            color: #3E3A39;
            font-size: 15px;
            flex-basis: 80*$unit;
          }
          input{
            box-sizing: border-box;
            height: 100%;
            width: 247*$unit;
            padding: 6*$unit 7*$unit;
            flex-grow: 1;
            color: #A5A5A5;
            font-size: 12px;
            border: 1px solid #ddd;
          }
        }
      }
      .button{
        width: 223*$unit;
        height: 40*$unit;
        text-align: center;
        line-height: 40*$unit;
        background: #169bd5;
        color: #fff;
        border-radius: 8rpx;
        display: inline-block;
        margin: 30*$unit auto;
      }
    }
  }
</style>
