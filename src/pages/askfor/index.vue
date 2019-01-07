<template>
<div class="askfor">
  <nav-bar>药检单索取记录</nav-bar>
  <statements :lists="lists"></statements>
  <div class="list" v-for="(item, index) in dataLists" :key="index">
    <searchlist :details="detailsFun(item)" ></searchlist>
    <span class="button" @click="tipDetail(item)">详情</span>
    <block >
      <span v-if="item.other.status==='已拒绝'" class="button" @click="toAsk(item)">重新索取</span>
      <span v-if="item.other.status==='已同意'" class="button" @click="downloadPdf(item.other.url, item.uuid)">查看</span>
    </block>
  </div>
  <vue-tab-bar @fetchIndex="clickIndexNav"  :selectNavIndex="selectNavIndex" :navList="navList" :needButton="needButton"  :type="type"></vue-tab-bar>
</div>
</template>
<script>
  import {get, post} from '../../utils.js'
  import {throttle} from '../../utils/index.js'
  import config from '../../config.js'
  import Statements from '@/components/statements'
  import NavBar from '@/components/base_top'
  import VueTabBar from '@/components/vueTabBar'
  import Searchlist from '@/components/searchlist'

  export default {
    components: {
      NavBar,
      Statements,
      Searchlist,
      VueTabBar
    },
    data () {
      return {
        next: null,
        more: true,
        req: 'send', // 请求接口字段 默认是我的索取记录
        type: '',
        selectNavIndex: 0,
        needButton: false,
        downloaded: {},
        navList: [],
        dataLists: [],
        myStatus: {
          '已拒绝': 'red_bg',
          '已结束': 'red_bg',
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
      console.log('加载', this.dataLists)
    },
    methods: {
      openPdf (url) {
        wx.openDocument({
          filePath: url,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      downloadPdf: throttle(function (url, id) { // 查看pdf
        console.log(url, id)
        var self = this
        if (self.downloaded[id]) {
          self.openPdf(self.downloaded[id])
        } else {
          var path = url
          if (!url.includes('https://')) {
            path = config.host + url
          }
          console.log(path)
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
        let vm = this
        await post({
          url,
          data: {
            uuid: uuid
          }
        }).then((resp) => {
          vm.getList()
        })
      },
      toAsk (item) {
        let vm = this
        wx.showModal({
          title: '提示',
          content: '是否重新索取药检单',
          success (res) {
            if (res.confirm) {
              vm.askReq(item)
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      tipDetail (item) { // 弹窗显示详情
        var name = item.drug.name || '--'
        var batch = item.batch || '--'
        var Package = item.drug.package || '--'
        var allDosage = item.drug.all_dosage || '--'
        var productionEnterprise = item.drug.production_enterprise || '--'
        var enterpriseName = item.receiver || '--'
        wx.showModal({
          title: '',
          content: '品种名称：' + name + '\r\n' + '生产批号：' + batch + '\r\n' + '包装规格：' + Package + '\r\n' + '供应企业：' + enterpriseName + '\r\n' + '剂型：' + allDosage + '\r\n' + '生产企业：' + productionEnterprise + '\r\n',
          showCancel: false,
          success (res) {
          }
        })
      },
      detailsFun (item) {
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
      async getList (_url) {
        var url = '/api/ask/' + this.req + '/report/list'
        if (_url) {
          url = _url
        }
        // url += '?_rt=' + Math.random()
        await get({
          url
        }).then((resp) => {
          var data = resp.data
          if (_url) {
            this.dataLists = this.dataLists.concat(data.results)
          } else {
            this.dataLists = data.results
            console.log(data.results)
            wx.stopPullDownRefresh()
            this.more = true
          }
          if (data.dataLists.length === 0) {
            this.more = false
          } else {
            this.more = true
          }
          this.next = data.next // 获取下页路径
          this.details.bgColor = this.dataLists
          this.details.name = this.dataLists.drug.name
          this.details.batch = this.dataLists.batch
          this.details.package = this.dataLists.drug.package
          this.details.enterprise_name = this.dataLists.receiver
          console.log(this.dataLists)
          console.log(this.details)
        })
      },
      clickIndexNav (msg) {
        this.selectNavIndex = msg
        this.req = msg === 0 ? 'send' : 'receive'
        this.getList()
        this.lists[0].text = msg === 0 ? '索取中' : '待处理'
        console.log('切换', this.dataLists)
      }
    }
  }
</script>
<style lang="scss" scoped>
  div.askfor{
    $unit: 2rpx;
    padding-bottom: 50*$unit;
    div.list{
      display: flex;
      align-items: center;
      justify-content: space-between;
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
</style>
