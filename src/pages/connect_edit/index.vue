<template>
  <div class="send_record">
    <div class="page-top">
      <navigation-bar :back="true"></navigation-bar>
      <base-top v-if="title === '添加企业'">添加企业</base-top>
      <base-top v-if="title === '编辑企业'">编辑企业</base-top>
    </div>
    <div class="_container mart">
      <div class="line">
        <span class="explain">公司名称</span>
        <p class="details" v-if="operate === 'edit'">
          <!--<input :value="data.enterprise_name" type="text">-->
          {{data.enterprise_name}}
        </p>
        <p class="details arrow" v-if="operate === 'new'" >
          <!--<input :value="data.enterprise_name" type="text">-->
          <input value="厦门天空黑有限公司厦门天空黑有限公司厦门天空黑有限公司" type="text">
        </p>
      </div>
      <div class="line">
        <span class="explain">认证状态</span>
        <block v-if="operate === 'edit'">
          <p class="details green" v-if="!data.is_temp">
            已认证
          </p>
          <p class="details orange" v-if="data.is_temp">
            未认证
          </p>
        </block>
        <block v-if="operate === 'new'">
          <p class="details arrow" >
          </p>
        </block>
      </div>
      <div class="line">
        <span class="explain">联系人</span>
        <p class="details arrow">
          <input v-model.trim="data.linkman"  type="text">
        </p>
      </div>
      <div class="line">
        <span class="explain">手机号</span>
        <p class="details arrow">
          <input v-model.trim="data.phone" type="text">
        </p>
      </div>
      <div class="line">
        <span class="explain">客户类型</span>
        <p class="details arrow">
          {{data.clientele_type}}
        </p>
      </div>
    </div>
    <div class="bottom">
      <span @click="remove" v-if="title === '编辑企业'" class="btn del">删除企业</span>
      <span @click="save" class="btn">保 存</span>
    </div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import {put, DELETE} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        operate: '',
        data: {},
        oldData: {},
        clientele: '', // ajax请求的id
        linkman: '',
        title: ''
      }
    },
    updated () {
    },
    onShow () {
      /* this.operate = this.$root.$mp.query.operate
      this.data = JSON.parse(this.$root.$mp.query.data)
      console.log(this.data)
      if (this.operate === 'new') {
        this.title = '添加企业'
      } else {
        this.title = '编辑企业'
      } */
      // this.getData()
    },
    watch: {
      'operate' (val, oldVal) {
        if (val === 'new') {
          this.title = '添加企业'
        } else {
          this.title = '编辑企业'
        }
      }
    },
    mounted () {
      this.operate = this.$root.$mp.query.operate
      if (this.operate === 'new') {
        this.data = {
          enterprise_name: '',
          linkman: '',
          phone: '',
          is_temp: '',
          clientele_type: ''
        }
      } else {
        this.data = JSON.parse(this.$root.$mp.query.data)
        this.oldData = JSON.parse(this.$root.$mp.query.data)
      }
    },
    onUnload: function () {
      this.data = {}
    },
    methods: {
      check () {
        let data = JSON.stringify(this.data)
        let oldData = JSON.stringify(this.oldData)
        if (data === oldData) {
          wx.showToast({
            title: '请修改内容后再提交！',
            icon: 'none'
          })
          return false
        } else {
          return true
        }
      },
      save () {
        this.check() && this.saveData()
      },
      remove () {
        var that = this
        wx.showModal({
          title: '',
          content: '您确定要删除该企业吗？',
          success (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.removeData()
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      },
      async saveData () {
        var that = this
        wx.stopPullDownRefresh()
        var url = '/api/enterprise/enterpriseAddressBook/' + this.data.clientele + '/'
        var resp = await put({
          url,
          data: {
            enterprise_name: that.data.enterprise_name,
            linkman: that.data.linkman,
            phone: that.data.phone,
            clientele_type: that.data.clientele_type
          }
        })
        var code = resp.statusCode
        var data = resp.data
        if (code >= 200 && code < 300) {
          wx.showToast({
            icon: 'none',
            title: '修改成功',
            duration: 2000,
            success () {
              setTimeout(function () {
                wx.navigateBack({
                  url: '/pages/connect/main',
                  success () {
                  }
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      },
      async removeData () {
        wx.stopPullDownRefresh()
        var url = '/api/enterprise/enterpriseAddressBook/' + this.data.clientele + '/'
        var resp = await DELETE({
          url
        })
        var code = resp.statusCode
        var data = resp.data
        if (code >= 200 && code < 300) {
          wx.showToast({
            icon: 'none',
            title: '删除成功',
            duration: 2000,
            success () {
              setTimeout(function () {
                wx.navigateBack({
                  url: '/pages/connect/main',
                  success () {
                  }
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .send_record{
    $unit: 2rpx;
    .orange{
      color: #FF821D;
    }
    .green{
      color: #16AB24;
    }
    .green_bg{
      background: #16AB24;
    }
    .red{
      color: #E71F10;
    }
    .gray{
      color: #A5A5A5;
    }
    ._container{
      .line{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 18*$unit;
        width: 100%;
        &:first-child{
          padding-top: 18*$unit;
        }
        .explain{
          font-size: 15px;
          color: #A5A5A5FF;
          width: 65*$unit;
        }
        .details{
          flex-grow: 1;
          font-size: 12px;
          color: #3E3A39FF;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          input{
            width: 100%;
            font-size: 12px;
            color: #3E3A39FF;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
          }
        }
        .orange{
          color: #FF821D;
        }
        .green{
          color: #16AB24;
        }
        .arrow{
          padding-right: 10*$unit;
        }
      }
    }
    .bottom{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 50*$unit;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 4*$unit;
      box-shadow:0px 0px 7px 0px rgba(143,143,143,0.16);
      .btn{
        width: 80*$unit;
        height: 28*$unit;
        line-height: 28*$unit;
        text-align: center;
        border-radius:4*$unit;
        background: #1E9EFFFF;
        color: #fff;
        font-size: 12px;
        margin-right: 16*$unit;
        margin-left: 16*$unit;
      }
      .del{
        background: #fff;
        color: #E71F10FF;
      }
    }
  }
</style>
