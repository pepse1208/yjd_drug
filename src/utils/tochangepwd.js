export function changePwd (url) {
  var randomModified = wx.getStorageSync('random_modified')
  if (randomModified === false) {
    wx.showModal({
      title: '提示',
      content: '为了您的账号安全，请及时修改初始密码',
      confirmText: '去修改',
      success: function (res) {
        wx.setStorageSync('random_modified', true)
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/passwd/main?name=' + url
          })
        }
      }
    })
  }
}
