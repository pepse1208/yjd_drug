<template>
  <div>
    <div class="navigation-bar"
      :style="{
        'padding-top': (paddingTop + 'px;'),
        'height': (height + 'px;'),
        'line-height': (height + 'px;'),
        'background': (background + ';'),
        'color': (color + ';'),
        'font-size': (fontSize + ';'),
        'position': (fixed && 'fixed;'),
        'transform': ('translateY(' + !show?( - paddingTop - height + 'px;'): '0;)')}">
      <div class="back" v-if="back"
        :style="{
          'padding-top': (0 + 'px;'),
          'margin-top': '30px',
          'height': (24 + 'px'),
          'line-height': (24 + 'px;')}">
        <div class="icon-fanhui" @click="navigateBack"></div>|<div class="back-home" v-if="showHomeButton" @click="navigateBackHome"></div>
      </div>
      <div class="title">{{title !== 'none' ? title : ''}}</div>
    </div>
    <div class="navigation-bar-holder" v-if="fixed && show"
      :style="{
        'background': (placeholderBg + ';'),
        'padding-top': (paddingTop + 'px;'),
        'height': (height + 'px;'),
        'line-height': (height + 'px;'),
        'width': (750 + 'rpx;')}">
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      height: 44,
      paddingTop: 20,
      // background: '#009DFF',
      background: '#FFF',
      fixed: true,
      color: '#ddd',
      showHomeButton: true,
      title: '药检通平台',
      show: true,
      placeholderBg: 'transparent'
    }
  },
  props: [
    'back'
  ],
  methods: {
    clickme: function () { console.log(13) },
    navigateBack () {
      wx.navigateBack({
        delta: '1'
      })
      // let pages = getCurrentPages()
      // if (pages.length < 2 && pages[0].route !== __wxConfig.pages[0]) {
      //   wx.reLaunch({url:'/' + __wxConfig.pages[0]})
      // } else {
      //   wx.navigateBack({delta: 1})
      // }
    },
    navigateBackHome () {
      wx.reLaunch({url: '/pages/catalog/main'})
    },
    /**
     * 切换导航栏显示
      */
    toggleShow () {
      if (!this.data.show) {
        this.setData({ show: true })
      }
    },
    /**
     * 切换导航栏隐藏
      */
    toggleHide () {
      if (this.data.show) {
        this.setData({ show: false })
      }
    }
  }
}
</script>
<style scoped>
.bar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
}
.navigation-bar{
  position: relative;
  padding-top: 20px;
  display: flex;
  left: 0;
  top: 0;
  width: 750rpx;
  color: #ffffff;
  /* background: #45b9e5; */
  z-index: 2000;
  text-align: center;
  /*transition: 300ms;*/
  /* margin-top: 16rpx; */
  box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
}
.back{
  position: absolute;
  width: 136rpx;
  height: 50rpx;
  border: 2rpx solid #EEEEEE;
  border-radius:12px;
  left: 0;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 24rpx;
}
/* .icon-fanhui, .back-home{
  display: inline-block;
  font-family: 'iconfont' !important;
  font-style: normal;
  font-weight: bold;
  font-variant: normal;
  text-transform: none;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
  font-size: 34rpx;
  padding-left:10rpx;
  color: #fff;
} */
.back-home {
  width: 28rpx;
  height: 26rpx;
  text-align: center;
  font-size: 30rpx;
  background: url(../images/back-home.png) no-repeat;
  background-size: 28rpx 26rpx;
  margin-left: 18rpx;
  margin-right: 18rpx;
}
.icon-fanhui{
  width: 16rpx;
  height: 26rpx;
  background: url(../images/icon-fanhui.png) no-repeat;
  background-size: 16rpx 26rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}
.title{
  font-weight: bold;
  margin: 0 auto;
  color: #3E3A39;
}
.navigation-bar-holder{
  background: transparent;
  position: relative;
  z-index: 2;
}
</style>
