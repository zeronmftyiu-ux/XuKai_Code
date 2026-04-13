import campService from '../../../services/campService'
import { normalizeCampData } from '../../../utils/camp'

Page({
  data: {
    loading: false,
    futureCamps: [],
    currentCamps: [],
    historyCamps: [],
    hasAnyCamp: false,
    status: '',
    pageTitle: '我的活动'
  },

  onLoad(options = {}) {
    const status = options.status || ''
    this.setData({
      status,
      pageTitle: this.getPageTitle(status)
    })
  },

  onShow() {
    this.getCampList()
  },

  getPageTitle(status) {
    const map = {
      current: '进行中活动',
      future: '待开始活动',
      history: '历史活动'
    }
    return map[status] || '我的活动'
  },

  async getCampList() {
    this.setData({ loading: true })

    const res = await campService.getCampList({})
    console.log('camp list res = ', res)

    if (Number(res.code) === 200) {
      const summary = normalizeCampData(res.data || {})

      this.setData({
        futureCamps: (summary.futureCamps || []).map(item => ({
          ...item,
          camp_name:
            item.name ||
            item.title ||
            item.camp_code ||
            `训练营${item.camp_id || ''}`,
          company_name: item.company || '--',
          camp_desc: item.desc || '训练营即将开始，敬请期待。',
          remain_days: this.getRemainDays(item.start_time)
        })),

        currentCamps: summary.currentCamps || [],

        historyCamps: (summary.historyCamps || []).map(item => ({
          ...item,
          camp_name:
            item.name ||
            item.title ||
            item.camp_code ||
            `训练营${item.camp_id || ''}`,
          company_name: item.company || '--',
          total_loss: this.getHistoryLoss(item),
          finish_rate: this.getHistoryFinishRate(item),
          action_text: this.getHistoryActionText(item)
        })),

        hasAnyCamp: summary.hasAnyCamp
      })
    } else {
      this.setData({
        futureCamps: [],
        currentCamps: [],
        historyCamps: [],
        hasAnyCamp: false
      })

      wx.showToast({
        title: res.message || '活动加载失败',
        icon: 'none'
      })
    }

    this.setData({ loading: false })
  },

  getRemainDays(startTime) {
    if (!startTime) return 0

    const today = new Date()
    const start = new Date(`${startTime} 00:00:00`)
    const todayZero = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime()

    const diff = start.getTime() - todayZero
    const day = Math.ceil(diff / (24 * 60 * 60 * 1000))

    return day > 0 ? day : 0
  },

  getHistoryLoss(item = {}) {
    const mockMap = {
      41: '4.6 kg',
      42: '3.2 kg',
      43: '2.1 kg'
    }
    return mockMap[item.camp_id] || '2.8 kg'
  },

  getHistoryFinishRate(item = {}) {
    const mockMap = {
      41: '92%',
      42: '84%',
      43: '76%'
    }
    return mockMap[item.camp_id] || '80%'
  },

  getHistoryActionText(item = {}) {
    const mockMap = {
      41: '查看成果',
      42: '查看复盘',
      43: '查看结果'
    }
    return mockMap[item.camp_id] || '查看详情'
  },

  goBindPage() {
    wx.navigateTo({
      url: '/pages/user/campVerify/index'
    })
  },

  handleFutureCardTap() {
    wx.showToast({
      title: '待开始，敬请期待',
      icon: 'none'
    })
  },

  goDetail(e) {
    const item = e.currentTarget.dataset.item || {}
    const campId = item.camp_id || ''

    if (!campId) {
      wx.showToast({
        title: '活动ID缺失',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/user/campDetail/index?camp_id=${campId}`
    })
  }
})