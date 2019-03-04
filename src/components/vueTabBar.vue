<template>
  <section class="tabBar-wrap">
    <article :class="navList.length === 0 ? 'tabBar-box tabBar-box2' : 'tabBar-box'">
      <ul class="tabBar-nav">
        <li class="item" 
            v-for="(item, index) in navList"
            @click="selectNavItem(index, item.pagePath)"
            :key="index"
            v-if="item.isShow">
          <p class="item-images">
            <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" alt="iconPath">
          </p>
          <p :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text' ">
            {{item.text}}
          </p>
        </li>
      </ul>
    </article>
  </section>
</template>
<script>
  export default {
    props: ['selectNavIndex', 'navList'],
    data () {
      return {}
    },
    methods: {
      selectNavItem (index, pagePath) {
        if (index === this.selectNavIndex) {
          return false
        } else {
          this.$emit('fetchIndex', index)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tabBar-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    box-sizing: border-box;
    padding: 12rpx 0;
    border-top: 1px solid #F8F8F8;
    background-color: #fff;
    box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
  }

  .tabBar-nav {
    width: 100%;
    display: flex;

    .item {
      flex: 1;
      text-align: center;
    }
    .item:not(:last-child) {
      border-right: 1px solid #eee; 
    }
    .item-text {
      color: #666;
      font-size: 24rpx;
      line-height: 24rpx;
      transition: .24s linear;
      margin-top: 16rpx;
    }
    .item-text-active {
      color: #00A0E9;
    }

    .item-images {
      width: 40rpx;
      height: 32rpx;
      margin: 0 auto;
      text-align: center;
      transition: .24s linear;

      img {
        height: 100%;
        width: 100%;
      }
    }
  }

  button {
    border: 0;
    outline: 0;
  }
  .submit-box-btn {
    position: relative;
    z-index: 999;
    width: 85%;
    height: 76rpx;
    background: #1e9eff;
    color: #fff;
    line-height: 76rpx;
    border-radius: 8rpx;
    font-size: 32rpx;
    text-align: center;
    border: 1px solid #eee;
  }
  .tabBar-box2 {
    padding: 0;
    border: 0;
    .submit-box-btn {
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      border: 0;
    }
  }
  
</style>
