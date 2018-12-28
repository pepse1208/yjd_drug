<template>
  <div class="operate">
    <div class="step step1">
      <p>step1</p>
      <div>打开浏览器输入网址: <span @click="longpress">https://www.syzljh.cn/</span> ,输入用户密码,验证登录到首营交换平台</div>
      <img class="img" mode="aspectFill" src="../../../static/step/step1.png" alt="">
    </div>
    <div class="step step2">
      <p>step2</p>
      <div>点击药检通图标,进入药检通平台。</div>
      <img class="img" mode="aspectFill" src="../../../static/step/step2.png" alt="">
    </div>
    <div class="step step3">
      <p>step3</p>
      <div>点击药检单查询,进入药检单查询模块，搜索需要查看文件的药检单。</div>
      <img class="img" mode="aspectFill" src="../../../static/step/step3.png" alt="">
    </div>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: 123
      }
    },
    methods: {
      longpress () {
        wx.setClipboardData({
          data: 'https://www.syzljh.cn/'
        })
      }
    }
  }
</script>
<style lang="scss" scope>
  .operate{
    font-size: 14px;
    .step1{
      span{
        font-size: 16px;
        color: #1E9EFF;
        text-decoration: underline;
      }
    }
    .step{
      div{
        line-height: 2em;
      }
      p{
        padding: 10px 0;
        font-size: 16px;
        color: #1E9EFF;
      }
      .img{
        width: 100%;
      }
    }
  }
</style>

