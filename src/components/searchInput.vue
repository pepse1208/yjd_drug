<template>
  <div class="_search flex flexrow">
    <input v-model="name" :placeholder="placeholder" type="text" class="_search_input">
    <span class="_search_text" @click="searchDrug(url)"><slot></slot></span>
  </div>
</template>
<script>
  import {get} from '../utils.js'
  export default {
    props: ['url', 'placeholder'],
    data () {
      return {
        name: '',
        show: true
      }
    },
    methods: {
      async searchDrug (url) {
        // console.log(this.name)
        var resp = await get({
          url,
          data: {
            name: this.name
          }
        })
        this.$emit('renderData', resp.data)
      }
    },
    onShow () {
      this.name = ''
    }
  }
</script>
<style lang='scss'>
</style>
