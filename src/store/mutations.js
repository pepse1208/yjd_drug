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
    state.searchList.length = 0
    let len = data.length // 数据数量
    console.log(len)
    for (let i = 0; i < len; i++) {
      var item = data[i]
      var drug = item.drug
      console.log(drug)
      // var obj = {}
      // // let fileLen = item.file.length // 药检单文件 数量
      // // for (var j = 0; j < fileLen; j++) {
      var obj = {
        // name: drug.name, // 品种名称
        batch: item.batch, // 生产批号
        // package: drug.package, // 包装规格
        // all_dosage: drug.all_dosage, // 剂型
        // drug_material: drug.drug_material, // 材质
        // reg_number: drug.reg_number, // 批准文号
        production_enterprise: drug.production_enterprise, // 生产企业
        enterprise_name: item.enterprise_name, // 供应企业
        report_date: item.report_date, // 报告日期
        product_date: item.product_date, // 生产日期
        drug: item.drug,
        validity: item.validity // 有效期至
      }
      console.log(1)
    //   // obj.push(subObj)
    //   // }
    }
    console.log(2)
    state.searchList.push(obj)
    console.log(state.searchList)
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
