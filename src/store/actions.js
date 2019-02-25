export default {
  initCheckDetailData (context, {data, status}) {
    context.commit('initCheckDetailData', {data, status})
  },
  initSendStepTwoDrugData (context, {data}) {
    context.commit('initSendStepTwoDrugData', {data})
  },
  initSendStepTwoListData (context, data) {
    context.commit('initSendStepTwoListData', data)
  },
  selectDrug  (context, {uuid, isSelect}) {
    context.commit('selectDrug', {uuid, isSelect})
  },
  submit  (context) {
    context.commit('submit')
  },
  initSelectedDrug  (context) {
    context.commit('initSelectedDrug')
  }
}
