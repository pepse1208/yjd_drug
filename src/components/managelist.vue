<template>
  <div class="managelist">
    <div class="item" :class="{ isflex: item.batch}" @click="item.package && jumpDetail({drug: item.drug, id: item.id})"  :key="index" v-for="(item, index) in lists">
      <div class="intro">
        <p class="title flex flexrow">
          <!-- <span class="bold sub_title" v-if="item.name">品种名称：</span> -->
          <span class="sub_title" v-if="item.batch">生产批号：</span>
          <span class="ellipsis1" :class="{bold: item.name}">{{item.name || item.batch}}</span>
        </p>
        <p class="company flex flexrow" :class="{ bg: item.package }">
          <span class="sub" v-if="item.package">包装规格：</span>
          <span class="sub" v-if="item.sender">{{isShow ? '供应企业：' : '报告日期：'}}</span>
          <span class="ellipsis2">{{item.package || item.sender.name || (item.report_date ? item.report_date : '--')}}</span>
        </p>
      </div>
      <div  v-if="item.sender">
        <!--<span class="button" @click="downloadPdf(item.file, item.uuid)">查看</span>-->
        <span class="button" @click="modal(true, item, 320)">查看</span>
      </div>
    </div>
    <!--弹框详情-->
    <div class="modal" @click="modal(false, null, 0)" :class="{showModal: isShowModal}"></div>
    <div class="con" :style="{
        'height': (height + 'px;')}">
      <div class="conBlock">
        <div class="line">
          <span class="explain">生产批号</span>
          <span class="details">{{checkDetails.batch || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">报告编号</span>
          <span class="details">{{checkDetails.code || '--'}}</span>
        </div>
        <block v-if="isShow">
          <div class="line">
            <span class="explain">供应企业</span>
            <span class="details">{{checkDetails.senderName || '--'}}</span>
          </div>
        </block>
        <div class="line">
          <span class="explain">报告日期</span>
          <span class="details">{{checkDetails.report_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">生产日期</span>
          <span class="details">{{checkDetails.product_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">有效期至</span>
          <span class="details">{{checkDetails.validity || '--'}}</span>
        </div>
        <span class="close" @click="modal(false, null, 0)">&times;</span>
        <span @click="downloadPdf(checkDetails.file, checkDetails.uuid)" class="btn">查看PDF文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {throttle} from '../utils/index.js'
  import config from '../config.js'

  export default {
    props: ['message', 'lists', 'router', 'isUpload'],
    data () {
      return {
        locked: true,
        downloaded: {},
        isShowModal: false, // 弹窗显示状态
        height: 0,
        checkDetails: {},
        isShow: true
      }
    },
    onLoad () {
      this.isShowModal = false
      this.height = 0
      this.checkDetails = {}
    },
    methods: {
      modal (flag, details, height) {
        this.isShowModal = flag
        this.height = height
        if (this.isShow && this.height !== 0) {
          this.height = 350
        }
        if (details) {
          this.checkDetails = details
          this.checkDetails.senderName = details.sender.name
        }
      },
      jumpDetail ({drug, id}) { // 跳转到药检单列表
        var uuid
        var vm = this
        if (drug) {
          uuid = drug
        } else {
          uuid = id
        }
        var url = '/pages/' + vm.message + '/main?drug=' + uuid + '&is_upload=' + this.isUpload
        if (vm.router) {
          url += '&router=' + vm.router
        }
        wx.navigateTo({
          url,
          success () {
            // console.log(uuid)
          }
        })
      },
      tipDetail (item) { // 弹窗显示详情
        var code = item.code || '--'
        var reportDate = item.report_date || '--'
        var productDate = item.product_date || '--'
        var validity = item.validity || '--'
        var senderName = item.sender.name || '--'
        wx.showModal({
          title: '',
          content: '生产批号：' + item.batch + '\r\n' + '报告日期：' + reportDate + '\r\n' + '报告编号：' + code + '\r\n' + (this.isShow ? ('供应企业：' + senderName + '\r\n') : '') + '生产日期：' + productDate + '\r\n' + '有效期至：' + validity,
          showCancel: false,
          success (res) {
          }
        })
      },
      openPdf (url) {
        wx.openDocument({
          filePath: url,
          success: function (res) {
            // console.log('打开文档成功')
          }
        })
      },
      downloadPdf: throttle(function (url, id) { // 查看pdf
        // console.log(config.host + url)
        var self = this
        if (self.downloaded[id]) {
          self.openPdf(self.downloaded[id])
        } else {
          var path = url
          if (!url.includes('https://')) {
            path = config.host + url
          }
          wx.showLoading({title: '加载中'})
          wx.downloadFile({
            url: path,
            success: function (res) {
              const filePath = res.tempFilePath
              // 避免发送方修改文件后，没及时更新
              self.downloaded[id] = filePath
              wx.hideLoading()
              self.openPdf(filePath)
            }
          })
        }
      }, 2000)
    },
    updated () {
      try {
        var url = this.$root.$mp.page.route
        var upload = this.$root.$mp.query.is_upload
        if (url.includes('druglist')) {
          if (upload !== 'true') {
            this.isShow = true
          } else {
            this.isShow = false
          }
        }
      } catch (e) {}
    }
  }
</script>
<style lang="scss" scoped>
  @import url(../common/base.scss);
  .managelist{
    $unit: 2rpx;
    .bold{
      font-weight: bold;
    }
    .isflex{
      /* 药检单列表的样式 */
      display: flex;
      justify-content: space-between;
      div.intro{
        width: 265*$unit;
        span.ellipsis1{
          width: 190*$unit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span.ellipsis2{
          width: 200*$unit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .title{
          width: 275*$unit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .item:last-child{
      border-bottom: 0px;
    }
    .item{
      box-sizing: border-box;
      padding-top: 12*$unit;
      width: 100%;
      border-bottom: 1px solid #eee;
      color: #3E3A39;
      p{
        padding-bottom: 15*$unit;
      }
      .title{
        font-size: 15*$unit;
        justify-content: flex-start;
      }
      .company{
        font-size: 12*$unit;
        justify-content: flex-start;
      }
      .bg{
        background: url('../images/enter2x.png') right 5px no-repeat;
        /*background-size: 50%;*/
        background-size:26rpx 12rpx;

      }
      // span{
      //   flex-basis: 40*$unit;
      // }
      .sub_title {
        width: 160rpx;
      }
      .sub {
        width: 120rpx;
      }
      span.ellipsis1, span.ellipsis2 {
        width: 480rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span.button{
        display: inline-block;
        width: 50*$unit;
        height: 50*$unit;
        line-height: 50*$unit;
        background: #1E9EFF;
        font-size: 15*$unit;
        color: #fff;
        text-align: center;
        border-radius: 8rpx;
        box-shadow:0px 7px 16px 0px rgba(121,197,255,0.5);
        margin-left: 15*$unit;
      }
    }
    /* 弹框详情*/
    .modal{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      background: #000;
      bottom: 0;
      opacity: 0;
      display: none;
      z-index:-1;
      /*transition: opacity 1000ms;*/
    }
    .showModal{
      opacity: 0.4;
      z-index:1001;
      display: block;
    }
    .con{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
      transition: height 500ms;
      background: #fff;
      z-index:1002;
      border-radius: 6*$unit 6*$unit 0 0;
    }
    .conBlock{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 25*$unit;
      .close{
        position: absolute;
        top: 12*$unit;
        right: 17*$unit;
        color: #3E3A39FF;
        font-size: 20px;
        width: 30*$unit;
        text-align: right;
      }
      .btn{
        width:134*$unit;
        height:40*$unit;
        background:rgba(30,158,255,1);
        border-radius:2px;
        font-size: 15px;
        line-height: 40*$unit;
        text-align: center;
        color: #FFFFFFFF;
        margin-top: 40*$unit;
        border-radius: 4*$unit;
      }
      .line{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14*$unit;
        width: 100%;
        &:first-child{
          margin-top: 50*$unit;
        }
        .explain{
          font-size: 12px;
          color: #A5A5A5FF;
          margin-left: 24rpx;
          width: 140*$unit;
        }
        .details{
          color: #3E3A39FF;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 24rpx;
        }
      }
    }
  }
</style>
