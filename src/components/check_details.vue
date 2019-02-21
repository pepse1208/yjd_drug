<template>
  <div   class="check_details">
    <div class="modal" @click="$emit('modalShow', false)" :class="{hideModal: ishide}"></div>
    <div class="con" :class="{showCon: isShowCheck}">
      <div class="conBlock">
        <div class="line">
          <span class="explain">品种名称</span>
          <span class="details">{{checkDetails.name}}</span>
        </div>
        <div class="line">
          <span class="explain">剂型</span>
          <span class="details">{{checkDetails.all_dosage}}</span>
        </div>
        <div class="line">
          <span class="explain">材质</span>
          <span class="details">{{checkDetails.drug_material}}</span>
        </div>
        <div class="line">
          <span class="explain">包装规格</span>
          <span class="details">{{checkDetails.package}}</span>
        </div>
        <div class="line">
          <span class="explain">批准文号</span>
          <span class="details">{{checkDetails.reg_number}}</span>
        </div>
        <div class="line">
          <span class="explain">生产企业</span>
          <span class="details">{{checkDetails.production_enterprise}}</span>
        </div>
        <div class="line">
          <span class="explain">生产批号</span>
          <span class="details">{{checkDetails.batch}}</span>
        </div>
        <div class="line">
          <span class="explain">发货数量</span>
          <span class="details">{{checkDetails.amount}}</span>
        </div>
        <!--特殊处理-->
        <!--已处理、已接受-->
        <block v-if="isShow">
          <div class="line">
            <span class="explain">审核结果</span>
            <span class="details">{{checkDetails.report_date}}</span>
          </div>
        </block>
        <!--已退回-->
        <block v-if="isShow">
          <div class="line">
            <span class="explain">拒绝原因</span>
            <span class="details">{{checkDetails.report_date}}</span>
          </div>
        </block>
        <!--已取消、待对方查收-->
        <block v-if="isShow">
          <div class="line">
            <span class="explain">报告日期</span>
            <span class="details">{{checkDetails.batch}}</span>
          </div>
          <div class="line">
            <span class="explain">生产日期</span>
            <span class="details">{{checkDetails.batch}}</span>
          </div>
          <div class="line">
            <span class="explain">有效期至</span>
            <span class="details">{{checkDetails.batch}}</span>
          </div>
        </block>
        <span class="close" @click="$emit('modalShow', false)">&times;</span>
        <span class="btn">查看PDF文件</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['isShowCheck', 'checkDetails'],
    data () {
      return {
        isShow: false,
        ishide: true
      }
    },
    watch: {
      'isShowCheck' (val, oldVal) {
        var vm = this
        if (val === false) {
          setTimeout(function () {
            vm.ishide = true
          }, 500)
        } else {
          setTimeout(function () {
            vm.ishide = false
          }, 50)
        }
      }
    },
    mounted () {
      console.log('组件', this.checkDetails)
    },
    computed: {
    },
    methods: {
      modal () {
        this.isShowCheck = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .check_details{
    $unit: 2rpx;
    .modal{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: #000;
      bottom: 0;
      opacity: 0.4;
      z-index:1001;
      display: block;
      /*transition: opacity 1000ms;*/
    }
    .hideModal{
      opacity: 0;
      display: none;
      z-index:-1;
    }
    .con{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
      transition: height 500ms;
      background: #fff;
      z-index:1002;
      border-radius: 6*$unit 6*$unit 0 0;
    }
    .conBlock{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 25*$unit;
      margin-bottom: 25*$unit;
      .close{
        position: absolute;
        top: 12*$unit;
        right: 17*$unit;
        color: #3E3A39FF;
        font-size: 20px;
      }
      .btn{
        width:134*$unit;
        height:40*$unit;
        background:rgba(30,158,255,1);
        border-radius:2px;
        font-size: 15px;
        line-height: 40*$unit;
        text-align: center;
        color: #FFFFFFFF;
        margin-top: 20*$unit;
      }
      .line{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14*$unit;
        width: 100%;
        &:first-child{
          margin-top: 45*$unit;
        }
        .explain{
          font-size: 12px;
          color: #A5A5A5FF;
          margin-left: 24rpx;
        }
        .details{
          color: #3E3A39FF;
          margin-right: 24rpx;
        }
      }
    }
    .showCon{
      height: 395*$unit;
    }
  }
</style>
