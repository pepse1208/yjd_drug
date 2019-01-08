<template>
  <div class="details">
    <div class="drug">
      <span :class="[details.bgColor, 'icon']"></span>
      <span class="txt">{{details.name}}</span>
    </div>
    <div class="batch">
      <span>生产批号：</span>
      <span class="txt">{{details.batch}}</span>
    </div>
    <div class="package">
      <span>包装规格：</span>
      <span class="txt">{{details.package}}</span>
    </div>
    <div class="enterprise">
      <span>供应企业：</span>
      <span class="txt">{{details.enterprise_name}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['details'],
    data () {
      return {
        header: 'search',
        locked: true,
        isShow: false
      }
    }
  }
</script>
<style lang='scss' scoped>
  .details {
    font-size: 24rpx;
    width: 420rpx;
    color: #A5A5A5;
    div {
      margin: 24rpx 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .drug {
      font-size: 32rpx;
      color: #3E3A39;
      font-weight: bold;
      .icon {
        display: inline-block;
        margin-bottom: 4rpx;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
    }
    .batch {
      color: #3E3A39;
    }
  }
  .overflow {
    .details {
      width: 300rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .overflow4 {
    .details {
      width: 186rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
