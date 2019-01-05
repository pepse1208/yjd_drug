<template>
  <div class="statements">
    <span class="declare">状态说明 :</span>
    <div class="item" :key="index" v-for="(item, index) in lists">
      <i class="gray_bg dot" :class="item.color" ></i>
      <span>{{item.text}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['lists'],
    data () {
      return {
      }
    }
  }
</script>
<style scoped lang="scss">
  div.statements{
    $unit: 2rpx;
    display: flex;
    padding: 0 4*$unit 16*$unit;
    border-bottom: 1px solid #EEEEEE;
    font-size: 12*$unit;
    span.declare{
      color: #A5A5A5;
    }
    div.item{
      display: flex;
      align-items: center;
      margin-left: 20*$unit;
      i{
        width: 8*$unit;
        height: 8*$unit;
        border-radius: 50%;
        font-style: normal;
        margin-right: 2*$unit;
      }
      span{
        color: #3E3A39;
      }
    }
  }
</style>
