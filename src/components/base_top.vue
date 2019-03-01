<template>
<div>
  <div class="_top flex flexrow fixed">
    <div class="_crumbs"><slot></slot></div>
    <div class="flex flexrow">
      <div @click="account" class="_company">{{info.name}}</div>
      <div @click="quit" class="_logout">
        <img src="../images/logout2x.png" />
      </div>
    </div>
  </div>
  <div class="_top"></div>
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
            let index = this.info.permissions.toString().indexOf('drug.sign')
            let isDrugSign = true
            if (index > -1) {
              isDrugSign = true
            } else {
              isDrugSign = false
            }
            wx.setStorage({ // uk用户
              key: 'use_ukey',
              data: this.info.enterprise.use_ukey
            })
            wx.setStorage({ //
              key: 'DrugSign',
              data: isDrugSign
            })
            wx.setStorage({ // 未认证企业
              key: 'is_authorize',
              data: this.info.enterprise.is_authorize
            })
            wx.setStorage({ // 是否设置签章密码
              key: 'set_password',
              data: this.info.set_password
            })
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
        wx.reLaunch({
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
<style lang="scss" scoped>
  ._top {
    width: 100%;
    height: 46px;
    line-height: 46px;
    box-sizing: border-box;
    background: #fff;
    padding: 0 24rpx;
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
  ._top.fixed {
    position: fixed;
    top: 65px;
    left: 0;
    z-index: 1000;
  }
  .shadow ._top:first-child {
    box-shadow:0px 6px 20px 0px rgba(212,219,224,0.3);
  }
  ._top:last-child {
    background: transparent;
  }
</style>
