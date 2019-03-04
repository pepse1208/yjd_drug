<template>
  <div class="selected-list">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>设置发货数量</base-top>
    </div>
    <div class="step-list list-shadow">
      <div class="item flex li-style flexrow" v-for="(item, key) in selectedDrug" :key="key">
        <div class="details">
          <div class="enterprise ellipsis">
            <span>{{item.drug.name}}</span>
          </div>
          <div class="second_line ellipsis">
            <div class="credit-code ellipsis">
              <span>生产批号：</span>
              <span>{{item.batch}}</span>
            </div>
          </div>
        </div>
        <div class="set-count flex flexrow">
          <input type="text" placeholder="请填写发货数量" v-model="item.amount">
          <img src="../../images/set-count.png" alt="">
        </div>
      </div>
    </div>
    <div class="foot flex flexrow">
      <div class="selected-text flex flexrow" @click="toSelectedList">
        <img class="next-icon" src="../../images/prev-step.png" />
        <span class="next-text">上一步</span>
        </div>
      <div class="next-step" @click="submit">
        <span class="next-text">申请发送</span>
      </div>
    </div>
    <div class="placeholder"></div>
    <alert-input :tips="tips" :placeholder='placeholder' :hidden="isShow" :reason="reason" @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert-input>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import AlertInput from '@/components/alert'
import $store from '../../store/index'
import {post, put} from '../../utils.js'
export default {
  components: {
    NavigationBar,
    BaseTop,
    AlertInput
  },
  data () {
    return {
      selectedDrug: {},
      drugReportsObj: {},
      uuid: '',
      drugSign: false,
      tips: '请输入【签章密码】完成签章', // 弹出框 title
      placeholder: '请输入签章密码', // 弹出框 placeholder
      isShow: false, // 弹出框 是否弹出
      reason: ''
    }
  },
  methods: {
    toSelectedList () {
      wx.navigateBack({
        delta: '1'
      })
    },
    submit () {
      let selectedDrug = this.selectedDrug
      let drugReportArr = []
      for (let key in selectedDrug) {
        drugReportArr.push({
          uuid: key,
          amount: selectedDrug[key].amount || 0
        })
      }
      this.drugReportsObj.drugReports = drugReportArr
      this.drugReportsObj.receiver = $store.state.receiver
      this.completeAjaxPost()
    },
    async completeAjaxPost () {
      var data = await post({
        url: '/api/drugReport/send/',
        data: this.drugReportsObj
      })
      var code = data.statusCode
      if (code === 500) {
        wx.showToast({
          title: data.data.errmsg + '，请重新签章。',
          icon: 'none',
          duration: 4000,
          success () {
            wx.reLaunch({
              url: '/pages/send_record/main'
            })
          }
        })
        return
      }
      if (code < 200 || code >= 300) {
        wx.showModal({
          title: '提示',
          content: data.data.errmsg,
          icon: 'none',
          showCancel: false
        })
        return
      }
      this.uuid = data.data.result.uuid
      if (!this.drugSign) {
        wx.showModal({
          title: '温馨提示',
          content: '药检单已申请！目前状态：待签章！',
          confirmText: '查看记录',
          icon: 'none',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/send_record/main'
              })
            }
          }
        })
        return
      }
      this.isShow = true
    },
    async signatureCode (password) {
      var data = await put({
        url: '/api/drugReport/send/' + this.uuid + '/',
        data: {
          password: password
        }
      })
      var code = data.statusCode
      if (code >= 200 && code < 300) {
        wx.reLaunch({
          url: '/pages/send_record/main'
        })
      } else if (code >= 400) {
        wx.showModal({
          title: '提示',
          content: data.data.errmsg,
          icon: 'none',
          showCancel: false
        })
      }
    },
    cancelShow (msg) {
      this.isShow = msg
      this.reason = ''
    },
    alertConfirm (msg) {
      let password = msg.reason
      password.replace(/^\s+|\s+$/g, '')
      if (!password) {
        wx.showToast({
          title: '请输入签章密码。',
          icon: 'none'
        })
      }
      this.signatureCode(password)
    }
  },
  beforeMount () {
    this.selectedDrug = $store.state.selectedList
    this.drugSign = wx.getStorageSync('DrugSign')
  },
  onUnload: function () {
    this.selectedDrug = {}
    this.drugReportsObj = {}
    this.uuid = ''
    this.drugSign = false
    this.isShow = false
    this.reason = ''
  },
  onPullDownRefresh () {
    // 下拉刷新
    wx.stopPullDownRefresh()
  }
}
</script>
<style>
._search_input {
  width: 528rpx;
}
</style>

<style scoped lang="scss">
.list {
  margin-bottom: 50rpx;
}
.item {
  align-items: center;
  padding: 0;
  > .details {
    width: 100%;
  }
  .set-count {
    height: 48rpx;
    font-size: 28rpx;
    color: #C7C7C7;
    > img {
      width: 10rpx;
      height: 16rpx;
      margin-top: -4rpx;
    }
  }
}
.enterprise {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 30rpx;
  margin: 24rpx 0;
  color: #3E3A39;
}
.second_line {
  justify-content: space-between;
  height: 24rpx;
  line-height: 24rpx;
  font-size: 24rpx;
  margin-bottom: 24rpx;
  color: #3E3A39;
  .credit-code {
    font-size: 24rpx;
    color: #a5a5a5;
  }
  .selected {
    width: 140rpx;
    color: #A5A5A5;
    font-size: 24rpx;
  }
}
.ellipsis {
  width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btns {
  width: 220rpx;
  > span {
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    color: #fff;
    border-radius: 4rpx;
  }
  .drug-detail {
    margin-right: 20rpx;
    box-shadow: 0px 7px 16px 0px rgba(121,197,255,0.5);
  }
  .delete {
    box-shadow:0px 7px 16px 0px rgba(255,115,105,0.5);
  }
}
.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  padding: 0 32rpx 0 56rpx;
  font-size: 24rpx;
  box-sizing: border-box;
  background: #FFF;
  box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
  .selected-text {
    color: #1E9EFF;
    .next-icon {
      width: 26rpx;
      height: 12rpx;
      margin-right: 8rpx;
    }
  }
  .next-step {
    justify-content: center;
    width: 162rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    color: #FFF;
    background: #1E9EFF;
  }
}
.foot, .placeholder {
  width: 100%;
  height: 98rpx;
}
</style>
