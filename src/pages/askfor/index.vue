<template>
<div class="askfor">
  <nav-bar>药检单索取记录</nav-bar>
  <statements :lists="lists"></statements>
  <vue-tab-bar @fetchIndex="clickIndexNav"  :selectNavIndex="selectNavIndex" :navList="navList" :needButton="needButton"  :type="type"></vue-tab-bar>
</div>
</template>
<script>
  import {get} from '../../utils.js'
  import Statements from '@/components/statements'
  import NavBar from '@/components/base_top'
  import VueTabBar from '@/components/vueTabBar'

  export default {
    components: {
      NavBar,
      Statements,
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
        navList: [],
        dataLists: [],
        lists: [
          {
            text: '已获取',
            color: 'gray_bg'
          },
          {
            text: '已共享',
            color: 'green_bg'
          },
          {
            text: '索取中',
            color: 'orange_bg'
          },
          {
            text: '未共享',
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
            wx.stopPullDownRefresh()
            this.more = true
          }
          if (data.dataLists.length === 0) {
            this.more = false
          } else {
            this.more = true
          }
          this.next = data.next // 获取下页路径
        })
      },
      clickIndexNav (msg) {
        this.selectNavIndex = msg
        this.req = msg === 0 ? 'send' : 'receive'
        this.getList()
        console.log('切换', this.dataLists)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
