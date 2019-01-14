<template>
  <div class="nav">
    <div class="title">
      <slot></slot>
    </div>
    <div class="company">
      <p @click="account">
        <span>杭州神中科技有限公司</span>
        <span @click="quit" class="img">退出</span>
        <!--<img src="" alt="">-->
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      account () {
        let url = this.$root.$mp.page.route
        if (url.indexOf('accountcenter') > 0) {
          return false
        }
        wx.navigateTo({
          url: '/pages/accountcenter/main',
          success () {
            // console.log('success')
          }
        })
      },
      quit () {
        wx.navigateTo({
          url: '/pages/login/main',
          success () {
            // console.log('登录')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .nav {
    $unit: 2rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: {
      left: 12*$unit;
      right: 12*$unit;
    };
    margin-bottom: 12*$unit;
    height: 40*$unit;
    border-bottom: 1px solid rgba(242, 242, 242, 1);
    .title {
      /*float: left;*/
      font-size: 16*$unit;
    }
    .company {
      /*float: right;*/
      font-size: 16px;
      p {
        /*cursor: pointer;*/
        .img {
          display: inline-block;
          margin: {
            left: 20*$unit;
          };
        }
      }
    }
  }
</style>
