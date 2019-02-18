<template>
<div class="askfor shadow">
  <div class="page-top">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>药检单索取记录</base-top>
  </div>
  <statements  :lists="lists"></statements>
  <div class="list borderBottomEEE" :class="{overflow4: openArr[index] && item.other.status==='申请中'}" v-for="(item, index) in dataLists" :key="index">
    <searchlist :details="detailsFun(item)" ></searchlist>
    <div class="btnList">
      <block v-if="selectNavIndex===0">
        <span class="button" @click="tipDetail(item)">详情</span>
        <span v-if="item.other.status==='已拒绝'" class="button ask" @click="toAsk(item)"></span>
        <span v-if="item.other.status==='已同意'" class="button" @click="downloadPdf(item.other.url, item.uuid)">查看</span>
      </block>
      <block v-if="selectNavIndex===1">
        <span :class="{show: !openArr[index], hide: openArr[index]}" class="button" @click="tipDetail(item)">详情</span>
        <block :openKey="index" v-if="openArr[index] && item.other.status==='申请中'">
          <span class="button" @click="consent(item)">同意</span>
          <span class="button" @click="refuse(item)">拒绝</span>
        </block>
        <span v-if="item.other.status==='申请中'" @click="toggle(item, index)" :class="{more_operate: !openArr[index], back: openArr[index]}" class="button operate" ></span>
      </block>
    </div>
  </div>
  <p class="text-footer" v-if="!more">
    暂无更多数据
  </p>
  <vue-tab-bar v-if="isMy" @fetchIndex="clickIndexNav"  :selectNavIndex="selectNavIndex" :navList="navList" :needButton="needButton"  :type="type"></vue-tab-bar>
  <alert :isPassword="true" :tips="tips" :placeholder='placeholder' :hidden="isShow"  @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert>
</div>
</template>
<script>
  import {get, post, put} from '../../utils.js'
  import {throttle} from '../../utils/index.js'
  import config from '../../config.js'
  import Statements from '@/components/statements'
  import BaseTop from '@/components/base_top'
  import VueTabBar from '@/components/vueTabBar'
  import Searchlist from '@/components/searchlist'
  import Alert from '@/components/alert'
  import NavigationBar from '@/components/navigationBar'

  export default {
    components: {
      BaseTop,
      Alert,
      Statements,
      Searchlist,
      NavigationBar,
      VueTabBar
    },
    data () {
      return {
        druglistId: '',
        tips: '签章密码',
        placeholder: '输入签章密码',
        isShow: false,
        isMy: true,
        next: null,
        password: null,
        more: true,
        uuid: '',
        req: 'send', // 请求接口字段 默认是我的索取记录
        type: '',
        openArr: [],
        selectNavIndex: 0,
        needButton: false,
        downloaded: {},
        navList: [],
        dataLists: [],
        myStatus: {
          '已拒绝': 'red_bg',
          '已处理': 'red_bg',
          '已同意': 'green_bg',
          '申请中': 'orange_bg',
          '已申请': 'orange_bg'
        },
        details: {
          bgColor: '',
          name: '',
          batch: '',
          package: '',
          enterprise_name: ''
        },
        lists: [
          {
            text: '索取中',
            color: 'orange_bg'
          },
          {
            text: '已同意',
            color: 'green_bg'
          },
          {
            text: '已拒绝',
            color: 'red_bg'
          }
        ]
      }
    },
    onLoad (options) {
      // this.tip = options.tip
      this.type = wx.getStorageSync('type')
      let my = this.type !== '生产企业'
      let client = this.type === '生产企业' || this.type === '商业公司'
      if (my !== client) {
        my && (this.req = 'send')
        client && (this.req = 'receive')
        this.selectNavIndex = my === true ? 0 : 1
        // return
      }
      this.navList = [
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/upload_black.png'),
          selectedIconPath: require('../../images/upload_blue.png'),
          text: '我的索取记录',
          isShow: my
        },
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/recv_black.png'),
          selectedIconPath: require('../../images/recv_blue.png'),
          text: '客户索取记录',
          isShow: client
        }
      ]
    },
    onShow () {
    },
    mounted () {
      this.isMy = this.$root.$mp.query.isMy
      this.type = wx.getStorageSync('type')
      if (this.isMy === 'true') {
        this.selectNavIndex = 0
      } else {
        this.selectNavIndex = 1
      }
      // if (this.type !== '商业公司') {
      //   if (this.type === '生产企业') {
      //     this.selectNavIndex = 1
      //   }
      //   if (this.type === '医疗机构') {
      //     this.selectNavIndex = 0
      //   }
      //   this.isMy = false
      // } else {
      //   this.isMy = true
      //   this.selectNavIndex = 0
      // }
      if (this.selectNavIndex === 0) {
        this.req = 'send'
        this.lists[0].text = '索取中'
      } else {
        this.req = 'receive'
        this.lists[0].text = '待处理'
      }
      this.navList = [
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/upload_black.png'),
          selectedIconPath: require('../../images/upload_blue.png'),
          text: '我的索取记录',
          isShow: true
        },
        {
          pagePath: '/pages/index/main',
          iconPath: require('../../images/recv_black.png'),
          selectedIconPath: require('../../images/recv_blue.png'),
          text: '客户索取记录',
          isShow: true
        }
      ]
      this.getList()
    },
    onPullDownRefresh () {
      // 下拉刷新
      this.getList()
    },
    onReachBottom () {
      // 上拉加载
      if (!this.next) {
        this.more = false
        return false
      }
      this.getList(this.next)
    },
    onReady () {
      this.selectNavIndex = 0
      if (this.selectNavIndex === 0) {
        this.req = 'send'
        this.lists[0].text = '索取中'
      } else {
        this.req = 'receive'
        this.lists[0].text = '待处理'
      }
    },
    methods: {
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
      refuse (item) { // 拒绝操作
        this.refuseReq(item)
      },
      async refuseReq (item) { // 拒绝请求
        let uuid = item.uuid
        var url = '/api/ask/receive/report/' + uuid + '/'
        var resultData = await put({
          url,
          data: {
            type: 'reject'
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
            this.getList()
            wx.showToast({
              icon: 'none',
              title: '已拒绝'
            })
          }
        }
      },
      async consentReq (uuid) { // 索取请求
        let password = this.password
        var url = '/api/ask/receive/report/' + uuid + '/'
        var resultData = await put({
          url,
          data: {
            type: 'agree',
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
            this.getList()
            wx.showToast({
              icon: 'none',
              title: '已同意'
            })
          }
        }
      },
      consent (item) { // 同意操作
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
        this.uuid = item.uuid
      },
      toggle (item, index) { // 按钮...跟X切换
        console.log(item)
        console.log(this.isOpen)
        this.druglistId = item.uuid
        this.openArr[index] = !this.openArr[index]
        this.$forceUpdate() // 没有触发render函数进行自动更新，需手动调用
      },
      openPdf (url) { // 打开pdf
        wx.openDocument({
          filePath: url,
          success: function (res) {
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
      }, 2000),
      async askReq (item) { // 重新索取请求
        let uuid = item.uuid
        let reportId = item.report_uuid
        var url = '/api/ask/report/' + reportId + '/'
        let resultData = await post({
          url,
          data: {
            uuid: uuid
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
            this.getList()
          }
        }
      },
      toAsk (item) { // 重新索取弹窗提示
        let vm = this
        wx.showModal({
          title: '',
          content: '是否重新索取药检单',
          success (res) {
            if (res.confirm) {
              vm.askReq(item)
              // console.log('用户点击确定')
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      },
      tipDetail (item) { // 弹窗显示详情
        const drug = item.drug
        let text = '供应企业：' + (item.receiver || '--') + '\r\n'
        if (item.user_name !== undefined) { // 客户索取记录
          text = '索取企业：' + (item.sender || '--') + '\r\n' +
          '联系人：' + (item.user_name || '--') + '\r\n' +
          '联系电话：' + (item.phone || '--') + '\r\n'
        }
        wx.showModal({
          title: '',
          content:
          '品种名称：' + (drug.name || '--') + '\r\n' +
          '生产批号：' + (item.batch || '--') + '\r\n' +
          '包装规格：' + (drug.package || '--') + '\r\n' +
          '剂型：' + (drug.all_dosage || '--') + '\r\n' +
          '材质：' + (drug.drug_material || '--') + '\r\n' +
          '批准文号：' + (drug.reg_number || '--') + '\r\n' +
          '生产企业：' + (drug.production_enterprise || '--') + '\r\n' +
          text +
          // '报告编号：' + productDate + '\r\n' +
          '报告日期：' + (item.report_date || '--') + '\r\n' +
          '生产日期：' + (item.product_date || '--') + '\r\n' +
          '有效期至：' + (item.validity || '--'),
          showCancel: false,
          success (res) {
          }
        })
      },
      detailsFun (item) { // 状态说明
        let status = item.other.status
        let details = {
          bgColor: this.myStatus[status],
          name: item.drug.name,
          batch: item.batch,
          package: item.drug.package,
          'enterprise_name': item.receiver
        }
        return details
      },
      async getList (_url) { // 获取列表数据
        var url = '/api/ask/' + this.req + '/report/list'
        if (_url) {
          url = _url
        }
        // url += '?_rt=' + Math.random()
        await get({
          url
        }).then((resp) => {
          let data = resp.data
          if (_url) {
            this.dataLists = this.dataLists.concat(data.results)
          } else {
            this.dataLists = data.results
            wx.stopPullDownRefresh()
            this.more = true
          }
          if (this.selectNavIndex === 1) {
            let len = this.dataLists.length
            for (let i = 0; i < len; i++) {
              this.openArr[i] = false
            }
          }
          if (this.dataLists.length === 0) {
            this.more = false
          } else {
            this.more = true
          }
          this.next = data.next // 获取下页路径
        })
      },
      clickIndexNav (msg) { // 切换页面
        let isAuthorize = wx.getStorageSync('is_authorize')
        let text = '该功能认证后才可使用，请前往电脑端认证。'
        if (isAuthorize !== 1) { // 未认证企业，不能访问客户索取记录
          wx.showModal({
            title: '',
            content: text,
            showCancel: false,
            success (res) {
            }
          })
          return
        }
        this.selectNavIndex = msg
        if (this.selectNavIndex === 0) { // 切换页面 数据刷新
          this.req = 'send'
          this.lists[0].text = '索取中'
        } else {
          this.req = 'receive'
          this.lists[0].text = '待处理'
        }
        this.dataLists = []
        this.more = true
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  div.askfor{
    $unit: 2rpx;
    padding-bottom: 50*$unit;
    .hide{
      display: none !important;
    }
    .show{
      display: inline-block !important;
    }
    .borderBottomEEE {
      border-bottom:1px solid #eee;
    }
    div.list{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .searchlist{
        background: red;
      }
      .btnList{
        display: flex;
      }
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
    span.ask{
      /*width:60rpx;
      height:60rpx;
      line-height:34rpx;
      padding:20rpx;*/
      background: #1E9EFF url(../../images/ask2x.png)  28rpx center no-repeat ;
      background-size: 50rpx 44rpx;
    }
    span.operate{
      background: #1E9EFF url(../../images/ellipsis.png) no-repeat center center;
      background-size: 40rpx 8rpx;
    }
    span.more_operate {
      background: #1E9EFF url(../../images/ellipsis.png) no-repeat center center;
      background-size: 40rpx 8rpx;
    }
    span.back {
      background: #1E9EFF url(../../images/cancel.png) no-repeat center center;
      background-size: 30rpx 30rpx;
    }
  }
</style>
