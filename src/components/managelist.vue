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
        <span class="button" @click="downloadPdf(item.file, item.uuid)">查看</span>
        <span class="button" @click="tipDetail(item)">详情</span>
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
        isShow: true
      }
    },
    methods: {
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
            console.log(uuid)
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
            console.log('打开文档成功')
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
        width: 210*$unit;
        span.ellipsis1{
          width: 135*$unit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span.ellipsis2{
          width: 145*$unit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .title{
          width: 220*$unit;
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
      margin: 12*$unit 0 0 0;
      width: 100%;
      border-bottom: 1px solid #ddd;
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
  }
</style>
