<template>
  <div class="scan-code">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>已选药检单</base-top>
    </div>
    <progress :percent="percent" stroke-width="4" backgroundColor="#fff" class="progress"/>
    <div class="con">
      <div class="conBlock">
        <div class="line">
          <span class="explain">品种名称</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.name : '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">生产批号</span>
          <span class="details">{{drugDetails.batch || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">批准文号</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.reg_number : '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">生产企业</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.production_enterprise : '--'}}</span>
        </div>
        <div class="line" v-if="drugDetails.sender">
          <span class="explain">供应企业</span>
          <span class="details">{{drugDetails.sender ? drugDetails.sender.name :'--'}}</span>
        </div>
        <div class="line">
          <span class="explain">剂型</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.all_dosage : '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">材质</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.drug_material : '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">包装规格</span>
          <span class="details">{{drugDetails.drug ? drugDetails.drug.package : '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">报告编号</span>
          <span class="details">{{drugDetails.code || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">报告日期</span>
          <span class="details">{{drugDetails.report_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">生产日期</span>
          <span class="details">{{drugDetails.product_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">有效期至</span>
          <span class="details">{{drugDetails.validity || '--'}}</span>
        </div>
      </div>
      <!-- <span v-if="checkDetailsOther.status==='已同意'" @click="downloadPdf(checkDetailsOther.url, checkDetails.uuid)" class="btn">查看PDF文件</span> -->
      <div class="buttons flex flexrow">
        <span class="open-pdf" @click="downloadPdf">查看PDF文件</span>
        <span class="askfor" v-if="isLogin" @click="askfor">索取药检单</span>
        <span class="al-get" v-if="isLogin" @click="alGet">获取药检单</span>
      </div>
      <div class="login" v-if="!isLogin">
        <span @click="toLogin">登录后可索取药检单，前往登录</span>
      </div>
    </div>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import {get, post} from '../../utils.js'
import {throttle} from '../../utils/index.js'
import config from '../../config.js'
export default {
  components: {
    NavigationBar,
    BaseTop
  },
  data () {
    return {
      uuid: '',
      drugDetails: {},
      isLogin: false,
      url: '/api/report/drug/',
      askforUrl: '/api/ask/report/',
      alGetUrl: '/api/share/get/report/',
      downloaded: {},
      percent: 0
    }
  },
  methods: {
    async getData () { // 获取信息
      // var self = this
      var resp = await get({
        // url: self.url + self.uuid + '/'
        url: '/api/drugReport/report/' + this.uuid + '/'
      })
      var code = resp.statusCode
      console.log(resp)
      if (code >= 200 && code < 300) {
        // var data = resp.data
        this.drugDetails = resp.data.result
        console.log(this.drugDetails)
      } else {
        wx.showToast({
          title: resp.data.errmsg,
          icon: 'none'
        })
      }
    },
    toLogin () { // 去登录
      wx.navigateTo({
        url: '/pages/login/main?redirect_url=scan_code'
      })
    },
    openPdf (url) { // 打开pdf文件
      let that = this
      wx.openDocument({
        filePath: url,
        success: function (res) {
          that.percent = 0
          // console.log('打开文档成功')
        }
      })
    },
    downloadPdf: throttle(function () { // 下载保存pdf文件
      const self = this
      let uuid = this.uuid
      let url = this.drugDetails.file_url
      if (self.downloaded[uuid]) {
        self.openPdf(self.downloaded[uuid])
      } else {
        var path = url
        if (!url.includes('https://')) {
          path = config.host + url
        }
        wx.showLoading({title: '加载中'})
        const downloadTask = wx.downloadFile({
          url: path,
          success: function (res) {
            const filePath = res.tempFilePath
            self.downloaded[uuid] = filePath
            setTimeout(function () {
              self.openPdf(filePath)
            }, 300)
          },
          complete () {
            wx.hideLoading()
          }
        })
        downloadTask.onProgressUpdate((res) => {
          self.percent = res.progress
          console.log(res.progress)
          console.log(self.percent)
        })
      }
    }, 2000),
    async AjaxPost (url) {
      var resp = await post({
        url: url + this.uuid
      })
      console.log(resp)
      var code = resp.statusCode
      if (code === 500) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
      if (code >= 200 && code < 300) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: resp.data.errmsg,
          icon: 'none'
        })
      }
    },
    askfor: throttle(function () { // 索取药检单
      console.log(this.uuid)
      const self = this
      wx.showModal({
        title: '信息',
        content: '索取后，您的联系方式将提供给上游供应企业，确定吗？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            self.AjaxPost(self.askforUrl)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }, 300),
    alGet: throttle(function () { // 获取药检单
      console.log(this.uuid)
      this.AjaxPost(this.alGetUrl)
    }, 300)
  },
  beforeMount () {
    // this.uuid = this.$root.$mp.query.scene
    this.uuid = '34fd79e5-6646-4a14-bc9f-e6c2d8b8ac4f'
    // this.isLogin = wx.getStorageSync('isLogin')
    this.isLogin = true
    console.log(this.isLogin)
    this.getData()
    console.log(this.uuid)
  }
}
</script>
<style scoped lang="scss">
.progress {
  position: fixed;
  background: red;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 2000;
}
.conBlock{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 850rpx;
  padding-bottom: 50rpx;
  .line{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;
    width: 100%;
    .explain{
      font-size: 24rpx;
      color: #A5A5A5FF;
      width: 280rpx;
    }
    .details{
      color: #3E3A39FF;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.buttons{
  width: 100%;
  height: 56rpx;
  justify-content: center;
  font-size: 24rpx;
  margin: 40rpx 0;
  > span {
    margin: 0 10rpx;
    background: #1E9EFF;
    height: 56rpx;
    color: #fff;
    line-height: 56rpx;
    padding: 0 20rpx;
    border-radius: 8rpx;
  }
}
.login {
  text-align: center;
  color: #1E9EFF;
  text-decoration: underline;
}
</style>
