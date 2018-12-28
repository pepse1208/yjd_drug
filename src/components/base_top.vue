<template>
  <div class="_top flex flexrow">
    <div class="_crumbs"><slot></slot></div>
    <div class="flex flexrow">
      <div @click="account" class="_company">{{info.name}}</div>
      <div @click="quit" class="_logout">
        <img src="../images/logout2x.png" />
      </div>
    </div>
  </div>
</template>
<script>
  import {get} from '../utils.js'

  export default {
    data () {
      return {
        info: {}
      }
    },
    methods: {
      async getData () {
        var resultData = await get({
          url: '/api/users/detail/'
        })
        if (resultData) {
          if (resultData.statusCode >= 400) {
            wx.showToast({
              icon: 'none',
              title: resultData.data.errmsg
            })
          } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
            this.info = resultData.data.result
          }
        }
      },
      account () {
        let url = this.$root.$mp.page.route
        if (url.indexOf('accountcenter') > 0) {
          return false
        }
        wx.navigateTo({
          url: '/pages/accountcenter/main'
        })
      },
      quit () {
        wx.navigateTo({
          url: '/pages/login/main?name=catalog'
        })
      }
    },
    mounted () {
      this.getData()
    },
    onShow () {
      this.getData()
    }
  }
</script>
<style lang="scss">
  ._top {
    width: 100%;
    height: 92rpx;
    line-height: 92rpx;
    box-sizing: border-box;
    $unit: 2rpx;
    ._crumbs{
      color: #3E3A39;
      font-size: 15*$unit;
      font-weight:500;
    }
    ._company {
      color: #3E3A39;
      overflow: hidden;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 180*$unit;
      font-size: 12*$unit;
    }
    ._logout {
      margin-left: 18rpx;
      display:flex;
      /*width: 30rpx;
      height: 26rpx;*/
      img {
        width: 30rpx;
        height: 26rpx;
        /*width: 100%;
        height: 100%;*/
        /*vertical-align: top;*/
      }
    }
  }
</style>
