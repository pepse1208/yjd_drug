<template>
  <div class="send_record_details">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>发送详情</base-top>
    </div>
    <send-card :info="info" ></send-card>
    <div class="tab" v-if="isTab">
      <div @click="accept" :class="{active: isAccept}">
        对方接收&nbsp;({{acceptNum}})
        <i></i>
      </div>
      <div @click="back" :class="{active: isBack}">
        对方退回&nbsp;({{backNum}})
        <i></i>
      </div>
      <div @click="remove" :class="{active: isRemove}">
        对方删除&nbsp;({{removeNum}})
        <i></i>
      </div>
    </div>
    <div class="managelist">
      <div class="item isflex" :key="index" v-for="(item, index) in lists">
        <div class="intro">
          <p class="title flex flexrow">
            <span class="ellipsis1 bold" >{{item.drugReport.drug.name || '--'}}</span>
          </p>
          <p class="company flex flexrow" >
            <span class="sub" >生产批号：</span>
            <span class="ellipsis2">{{item.drugReport.batch || '--'}}</span>
          </p>
        </div>
        <div >
          <span class="button" @click="modalShow(true, item, 400)">查看</span>
          <span class="button" v-if="isModify" @click="modify(item.drugReport.uuid,item.uuid)">修改</span>
        </div>
      </div>
    </div>
    <p class="text-footer" :class="{pb70: isCancelSend}" v-if="!more">
      暂无更多数据
    </p>
    <div class="btn" @click="cancel" v-if="isCancelSend">
      <span>取消发送</span>
    </div>
    <div class="btn" @click="resend" v-if="isResend">
      <span>重新发送</span>
    </div>
    <alert :isPassword="true" :tips="tips" :placeholder='placeholder' :hidden="isShow"  @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert>
    <!--弹框详情组件-->
    <public-check-details :checkDetailsDrug="checkDetailsDrug" :checkDetailsFile="checkDetailsFile" :checkDetails="checkDetails" :checkDetailsUuid="checkDetailsUuid" :checkDetailsUrl="checkDetailsUrl" :isShowCheck="isShowCheck" :height="height" @modalShow="modalShow">
      <div class="line">
        <span class="explain">品种名称</span>
        <span class="details">{{checkDetailsDrug.name || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">剂型</span>
        <span class="details">{{checkDetailsDrug.all_dosage || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">材质</span>
        <span class="details">{{checkDetailsDrug.drug_material || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">包装规格</span>
        <span class="details">{{checkDetailsDrug.package || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">批准文号</span>
        <span class="details">{{checkDetailsDrug.reg_number || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">生产企业</span>
        <span class="details">{{checkDetailsDrug.production_enterprise || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">生产批号</span>
        <span class="details">{{checkDetailsOther.batch || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">发货数量</span>
        <span class="details">{{checkDetails.amount || '0'}}</span>
      </div>
      <!--特殊处理-->
      <!--已处理、对方已接收、对方已退回-->
      <block v-if="checkDetailsFile.state === '已处理' || checkDetailsFile.state === '对方已接收' || checkDetailsFile.state === '对方已退回'">
        <!--对方接收-->
        <block v-if="checkDetailsFile.type === 1">
          <div class="line">
            <span class="explain">审核结果</span>
            <span class="details">审核通过</span>
          </div>
        </block>
        <!--对方退回-->
        <block v-if="checkDetailsFile.type === 2">
          <div class="line">
            <span class="explain">拒绝原因</span>
            <span class="details">{{checkDetailsFile.reason || '--'}}</span>
          </div>
        </block>
        <!--对方删除-->
        <block v-if="checkDetailsFile.type === 3">
          <div class="line">
            <span class="explain">删除原因</span>
            <span class="details">{{checkDetailsFile.reason || '--'}}</span>
          </div>
        </block>
      </block>
      <!--已取消、待对方查收-->
      <block v-if="checkDetailsFile.state === '已取消' || checkDetailsFile.state === '待对方查收'">
        <div class="line">
          <span class="explain">报告日期</span>
          <span class="details">{{checkDetailsFile.report_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">生产日期</span>
          <span class="details">{{checkDetailsFile.product_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="explain">有效期至</span>
          <span class="details">{{checkDetailsFile.validity || '--'}}</span>
        </div>
      </block>
    </public-check-details>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import sendCard from '@/components/send_card'
  import Searchlist from '@/components/searchlist'
  import PublicCheckDetails from '@/components/public_check_details'
  import Alert from '@/components/alert'

  import {get, post, DELETE} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar,
      sendCard,
      Alert,
      PublicCheckDetails,
      Searchlist
    },
    data () {
      return {
        info: {}, // 详情信息
        next: null, // 下一页路径
        more: true, // 是否有更多数据
        id: '',
        uuid: null,
        status: 1,
        isActive: true,
        isAccept: true,
        acceptNum: 0,
        isBack: false,
        backNum: 0,
        isRemove: false,
        removeNum: 0,
        isCancelSend: false,
        isResend: false,
        isTab: false,
        isModify: false,
        isModifyFlag: false,
        password: null,
        isShow: false,
        isShowModal: false, // 弹窗显示状态
        isShowCheck: false,
        checkDetailsUrl: null,
        checkDetailsUuid: null,
        height: 0,
        checkDetails: {},
        checkDetailsDrug: {},
        checkDetailsOther: {},
        checkDetailsFile: {},
        tips: '签章密码',
        state: '',
        placeholder: '输入签章密码',
        lists: [] // 列表数据
      }
    },
    onShow () {
      this.id = this.$root.$mp.query.id
    },
    mounted () {
      this.getData()
      /* if (this.isTab) {
        this.getLists()
      } else {
        this.getAllLists()
      } */
    },
    onPullDownRefresh () {
      // 下拉刷新
      if (this.isTab) {
        this.getLists()
      } else {
        this.getAllLists()
      }
    },
    onReachBottom () {
      // 上啦触底
      if (this.next) {
        if (this.isTab) {
          this.getLists(this.next)
        } else {
          this.getAllLists(this.next)
        }
      } else {
        this.more = false
      }
    },
    onUnload: function () {
      this.info = {}
      this.more = true
      this.noMoreData = 'no_datas'
      this.isAccept = true
      this.isBack = false
      this.isRemove = false
      this.status = 1
      this.isModify = false
      this.isTab = false
      this.isCancelSend = false
      this.isResend = false
      this.lists = []
      this.isShowModal = false
      this.isShowCheck = false
      this.checkDetailsUrl = null
      this.checkDetailsUuid = null
      this.height = 0
      this.checkDetails = {}
      this.checkDetailsDrug = {}
      this.checkDetailsOther = {}
      this.checkDetailsFile = {}
    },
    methods: {
      modalShow (flag, details, height) { // 查看详情隐藏
        this.isShowCheck = flag
        this.height = height
        if (details) {
          this.checkDetails = details
          this.checkDetailsDrug = details.drugReport.drug
          this.checkDetailsOther = details.drugReport
          this.checkDetailsUrl = details.file
          this.checkDetailsUuid = details.uuid
          if (this.state === '已处理' || this.state === '对方已接收' || this.state === '对方已退回') {
            if (this.status === 1) {
              this.checkDetailsFile = {
                state: this.state,
                type: 1
              }
            } else if (this.status === 2) {
              this.checkDetailsFile = {
                state: this.state,
                type: 2,
                reason: details.reason
              }
            } else if (this.status === 3) {
              this.checkDetailsFile = {
                state: this.state,
                type: 3,
                reason: details.reason || ''
              }
            }
            this.height = 430
          }
          if (this.state === '待对方查收' || this.state === '已取消') {
            this.checkDetailsFile = {
              state: this.state,
              report_date: details.drugReport.report_date || '--',
              product_date: details.drugReport.product_date || '--',
              validity: details.drugReport.validity || '--'
            }
            this.height = 500
          }
        }
      },
      cancelShow (msg) { // 签章密码取消
        this.isShow = msg
        this.reason = ''
      },
      alertConfirm (msg) { // 签章密码确定
        this.password = msg.reason
        if (this.password) {
          this.isShow = false
          this.consentReq(this.uuid)
        }
      },
      resend () { // 同意操作
        let ukey = wx.getStorageSync('use_ukey')
        let DrugSign = wx.getStorageSync('DrugSign')
        let setPassword = wx.getStorageSync('set_password')
        if (ukey === 1) {
          wx.showToast({
            icon: 'none',
            title: 'UKEY用户暂时无法在小程序上使用签章功能',
            duration: 2000
          })
          return
        }
        if (DrugSign === false) {
          wx.showToast({
            icon: 'none',
            title: '您没有签章权限，请联系管理员设置。',
            duration: 2000
          })
          return
        }
        if (setPassword !== true) { // 没有设置签章密码
          wx.showToast({
            icon: 'none',
            title: '您尚未设置签章密码，请前往电脑端设置。',
            duration: 2000
          })
          return
        }
        this.isShow = true
      },
      async consentReq (uuid) { // 输入签章密码后
        let password = this.password
        var url = '/api/drugReport/reply/' + uuid + '/'
        var resultData = await post({
          url,
          data: {
            password: password
          }
        })
        if (resultData) {
          if (resultData.data.code >= 400) {
            var tip = resultData.data.detail || resultData.data.errmsg
            wx.showToast({
              icon: 'none',
              title: tip
            })
          } else if (resultData.data.code >= 200 && resultData.data.code < 300) {
            // this.getList()
            wx.navigateBack({
              url: '/pages/send_record/main',
              success () {
              }
            })
            wx.showToast({
              icon: 'none',
              title: ''
            })
          }
        }
      },
      cancel () {
        var vm = this
        wx.showModal({
          title: '',
          content: '取消发送后,不会返还扣除的发送页数,确认取消？',
          success (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              vm.cancelAjax()
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      },
      modify (drug, uuid) { // 修改按钮
        wx.navigateTo({
          url: '/pages/modification/main?drug=' + drug + '&uuid=' + uuid
        })
      },
      accept () {
        this.isAccept = true
        this.isBack = false
        this.isRemove = false
        this.isModify = false
        this.status = 1
        this.getLists()
      },
      back () {
        this.isAccept = false
        this.isBack = true
        this.isRemove = false
        if (this.isModifyFlag) {
          this.isModify = true
        } else {
          this.isModify = false
        }
        this.status = 2
        this.getLists()
      },
      remove () {
        this.isAccept = false
        this.isBack = false
        this.isRemove = true
        this.isModify = false
        this.status = 3
        this.getLists()
      },
      async cancelAjax () {
        wx.stopPullDownRefresh()
        var url = '/api/drugReport/send/' + this.id + '/'
        var resp = await DELETE({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
          wx.navigateBack({
            url: '/pages/send_record/main',
            success () {
            }
          })
          /* wx.showToast({
            icon: 'none',
            title: '取消成功',
            duration: 2000,
            success () {
              setTimeout(function () {
                wx.navigateBack({
                  url: '/pages/send_record/main',
                  success () {
                  }
                })
              }, 1000)
            }
          }) */
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      },
      async resendAjax () {
        wx.stopPullDownRefresh()
        var url = '/api/drugReport/send/' + this.id + '/'
        var resp = await post({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      },
      async getData () {
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/drugReport/send/info/' + this.id
        var resp = await get({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
          self.info = {
            receiverName: data.receiver.name,
            senderUserName: data.sender_user.name,
            receiverLicense: data.receiver.license,
            createTime: data.create_time,
            state: data.status,
            receiverUserName: data.receiver_user.name,
            receiverUserPhone: data.receiver_user.phone
          }
          this.state = data.status
          this.uuid = data.uuid
          this.acceptNum = data.count['签收']
          this.backNum = data.count['退回']
          this.removeNum = data.count['删除']
          this.isModifyFlag = true
          if (data.status === '待签章') {
            this.isCancelSend = true
            this.isResend = false
            this.isTab = false
          } else if (data.status === '待对方查收') {
            this.isCancelSend = true
            this.isResend = false
            this.isTab = false
          } else if (data.status === '已取消') {
            this.isCancelSend = false
            this.isResend = false
            this.isTab = false
          } else {
            this.isCancelSend = false
            this.isResend = false
            this.isModifyFlag = false
            if (data.status === '对方已退回') {
              this.isResend = true
              this.isModifyFlag = true
            }
            this.isTab = true
          }
          if (this.isTab) {
            this.getLists()
          } else {
            this.getAllLists()
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      },
      async getAllLists (_url) {
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/drugReport/send/info/list/' + this.id + '/'
        if (_url) {
          url = _url
        }
        var resp = await get({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
          self.next = data.next
          if (_url) {
            self.lists = this.lists.concat(data.results)
          } else {
            self.lists = data.results
          }
          if (data.results.length === 0) {
            self.more = false
          } else {
            self.more = true
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      },
      async getLists (_url) {
        this.lists = []
        wx.stopPullDownRefresh()
        var self = this
        var url = '/api/drugReport/send/info/list/' + this.id + '?status=' + this.status
        if (_url) {
          url = _url
        }
        var resp = await get({
          url
        })
        var code = resp.statusCode
        if (code >= 200 && code < 300) {
          var data = resp.data
          self.next = data.next
          if (_url) {
            self.lists = this.lists.concat(data.results)
          } else {
            self.lists = data.results
          }
          if (data.results.length === 0) {
            self.more = false
          } else {
            self.more = true
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .send_record_details{
    $unit: 2rpx;
    .tab{
      display: flex;
      div{
        color: #3E3A39;
        font-size: 12*$unit;
        border-bottom: 1px solid #DFDFDF;
        padding-bottom: 10*$unit;
        padding-right: 14*$unit;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:last-child{
          padding-right: 0;
        }
        i{
          display: inline-block;
          width: 23*$unit;
          border-bottom: 2px solid transparent;
          position: absolute;
          left: 50%;
          margin-left: -23*$unit;
          bottom: 0*$unit;
        }
      }
      div.active{
        color: #1E9EFF;
        i{
          border-bottom: 2px solid #1E9EFF;
        }
      }
    }
    .managelist{
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
          background: url('../../images/enter2x.png') right 5px no-repeat;
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
    .btn{
      height: 50*$unit;
      background: #fff;
      box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      span{
        width: 81*$unit;
        height: 28*$unit;
        background: #1E9EFF;
        text-align: center;
        line-height: 28*$unit;
        font-size: 12*$unit;
        color: #fff;
        border-radius: 4*$unit;
        margin-right: 16*$unit;
      }
    }
    .pb70{
      padding-bottom: 70*$unit;
    }
  }
</style>
