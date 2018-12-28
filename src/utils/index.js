function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export function throttle (fn, gapTime) {
  if (gapTime == null || gapTime === undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // 将this和参数传给原函数
      console.log(6666)
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export default {
  formatNumber,
  formatTime
}
