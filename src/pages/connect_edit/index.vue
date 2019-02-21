<template>
  <div class="send_record">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>{{title}}</base-top>
    </div>
    <div class="_container mart">
      <div>
        {{operate}}
        {{title}}
      </div>
    </div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import {get} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        operate: '',
        title: ''
      }
    },
    updated () {
    },
    onShow () {
      this.operate = this.$root.$mp.query.operate
      if (this.operate === 'new') {
        this.title = '添加企业'
      } else {
        this.title = '编辑企业'
      }
      console.log(this.operate === 'new')
      // this.getData()
    },
    mounted () {
      this.operate = this.$root.$mp.query.operate
      if (this.operate === 'new') {
        this.title = '添加企业'
      } else {
        this.title = '编辑企业'
      }
      console.log(this.operate === 'new')
      // this.getData()
    },
    onPullDownRefresh () {
      // 下拉刷新
    },
    onReachBottom () {
      // 上啦触底
    },
    onUnload: function () {
    },
    methods: {
      async getData () {
        wx.stopPullDownRefresh()
        var url = '/api/drugReport/send/'
        var resp = await get({
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .send_record{
    $unit: 2rpx;
    .orange{
      color: #FF821D;
    }
    .green{
      color: #16AB24;
    }
    .green_bg{
      background: #16AB24;
    }
    .red{
      color: #E71F10;
    }
    .gray{
      color: #A5A5A5;
    }
  }
</style>
