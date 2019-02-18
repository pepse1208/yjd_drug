<template>
  <div class="list">
    <block v-for="(item, index) in lists" :key="index">
      <div class="item flex flexrow">
        <div class="left-info">
          <div class="supply_enterprise ellipsis">
            <span class="enterprise_txt">接收企业：</span>
            <span class="enterprise">{{item.receiver}}</span>
          </div>
          <div class="second_line flex flexrow">
            <div class="send_time ellipsis">
              <span class="time_txt">发送时间：</span>
              <span class="time">{{item.create_time}}</span>
            </div>
          </div>
        </div>
        <div class="right-btn flex flexrow">
          <span class="button" @click="look(item.uuid)">查看</span>
          <span class="button" @click="submit(item.uuid)">签章</span>
        </div>
      </div>
      </block>
      <alert-input :tips="'签章密码'" :placeholder="'请输入签章密码'" :hidden="isShow" :reason="reason" @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert-input>
  </div>
</template>
<script>
import AlertInput from '@/components/alert'
import {put} from '../utils.js'
import {throttle} from '../utils/index.js'
export default {
  components: {
    AlertInput
  },
  data () {
    return {
      isShow: false,
      reason: '',
      password: '',
      uuid: ''
    }
  },
  props: ['lists'],
  methods: {
    look: throttle(function (uuid) {
      wx.navigateTo({
        url: '/pages/send_apply_detail/main?uuid=' + uuid
      })
    }, 2000),
    submit: throttle(function (uuid) {
      let drugSign = wx.getStorageSync('DrugSign')
      let setPassword = wx.getStorageSync('set_password')
      this.uuid = uuid
      if (!drugSign) {
        wx.showModal({
          title: '温馨提示',
          content: '您没有签章权限，请联系管理设置。',
          showCancel: false
        })
        return
      }
      if (!setPassword) {
        wx.showModal({
          title: '温馨提示',
          content: '您尚未设置签章密码，请先前往电脑端药检通平台设置。',
          showCancel: false
        })
        return
      }
      this.isShow = true
    }, 500),
    async sign () {
      this.isShow = false
      var resp = await put({
        url: '/api/drugReport/send/' + this.uuid + '/',
        data: {
          password: this.password
        }
      })
      var data = resp.data
      var code = resp.statusCode
      if (code >= 200 && code < 300) {
        this.$parent.getData()
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none'
        })
      }
    },
    cancelShow (msg) {
      this.isShow = msg
      this.reason = ''
    },
    alertConfirm (msg) {
      this.password = msg.reason
      this.sign()
    }
  }
}
</script>
<style scoped lang="scss">
.list {
  box-shadow:0px 0px 11px 0px rgba(139,139,139,0.14);
}
.item {
  padding: 22rpx 0;
  margin: 0 22rpx;
  border-bottom: 2rpx solid #EEEEEE;
}
.item:last-child {
  border-bottom: 0;
}
.supply_enterprise {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 30rpx;
  margin-bottom: 30rpx;
  color: #3E3A39;
}
.second_line {
  height: 24rpx;
  line-height: 24rpx;
  font-size: 24rpx;
  color: #a5a5a5;
}
.ellipsis {
  width: 352rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right-btn {
  .icon {
    width: 26rpx;
    height: 12rpx;
    margin-left: 12rpx;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      margin-top: -18rpx;
    }
  }
}
span.button{
  display: inline-block;
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  background: #1E9EFF;
  font-size: 28rpx;
  color: #fff;
  text-align: center;
  border-radius: 8rpx;
  box-shadow:0px 7px 16px 0px rgba(121,197,255,0.5);
  margin-left: 20rpx;
}
</style>
