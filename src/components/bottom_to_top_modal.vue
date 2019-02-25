<template>
  <div :class="showModalStatus ? '_toTop _show': '_toTop'">
    <div class="_commodity_screen" @click="clickHide" v-if="showModalStatus"></div>
    <div class="_commodity_attr_box" v-if="showModalStatus" :style="'height:'+height+'px;'">
      <div class="cancel" @click="clickHide"></div>
      <div class="list" v-if="show">
        <block v-for="(item, index) in lists" :key="index">
          <div class="li-style flex flexrow" @click="checkDrug({uuid: item.uuid, isSelect: item.is_select})">
            <div>
              <div class="batch">
                <span>生产批号：</span>
                <span>{{item.batch}}</span>
              </div>
              <div class="report-date">
                <span>报告日期：</span>
                <span>{{item.report_date || '--'}}</span>
              </div>
            </div>
            <span class="select-icon" :class="{'selected': item.is_select}"></span>
          </div>
        </block>
      </div>
      <div class="submit flex" @click="complete" v-if="show">
        <span>确定</span>
      </div>
      <div class="detail-list list" v-if="!show">
        <div class="line">
          <span class="title">品种名称：</span>
          <span class="det">{{details.drug.name || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">批准文号</span>
          <span class="det">{{details.drug.reg_number || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">包装规格</span>
          <span class="det">{{details.drug.package || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">剂型</span>
          <span class="det">{{details.drug.all_dosage || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">材质</span>
          <span class="det">{{details.drug.drug_material || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">生产企业</span>
          <span class="det">{{details.drug.production_enterprise || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">生产批号</span>
          <span class="det">{{details.batch || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">报告日期</span>
          <span class="det">{{details.report_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">报告编号</span>
          <span class="det">{{details.code || '--'}}</span>
        </div>
        <div v-if="details.sender.name" class="line">
          <span class="title">供应企业</span>
          <span class="det">{{details.sender.name || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">生产日期</span>
          <span class="det">{{details.product_date || '--'}}</span>
        </div>
        <div class="line">
          <span class="title">有效期至</span>
          <span class="det">{{details.validity || '--'}}</span>
        </div>
      </div>
      <div class="submit flex" @click="complete" v-if="!show">
        <span>查看PDF文件</span>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      show: true,
      details: []
    }
  },
  props: ['showModalStatus', 'height', 'lists', 'fatherPage'],
  methods: {
    clickHide () {
      this.height = 0
      this.showModalStatus = false
      this.$emit('hideModal', false)
    },
    complete () {
      this.submit()
      this.clickHide()
      this.$forceUpdate()
    },
    checkDrug ({uuid, isSelect}) {
      this.selectDrug({uuid, isSelect})
      this.$forceUpdate()
    },
    ...mapActions({
      selectDrug: 'selectDrug',
      submit: 'submit'
    })
  },
  updated () {
    if (this.fatherPage === 'selected_list') {
      this.show = false
    } else {
      this.show = true
    }
    this.details = this.lists[this.$parent.key]
  },
  beforeMount () {
    console.log(this.lists)
    console.log(this.details)
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
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
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
.cancel {
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  top: 24rpx;
  right: 24rpx;
  background: url(../images/cancel_black.png) no-repeat;
  background-size: 24rpx 24rpx;
}
.list {
  height: 376rpx;
  overflow: auto;
  margin-top: 64rpx;
}
.li-style {
  height: 120rpx;
  margin: 0 32rpx;
  box-sizing: border-box;
  .batch {
    font-size:30rpx;
    margin-bottom: 10rpx;
  }
  .report-date {
    font-size:24rpx;
    color:#A5A5A5;
  }
  .select-icon {
    width: 32rpx;
    height: 32rpx;
    border: 1px solid #DFDFDF;
    border-radius: 4rpx;
  }
  .select-icon.selected {
    background: #1E9EFF url(../images/selected.png) no-repeat 7rpx 8rpx;
    background-size: 18rpx;
  }
}
.submit {
  width: 100%;
  height: 160rpx;
  justify-content: center;
  span {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 48rpx;
    border-radius: 4rpx;
    background: #1e9eff;
    color: #fff;
    font-size: 30rpx;
    text-align: center;
  }
}
.detail-list {
  padding: 0 32rpx;
}
.line {
  display: flex;
  justify-content: space-between;
  height: 24px;
  line-height: 24px;
  font-size: 24rpx;
  .title {
    color:#A5A5A5;
  }
  .det {
    color: #3E3A39;
  }
}
</style>
