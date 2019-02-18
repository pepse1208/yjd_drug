<template>
  <div class="send_record_details">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>发送详情</base-top>
    </div>
    <send-card :info="info" ></send-card>
    <div class="tab" v-if="isTab">
      <div @click="accept" :class="{active: isAccept}">
        对方接收&nbsp({{acceptNum}})
        <i></i>
      </div>
      <div @click="back" :class="{active: isBack}">
        对方退回&nbsp({{backNum}})
        <i></i>
      </div>
      <div @click="remove" :class="{active: isRemove}">
        对方删除&nbsp({{removeNum}})
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
          <span class="button" >查看</span>
          <span class="button" v-if="isModify" @click="modify(item.drugReport.uuid)">修改</span>
        </div>
      </div>
    </div>
    <p class="text-footer" :class="{pb70: isCancelSend}" v-if="!more">
      暂无更多数据
    </p>
    <div class="cancel" v-if="isCancelSend">
      <span>取消发送</span>
    </div>
    <div class="cancel" v-if="isResend">
      <span>重新发送</span>
    </div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import sendCard from '@/components/send_card'
  import Searchlist from '@/components/searchlist'

  import {get} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar,
      sendCard,
      Searchlist
    },
    data () {
      return {
        info: {}, // 详情信息
        next: null, // 下一页路径
        more: true, // 是否有更多数据
        id: '',
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
        lists: [] // 列表数据
      }
    },
    onShow () {
      this.id = this.$root.$mp.query.id
    },
    mounted () {
      this.getData()
      this.getAllLists()
      this.getLists()
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
      this.lists = []
    },
    methods: {
      modify (uuid) { // 修改按钮
        wx.navigateTo({
          url: '/pages/modify/main?drug=' + uuid + '&isModify=true'
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
        this.isModify = true
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
          this.acceptNum = data.count['签收']
          this.backNum = data.count['退回']
          this.removeNum = data.count['删除']
          if (data.status === '待签章') {
            this.isCancelSend = true
            this.isResend = false
            this.isTab = false
            this.getAllLists()
          } else if (data.status === '待对方查收') {
            this.isCancelSend = true
            this.isResend = false
            this.isTab = false
            this.getAllLists()
          } else if (data.status === '已取消') {
            this.isTab = false
            this.getAllLists()
          } else {
            this.isCancelSend = false
            this.isResend = true
            this.isTab = true
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
          console.log(data.results.length)
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
          console.log(data.results.length)
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
