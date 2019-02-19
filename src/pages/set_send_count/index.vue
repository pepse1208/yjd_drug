<template>
  <div class="selected-list">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>选择药检单</base-top>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'name'">查&emsp;询</search-input>
    <div class="foot flex flexrow">
      <div class="selected-text" @click="toSelectedList">查看已选药检单</div>
      <div class="next-step flex flexrow">
        <span class="next-text">下一步</span>
        <img class="next-icon" src="../../images/next-step.png" />
      </div>
    </div>
    <div class="placeholder"></div>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import SearchInput from '@/components/searchInput'
export default {
  components: {
    NavigationBar,
    BaseTop,
    SearchInput
  },
  data () {
    return {}
  }
}
</script>
<style>
._search_input {
  width: 528rpx;
}
</style>

<style scoped lang="scss">
.list {
  margin-bottom: 50rpx;
}
.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 32rpx 0 56rpx;
  font-size: 24rpx;
  box-sizing: border-box;
  background: #FFF;
  box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
  .selected-text {
    color: #1E9EFF;
  }
  .next-step {
    justify-content: center;
    width: 162rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    color: #FFF;
    background: #1E9EFF;
    .next-icon {
      width: 26rpx;
      height: 12rpx;
      margin-left: 8rpx;
    }
  }
}
.foot, .placeholder {
  width: 100%;
  height: 98rpx;
}
</style>
