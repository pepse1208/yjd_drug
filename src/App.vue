<script>
import {checkcrosstime} from './utils.js'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  },
  // mounted () {
  //   checkcrosstime()
  // },
  onload () {
    checkcrosstime()
  },
  onLaunch () {
    wx.setStorage({ // 判断登录
      key: 'isLogin',
      data: false
    })
    wx.setStorage({ // 企业类型
      key: 'type',
      data: ''
    })
  }
}
</script>

<style>
@import url(./common/base.scss);
.right{
  float: right;
}
.left{
  float: left;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
