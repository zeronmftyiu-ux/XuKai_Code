import campService from '../../../services/campService'
import { normalizeCampData, getBestCampEntry } from '../../../utils/camp'

Page({
  data: {
    mobile: '',
    code: '',
    sending: false,
    binding: false,
    countdown: 0,
    timer: null,
    mode: 'bind'
  },

  onUnload() {
    this.clearTimer()
  },

  onLoad(options) {
    if (options.mode) {
      this.setData({
        mode: options.mode
      })
    }
  },

  onInputMobile(e) {
    this.setData({
      mobile: (e.detail.value || '').replace(/\D/g, '').slice(0, 11)
    })
  },

  onInputCode(e) {
    this.setData({
      code: (e.detail.value || '').replace(/\D/g, '').slice(0, 6)
    })
  },

  async handleSendCode() {
    const { mobile, countdown, sending } = this.data

    if (sending || countdown > 0) return

    if (!/^1\d{10}$/.test(mobile)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return
    }

    this.setData({ sending: true })

    const res = await campService.sendBindCode({
      mobile,
      app: 1
    })

    if (Number(res.code) === 200) {
      wx.showToast({
        title: '验证码已发送',
        icon: 'none'
      })
      this.startCountdown(60)
    } else {
      wx.showToast({
        title: res.message || '验证码发送失败',
        icon: 'none'
      })
    }

    this.setData({ sending: false })
  },

  async handleBind() {
    const { mobile, code, binding } = this.data

    if (binding) return

    if (!/^1\d{10}$/.test(mobile)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return
    }

    if (!/^\d{6}$/.test(code)) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      })
      return
    }

    this.setData({ binding: true })

    const res = await campService.bindCamp({
      mobile,
      verifycode: code
    })

    console.log('bind res = ', res)

    if (Number(res.code) === 200) {
      const isIdempotent = res.data && Number(res.data.is_idempotent) === 1

      wx.showToast({
        title: isIdempotent ? '已绑定当前活动' : '绑定成功',
        icon: 'success'
      })

      setTimeout(async () => {
        const campRes = await campService.getCampList({})
        const campSummary = normalizeCampData(campRes.data || {})
        const entry = getBestCampEntry(campSummary)

        if (entry.type === 'detail' && entry.campId) {
          wx.redirectTo({
            url: `/pages/user/campDetail/index?camp_id=${entry.campId}`
          })
          return
        }

        if (entry.type === 'list') {
          wx.redirectTo({
            url: '/pages/user/camp/index'
          })
          return
        }

        wx.redirectTo({
          url: '/pages/user/camp/index'
        })
      }, 800)
    } else {
      wx.showToast({
        title: res.message || '绑定失败',
        icon: 'none'
      })
    }

    this.setData({ binding: false })
  },

  startCountdown(seconds) {
    this.clearTimer()
    this.setData({ countdown: seconds })

    const timer = setInterval(() => {
      const count = this.data.countdown
      if (count <= 1) {
        this.clearTimer()
        this.setData({ countdown: 0 })
      } else {
        this.setData({ countdown: count - 1 })
      }
    }, 1000)

    this.setData({ timer })
  },

  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  }
})