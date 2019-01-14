<template>
  <div class="search flex">
    <block :key="index" v-for="(list, index) in lists">
      <div class="item flex flexrow">
        <div class="details">
          <div class="drug flex flexrow">
            <span :class="bgColor"></span>
            <span>{{list.drug.name}}</span>
          </div>
          <div class="batch">
            <span>生产批号：</span>
            <span>{{list.batch}}</span>
          </div>
          <div class="package">
            <span>包装规格：</span>
            <span>{{list.drug.package}}</span>
          </div>
          <div class="enterprise">
            <span>供应企业：</span>
            <span>{{list.enterprise_name}}</span>
          </div>
        </div>
        <div class="btns">
          <div class="btn_com flex flexrow" v-if="!isShow">
            <div @click="tipDetail(list)">详情</div>
            <div class="more_operate" @click="showOperateBtns"></div>
          </div>
          <div class="btn_com flex flexrow operation" v-if="isShow">
            <block v-for="(_item, _index) in btnList" :key="_index">
              <div @click="_item.cb">{{_item.text}}</div>
            </block>
            <div class="back" @click="backCb"></div>
          </div>
        </div>
      </div>
    </block>
  </div>
</template>
<script>
  export default {
    props: ['lists', 'consoleText', 'bgColor', 'btnList'],
    data () {
      return {
        header: 'search',
        locked: true,
        isShow: false
      }
    },
    mounted () {
      // console.log(this.lists, 'lists')
      // console.log(this.bgColor)
    },
    methods: {
      getDetail (index) {
        let vm = this
        if (vm.locked) {
          vm.locked = false
          // console.log(vm.locked, 'loading')
          wx.navigateTo({
            url: '/pages/drugdetail/main?json=' + JSON.stringify(vm.lists[index]),
            success () {
              vm.locked = true
              // console.log(vm.locked, 'success')
            }
          })
        }
      },
      tipDetail (item) { // 弹窗显示详情
        const drug = item.drug
        wx.showModal({
          title: '',
          content:
            '品种名称：' + (drug.name || '--') + '\r\n' +
            '生产批号：' + (item.batch || '--') + '\r\n' +
            '包装规格：' + (drug.package || '--') + '\r\n' +
            '剂型：' + (drug.all_dosage || '--') + '\r\n' +
            '材质：' + (drug.drug_material || '--') + '\r\n' +
            '批准文号：' + (drug.reg_number || '--') + '\r\n' +
            '生产企业：' + (drug.production_enterprise || '--') + '\r\n' +
            (this.isShow ? ('供应企业：' + (item.enterprise_name || '--') + '\r\n') : '') +
            // '报告编号：' + productDate + '\r\n' +
            '报告日期：' + (item.report_date || '--') + '\r\n' +
            '生产日期：' + (item.product_date || '--') + '\r\n' +
            '有效期至：' + (item.validity || '--'),
          showCancel: false,
          success (res) {
          }
        })
      },
      showOperateBtns () { // 点击 ··· 显示更多操作按钮
        this.isShow = true
        // console.log('show more btns')
      },
      backCb () {
        this.isShow = false
      }
    }
  }
</script>
<style lang='scss'>
  .search {
    .item {
      width: 100%;
      justify-content: space-between;
      .details {
        font-size: 24rpx;
        width: 420rpx;
        color: #A5A5A5;
        div {
          margin: 24rpx 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .drug {
          font-size: 32rpx;
          color: #3E3A39;
          font-weight: bold;
          justify-content: flex-start;
          .icon {
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            margin-right: 10rpx;
          }
        }
        .batch {
          color: #3E3A39;
        }
      }
      .details.overflow {
        width: 300rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .btns {
        .btn_com {
          .btn_com {
            width: 100rpx;
            height: 100rpx;
            text-align: center;
            line-height: 100rpx;
            font-size: 30rpx;
            color: white;
            border: 0;
            border-radius: 4rpx;
            background: #1E9EFF;
            padding: 0;
          }
          .more_operate {
            background: #1E9EFF url(../images/ellipsis.png) no-repeat center center;
            background-size: 40rpx 8rpx;
          }
        }
        div ~ div {
          margin-left: 30rpx;
        }
        .operation {
          .back {
            background: #1E9EFF url(../images/cancel.png) no-repeat center center;
            background-size: 30rpx 30rpx;
          }
        }
      }
    }
    .item:not(:last-child) {
      border-bottom: 2rpx solid #eee;
    }
  }
</style>