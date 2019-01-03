<template>
  <div class="druglist">
    <nav-bar>新建药检单</nav-bar>
    <list-details :info="info"></list-details>
    <p class="part">上传药检单</p>
    <div class="imgContent">
      <span class="imgBg">
        <img @click="imgUrl === '' && upImg()" id="drugImg" :src="imgUrl"  alt="">
      <i v-show="imgUrl" @click="delImg" class="del"></i>
      </span>
      <span @click="preview" class="upBtn">预 览</span>
    </div>
    <p class="part">药检单信息</p>
    <div class="formContent">
      <div class="list">
        <i class="redIcon">*</i>
        <span class="">生产批号：</span>
        <input v-model.trim="batch" placeholder-style="color:#a5a5a5;" placeholder="请填写生产批号" type="text">
      </div>
      <div class="list">
        <span class="">报告编号：</span>
        <input v-model.trim="code" placeholder-style="color:#a5a5a5;" placeholder="请填写报告编号" type="text">
      </div>
      <div class="list">
        <span class="">报告日期：</span>
        <picker mode="date"
                :value="startDate"
                :start="pickerStart" end="2217-09-01" @change="bindDateChange($event, 'reportDate')"  >
          <p class="">{{ reportDate }}</p>
        </picker>
      </div>
      <div class="list">
        <span class="">生产日期：</span>
        <picker mode="date"
                :value="startDate"
                :start="pickerStart" end="2217-09-01" @change="bindDateChange($event, 'productDate')"  >
          <p class="">{{ productDate }}</p>
        </picker>
      </div>
      <div class="list">
        <span class="">有效期至：</span>
        <picker mode="date"
                :value="startDate"
                :start="pickerStart" end="2217-09-01" @change="bindDateChange($event, 'validity')"  >
          <p class="">{{ validity }}</p>
        </picker>
      </div>
      <span @click="submit" class="submit">提 交</span>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/base_top'
  import ListDetails from '@/components/listdetails'
  import config from '../../config'
  import {get, post} from '../../utils.js'

  export default {
    components: {
      ListDetails,
      NavBar
    },
    data () {
      return {
        info: {}, // 详情信息
        drug: '', // 药品id
        backName: 'druglist', // 跳转页面
        pageName: '', // 返回页面
        imgUrl: '',
        file: '', // 文件
        batch: '', // 生产批号
        code: '', // 报告编号
        reportDate: '请填写报告日期', // 报告日期
        productDate: '请选择生产日期', // 生产日期
        validity: '请选择有效期' // 有效期至
      }
    },
    onShow () {
    },
    onHide () {
    },
    onLoad () {
    },
    methods: {
      /* 详情信息 */
      getInfo () {
        let url = '/api/common/drug/' + this.drug
        get({
          url
        }).then((resp) => {
          this.info = resp.data.result // 获取药品信息
        })
      },
      /* 上传图片 */
      upImg () {
        let vm = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original'], // ['original', 'compressed'],
          success (res) {
            const tempFilePaths = res.tempFilePaths
            vm.imgUrl = tempFilePaths
            wx.uploadFile({
              url: config.host + '/api/common/file/', // 接口地址
              filePath: tempFilePaths[0],
              header: {
                'Cookie': 'sessionid=' + wx.getStorageSync('sessionid') + '; ' + '_united_id=' + wx.getStorageSync('unitedid') + '; ',
                'Authorization': wx.getStorageSync('Authorization')
              },
              name: 'file',
              /* formData: {
                user: 'test'
              }, */
              success (res) {
                let data = res.data
                vm.file = JSON.parse(data).uuid
              }
            })
          }
        })
      },
      preview () {
        if (!this.imgUrl) {
          wx.showToast({
            icon: 'none',
            title: '请上传药检单'
          })
          return
        }
        let vm = this
        wx.previewImage({
          current: vm.imgUrl, // 当前显示图片的http链接
          urls: vm.imgUrl // vm.urls // 需要预览的图片http链接列表
        })
        this.isClear = false
      },
      delImg () {
        this.imgUrl = ''
      },
      /* 选择日期 */
      bindDateChange (e, name) {
        this[name] = e.mp.detail.value
      },
      /* 提交 */
      submit () {
        this.check() && this.submitAjax()
      },
      check () {
        if (this.productDate && this.validity) {
          let productTime = new Date(this.productDate).getTime()
          let validityTime = new Date(this.validity).getTime()
          if (validityTime <= productTime) {
            wx.showToast({
              icon: 'none',
              title: '请填写正确的有效期时间！'
            })
            return false
          }
          if (!this.batch) {
            wx.showToast({
              icon: 'none',
              title: '请填写药品批号！'
            })
            return false
          }
          if (!this.imgUrl) {
            wx.showToast({
              icon: 'none',
              title: '请上传药检单原件扫描件！'
            })
            return false
          }
          return true
        }
      },
      async submitAjax () {
        let resultData = await post({
          data: {
            batch: this.batch,
            code: this.code,
            drug: this.drug,
            file: this.file,
            product_date: this.productDate === '请选择生产日期' ? '' : this.productDate,
            report_date: this.reportDate === '请填写报告日期' ? '' : this.reportDate,
            validity: this.validity === '请选择有效期' ? '' : this.validity
          },
          url: '/api/drugReport/report/'
        })
        if (resultData) {
          if (resultData.statusCode >= 400) {
            wx.showToast({
              icon: 'none',
              title: resultData.data.errmsg
            })
          } else if (resultData.statusCode >= 200 && resultData.statusCode < 300) {
            let pageName = (this.pageName === 'choose') ? this.pageName : this.backName
            let vm = this
            wx.showToast({
              icon: 'none',
              title: '药检单上传成功',
              duration: 2000,
              success () {
                setTimeout(function () {
                  if (pageName === 'druglist') {
                    wx.navigateBack({
                      url: '/pages/choose/main',
                      success () {
                      }
                    })
                  } else if (pageName === 'choose') {
                    wx.navigateTo({
                      url: '/pages/druglist/main?drug=' + vm.drug + '&isBack=true&is_upload=true',
                      success () {
                      }
                    })
                  }
                }, 1000)
              }
            })
          }
        }
      },
      clear () {
        this.imgUrl = ''
        this.file = ''
        this.batch = ''
        this.code = ''
        this.reportDate = '请填写报告日期'
        this.productDate = '请选择生产日期'
        this.validity = '请选择有效期'
      }
    },
    mounted () {
      this.clear()
      this.drug = this.$root.$mp.query.drug
      this.pageName = this.$root.$mp.query.router
      this.getInfo()
    }
  }
</script>
<style lang="scss" scoped>
  @import url(../../common/base.scss);
  .druglist{
    $unit: 2rpx;
    .part{
      font-size:15*$unit;
      font-weight:400;
      color:rgba(62,58,57,1);
      margin-bottom: 16*$unit;
    }
    .imgContent{
      display: flex;
      margin-bottom: 20*$unit;
      .imgBg{
        width:80*$unit;
        height:80*$unit;
        margin-left: 10*$unit;
        position: relative;
        background: url(../../images/upDrug2x.png) center no-repeat;
        background-size: 26*$unit 20*$unit;
        border:1px solid rgba(199,199,199,1);
        img{
          width: 100%;
          height: 100%;
          /*background: red;*/
        }
        .del{
          width: 20*$unit;
          height: 20*$unit;
          background: url(../../images/del2x.png);
          background-size: 20*$unit 20*$unit;
          position: absolute;
          top: -10*$unit;
          right: -10*$unit;
        }
      }
      .upBtn{
        font-size:18*$unit;
        font-weight:400;
        width:89*$unit;
        height:26*$unit;
        line-height: 26*$unit;
        color: #fff;
        text-align: center;
        margin-left: 32*$unit;
        border-radius: 4*$unit;
        background:rgba(30,158,255,1);
      }
    }
    .formContent{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .list{
        display: flex;
        font-size: 12*$unit;
        margin-bottom: 16*$unit;
        line-height: 32*$unit;
        position: relative;
        .redIcon{
          color: #E71F10;
          left: -15rpx;
          top: 4rpx;
          position: absolute;
        }
        span{
          color: #3E3A39;
        }
        input,p{
          width:264*$unit;
          height:32*$unit;
          color: #A5A5A5;
          box-sizing: border-box;
          padding: 0 8*$unit;
          border:1px solid #C7C7C7;
        }
      }
      .submit{
        width: 211*$unit;
        height: 40*$unit;
        line-height: 40*$unit;
        font-size: 18*$unit;
        color: #fff;
        text-align: center;
        margin-top: 16*$unit;
        margin-bottom: 53*$unit;
        border-radius: 4*$unit;
        background:rgba(30,158,255,1);
      }
    }
  }
</style>
