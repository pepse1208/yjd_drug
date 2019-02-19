<template>
  <div   class="check_details">
    <div class="modal" @click="$emit('modalShow', false)" :class="{showModal: isShowCheck}"></div>
    <div class="con" :class="{showCon: isShowCheck}">

    </div>
  </div>
</template>
<script>
  export default {
    props: ['isShowCheck'],
    mounted () {
      console.log('组件', this.isShowCheck)
    },
    methods: {
      modal () {
        this.isShowCheck = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .check_details{
    $unit: 2rpx;
    .modal{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: #000;
      bottom: 0;
      opacity: 0;
      transition: opacity 1000ms;
      z-index:-1;
    }
    .showModal{
      opacity: 0.4;
      z-index:1001;
    }
    .con{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0;
      transition: height 500ms;
      background: #fff;
      z-index:1002;
      border-radius: 6*$unit 6*$unit 0 0;
    }
    .showCon{
      height: 250*$unit;
    }
  }
</style>
