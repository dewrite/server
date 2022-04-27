const moment = require('moment')
const crypto = require('crypto')

// 格式化时间
exports.formatTime = (time) => moment(time).format('YYYY-MM-DD HH:mm')

// 格式化时间
exports.formatTime = (time, format) => moment(time).format(format)

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg,
  }
  ctx.status = 200
}

exports.parseMsg = (action, payload = {}, metadata = {}) => {
  const meta = Object.assign(
    {},
    {
      timestamp: Date.now(),
    },
    metadata
  )

  return {
    meta,
    data: {
      action,
      payload,
    },
  }
}

// 加密方法
exports.encrypt = (data, key) => {
  // 注意，第二个参数是Buffer类型
  return crypto.publicEncrypt(key, Buffer.from(data))
}

// 解密方法
exports.decrypt = (encrypted, key) => {
  // 注意，encrypted是Buffer类型
  return crypto.privateDecrypt(key, encrypted)
}

exports.md5 = (data) => {
  return crypto.createHash('md5').update(data).digest('hex')
}

exports.isNumber = (val) => {
  if (parseFloat(val).toString() == 'NaN') {
    return false
  } else {
    return true
  }
}

exports.randomNum = (n = 4) => {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  var res = ''
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * chars.length - 1)
    res += chars[id]
  }
  return res
}
