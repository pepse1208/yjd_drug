<template>
  <div class="header">
    <div class="flex flexrow nav">
      <div class="flex flexrow">
        <div :class="{'checkBtn': true, 'active': show}">
          <span @click="unexpand">普通搜索</span>
          <span class="line"></span>
        </div>
        <div :class="{'checkBtn': true, 'active': !show}">
          <span @click="expand">高级搜索</span>
          <span class="line"></span>
        </div>
      </div>
      <img @click="richScan" class="img" src="../../static/saoyisao2x.png" alt="">
    </div>
    <div v-if="show" class="top flex flexrow">
      <div class="flex flexrow">
        <input v-model="name" placeholder="请输入品种名称" type="text">
        <input v-model="batch" placeholder="请输入生产批号" type="text">
      </div>
      <!-- <img @click="search" class="btn" type="primary" size="mini"> -->
      <button @click="search" class="btn_com">查&emsp;询</button>
    </div>
    <div v-else class="topExpand flex flexrow">
      <div class="topExpand flex">
        <div class="box flex flexrow">
          <input v-model="name" placeholder="请输入品种名称" type="text">
          <input v-model="batch" placeholder="请输入生产批号" type="text">
        </div>
        <div class="box flex flexrow">
          <input v-model="packages" placeholder="请输入批准文号" type="text">
          <input v-model="enterprise" placeholder="请输入供应企业" type="text">
        </div>
      </div>
      <button @click="search" class="btn_com">查询</button>
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
    .nav {
      width: 100%;
      height: 96rpx;
      border-bottom: 2rpx solid #eee;
      margin-bottom: 32rpx;
      .img {
        width: 40rpx;
        height: 40rpx;
      }
      .checkBtn {
        position: relative;
        height: 96rpx;
        width: 136rpx;
        line-height: 96rpx;
        text-align: center;
        margin-right: 40rpx;
        .line {
          position:absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 56rpx;
          border-bottom: 4rpx solid transparent;
        }
      }
      .checkBtn.active {
        font-size: 32rpx;
        color: #1E9EFF;
        .line {
          border-color: #1E9EFF;
        }
      }
    }
    input {
      width: 256rpx;
      height: 56rpx;
      padding-left: 10rpx;
      border:1px solid rgba(199,199,199,1)
      
    }
    .top,
    .topExpand {
      justify-content: space-between;
      button {
        padding: 0;
      }
    }
    .top > div,
    .topExpand > div {
      flex-grow: 0;
      width: 548rpx;
      justify-content: space-between;
    }
    .topExpand {
      > div {
        height: 136rpx;
        justify-content: space-between;
      }
      .box {
        height: 60rpx;
      }
      .btn_com {
        height: 136rpx;
        padding: 10rpx 50rpx;
      }
    }
    // .top{
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   width: 100%;
    //   height: 100%;
    //   .img{
    //     width: 40rpx;
    //     height: 40rpx;
    //     // vertical-align: middle;
    //   }
    //   input{
    //     // float: left;
    //     padding-left: 10rpx;
    //     display: inline-block;
    //     width: 223rpx;
    //     height: 58rpx;
    //     border:1px solid rgba(199,199,199,1)
    //   }
    //   .btn{
    //     width: 60rpx;
    //     height: 60rpx;
    //     border-radius: 8rpx;
    //     background: #1E9EFF url(../../static/btn2x.png) no-repeat center;
    //     background-size: 40rpx 40rpx;
    //   }
    //   span{
    //     font-family:PingFangSC-Regular;
    //     font-weight:400;
    //     color:rgba(30,158,255,1);
    //   }
    // }
    // .topExpand{
    //   position: relative;
    //   .box{
    //     margin-bottom: 10px;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     width: 100%;
    //     height: 100%;
    //     input{
    //       display: inline-block;
    //       padding-left: 10rpx;
    //       width:333rpx;
    //       height:58rpx;
    //       border:1rpx solid rgba(199,199,199,1)
    //     }
    //   }
    //   // button{
    //   //   width:463rpx;
    //   //   height:60rpx;
    //   //   line-height: 60rpx;
    //   //   color: #fff;
    //   //   font-size: 14px;
    //   //   background:rgba(30,158,255,1) url('../../static/btn2x.png') no-repeat 120rpx center;
    //   //   background-size: 40rpx 40rpx;
    //   //   border: none;
    //   // }
    //   span{
    //     position: absolute;
    //     right: 0;
    //     bottom: 10rpx;
    //     color: rgba(30,158,255,1);
    //   }
    // }
    .btn_com {
      width: 142rpx;
      height:60rpx;
      line-height: 60rpx;
      color: #fff;
      font-size: 14px;
      border: none;
      background:#1E9EFF;
      margin: 0;
    }
  }
</style>

