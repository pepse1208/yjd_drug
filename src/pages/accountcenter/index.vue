<template>
  <div class="accountcenter">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>账号中心</base-top>
    </div>
    <div class="box">
      <div class="panel">
        <p class="first">
          <span class="title">公司名称</span>
          <span class="content">{{info.name || ''}}</span>
        </p>
        <!--<p> 暂时不用
          <span class="title">联系人</span>
          <span class="content">张三</span>
        </p>-->
        <p>
          <span class="title">手机号</span>
          <span class="content">{{info.mobile || '' }}</span>
        </p>
        <p>
          <span class="title">密码</span>
          <span class="content pwd">
            <span>******</span>
            <a @click="passwd" href="">修改密码</a>
          </span>

        </p>
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
        info: {},
        tip: ''
      }
    },
    methods: {
      passwd () {
        wx.navigateTo({
          url: '/pages/passwd/main?name=accountcenter',
          success () {
          }
        })
      },
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
      }
    },
    onLoad (options) {
      // this.tip = options.tip
    },
    mounted () {
      this.getData()
      /* if (this.tip === 'success') {
        wx.showToast({
          icon: 'none',
          title: '修改成功',
          duration: 4500,
          success () {
            console.log('提示修改成功')
          }
        })
      } */
    }
  }
</script>
<style lang="scss" scoped>
  .accountcenter{
    $unit: 2rpx;
    .box {
      display: flex;
      justify-content: center;
      .panel {
        width: 351*$unit;
        /*height: 150*$unit;*/
        box-sizing: border-box;
        font-size: 15*$unit;
        padding: 13*$unit 15*$unit 13*$unit;
        box-shadow: 0px 0px 11px 0px rgba(139, 139, 139, 0.14);
        p {
          font-size: 14*$unit;
          /*height: 30*$unit;*/
          display: flex;
          /*justify-content: flex-start;*/
          padding: 6*$unit 0;
          .title {
            width: 175*$unit;
            color: #A5A5A5;
          }
          .content {
            color: #3E3A39;
            width: 250*$unit;
            text-align: left;
          }
          .pwd {
            display: flex;
            flex-direction: row;
          }
          a {
            color: #1E9EFF;
            margin: {
              left: 15*$unit;
            }
          }
        }
      }
    }
  }
</style>
