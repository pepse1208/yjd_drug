<template>
  <div class="send_record_details">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>发送详情</base-top>
    </div>
    <send-card :info="info" ></send-card>
    <div class="tab">

    </div>
    <!--<div class="item" :class="{ isflex: item.batch}" @click="item.package && jumpDetail({drug: item.drug, id: item.id})"  :key="index" v-for="(item, index) in lists">
      <div class="intro">
        <p class="title flex flexrow">
          <span class="ellipsis1" :class="{bold: item.name}">{{item.name || '&#45;&#45;'}}</span>
        </p>
        <p class="company flex flexrow" :class="{ bg: item.package }">
          <span class="sub" v-if="item.package">生产批号：</span>
          <span class="ellipsis2">{{item.package || '&#45;&#45;'}}</span>
        </p>
      </div>
      <div  v-if="item.sender">
        <span class="button" @click="downloadPdf(item.file, item.uuid)">查看</span>
        <span class="button" @click="tipDetail(item)">详情</span>
      </div>
    </div>-->
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
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
        lists: [] // 列表数据
      }
    },
    onShow () {
      this.id = this.$root.$mp.query.id
    },
    mounted () {
      this.getData()
      this.getLists()
    },
    onPullDownRefresh () {
      // 下拉刷新
      if (!this.loading) {
        this.getLists()
      }
    },
    onReachBottom () {
      // 上啦触底
      if (!this.loading && this.next) {
        this.getLists(this.next)
      }
    },
    onUnload: function () {
      this.info = {}
      this.more = true
      this.noMoreData = 'no_datas'
    },
    methods: {
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
            receiverUserName: data.receiver_user.name,
            receiverUserPhone: data.receiver_user.phone
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
        /*background: url('../images/enter2x.png') right 5px no-repeat;*/
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
