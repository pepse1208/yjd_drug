<template>
  <view class='_toast-box' v-if="hidden">
    <view class='_toastbg' @click="$emit('cancelShow', false)"></view>
    <view class='_showToast'>
      <view class='_toast-title'>
        <text>{{tips}}</text>
      </view>
      <view class='_toast-main'>
        <view class='_toast-input'>
          <input :placeholder="placeholder" v-if="isPassword" type="password" maxlength="6" bindinput='_setValue' data-name='_stuEidtName' v-model="resaon" :reason="resaon"/>
          <input :placeholder="placeholder" v-if="!isPassword" bindinput='_setValue' data-name='_stuEidtName' v-model="resaon" :reason="resaon"/>
        </view>
      </view>
      <view class='_toast-button'>
        <view class='_cancel'>
          <button @click="$emit('cancelShow', false)">取消</button>
        </view>
        <view class='_confirm'>
          <button @click="$emit('alertConfirm', {resaon})">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data () {
      return {
        resaon: '',
        type: 'text',
        length: 200
      }
    },
    props: ['tips', 'placeholder', 'hidden', 'resaon', 'isPassword'],
    methods: {
      clickMask () {
        this.hidden = false
      }
    }
  }
</script>
<style scoped>
._toast-box {
    width: 100%;
    height: 100%;
    opacity: 1;
    position: fixed;
    top: 0px;
    left: 0px;
}
._toastbg {
    opacity: 0.2;
    background-color: black;
    position: absolute;
    width: 100%;
    min-height: 100vh;
}
._showToast {
    position: absolute;
    opacity: 1;
    width: 70%;
    margin-left: 15%;
    margin-top: 40%;
}
._toast-title {
    padding-left: 5%;
    background-color: #2196f3;
    color: white;
    padding-top: 2vh;
    padding-bottom: 2vh;
    border-top-right-radius: 16rpx;
    border-top-left-radius: 16rpx;
}
._toast-main {
    padding: 2vh;
    background-color: white;
    text-align: center;
}
._toast-input {
    margin-left: 5%;
    margin-right: 5%;
    border: 1px solid #ddd;
    padding-left: 2vh;
    padding-right: 2vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
}
._toast-button {
    display: flex;
}
._cancel {
    width: 50%;
}
._confirm {
    width: 50%;
}
._cancel button {
    width: 100%;
    background-color: white;
    color: #E71F10;
    border-radius: 0px;
    border-bottom-left-radius: 16rpx;
}
._confirm button{
    width: 100%;
    background-color: white;
    color: #16AB24;
    border-radius: 0px;
    border-bottom-right-radius: 16rpx;
}
._picker {
    padding-top: 1vh;
    padding-bottom: 1vh;
}
</style>
