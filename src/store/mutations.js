function initButtonState (status, obj) {
  obj.buttonState = {
    see_btns: true,
    operate_btns: false,
    other_btns: false,
    reason_btn: false
  }
}
export default {
  /**
   * 在main.js例引入
   * import store from './store/index'
   * 把store挂载到全局
   * Vue.prototype.$store = store;
   */
  initData (state, {data, status}) {
    state.initData.length = 0
    let len = data.length // 药品数量
    for (let i = 0; i < len; i++) {
      var item = data[i]
      var obj = {}
      obj.drug = item.drug // 药品
      obj.files = [] // 药检单文件
      let fileLen = item.file.length // 药检单文件 数量
      for (var j = 0; j < fileLen; j++) {
        let tmp = item.file[j]
        var subObj = {
          amount: tmp.amount,
          batch: tmp.batch,
          file_name: tmp.file_name,
          product_date: tmp.product_date,
          report_date: tmp.report_date,
          status: tmp.status,
          url: tmp.url,
          uuid: tmp.uuid,
          validity: tmp.validity,
          reason: tmp.reason,
          buttonState: {}
        }
        initButtonState(status, subObj)
        obj.files.push(subObj)
        if (status === '待查收') {
          obj.num = 0
        }
      }
      state.initData.push(obj)
    }
  },
  initSearchList (state, data) {
    console.log(data)
    state.searchDate = data
    let len = data.length
    console.log(len)
    for (let i = 0; i < len; i++) {
      data[i].btnStatus = true
      // let id = data[i].uuid.replace(/-/ig, '')
      // arr[id] = true
    }
    console.log(state.searchDate)
  },
  /**
   * 这里设置一个统一的方法,大部分用的vuex都是简单的改变一些状态,不需要写过多的mutations
   * 使用方法 例:
   * this.$store.update({"cityName":"北京"})
   *
   *  config需要传入对象
   * @param {*} state
   * @param {*Object} config
   */
  update (state, config) {
    Object.keys(config).map((item, key) => {
      state[item] = config[item]
    })
  }
}
