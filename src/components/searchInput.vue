<template>
  <div class="_search flex flexrow">
    <input v-model="content" :placeholder="placeholder" type="text" class="_search_input">
    <span class="_search_text" @click="searchDrug(url)"><slot></slot></span>
  </div>
</template>
<script>
  import {get} from '../utils.js'
  export default {
    props: ['url', 'placeholder', 'searchName'],
    data () {
      return {
        content: '',
        show: true
      }
    },
    methods: {
      async searchDrug (url) {
        let dataObj = {}
        if (this.searchName === 'name') {
          dataObj = {name: this.content}
        } else if (this.searchName === 'enterprise_name') {
          dataObj = {enterprise_name: this.content}
        } else if (this.searchName === 'drug_name') {
          dataObj = {drug_name: this.content}
        }
        var resp = await get({
          url,
          data: dataObj
        })
        this.$emit('renderData', resp.data)
      }
    },
    onShow () {
      this.content = ''
    }
  }
</script>
<style lang='scss'>
</style>
