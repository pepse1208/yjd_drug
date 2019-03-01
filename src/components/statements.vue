<template>
  <div>
    <div class="statements" id="statements">
    </div>
    <div class="statements fixed">
      <span class="declare">状态说明 :</span>
      <div class="item" :key="index" v-for="(item, index) in lists">
        <i class="gray_bg dot" :class="item.color" ></i>
        <span>{{item.text}}</span>
      </div>
      </div>
  </div>
</template>
<script>
  export default {
    props: ['lists'],
    data () {
      return {
        isFixed: false,
        scrollTop: 0
      }
    },
    onPageScroll: function (e) {
      // console.log(e) // {scrollTop:99}
      // console.log(e.scrollTop) // {scrollTop:99}
      // if (e.scrollTop >= 92) {
      //   this.isFixed = true
      //   console.log(this.isFixed)
      // } else {
      //   this.isFixed = false
      // }
      let query = wx.createSelectorQuery()
      query.select('#statements').boundingClientRect((rect) => {
        console.log(rect.top <= 106)
        let top = rect.top
        if (top <= 106) { // 临界值，根据自己的需求来调整
          this.isFixed = true
        } else {
          this.isFixed = false
        }
      }).exec()
    },
    onUnload: function () {
      this.isFixed = false
    }
  }
</script>
<style scoped lang="scss">
  div.statements{
    $unit: 2rpx;
    display: flex;
    width: 100%;
    height: 60rpx;
    line-height: 60rpx;
    // border-bottom: 1px solid #EEEEEE;
    background: #fff;
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
  div.statements.fixed {
    position: fixed;
    top: 212rpx!important;
    left: 0;
    z-index: 100;
    padding-left: 24rpx;
    padding-right: 24rpx;
  }
</style>
