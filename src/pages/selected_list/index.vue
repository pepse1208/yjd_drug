<template>
  <div class="selected-list">
    <navigation-bar :back="true"></navigation-bar>
    <base-top>已选药检单</base-top>
    <search-input :url="searchUrl" @renderData="recvData" :placeholder='"请输入企业全称"' :searchName="'name'">查&emsp;询</search-input>
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
<style scoped lang="">
</style>
