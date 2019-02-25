<template>
  <div   class="check_details">
    <progress :percent="percent" stroke-width="4" backgroundColor="#fff"/>
    <div class="modal" @click="$emit('modalShow', false)" :class="{showModal: isShowModal}"></div>
    <div class="con" :class="{showCon: isShowCheck, showConthree: isShowCheck && specialDetails.type}">
      <div class="conBlock">
        <div class="line">
          <span class="explain">品种名称</span>
          <span class="details">{{checkDetails.name}}</span>
        </div>
        <div class="line">
          <span class="explain">剂型</span>
          <span class="details">{{checkDetails.all_dosage}}</span>
        </div>
        <div class="line">
          <span class="explain">材质</span>
          <span class="details">{{checkDetails.drug_material}}</span>
        </div>
        <div class="line">
          <span class="explain">包装规格</span>
          <span class="details">{{checkDetails.package}}</span>
        </div>
        <div class="line">
          <span class="explain">批准文号</span>
          <span class="details">{{checkDetails.reg_number}}</span>
        </div>
        <div class="line">
          <span class="explain">生产企业</span>
          <span class="details">{{checkDetails.production_enterprise}}</span>
        </div>
        <div class="line">
          <span class="explain">生产批号</span>
          <span class="details">{{checkDetails.batch}}</span>
        </div>
        <div class="line">
          <span class="explain">发货数量</span>
          <span class="details">{{checkDetails.amount}}</span>
        </div>
        <!--特殊处理-->
        <!--已处理、对方已接收、对方已退回-->
        <block v-if="specialDetails.state === '已处理' || specialDetails.state === '对方已接收' || specialDetails.state === '对方已退回'">
          <!--对方接收-->
          <block v-if="specialDetails.type === 1">
            <div class="line">
              <span class="explain">审核结果</span>
              <span class="details">审核通过</span>
            </div>
          </block>
          <!--对方退回-->
          <block v-if="specialDetails.type === 2">
            <div class="line">
              <span class="explain">拒绝原因</span>
              <span class="details">{{specialDetails.reason}}</span>
            </div>
          </block>
          <!--对方删除-->
          <block v-if="specialDetails.type === 3">
            <div class="line">
              <span class="explain">删除原因</span>
              <span class="details">{{specialDetails.reason}}</span>
            </div>
          </block>
        </block>
        <!--已取消、待对方查收-->
        <block v-if="specialDetails.state === '已取消' || specialDetails.state === '待对方查收'">
          <div class="line">
            <span class="explain">报告日期</span>
            <span class="details">{{specialDetails.report_date}}</span>
          </div>
          <div class="line">
            <span class="explain">生产日期</span>
            <span class="details">{{specialDetails.product_date}}</span>
          </div>
          <div class="line">
            <span class="explain">有效期至</span>
            <span class="details">{{specialDetails.validity}}</span>
          </div>
        </block>
        <span class="close" @click="$emit('modalShow', false)">&times;</span>
        <span @click="downloadPdf(checkDetails.url, checkDetails.uuid)" class="btn">查看PDF文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {throttle} from '../utils/index.js'
  import config from '../config.js'

  export default {
    props: ['isShowCheck', 'checkDetails', 'specialDetails'],
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
          }, 500)
        } else {
          setTimeout(function () {
            vm.isShowModal = true
          }, 50)
        }
      }
    },
    mounted () {
      console.log('组件', this.checkDetails)
      console.log('特殊处理', this.specialDetails.type)
    },
    computed: {
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.percent = 0
      this.isShowModal = false
    },
    methods: {
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
              }, 700)
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
<style lang="scss" scoped>
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
      position: absolute;
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
      position: absolute;
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
          color: #A5A5A5FF;
          margin-left: 24rpx;
        }
        .details{
          color: #3E3A39FF;
          margin-right: 24rpx;
        }
      }
    }
    .showCon{
      height: 500*$unit;
    }
    .showConthree{
      height: 435*$unit;
    }
  }
</style>
