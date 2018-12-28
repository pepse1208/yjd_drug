<template>
  <div class="info">
    <div class="infomation">
      <div class="box">
        品种名称:
        <div class="right">{{infolist.name}}</div>
      </div>
      <div class="box">
        批号:
        <div class="right">{{info.batch}}</div>
      </div>
      <div class="box">
        批准文号:
        <div class="right">{{infolist.reg_number}}</div>
      </div>
      <div class="box">
        生产企业:
        <div class="right">{{infolist.production_enterprise}}</div>
      </div>
      <div class="box">
        供应企业:
        <div class="right">{{info.enterprise_name}}</div>
      </div>
      <div class="box">
        剂型:
        <div class="right">{{infolist.general_dosage}}</div>
      </div>
      <div class="box">
        材质:
        <div class="right">{{infolist.drug_material}}</div>
      </div>
      <div class="box">
        包装规格:
        <div class="right">{{infolist.package}}</div>
      </div>
      <div class="box">
        报告日期:
        <div class="right">{{info.report_date}}</div>
      </div>
      <div class="box">
        生产日期:
        <div class="right">{{info.product_date}}</div>
      </div>
      <div class="box">
        有效日期:
        <div class="right">{{info.validity}}</div>
      </div>
    </div>
    <div class="operate">
      温馨提示: 请登录电脑端药检单平台查看药检单文件,平台网址: <span @click="longpress">https://www.syzljh.cn/</span> <span class="right" @click="goOperate">操作指南</span>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        info: {},
        infolist: {}
      }
    },
    mounted () {
      this.info = JSON.parse(this.$root.$mp.query.json)
      this.infolist = this.info.drug
      console.log(this.info, 'info11')
      // this.info = {
      //   name: '六味地黄丸',
      //   batch: 'yky0001',
      //   pizhun: '国药准字号002',
      //   enterprise: '杭州天猪科技有限公司',
      //   product: '杭州神中科技有限公司',
      //   jixin: '胶囊型',
      //   caizhi: '非pvc',
      //   package: '(每粒装0.25g)*/10/盒',
      //   baogao: '2018-9-10',
      //   date: '2018-9-10',
      //   youxiao: '2018-9-10'
      // }
    },
    methods: {
      longpress () {
        wx.setClipboardData({
          data: 'https://www.syzljh.cn/'
        })
      },
      goOperate () {
        console.log(123)
        wx.navigateTo({
          url: '/pages/drugoperate/main'
        })
      }
    }
  }
</script>
<style lang="scss">
  .info{
    font-size: 14px;
    .infomation{
      padding-top: 24rpx;
      padding-bottom: 24rpx;
      color: #999;
      .box{
        padding: 10px 0;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(62,58,57,1);
        .right{
          float: right;
          font-family:PingFangSC-Light;
          font-weight:300;
          color:#a5a5a5;
        }
      }

    }
    .operate{
      padding: 12px;
      color: #a5a5a5;
      line-height: 2em;
      span{
        font-size: 16px;
        color: #1E9EFF;
      }
    }
  }
</style>

