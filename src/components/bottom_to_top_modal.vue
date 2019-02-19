<template>
  <div :class="showModalStatus ? '_toTop _show': '_toTop'">
    <div class="_commodity_screen" @click="clickHide" v-if="showModalStatus"></div>
    <div class="_commodity_attr_box" v-if="showModalStatus" :style="'height:'+height+'px;'">123123</div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: ['showModalStatus', 'height'],
  methods: {
    clickHide () {
      this.height = 0
      this.showModalStatus = false
      this.$emit('hideModal', false)
    }
  }
}
</script>
<style scoped lang="scss">
._toTop {
  height: 0;
  overflow: hidden;
  ._commodity_screen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.4;
    z-index: 10000;
    color: #fff;
    display: none;
  }
  ._commodity_attr_box {
    width: 100%;
    height: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 20000;
    background: #fff;
    transition: all .5s linear;
  }
}

._show {
  height: 100%;
  ._commodity_screen {
    display: block;
  }
  ._commodity_attr_box {
    bottom: 0;
  }
}
</style>
