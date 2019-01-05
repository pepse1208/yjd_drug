<template>
  <div class="drugSearch">
    <drug-head @childSearch="childSearch"></drug-head>
    <search-list :lists="lists" :consoleText="consoleText" :bgColor="bgColor"></search-list>
    <p class="text-footer" v-if="!more">
      暂无更多数据
    </p>
  </div>
</template>
<script>
  import DrugHead from '@/components/header'
  import SearchList from '@/components/searchlist'
  import $store from '../../store/index'
  import {get} from '../../utils.js'
  export default {
    components: {
      DrugHead,
      SearchList
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
        loading: false
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
          $store.commit('initSearchList', res)
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
        if (init) {
          this.lists = $store.state.searchList
          wx.stopPullDownRefresh()
        } else {
          this.lists = this.lists.concat(res)
        }

        wx.hideNavigationBarLoading()
        this.loading = false
      }
    },
    computed: {
      bgColor () {
        return 'icon red_bg'
      }
    },
    onPullDownRefresh () {
      // 下拉刷新
      // console.log('下拉刷新')
      this.getList(true)
    },
    onReachBottom () {
      // 上啦触底
      // console.log('上啦触底加载')
      if (!this.more) {
        return false
      }
      this.page = this.page + 1
      this.getList()
    },
    mounted () {
      this.getList(true)
      // this.lists = [{
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0001',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0002',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0003',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0004',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0005',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0006',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0007',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: '8',
      //   enterprise: '杭州神中科技有限公司'
      // }, {
      //   name: '六味地黄丸',
      //   package: '(每粒装0.25g)*/10/盒',
      //   batch: 'yky0009',
      //   enterprise: '杭州神中科技有限公司'
      // }]
    }
  }
</script>
<style lang="scss" scope>
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
</style>

