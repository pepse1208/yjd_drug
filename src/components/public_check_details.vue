<template>
  <div @touchmove.stop="stopPageScroll"  class="check_details">
    <progress :percent="percent" stroke-width="4" backgroundColor="#fff"/>
    <div class="modal" @click="$emit('modalShow', false)" :class="{showModal: isShowModal}"></div>
    <div class="con" :style="{'height': ((height || 0) + 'px;')}">
      <div class="conBlock">
        <slot :checkDetailsDrug="checkDetailsDrug" :checkDetailsFile="checkDetailsFile" :checkDetails="checkDetails"></slot>
        <span class="close" @click="$emit('modalShow', false)">&times;</span>
        <span @click="downloadPdf(checkDetailsUrl, checkDetailsUuid)" class="btn">查看PDF文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {throttle} from '../utils/index.js'
  import config from '../config.js'

  export default {
    props: ['isShowCheck', 'height', 'checkDetailsFile', 'checkDetailsDrug', 'checkDetails', 'checkDetailsUrl', 'checkDetailsUuid'],
    data () {
      return {
        isShowModal: false,
        downloaded: {},
        percent: 0,
        ishide: true
      }
    },
    watch: {
      'isShowCheck' (val, oldVal) {
        var vm = this
        if (val === false) {
          setTimeout(function () {
            vm.isShowModal = false
            vm.height = 0
          }, 500)
        } else {
          setTimeout(function () {
            vm.isShowModal = true
          }, 50)
        }
      }
    },
    mounted () {
    },
    computed: {
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.percent = 0
      this.height = 0
      this.isShowModal = false
    },
    methods: {
      stopPageScroll () {
      },
      modal () {
        this.isShowCheck = false
      },
      openPdf (url) { // 打开pdf
        let that = this
        wx.openDocument({
          filePath: url,
          success: function (res) {
            that.percent = 0
            // console.log('打开文档成功')
          }
        })
      },
      downloadPdf: throttle(function (url, id) { // 查看pdf
        var self = this
        if (self.downloaded[id]) {
          self.openPdf(self.downloaded[id])
        } else {
          var path = url
          if (!url.includes('https://')) {
            path = config.host + url
          }
          wx.showLoading({title: '加载中'})
          const that = this
          const downloadTask = wx.downloadFile({
            url: path,
            success: function (res) {
              const filePath = res.tempFilePath
              // 避免发送方修改文件后，没及时更新
              self.downloaded[id] = filePath
              wx.hideLoading()
              setTimeout(function () {
                self.openPdf(filePath)
              }, 300)
            }
          })
          downloadTask.onProgressUpdate((res) => {
            that.percent = res.progress
          })
        }
      }, 2000)
    }
  }
</script>
<style lang="scss">
  .check_details{
    $unit: 2rpx;
    progress {
      position: fixed;
      background: red;
      top: 60px;
      left: 0;
      width: 100%;
      z-index: 2000;
    }
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
      padding-right: 24rpx;
      padding-left: 24rpx;
      .close{
        position: absolute;
        top: 12*$unit;
        right: 17*$unit;
        color: #3E3A39;
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
        color: #FFFFFF;
        margin-top: 20*$unit;
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
          color: #A5A5A5;
        }
        .details{
          color: #3E3A39;
          width: 280*$unit;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
        }
      }
    }
  }
</style>
