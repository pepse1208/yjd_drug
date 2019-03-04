<template>
  <div class="drugSearch shadow">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>药检单查询</base-top>
    </div>
    <progress :percent="percent" stroke-width="4" backgroundColor="#fff"/>
    <div>
      <statements :lists="statements"></statements>
      <drug-head @childSearch="childSearch"></drug-head>
      <block v-for="(item, index) in lists" :key="index">
        <div :class="{'overflow': !item.btnStatus, 'flex flexrow borderBottomEEE': true}">
          <search-list :details="initDetails(item)"></search-list>
          <div class="btns">
            <div class="flex flexrow" v-if="item.btnStatus">
              <button class="btn_com" @click="modalShow(true, item, 400)">详情</button>
              <!--<button class="btn_com" v-if="item.other.status === '已获取' && item.other.status !== '索取中'" @click="downloadPdf(item.other.url, item.uuid)">查看</button>-->
              <button class="btn_com" @click="askfor(index, item.uuid)" v-if="item.other.status === '未共享' && item.other.status !== '索取中'">索取</button>
              <!--<button class="btn_com more_operate" @click="showOperateBtns(index)" v-if="item.other.status === '已共享' && item.other.status !== '索取中'"></button>-->
              <block v-if="item.other.status === '已共享' && item.other.status !== '索取中'">
                <button class="btn_com" @click="gain(index, item.uuid)">获取</button>
              </block>
            </div>
            <div class="flex flexrow operation" v-if="!item.btnStatus">
              <button class="btn_com" @click="downloadPdf(item.other.url, item.uuid)">查看</button>
              <button class="btn_com" @click="gain(index, item.uuid)">获取</button>
              <button class="btn_com back" @click="backCb(index)"></button>
            </div>
          </div>
        </div>
      </block>
      <p class="text-footer" v-if="!more">
        暂无更多数据
      </p>
    </div>
    <!--弹框详情组件-->
    <public-check-details :checkDetailsDrug="checkDetailsDrug" :checkDetailsFile="checkDetailsFile" :checkDetails="checkDetails" :checkDetailsUuid="checkDetailsUuid" :checkDetailsUrl="checkDetailsUrl" :isShowCheck="isShowCheck" :height="height" @modalShow="modalShow">
      <div class="line">
        <span class="explain">品种名称</span>
        <span class="details">{{checkDetailsDrug.name || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">生产批号</span>
        <span class="details">{{checkDetails.batch || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">包装规格</span>
        <span class="details">{{checkDetailsDrug.package || '--'}}</span>
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
        <span class="explain">生产企业</span>
        <span class="details">{{checkDetailsDrug.production_enterprise || '--'}}</span>
      </div>
      <div class="line">
        <span class="explain">供应企业</span>
        <span class="details">{{checkDetails.enterprise_name || '--'}}</span>
      </div>
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
    </public-check-details>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import DrugHead from '@/components/header'
  import SearchList from '@/components/searchlist'
  import Statements from '@/components/statements'
  import NavigationBar from '@/components/navigationBar'
  import PublicCheckDetails from '@/components/public_check_details'
  import {get, post} from '../../utils.js'
  import {throttle} from '../../utils/index.js'
  import config from '../../config.js'
  export default {
    components: {
      DrugHead,
      SearchList,
      Statements,
      PublicCheckDetails,
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        lists: [],
        more: true,
        name: '',
        batch: '',
        enterprise: '',
        reg_number: '',
        next: '',
        butsStatus: [],
        isShowModal: false, // 弹窗显示状态
        isShowCheck: false,
        checkDetailsUrl: null,
        checkDetailsUuid: null,
        height: 0,
        checkDetails: {},
        checkDetailsDrug: {},
        checkDetailsOther: {},
        downloaded: {},
        statements: [
          {
            text: '已获取',
            color: 'gray_bg'
          }, {
            text: '已共享',
            color: 'green_bg'
          }, {
            text: '索取中',
            color: 'orange_bg'
          }, {
            text: '未共享',
            color: 'red_bg'
          }
        ],
        percent: 0
      }
    },
    methods: {
      modalShow (flag, details, height) { // 查看详情隐藏
        this.isShowCheck = flag
        this.height = height
        if (details) {
          this.checkDetails = details
          this.checkDetailsDrug = details.drug
          this.checkDetailsOther = details.other
          this.checkDetailsUrl = details.other.url
          this.checkDetailsUuid = details.uuid
          if ((this.checkDetailsOther.status === '已获取' || this.checkDetailsOther.status === '已共享') && this.checkDetailsOther.status !== '索取中' && this.height !== 0) {
            this.height = 480
          }
        }
      },
      childSearch (res) {
        this.name = res.name
        this.batch = res.batch
        this.enterprise = res.enterprise
        this.reg_number = res.reg_number
        this.getList()
      },
      async getList (next) {
        let url = '/api/drugReport/report/all/'
        if (next) {
          url = next
        }
        let res
        // const res = await get('/api/drugReport/report/all/', {
        const data = await get({
          url,
          data: {
            drug_name: this.name,
            batch: this.batch,
            reg_number: this.reg_number,
            enterprise: this.enterprise
          }
        })
        var code = data.statusCode
        if (code >= 200 && code < 300) {
          res = data.data.results
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
          return
        }
        if (res.length < 10) {
          this.more = false
        }
        var resp = this.initSearchList(res)
        if (next) {
          this.lists = this.lists.concat(resp)
        } else {
          this.lists = resp
          wx.stopPullDownRefresh()
        }
        this.next = data.data.next
      },
      initSearchList (data) { // 初始化列表数据
        let arr = [].concat(JSON.parse(JSON.stringify(data)))
        let len = arr.length
        for (let i = 0; i < len; i++) {
          arr[i].btnStatus = true
        }
        return arr
      },
      initDetails (data) { // 初始化部分信息(药品名称、生产批号、包装规格、供应企业)
        let self = this
        let state = data.other.status
        let details = {
          bgColor: self.initBgColor(state),
          name: data.drug.name,
          batch: data.batch,
          package: data.drug.package,
          enterprise_name: data.enterprise_name
        }
        return details
      },
      initBgColor (status) { // 初始化icon
        let bgColor
        switch (status) {
          case '未共享':
            bgColor = 'red_bg'
            break
          case '已共享':
            bgColor = 'green_bg'
            break
          case '已获取':
            bgColor = 'gray_bg'
            break
          case '索取中':
            bgColor = 'orange_bg'
            break
        }
        return bgColor
      },
      tipDetail (item) { // 弹窗显示详情
        const drug = item.drug
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
            '供应企业：' + (item.enterprise_name || '--') + '\r\n' +
            // '报告编号：' + productDate + '\r\n' +
            '报告日期：' + (item.report_date || '--') + '\r\n' +
            '生产日期：' + (item.product_date || '--') + '\r\n' +
            '有效期至：' + (item.validity || '--'),
          showCancel: false,
          success (res) {
          }
        })
      },
      showOperateBtns (index) { // 点击 ··· 显示更多操作按钮
        this.lists[index].btnStatus = false
      },
      backCb (index) {
        this.lists[index].btnStatus = true
      },
      openPdf (url) {
        const self = this
        wx.openDocument({
          filePath: url,
          success: function (res) {
            self.percent = 0
            // console.log(self.percent)
            // console.log('打开文档成功')
          }
        })
      },
      downloadPdf: throttle(function (url, id) { // 查看pdf
        id = id.replace(/-/ig, '')
        var self = this
        if (self.downloaded[id]) {
          // console.log('直接打开')
          self.openPdf(self.downloaded[id])
        } else {
          // console.log('下载')
          var path = url
          if (!url.includes('https://')) {
            path = config.host + url
          }
          wx.showLoading({title: '加载中'})
          const self = this
          // const url = 'https://yjd.yxsjob.com/media/2019/1/16/f902367378ea4bfa97d995f08e1049c1/kgSbzLlWbNIxUPFphBNR.pdf'
          const downloadTask = wx.downloadFile({
            url: path,
            success (res) {
              const filePath = res.tempFilePath
              // 避免发送方修改文件后，没及时更新
              self.downloaded[id] = filePath
              // self.percent = 0
              wx.hideLoading()
              self.openPdf(filePath)
              // downloadTask.abort() // 取消下载任务
            }
          })
          downloadTask.onProgressUpdate((res) => {
            self.percent = res.progress
            // console.log('下载进度', res.progress)
          })
          // wx.downloadFile({
          //   url: path,
          //   success: function (res) {
          //     const filePath = res.tempFilePath
          //     // 避免发送方修改文件后，没及时更新
          //     self.downloaded[id] = filePath
          //     self.percent = 100
          //     wx.hideLoading()
          //     self.openPdf(filePath)
          //   }
          // })
        }
      }, 2000),
      askfor (index, id) {
        let self = this
        wx.showModal({
          title: '信息',
          content: '索取后，您的联系方式将提供给上游供应企业，确定吗？',
          success (res) {
            if (res.confirm) {
              self.askforAjax(index, id)
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      },
      async askforAjax (index, id) { // 索取
        const data = await post({
          url: '/api/ask/report/' + id + '/'
        })
        let code = data.statusCode
        if (code >= 200 && code < 300) {
          this.lists[index].other.status = '索取中'
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      },
      async gain (index, id) {
        const data = await post({
          url: '/api/share/get/report/' + id + '/'
        })
        let code = data.statusCode
        if (code >= 200 && code < 300) {
          // this.lists[index].other.status = '已获取'
          // this.lists[index].btnStatus = true
          this.downloaded = {}
          this.getList()
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      }
    },
    onShow () {
      this.percent = 0
    },
    onPullDownRefresh () {
      // 下拉刷新
      this.getList()
    },
    onReachBottom () {
      // 上啦触底
      if (this.next) {
        this.getList(this.next)
      } else {
        wx.showToast({
          title: '没有了',
          icon: 'none'
        })
        this.more = false
      }
    },
    beforeMount () {
      this.getList()
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.lists.length = 0
      this.name = ''
      this.batch = ''
      this.enterprise = ''
      this.reg_number = ''
      this.next = ''
      this.percent = 0
      this.isShowModal = false
      this.isShowCheck = false
      this.checkDetailsUrl = null
      this.checkDetailsUuid = null
      this.height = 0
      this.checkDetails = {}
      this.checkDetailsDrug = {}
      this.checkDetailsOther = {}
    }
  }
</script>
<style lang="scss" scope>
  @import url(../../common/base.scss);
  .drugSearch{
    $unit: 2rpx;
    .loading{
      font-size: 14px;
      padding: 20px 0;
      text-align: center;
      button{
        border: none;
        background: #fff;
      }
    }
  }
.btns {
  .btn_com {
    width: 100rpx;
    height: 100rpx;
    color: #fff;
    line-height: 100rpx;
    text-align: center;
    border: 0;
    padding: 0;
    font-size: 30rpx;
    margin-left: 30rpx;
    background: #1E9EFF;
    box-shadow:0px 7px 16px 0px rgba(121,197,255,0.5);
  }
  .more_operate {
    background: #1E9EFF url(../../images/ellipsis.png) no-repeat center center;
    background-size: 40rpx 8rpx;
  }
}
.btn_com ~ .btn_com {
  margin-left: 30rpx;
}
.operation {
  .back {
    background: #1E9EFF url(../../images/cancel.png) no-repeat center center;
    background-size: 30rpx 30rpx;
  }
}
.borderBottomEEE:last-child {
  border: 0;
}
progress {
  position: fixed;
  background: red;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 2000;
}
</style>

