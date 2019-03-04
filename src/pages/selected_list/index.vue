<template>
  <div class="selected-list">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top>已选药检单</base-top>
    </div>
    <div class="list">
      <send-step-list :fatherPage="fatherPage" :lists="lists"  @controlModal="controlModal"></send-step-list>
    </div>
    <p class="no_datas" v-if="!more">
      暂无更多数据
    </p>
    <bottom-to-top-modal :showModalStatus="showModalStatus" @hideModal="hideModal" :height="height" :lists="lists"  :fatherPage="fatherPage"></bottom-to-top-modal>
  </div>
</template>
<script>
import NavigationBar from '@/components/navigationBar'
import BaseTop from '@/components/base_top'
import SendStepList from '@/components/send_step_list'
import BottomToTopModal from '@/components/bottom_to_top_modal'
import $store from '../../store/index'
export default {
  components: {
    NavigationBar,
    BaseTop,
    SendStepList,
    BottomToTopModal
  },
  data () {
    return {
      lists: {},
      drugsDetails: {},
      showModalStatus: false,
      height: 0,
      fatherPage: 'selected_list',
      more: true,
      key: ''
    }
  },
  methods: {
    hideModal (bool) {
      let self = this
      self.height = 0
      setTimeout(function () { self.showModalStatus = bool }, 300)
    },
    controlModal (data) {
      let self = this
      self.showModalStatus = data.showModalStatus
      setTimeout(function () { self.height = data.height }, 300)
    },
    showDrugDetail ({key}) {
      let self = this
      self.key = key
      // console.log(self.key)
      self.showModalStatus = true
      setTimeout(function () { self.height = 300 }, 300)
    },
    deleteDrug ({key}) {
      let drugId = this.lists[key].drug.uuid
      let sendStepTwoListData = $store.state.sendStepTwoListData
      let selectObj = $store.state.selectObj
      let selectedList = $store.state.selectedList
      sendStepTwoListData[drugId].count -= 1
      // delete $store.state.selectObj[drugId][key]
      // delete $store.state.sendStepTwoListData[drugId].files[key]
      // delete $store.state.selectedList[key]
      delete selectObj[drugId][key]
      delete sendStepTwoListData[drugId].files[key]
      delete selectedList[key]
      this.$forceUpdate()
    },
    updateData () {
      this.lists = $store.state.selectedList
      if (Object.keys(this.lists).length === 0) {
        this.more = false
      } else {
        this.more = true
      }
    }
  },
  beforeMount () {
    this.updateData()
  },
  updated () {
    this.updateData()
  },
  onPullDownRefresh () {
    // 下拉刷新
    wx.stopPullDownRefresh()
  },
  onUnload: function () {
    this.drugsDetails = {}
    this.showModalStatus = false
    this.height = 0
    this.more = true
    this.key = ''
  }
}
</script>
<style scoped lang="">
</style>
