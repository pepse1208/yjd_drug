<template>
  <div class="search">
    <div @click="getDetail(index)" class="list" :key="index" v-for="(list, index) in lists">
      <div class="bold clear">
        <div class="left">
          品种名称:{{list.drug.name}}
        </div>
        <div class="right">包装规格:{{list.drug.package}}</div>
      </div>
      <div class="nomal clear">
        <div class="left">
          批号:{{list.batch}}
        </div>
        <div class="right">供应企业:{{list.enterprise_name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['lists'],
    data () {
      return {
        header: 'search',
        locked: true
      }
    },
    mounted () {
      console.log(this.lists, 'lists')
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
      }
    }
  }
</script>
<style lang='scss'>
  .search{
    .list{
      border-bottom: 1rpx solid #f7f7f7;
      .bold{
        padding: 14px 0 10px;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(62,58,57,1);
        .left{
          width: 45%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .right{
          width: 55%;
          text-align: right;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
      }
      .nomal{
        padding-bottom: 14px;
        font-size:12px;
        font-family:PingFangSC-Light;
        font-weight:300;
        color:#a5a5a5;
        .left{
          width: 45%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .right{
          width: 55%;
          text-align: right;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
      }
    }
  }
</style>

