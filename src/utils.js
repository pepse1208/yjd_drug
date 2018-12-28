import config from './config'

function request ({url, data, method, header = {}}) {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    if (!url.includes('http')) {
      url = config.host + url
    }
    wx.request({
      data,
      url: url,
      method,
      // header,
      header: {
        'Cookie': 'sessionid=' + wx.getStorageSync('sessionid') + '; ' + '_united_id=' + wx.getStorageSync('unitedid') + '; ',
        'Authorization': wx.getStorageSync('Authorization')
      },
      /* header: {
        'X-CSRFTOKEN': 'KV0RIFoE5sJUTNyli8dki7LDPsxbdnUs6DtsNn0BQVEE4l3EzkRfJK2mCP4gKtBK',
        'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjowLCJuYW1lIjoiXHU2NzZkXHU1ZGRlXHU2ZDRiXHU4YmQ1IiwidHlwZSI6OSwiZXhwIjoxNTQ0MjI3MTk5LCJ1dWlkIjoiMDA5MGMyZmQtYTIzMi00MjljLWJkY2MtNTdlNmI4YjcyMTRmIn0.b09oLbva_kElkuYGBNPQzkh18BWnJtVgNgcnBdGZ75c',
        'cookie': 'drugcsrftoken=KV0RIFoE5sJUTNyli8dki7LDPsxbdnUs6DtsNn0BQVEE4l3EzkRfJK2mCP4gKtBK; Hm_lvt_c7a77eff2e8cc0670fac6dec780dbd7a=1543993144,1543993542,1544150382,1544161131; sessionid=kebmicjhf0xu4qbugnqduh2povmydvth; _united_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjowLCJuYW1lIjoiXHU2NzZkXHU1ZGRlXHU2ZDRiXHU4YmQ1IiwidHlwZSI6OSwiZXhwIjoxNTQ0MjI3MTk5LCJ1dWlkIjoiMDA5MGMyZmQtYTIzMi00MjljLWJkY2MtNTdlNmI4YjcyMTRmIn0.b09oLbva_kElkuYGBNPQzkh18BWnJtVgNgcnBdGZ75c; Hm_lpvt_c7a77eff2e8cc0670fac6dec780dbd7a=1544169461'
      }, */
      success (res) {
        wx.hideLoading()
        resolve(res)
        // resolve(res.data.results)
      },
      fail (err) {
        wx.hideLoading()
        reject(err)
      },
      complete () {
        wx.hideLoading()
      }
    })
  })
}

export function get ({url, data, header}) {
  return request({url, data, method: 'GET', header})
}
export function post ({url, data, header}) {
  return request({url, method: 'POST', data, header})
}
export function put ({url, data, header}) {
  return request({url, method: 'PUT', data, header})
}

// 可以封装一个保存sessinid的方法，将sessionid存储在localstorage中，定为半小时之后清空此sessionid缓存。
function saveSession (sessionId) {
  console.log(' now save sessionid: ' + sessionId)
  wx.setStorageSync('sessionid', sessionId)// 保存sessionid
  wx.setStorageSync('sessiondate', Date.parse(new Date()))// 保存当前时间，
}

// 过期后清除session缓存
function removeLocalSession () {
  wx.removeStorageSync('sessionid')
  wx.removeStorageSync('sessiondate')
  console.log('remove session!')
}

// 检查sessionid是否过期的方法

function checkSessionTimeout () {
  var sessionid = wx.getStorageSync('sessionId')
  if (sessionid === null || sessionid === undefined || sessionid === '') {
    console.log('session is empty')
    return false
  }
  var sessionTime = wx.getStorageSync('sessiondate')
  var aftertimestamp = Date.parse(new Date())
  if (aftertimestamp - sessionTime >= 0) {
    removeLocalSession()
    return false
  }
  return true
}
// 保存cookie
function saveCookie (cookie) {
  console.log(' now save cookie: ' + cookie)
  wx.setStorageSync('cookie', cookie)// 保存cookie
}
export function getCookie () {
  var cookie = wx.getStorageSync('cookie')// 保存cookie
  return cookie
}
// 如果sessionid过期，重新获取sessionid

function checkSessionOk () {
  console.log('check session ok?...')
  var sessionOk = checkSessionTimeout()
  if (!sessionOk) {
    get('url', 'data', 'header').then((data) => {
      console.log(arguments)
      saveSession(data)
      saveCookie(data.header)
    })
  }
}
// 定义一个方法每隔一段时间检查sessionid是否过期

export function checkcrosstime () {
  setInterval(checkSessionOk, 30 & 60 * 1000) // 这个时间可以自定义。比如25 * 60 * 1000（代表25分钟）
}

function jumpToPage (url) {
  wx.navigateTo({
    url: url
  })
}
// 用户是否登录  未登录跳转到登录页面
export function getStorageOpenid (url, flag) {
  if (!flag) {
    jumpToPage(url)
    return
  }
  // const openId = wx.getStorageSync('openId')
  const isLogin = wx.getStorageSync('isLogin')
  let type = wx.getStorageSync('type')
  if (!isLogin) { // 生产企业没有查收药检单功能
    if (url.indexOf('drugmanage') > -1) {
      url = '/pages/login/main?name=drugmanage'
      jumpToPage(url)
    }
    if (url.indexOf('recv') > -1) {
      if (type === '生产企业') {
        wx.showToast({
          icon: 'none',
          title: '生产企业无查收药检单功能',
          duration: 2000
        })
        return
      }
      url = '/pages/login/main?name=recv'
      jumpToPage(url)
    }
  }
  if (isLogin) { // 生产企业没有查收药检单功能
    if (url.indexOf('recv') > -1) {
      if (type === '生产企业') {
        wx.showToast({
          icon: 'none',
          title: '生产企业无查收药检单功能',
          duration: 2000
        })
        return
      }
    }
    jumpToPage(url)
  }
}
