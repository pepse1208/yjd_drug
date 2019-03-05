export default {
  checkDetailData: [], // 药检单查收的数据
  searchData: [], // 药检单查询的数据
  sidebar: [], // 首页模块显示
  sendStepTwoListData: {}, // send_step2页面下：用于存储用户操作的数据
  sendStepTwoDrugData: {}, // send_step2页面下：某品种下的药检单信息
  sendStepTwoDrugId: '', // send_step2页面下：选择药检单 - 药品id
  searchObj: {}, // send_step2页面下：品种列表，显示药品信息（品种名称、包装、已选数量）
  selectObj: {}, // send_step2页面下：选中的药检单
  selectedList: {}, // 已选药检单
  receiver: '',
  drugReports: [],
  clientHeight: 0,
  key: ''
}
