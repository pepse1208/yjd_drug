<template>
  <div class="search flex flexrow">
    <input v-model="name" placeholder="请输入品种名称" type="text" class="search_input">
    <span class="search_text" @click="searchDrug(url)"><slot></slot></span>
  </div>
</template>
<script>
  import {get} from '../utils.js'
  export default {
    props: ['url'],
    data () {
      return {
        name: '',
        show: true
      }
    },
    methods: {
      async searchDrug (url) {
        console.log(this.name)
        var resp = await get({
          url,
          data: {
            name: this.name
          }
        })
        console.log(resp.data)
        this.$emit('renderData', resp.data)
      }
    },
    onShow () {
      this.name = ''
    }
  }
</script>
<style lang='scss'>
  .search {
    margin-bottom: 40rpx;
  }
  .search_input {
    width:436rpx;
    height:64rpx;
    border:1px solid #C7C7C7;
    padding-left:20rpx;
    margin-right: 20rpx;
    box-sizing: border-box;
  }
  .search_text {
    width: 182rpx;
    height: 64rpx;
    line-height: 64rpx;
    background: #1e9eff;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
    border-radius: 8rpx;
  }
</style>

