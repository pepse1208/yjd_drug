<template>
    <div class="details">
      <div class="headline">
        <p class="left">
          <span class="title bold">接收企业：</span>
          <span class="content bold">{{info.receiverName || '--;'}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">发送人：</span>
          <span class="content">{{info.senderUserName || '--'}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">营业执照号：</span>
          <span class="content">{{info.receiverLicense || '--'}}</span>
        </p>
      </div>
      <div class="">
        <p>
          <span class="title">创建时间：</span>
          <span class="content">{{info.createTime || '--'}}</span>
        </p>
      </div>
      <div class="">
        <p>
          <span class="title">接收人：</span>
          <span class="content">{{info.receiverUserName || '--'}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">接收人手机号：</span>
          <span class="content">{{info.receiverUserPhone || '--'}}</span>
        </p>
      </div>
    </div>
</template>
<script>
  export default {
    props: ['info']
  }
</script>
<style lang="scss" scoped>
  @import url(../common/base.scss);
  .details{
    $unit: 2rpx;
    color: #fff;
    height: 190*$unit;
    padding: 0*$unit 15*$unit 0*$unit;
    margin-bottom: 50*$unit;
    /*background: url('../images/manage_bg.png') center 100% no-repeat;*/
    background: linear-gradient(to right,#1E58FF, #1E8CFF , #2CA1FF);
    border-radius: 8rpx;
    box-shadow:0px 20rpx 30rpx rgba(30,140,255,.5);
    .bold{
      font-weight: bold;
    }
    div{
      font-size: 12*$unit;
      height: 12*$unit;
      padding-bottom: 15*$unit;
      display: flex;
      justify-content: space-between;
      p.left{
      }
      p{
        span{

        }
      }
    }
    div.headline{
      height: 12*$unit;
      font-size: 15*$unit;
      padding-top: 15*$unit;
    }
  }
</style>
