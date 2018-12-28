<template>
  <div class="header">
    <div v-if="show" class="top">
      <img @click="richScan" class="img" src="../../static/saoyisao2x.png" alt="">
      <input v-model="name" placeholder="请输入品种名称" type="text">
      <input v-model="batch" placeholder="请输入生产批号" type="text">
      <img @click="search" class="btn" type="primary" size="mini">
      <span @click="expand">高级搜索</span>
    </div>
    <div v-else class="topExpand">
      <div class="box">
        <input v-model="name" placeholder="请输入品种名称" type="text">
        <input v-model="batch" placeholder="请输入生产批号" type="text">
      </div>
      <div class="box">
        <input v-model="packages" placeholder="请输入批准文号" type="text">
        <input v-model="enterprise" placeholder="请输入供应企业" type="text">
      </div>
      <button @click="search" type='default' plain="true">高级搜索</button>
      <span @click="unexpand">普通搜索</span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show: true,
        name: '',
        batch: '',
        packages: '',
        enterprise: ''
      }
    },
    methods: {
      richScan () {
        wx.scanCode({
          success () {
            wx.showToast({
              title: '此功能暂未开放cancel'
            })
          }
        })
      },
      search () {
        // console.log('查询')
        this.$emit('childSearch', {
          name: this.name,
          batch: this.batch,
          packages: this.packages,
          enterprise: this.enterprise
        })
      },
      expand () {
        // console.log('expand')
        this.show = false
      },
      unexpand () {
        // console.log('unexpand')
        this.show = true
      }
    }
  }
</script>
<style lang="scss" scope>
  .header{
    margin-top: 10rpx;
    margin-bottom: 30rpx;
    font-size: 12px;
    .top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      .img{
        width: 40rpx;
        height: 40rpx;
        // vertical-align: middle;
      }
      input{
        // float: left;
        padding-left: 10rpx;
        display: inline-block;
        width: 223rpx;
        height: 58rpx;
        border:1px solid rgba(199,199,199,1)
      }
      .btn{
        width: 60rpx;
        height: 60rpx;
        border-radius: 8rpx;
        background: #1E9EFF url(../../static/btn2x.png) no-repeat center;
        background-size: 40rpx 40rpx;
      }
      span{
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(30,158,255,1);
      }
    }
    .topExpand{
      position: relative;
      .box{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        input{
          display: inline-block;
          padding-left: 10rpx;
          width:333rpx;
          height:58rpx;
          border:1rpx solid rgba(199,199,199,1)
        }
      }
      button{
        width:463rpx;
        height:60rpx;
        line-height: 60rpx;
        color: #fff;
        font-size: 14px;
        background:rgba(30,158,255,1) url('../../static/btn2x.png') no-repeat 120rpx center;
        background-size: 40rpx 40rpx;
        border: none;
      }
      span{
        position: absolute;
        right: 0;
        bottom: 10rpx;
        color: rgba(30,158,255,1);
      }
    }
  }
</style>

