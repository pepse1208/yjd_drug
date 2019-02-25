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
          {{data.enterprise_name}}
        </p>
        <p class="details arrow" v-if="operate === 'new'" >
          <input v-model.trim="data.enterprise_name" type="text">
        </p>
      </div>
      <div class="line" v-if="operate === 'edit'">
        <span class="explain">认证状态</span>
        <p class="details green" v-if="!data.is_temp">
          已认证
        </p>
        <p class="details orange" v-if="data.is_temp">
          未认证
        </p>
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
        <p @click="model(true)" class="details arrow">
          {{data.clientele_type}}
        </p>
      </div>
    </div>
    <div class="modal" @click="model(false)" :class="{showModal: isShowModal}"></div>
    <div class="con" :class="{showCon: isShowModal}">
      <div class="conBlock">
        <checkbox-group class="checkboxGroup" @change="checkboxChange">
          <label class="checkbox" v-for="(item, index) in checkboxItems" :key="index">
            <checkbox :value="item.value" :checked="item.checked"/>
            {{item.name}}
          </label>
        </checkbox-group>
        <span class="close" @click="model(false)">&times;</span>
        <span @click="confirm" class="btn">确定</span>
      </div>
    </div>
    <div class="bottom" v-if="operate === 'edit'" >
      <span @click="remove" class="btn del">删除企业</span>
      <span @click="save" class="btn">保 存</span>
    </div>
    <div class="bottom direction" v-if="operate === 'new'" >
      <span @click="addSave" class="btn">保 存</span>
    </div>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import NavigationBar from '@/components/navigationBar'
  import {put, DELETE, post} from '../../utils.js'

  export default {
    components: {
      BaseTop,
      NavigationBar
    },
    data () {
      return {
        operate: '', // 判断当前是编辑还是新增
        data: {}, // 传过来的信息
        oldData: {}, // 与传过来的信息做比较，判断是否修改过
        clientele: '', // ajax请求的id
        linkman: '', // 联系人字段
        isShowModal: false, // 弹窗显示状态
        clientele_type: [], // 客户类型临时存储
        checkboxItems: [ // 复选框列表
          {
            name: '上游企业',
            value: '上游企业',
            checked: false
          },
          {
            name: '下游客户',
            value: '下游客户',
            checked: false
          }
        ],
        title: '' // 标题
      }
    },
    watch: {
      'operate' (val) {
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
          clientele_type: []
        }
      } else {
        this.data = JSON.parse(this.$root.$mp.query.data)
        this.oldData = JSON.parse(this.$root.$mp.query.data)
      }
    },
    onUnload: function () {
      this.data = {}
      this.operate = ''
    },
    methods: {
      checkboxChange (e) { // 复选框改变事件
        this.clientele_type = e.mp.detail.value
        let checkboxItems = this.checkboxItems
        let values = e.mp.detail.value
        for (let i = 0; i < checkboxItems.length; i++) {
          checkboxItems[i].checked = false
          for (let j = 0; j < values.length; j++) {
            if (checkboxItems[i].value === values[j]) {
              checkboxItems[i].checked = true
              break
            }
          }
        }
      },
      confirm () { // 弹窗确定
        if (this.checkboxItems[0].checked === false && this.checkboxItems[1].checked === false) {
          wx.showToast({
            title: '请选择客户类型！',
            icon: 'none'
          })
        } else {
          this.model(false, 'send')
        }
      },
      model (flag, type) { // 弹窗隐藏显示
        var that = this
        if (flag === false) { // 隐藏遮罩层
          setTimeout(function () {
            that.isShowModal = false
            if (type === 'send') {
              that.data.clientele_type = that.clientele_type
            }
          }, 500)
        } else {
          let clienteleType = that.data.clientele_type
          that.checkboxItems[0].checked = false
          that.checkboxItems[1].checked = false
          if (clienteleType.indexOf('上游企业') !== -1) {
            that.checkboxItems[0].checked = true
          }
          if (clienteleType.indexOf('下游客户') !== -1) {
            that.checkboxItems[1].checked = true
          }
          if (clienteleType.indexOf('下游客户') !== -1 && clienteleType.indexOf('上游企业') !== -1) {
            that.checkboxItems[0].checked = true
            that.checkboxItems[1].checked = true
          }
          setTimeout(function () {
            that.isShowModal = true
          }, 50)
        }
      },
      check () { // 编辑  校验
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
      addCheck () { // 添加  校验
        if (this.data.enterprise_name === '') {
          wx.showToast({
            title: '请填写企业名称！',
            icon: 'none'
          })
          return false
        } else if (this.data.linkman === '') {
          wx.showToast({
            title: '请填写联系人！',
            icon: 'none'
          })
          return false
        } else if (this.data.phone === '') {
          wx.showToast({
            title: '请填写联系人手机号！',
            icon: 'none'
          })
          return false
        } else if (this.data.clientele_type.length === 0) {
          wx.showToast({
            title: '请填写客户类型！',
            icon: 'none'
          })
          return false
        } else {
          return true
        }
      },
      save () { // 编辑 保存按钮
        this.check() && this.saveData()
      },
      addSave () { // 添加 保存按钮
        this.addCheck() && this.addSaveData()
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
      async addSaveData () {
        var that = this
        wx.stopPullDownRefresh()
        var url = '/api/enterprise/enterpriseAddressBook/'
        var resp = await post({
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
            title: '添加成功',
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
          height: 20*$unit;
          line-height: 20*$unit;
          input{
            width: 100%;
            height: 10*$unit !important;
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
          background: url("../../images/write2x.png") right center no-repeat;
          background-size: 5*$unit;
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
    .direction{
      flex-direction: row-reverse;
    }
    .modal{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: #000;
      bottom: 0;
      opacity: 0;
      display: none;
      z-index:-1;
      /*transition: opacity 1000ms;*/
    }
    .showModal{
      opacity: 0.4;
      z-index:1001;
      display: block;
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
      .close{
        position: absolute;
        top: 12*$unit;
        right: 17*$unit;
        color: #3E3A39FF;
        font-size: 20px;
        width: 30*$unit;
        text-align: right;
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
        margin-top: 40*$unit;
        border-radius: 4*$unit;
      }
      .checkboxGroup{
        margin-top: 65*$unit;
        .checkbox{
          margin-right: 20*$unit;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .showCon{
      height: 200*$unit;
    }
  }
</style>
