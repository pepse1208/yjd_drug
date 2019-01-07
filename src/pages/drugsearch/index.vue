<template>
  <div class="drugSearch">
    <drug-head @childSearch="childSearch"></drug-head>
    <statements :lists="statements"></statements>
    <block v-for="(item, index) in lists" :key="index">
      <div :class="{'overflow': !item.btnStatus, 'flex flexrow': true}">
        <search-list :details="initDetails(item)"></search-list>
        <div class="btns">
          <div class="flex flexrow" v-if="item.btnStatus">
            <div class="btn_com" @click="tipDetail(item)">详情</div>
            <div class="btn_com more_operate" @click="showOperateBtns(index)"></div>
          </div>
          <div class="flex flexrow operation" v-if="!item.btnStatus">
            <div class="btn_com">查看</div>
            <div class="btn_com">获取</div>
            <div class="btn_com back" @click="backCb(index)"></div>
          </div>
        </div>
      </div>
    </block>
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
  </div>
</template>
<script>
  import DrugHead from '@/components/header'
  import SearchList from '@/components/searchlist'
  import Statements from '@/components/statements'
  import $store from '../../store/index'
  import {get} from '../../utils.js'
  export default {
    components: {
      DrugHead,
      SearchList,
      Statements
    },
    data () {
      return {
        lists: [],
        page: 1,
        more: true,
        name: '',
        batch: '',
        enterprise: '',
        packages: '',
        loading: false,
        butsStatus: [],
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
        ]
      }
    },
    methods: {
      childSearch (res) {
        // console.log(res, 'child')
        this.name = res.name
        this.batch = res.batch
        this.enterprise = res.enterprise
        this.packages = res.packages
        this.getList(true)
      },
      async getList (init) {
        if (init) {
          this.page = 1
          this.more = true
        }
        wx.showNavigationBarLoading()
        this.loading = true
        var res
        // const res = await get('/api/drugReport/report/all/', {
        const data = await get({
          url: '/api/drugReport/report/all/',
          data: {
            drug_name: this.name,
            batch: this.batch,
            reg_number: this.packages,
            enterprise: this.enterprise,
            page: this.page
          }
        })
        var code = data.statusCode
        if (code >= 200 && code < 300) {
          res = data.data.results
        } else {
          return
        }
        if (res.length === 0) {
          this.more = false
        } else if (res.length < 10 && this.page > 1) {
          wx.showToast({
            title: '没有了'
          })
          this.more = false
        }
        $store.commit('initSearchList', res)
        if (init) {
          // this.lists = res
          this.lists = $store.state.searchData
          wx.stopPullDownRefresh()
        } else {
          this.lists = this.lists.concat($store.state.searchData)
        }
        wx.hideNavigationBarLoading()
        this.loading = false
      },
      initDetails (data) {
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
      initBgColor (status) {
        let bgColor
        switch (status) {
          case '未共享':
            bgColor = 'orange_bg'
            break
          case '已共享':
            bgColor = 'green_bg'
            break
          case '以获取':
            bgColor = 'red_bg'
            break
          case '索取中':
            bgColor = 'gray_bg'
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
      }
    },
    onPullDownRefresh () {
      // 下拉刷新
      this.getList(true)
    },
    onReachBottom () {
      // 上啦触底
      if (!this.more) {
        return false
      }
      this.page = this.page + 1
      this.getList()
    },
    beforeMount () {
      this.getList(true)
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.lists.length = 0
    }
  }
</script>
<style lang="scss" scope>
  @import url(../../common/base.scss);
  .drugSearch{
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
  .btn_com {
  width: 100rpx;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  font-size: 30rpx;
  color: white;
  border: 0;
  border-radius: 4rpx;
  background: #1E9EFF;
  padding: 0;
}
.more_operate {
  background: #1E9EFF url(../../images/ellipsis.png) no-repeat center center;
  background-size: 40rpx 8rpx;
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
</style>

