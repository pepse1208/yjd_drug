<template>
  <div class="shadow">
    <base-top>查收页面</base-top>
    <statements :lists="statements"></statements>
    <div class="_container">
      <div :class="status === '对方已取消' ? 'info info_no_border' : 'info'">
        <div class="supply_enterprise">
          <span class="enterprise_txt">供应企业：</span>
          <span class="enterprise">{{sender}}</span>
        </div>
        <div class="second_line flex flexrow">
          <div class="send_time">
            <span class="time_txt">发送时间：</span>
            <span class="time">{{create_time}}</span>
          </div>
          <div class="status">
            <span>状态：</span>
            <span :class="colorClass">{{status}}</span>
          </div>
        </div>
      </div>
      <div class="big_list flex" v-if="status !== '对方已取消'">
        <block v-for="(item, index) in druglist" :key="index">
          <div class="big_item">
            <div class="documents flex flexrow" @click="clickDocument(item.drug.uuid)">
              <div class="document_title">
                <span class="drug_name">{{item.drug.name}}</span>
                <span class="num">{{status !== '待查收' ? ('（' + item.files.length + '份）') : ('（' + item.num + '/' + item.files.length + '）')}}</span>
              </div>
              <div :class="druglistId === item.drug.uuid ? 'open_icon' : 'close_icon'"></div>
            </div>
            <div class="sub_list">
              <block v-for="(tmp, _index) in item.files" :key="_index">
                <div class="sub_item flex flexrow" v-if='druglistId === item.drug.uuid'>
                  <div class="title flex flexrow">
                    <span :class="['operate_icon', tmp.status === '删除' ? 'orange_bg' : (tmp.status === '签收' ? 'green_bg' : (tmp.status === '退回' ? 'red_bg' : ''))]"></span>
                    <span :class="{'batch': true, 'overflow': tmp.buttonState.operate_btns}">{{tmp.batch}}</span>
                  </div>
                  <div class="buttons">
                    <div class="see_btns btn_com" v-if="tmp.buttonState.see_btns">
                      <button class="see" @click="downloadPdf(tmp.url, tmp.uuid)">查看</button>
                      <!-- <button class="more_operate" v-if="tmp.status !== '签收'" @click="status === '待查收' ? showOperateBtns(index, tmp.uuid, _index, tmp.status) : showReason(index, _index)">{{status === '待查收' ? '···' : '原因'}}</button> -->
                      <button v-if="tmp.status !== '签收' && status !== '待查收'" @click="showReason(index, _index)">原因</button>
                      <button class="more_operate" v-if="tmp.status !== '签收' && status === '待查收'" @click="showOperateBtns(index, tmp.uuid, _index, tmp.status)"></button>
                    </div>
                    <div class="operate_btns btn_com" v-if="tmp.buttonState.operate_btns">
                      <button class="agree_btn" @click="agreeRefuseDel(index, _index)">接收</button>
                      <button class="delete_btn" @click="agreeRefuseDel(index, _index, '删除')">删除</button>
                      <button class="reject_btn" @click="agreeRefuseDel (index, _index, '退回')">退回</button>
                      <button class="back" @click="closeOperateBtns(index, tmp.uuid, _index)"></button>
                    </div>
                    <div class="other_btns btn_com" v-if="status === '待查收' && tmp.status !== '未处理'">
                      <button class="cancel_agree" @click="cancel(index, _index)">取消</button>
                      <button class="reason" v-if="tmp.status === '删除' || tmp.status === '退回'" @click="showReason(index, _index)">原因</button>
                    </div>
                  </div>
                </div>
              </block>
            </div>
          </div>
        </block>
      </div>
      </div>
      <div class="cancel_send" v-if="status === '对方已取消'">发送方已取消文件发送</div>
      <div class="submit">
        <button @click="submit()" v-if="status === '待查收'">完成</button>
      </div>
      <!-- <alert-input v-if="isShow" :tips="tips" :placeholder='placeholder'></alert-input> -->
      <alert-input :tips="tips" :placeholder='placeholder' :hidden="isShow" :reason="reason" @cancelShow="cancelShow" @alertConfirm="alertConfirm"></alert-input>
  </div>
</template>
<script>
  import BaseTop from '@/components/base_top'
  import AlertInput from '@/components/alert'
  import Statements from '@/components/statements'
  import {get, post} from '../../utils.js'
  import {throttle} from '../../utils/index.js'
  import config from '../../config.js'
  // import {mapState, mapMutations} from 'vuex'
  // 引入store
  import $store from '../../store/index'
  export default {
    data () {
      return {
        exchangeId: '',
        druglist: [], // 药检单列表
        initParams: [],
        sender: '', // 供应企业
        create_time: '', // 发送时间
        status: '', // 药检单状态
        druglistId: '', // 药检单id
        colorClass: '',
        tips: '', // 弹出框 title
        placeholder: '', // 弹出框 placeholder
        isShow: false, // 弹出框 是否弹出
        downloaded: {},
        drugIndex: '',
        subIndex: '',
        type: '',
        reason: '',
        statements: [
          {
            text: '已接收',
            color: 'green_bg'
          }, {
            text: '已删除',
            color: 'orange_bg'
          }, {
            text: '已退回',
            color: 'red_bg'
          }
        ]
      }
    },
    components: {
      BaseTop,
      AlertInput,
      Statements
    },
    onUnload: function () { // 如果页面被卸载时被执行
      this.druglist.length = 0
      this.initParams.length = 0
      this.status = ''
      this.create_time = ''
      this.sender = ''
    },
    methods: {
      clickDocument (id) {
        this.druglistId = id
      },
      openPdf (url) {
        wx.openDocument({
          filePath: url,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      downloadPdf: throttle(function (url, id) { // 查看pdf
        console.log(config.host + url)
        var self = this
        if (self.downloaded[id]) {
          self.openPdf(self.downloaded[id])
        } else {
          var path = url
          if (!url.includes('https://')) {
            path = config.host + url
          }
          wx.showLoading({title: '加载中'})
          wx.downloadFile({
            url: path,
            success: function (res) {
              const filePath = res.tempFilePath
              // 避免发送方修改文件后，没及时更新
              self.downloaded[id] = filePath
              wx.hideLoading()
              self.openPdf(filePath)
            }
          })
        }
      }, 2000),
      showOperateBtns (drugIndex, id, subIndex, status) { // 点击 ··· 显示更多操作按钮
        var operate = ''
        if (this.status === '待查收') {
          if (status === '未处理') {
            operate = 'operate_btns'
          } else {
            operate = 'other_btns'
          }
        }
        if (this.status === '已退回') {
          operate = 'other_btns'
          this.druglist[drugIndex].files[subIndex].buttonState['reason_btn'] = true
        }
        if (this.status === '已结束') {
          operate = 'other_btns'
          this.druglist[drugIndex].files[subIndex].buttonState['reason_btn'] = true
        }
        this.druglist[drugIndex].files[subIndex].buttonState[operate] = true
        this.druglist[drugIndex].files[subIndex].buttonState['see_btns'] = false
      },
      closeOperateBtns (drugIndex, id, subIndex) { // 收起操作按钮
        var obj = {
          see_btns: true,
          operate_btns: false,
          other_btns: false
        }
        this.druglist[drugIndex].files[subIndex].buttonState = obj
      },
      showReason (drugIndex, subIndex) { // 查看原因
        var data = this.druglist[drugIndex].files[subIndex]
        var type = data.status
        var reason = data.reason
        var title = ''
        if (type === '删除') {
          title = '删除原因'
        } else if (type === '退回') {
          title = '退回原因'
        }
        wx.showModal({
          title: title,
          content: reason,
          icon: 'none',
          showCancel: false
        })
      },
      agreeRefuseDel (drugIndex, subIndex, type) {
        this.drugIndex = drugIndex
        this.subIndex = subIndex
        if (type) {
          this.tips = '是否' + type + '本文件（必填）'
          this.type = type
          this.isShow = true
        } else {
          this.type = '签收'
          this.saveData()
        }
      },
      cancel (drugIndex, subIndex) {
        var data = this.druglist[drugIndex].files[subIndex]
        data.status = '未处理'
        data.buttonState.operate_btns = true
        var num = this.druglist[drugIndex].num
        if (num > 0) {
          this.druglist[drugIndex].num -= 1
        }
      },
      saveData () {
        var drugIndex = this.drugIndex
        var data = this.druglist[drugIndex].files[this.subIndex]
        data.status = this.type
        data.buttonState.operate_btns = false
        this.isShow = false
        var num = this.druglist[drugIndex].num
        var max = this.druglist[drugIndex].files.length
        if (num < max) {
          this.druglist[drugIndex].num += 1
        }
      },
      judgeIsRefuse () {
        var flag = false
        // $.each(this.druglist, function (i, item) {
        //   for(var j = 0; j < item.files.length; j++){
        //     var subItem = item.files[j]
        //     if(subItem.refuse) {
        //       flag = true
        //       return false
        //     }
        //   }
        // })
        return flag
      },
      judgeIsHandle () { // 判断是否有未处理文件
        var flag = false
        var handleNum = 0
        var total = 0
        var len = this.druglist.length
        for (var i = 0; i < len; i++) {
          var item = this.druglist[i]
          handleNum += item.num
          total += item.files.length
        }
        if (handleNum === total) {
          flag = true
        }
        return flag
      },
      handleAjaxPostData () {
        var data = {
          agree: [], // 接收的文件
          disagree: [], // 退回的文件
          delete: [] // 删除的文件
        }
        var lists = this.druglist
        for (var i in lists) {
          var item = lists[i].files
          var num = lists[i].num
          for (var j = 0; j < num; j++) {
            var subItem = item[j]
            if (subItem.status === '签收') {
              data.agree.push({
                uuid: subItem.uuid,
                reason: ''
              })
            } else if (subItem.status === '删除') {
              data.delete.push({
                uuid: subItem.uuid,
                reason: subItem.reason
              })
            } else if (subItem.status === '退回') {
              data.disagree.push({
                uuid: subItem.uuid,
                reason: subItem.reason
              })
            }
          }
        }
        console.log(data)
        return data
      },
      async completeAjaxPost () {
        var data = await post({
          url: '/api/drugReport/receive/' + this.exchangeId + '/',
          data: this.handleAjaxPostData()
        })
        var code = data.statusCode
        if (code >= 200 && code < 300) {
          wx.navigateBack({
            delta: 1
          })
        } else if (code >= 400) {
          wx.showModal({
            title: '提示',
            content: data.data.errmsg,
            icon: 'none',
            showCancel: false
          })
        }
      },
      submit () {
        if (!this.judgeIsHandle()) {
          wx.showModal({
            title: '温馨提示',
            content: '您有未处理的文件,是否放弃本次查收并退出！本次已完成操作不做保存！',
            icon: 'none',
            confirmText: '退出',
            confirmColor: '#000',
            cancelText: '继续查收',
            cancelColor: '#3cc51f',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
          return
        }
        this.completeAjaxPost()
      },
      cancelShow (msg) {
        this.isShow = msg
        this.reason = ''
      },
      alertConfirm (msg) {
        var self = this
        var drugIndex = self.drugIndex
        var subIndex = self.subIndex
        var type = self.type
        var data = self.druglist[drugIndex].files[subIndex]
        var value = msg.resaon
        if (value) {
          data.reason = value
          self.reason = ''
          self.isShow = msg
        } else {
          wx.showToast({
            title: '请输入' + type + '原因',
            icon: 'none'
          })
          return
        }
        self.saveData()
      }
    },
    async beforeMount () {
      this.exchangeId = this.$root.$mp.query.id
      var resp = await get({
        url: '/api/drugReport/report/receive/' + this.exchangeId + '/'
      })
      if (resp.data.code === 200) {
        var data = resp.data
        var status = data.status
        this.status = status
        this.sender = data.sender.name
        this.create_time = data.create_time.slice(0, 10)
        this.druglistId = data.package[0].drug.uuid
        this.colorClass = status === '待查收' ? 'orange' : (status === '已接收' ? 'green' : (status === '已退回' ? 'red' : 'gray'))
        $store.commit('initData', {data: data.package, status})
        this.druglist = $store.state.initData
      }
    }
  }
</script>
<style lang="scss" scoped>
  ._container {
    border-top: 0;
  }
  // 接收的信息
  .info {
    width: 100%;
    height: 140rpx;
    border-bottom: 1rpx solid #eee;
    padding: 30rpx 0;
    box-sizing: border-box;
    .supply_enterprise {
      height: 30rpx;
      line-height: 30rpx;
      font-size: 30rpx;
      margin-bottom: 30rpx;
      color: #3E3A39;
    }
    .second_line {
      width: 100%;
      height: 24rpx;
      line-height: 24rpx;
      font-size: 24rpx;
      color: #A5A5A5;
    }
    .status {
      color: #3E3A39;
    }
  }
  .info_no_border {
    border: 0;
  }
  .big_item {
    border-bottom: 1rpx solid rgba(199,199,199,1);
  }
  .big_item:last-child {
    border-bottom: 0;
  }
  // 品种及药检单 信息
  .big_list,
  .big_item,
  .sub_list  {
    width: 100%;
  }
  .documents{
    height: 88rpx;
    line-height: 88rpx;
    box-sizing: border-box;
    .document_title {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .drug_name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .sub_item {
    font-size: 24rpx;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    box-sizing: border-box;
    margin-bottom: 30rpx;
    .title {
      .operate_icon {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
      .batch {
        line-height: initial;
        width: 380rpx;
      }
      .batch.overflow {
        width: 110rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .buttons {
      .btn_com {
        display: flex;
      }
      .btn_com button:first-child {
        margin-left: 0;
      }
      button {
        width: 100rpx;
        height: 100rpx;
        color: #fff;
        line-height: 100rpx;
        text-align: center;
        border: 0;
        padding: 0;
        font-size: 28rpx;
        margin-left: 30rpx;
        background: #1E9EFF;
        box-shadow:0px 7px 16px 0px rgba(121,197,255,0.5);
      }
      .more_operate {
        background: #1E9EFF url(../../images/ellipsis.png) no-repeat center center;
        background-size: 40rpx 8rpx;
      }
      .operate_btns {
        .agree_btn {
          background: #16AB24;
          box-shadow:0px 7px 16px 0px rgba(131,255,143,0.5);
        }
        .delete_btn {
          background: #FF821D;
          box-shadow:0px 7px 16px 0px rgba(255,168,97,0.5);
        }
        .reject_btn {
          background: #E71F10;
          box-shadow:0px 7px 16px 0px rgba(255,115,105,0.5);
        }
        .back {
          background: #1E9EFF url(../../images/cancel.png) no-repeat center center;
          background-size: 30rpx 30rpx;
        }
      }
      .other_btns {
        button {
          background: #1E9EFF;
        }
      }
    }
    .enter_icon {
      width: 26rpx;
      height: 12rpx;
      margin-left: 12rpx;
      background: url(../../images/enter2x.png);
    }
  }
  .cancel_send {
    text-align: center;
    font-size: 36rpx;
    color: #3e3a39;
    margin-top: 80rpx;
  }
  .submit {
    padding: 40rpx 0;
    button {
      width: 420rpx;
      height: 80rpx;
      line-height: 80rpx;
      color: #fff;
      background: #1e9eff;
    }
  }
  .open_icon {
    width: 34rpx;
    height: 20rpx;
    background: url(../../images/open_icon2x.png) no-repeat;
    background-size: 34rpx 20rpx;
  }
  .close_icon {
    width: 20rpx;
    height: 34rpx;
    background: url(../../images/close_icon.png) no-repeat;
    background-size: 20rpx 34rpx;
  }
</style>
