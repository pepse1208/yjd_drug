<template>
  <div class="step-list list-shadow">
    <div class="item flex li-style" :class="{'flex flexrow': showBtns}" @click="!showBtns && (showCode ? stepOne(item.uuid, item.name) : showModal(item.drug ? item.drug.uuid : ''))" v-for="(item, key) in lists" :key="key">
      <div class="details" :class="{'ellipsis': showBtns}">
        <div class="enterprise ellipsis">
          <span>{{item.drug ? item.drug.name : item.name}}</span>
        </div>
        <div class="second_line ellipsis" v-if="showBtns">
          <div class="credit-code ellipsis">
            <span>生产批号：</span>
            <span>{{item.batch || ''}}</span>
          </div>
        </div>
        <div class="second_line flex flexrow">
          <div class="credit-code ellipsis">
            <span v-if="showCode">统一社会信用代码：</span>
            <span v-if="!showCode">包装规格：</span>
            <span>{{showCode ? item.license : item.drug.package}}</span>
          </div>
          <div class="icon" v-if="showCode">
            <img src="../images/enter2x.png" alt="" />
          </div>
          <div class="selected" v-if="!showCode && !showBtns">
            <span>已选：</span>
            <span>{{item.count}}份</span>
          </div>
        </div>
      </div>
      <div v-if="showBtns" class="btns flex flexrow">
        <span class="drug-detail blue_bg" @click="showDrugDetail(key)">查看</span>
        <span class="delete red_bg" @click="deleteDrug(key)">删除</span>
      </div>
    </div>
  </div>
</template>
<script>
import $store from '../store/index'
export default {
  props: ['fatherPage', 'lists', 'getListDataFun'],
  data () {
    return {
      showCode: true,
      showBtns: false
    }
  },
  beforeMount () {
    if (this.fatherPage === 'send_step1') {
      this.showCode = true
      this.showBtns = false
    } else if (this.fatherPage === 'selected_list') {
      this.showBtns = true
      this.showCode = false
    } else {
      this.showCode = false
      this.showBtns = false
    }
  },
  methods: {
    stepOne (uuid, name) {
      // let receiver = $store.state.receiver
      // if (receiver === uuid) {
      //   receiver = ''
      // } else {
      $store.state.receiver = uuid
      $store.state.sendStepTwoListData = {}
      $store.state.sendStepTwoDrugData = {}
      $store.state.sendStepTwoDrugId = ''
      $store.state.searchObj = {}
      $store.state.selectObj = {}
      $store.state.selectedList = {}
      // }
      if (this.fatherPage === 'send_step1') {
        wx.navigateTo({
          url: '/pages/send_step2/main'
        })
      }
    },
    showModal (uuid) {
      $store.state.sendStepTwoDrugId = uuid
      if (this.$parent.getDrugData) {
        this.$parent.getDrugData({})
      }
      this.$emit('controlModal', {showModalStatus: true, height: 300})
    },
    showDrugDetail (key) {
      // console.log('key: ' + key)
      this.$parent.showDrugDetail({key})
    },
    deleteDrug (key) {
      this.$parent.deleteDrug({key})
    }
  }
}
</script>
<style scoped lang="scss">
.item {
  align-items: center;
  padding: 0;
  > .details {
    width: 100%;
  }
}
.enterprise {
  height: 30rpx;
  line-height: 30rpx;
  font-size: 30rpx;
  margin: 24rpx 0;
  color: #3E3A39;
}
.second_line {
  justify-content: space-between;
  height: 24rpx;
  line-height: 24rpx;
  font-size: 24rpx;
  margin-bottom: 24rpx;
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
    width: 140rpx;
    color: #A5A5A5;
    font-size: 24rpx;
  }
}
.ellipsis {
  width: 400rpx !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btns {
  width: 220rpx;
  > span {
    width: 100rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    color: #fff;
    border-radius: 4rpx;
  }
  .drug-detail {
    margin-right: 20rpx;
    box-shadow: 0px 7px 16px 0px rgba(121,197,255,0.5);
  }
  .delete {
    box-shadow:0px 7px 16px 0px rgba(255,115,105,0.5);
  }
}
</style>
