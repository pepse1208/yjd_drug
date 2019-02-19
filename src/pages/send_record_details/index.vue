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
          <span class="button" @click="check">查看</span>
          <span class="button" v-if="isModify" @click="modify(item.drugReport.uuid,item.uuid)">修改</span>
        </div>
      </div>
    </div>
    <p class="text-footer" :class="{pb70: isCancelSend}" v-if="!more">
      暂无更多数据
    </p>
    <div class="cancel" @click="cancel" v-if="isCancelSend">
      <span>取消发送</span>
    </div>
    <div class="cancel" @click="resend" v-if="isResend">
      <span>重新发送</span>
    </div>
    <alert :isPassword="true" :tips="tips" :placeholder='placeholder' :hidden="isShow"  @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert>
    <check-details :isShowCheck="isShowCheck" @modalShow="modalShow"></check-details>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import sendCard from '@/components/send_card'
  import Searchlist from '@/components/searchlist'
  import CheckDetails from '@/components/check_details'
  import Alert from '@/components/alert'

  import {get, post, DELETE} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar,
      sendCard,
      Alert,
      CheckDetails,
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
        isShowCheck: false,
        tips: '签章密码',
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
    },
    methods: {
      modalShow (msg) { // 查看详情隐藏
        this.isShowCheck = msg
        console.log('有没有')
      },
      check () {
        this.isShowCheck = true
      },
      cancelShow (msg) { // 签章密码取消
        this.isShow = msg
        this.reason = ''
      },
      alertConfirm (msg) { // 签章密码确定
        this.password = msg.resaon
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
        this.lists = []
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
        this.lists = []
        this.getLists()
      },
      remove () {
        this.isAccept = false
        this.isBack = false
        this.isRemove = true
        this.isModify = false
        this.status = 3
        this.lists = []
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
                  url: '/pages/choose/main',
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
          position: relative;
          bottom: -10*$unit;
        }
      }
      div.active{
        color: #1E9EFF;
        i{
          border-bottom: 2px solid #1E9EFFFF;
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
    .cancel{
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
        margin-right: 16*$unit;
      }
    }
    .pb70{
      padding-bottom: 70*$unit;
    }
  }
</style>
