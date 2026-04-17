let params = require('./params.js')


export const post = (url, data, apihost, method) => {
  if (apihost) url = params[apihost] + url
  else url = params.apihost + url
  if (!data) {
    data = {}
  }

  data.app = data.app?data.app:params.app;
  data.gid = params.gid;

  var userInfo = wx.getStorageSync('userInfo')
  var token = ''
  // var userInfo = { // 临时获取数据用 完成开发后请删除
  //   urid: 84,
  //   token: 'cjoy9kbkp63391'
  // }
  // var token = 'cjoy9kbkp63391'
  
  if (data.token) {
    token = data.token
  } else if (userInfo) {
    var urid = userInfo.urid
    token = userInfo.token

    if (urid && !data.urid) {
      data.urid = urid
    }

    if (token) {
      data.token = token
    }
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method || 'POST',
      timeout: 60000,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
      },
      success: function (res) {
        if (params.debug) {
          console.log("🟢 ", url, "\nreq", data, method, "\nres", res)
        }
        if (res.data.code != 200 && res.data.status != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        if (params.debug) {
          console.log("🟡", url, "\nreq", data, method, "\nres", res)
        }
        reject(res.data)
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.showToast({
          icon: 'none',
          title: '数据请求失败,请稍后再试',
        })
      },
    })
  })
}

function getCurrentPageUrlWithArgs() {
  var $encodeValue = arguments[0] ? arguments[0] : false
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`

  for (let key in options) {
    if ($encodeValue == 1) {
      var value = decodeURIComponent(options[key])
    } else {
      var value = options[key]
    }
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}
