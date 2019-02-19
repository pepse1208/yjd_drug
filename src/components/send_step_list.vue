<template>
  <div class="step-list list-shadow">
    <div class="item flex li-style" @click="showCode ? stepOne(item.uuid, item.name) : showModal()" v-for="(item, index) in lists" :key="index">
      <div class="enterprise ellipsis">
        <span>{{item.name}}</span>
      </div>
      <div class="second_line flex flexrow">
        <div class="credit-code ellipsis">
          <span v-if="showCode">统一社会信用代码：</span>
          <span v-if="!showCode">包装规格：</span>
          <span>{{showCode ? item.license : item.package}}</span>
        </div>
        <div class="icon" v-if="showCode">
          <img src="../images/enter2x.png" alt="" />
        </div>
        <div class="selected" v-if="!showCode">
          <span>已选：</span>
          <span>100份</span>
        </div>
      </div>
    </div>
    <bottom-to-top-modal :showModalStatus="showModalStatus" @hideModal="hideModal" :height="height"></bottom-to-top-modal>
  </div>
</template>
<script>
import BottomToTopModal from '@/components/bottom_to_top_modal'
export default {
  props: ['fatherPage', 'lists'],
  components: {
    BottomToTopModal
  },
  data () {
    return {
      showCode: true,
      showModalStatus: false,
      height: 0
    }
  },
  beforeMount () {
    console.log(this.fatherPage)
    if (this.fatherPage === 'send_step1') {
      this.showCode = true
    } else {
      this.showCode = false
    }
  },
  methods: {
    stepOne (uuid, name) {
      if (this.fatherPage === 'send_step1') {
        wx.navigateTo({
          url: '/pages/send_step2/main?id=' + uuid + '&name=' + name
        })
      }
    },
    stepTwo () {
      let self = this
      self.showModalStatus = true
      setTimeout(function () { self.height = 200 }, 300)
    },
    showModal () {
      let self = this
      self.showModalStatus = true
      setTimeout(function () { self.height = 200 }, 300)
    },
    hideModal (bool) {
      let self = this
      self.height = 0
      setTimeout(function () { self.showModalStatus = bool }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
.item {
  align-items: flex-start;
  > div {
    width: 100%;
  }
}
.enterprise {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 30rpx;
  margin-bottom: 30rpx;
  color: #3E3A39;
}
.second_line {
  justify-content: space-between;
  height: 24rpx;
  line-height: 24rpx;
  font-size: 24rpx;
  color: #3E3A39;
  .credit-code {
    font-size: 24rpx;
    color: #a5a5a5;
  }
  .icon {
    width: 26rpx;
    height: 12rpx;
    margin-left: 12rpx;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      margin-top: -18rpx;
    }
  }
  .selected {
    min-width: 108rpx;
    color: #A5A5A5;
    font-size: 24rpx;
  }
}
.ellipsis {
  width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
