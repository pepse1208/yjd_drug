<template>
    <div class="details">
      <div class="headline">
        <p class="left">
          <!--<span class="title bold">品种名称：</span>-->
          <span class="content bold">{{info.name}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">批准文号：</span>
          <span class="content">{{info.reg_number}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">包装规格：</span>
          <span class="content">{{info.package}}</span>
        </p>
      </div>
      <div class="">
        <p>
          <span class="title">剂型：</span>
          <span class="content">{{info.all_dosage}}</span>
        </p>
      </div>
      <div class="">
        <p>
          <span class="title">材质：</span>
          <span class="content">{{info.drug_material || '--'}}</span>
        </p>
      </div>
      <div class="">
        <p class="left">
          <span class="title">生产企业：</span>
          <span class="content">{{info.production_enterprise}}</span>
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
