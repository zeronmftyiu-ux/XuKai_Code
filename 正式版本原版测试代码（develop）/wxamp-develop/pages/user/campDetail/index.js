import campService from '../../../services/campService'
import { normalizeCampData } from '../../../utils/camp'
import { getTrendDataByPeriod } from '../../mock/weight-record'
import api from '../../../request/index'

const PERIOD_TABS = [
  { key: 'week', name: '周' },
  { key: 'month', name: '月' },
  { key: 'quarter', name: '季' }
]

function safeNumber(value, fallback = 0) {
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}

function buildEmptyChart() {
  return {
    chartReady: false,
    activePeriod: 'week',
    periodTabs: PERIOD_TABS,
    chartPoints: [],
    chartLabels: [],
    chartData: [],
    currentWeight: '--',
    trendDesc: '--',
    selectedPointIndex: -1,
    selectedPointInfo: null,
    chartMeta: null
  }
}

Page({
  data: {
    loading: true,

    camp_id: '',
    activity_id: '',
    info: {},
    statusText: '--',
    pageMode: 'ongoing',

    currentCampList: [],
    currentCampIndex: 0,

    taskList: [],
    dashboardInfo: {
      stage_text: '习惯养成期',
      current_day: 1,
      remain_task_text: '今天还差 1 次课程打卡，完成后可累计本周进度。',
      today_task_list: [],
      current_weight: '--',
      lost_weight: '--',
      distance_weight: '--',
      week_done: 0,
      week_total: 0,
      progress_percent: 0
    },

    historySummary: {
      summaryCards: [],
      actionText: '查看结果'
    },

    ...buildEmptyChart()
  },

  async onLoad(options = {}) {
    const activityId = options.activity_id || options.camp_id || ''

    this.setData({
      camp_id: String(activityId || ''),
      activity_id: String(activityId || '')
    })

    if (!activityId) {
      wx.showToast({
        title: '活动ID缺失',
        icon: 'none'
      })
      return
    }

    await this.getDetail()
  },

  onShow() {},

  formatStatusText(status) {
    const map = {
      ongoing: '进行中',
      upcoming: '未开始',
      ended: '已结束'
    }
    return map[status] || '--'
  },

  getActivityId(item = {}) {
    return String(item.activityId || item.activity_id || item.camp_id || '')
  },

  getActivityName(item = {}) {
    return item.activityName || item.activity_name || item.camp_name || item.name || item.title || ''
  },

  getCompanyName(item = {}) {
    return item.companyName || item.company_name || '--'
  },

  getTaskList(info = {}) {
    const serviceTaskList = Array.isArray(info.taskList) ? info.taskList : []
    if (serviceTaskList.length) return serviceTaskList

    return [
      {
        key: 'motion',
        title: '每日运动',
        desc: '完成运动课程或运动打卡',
        url: '/pages/motion/index'
      },
      {
        key: 'food',
        title: '每日饮食',
        desc: '记录每日饮食情况',
        url: '/pages/food/index'
      },
      {
        key: 'point',
        title: '积分明细',
        desc: '查看当前积分与获取记录',
        url: '/pages/user/point/index'
      },
      {
        key: 'news',
        title: '推荐阅读',
        desc: '查看活动健康资讯',
        url: '/pages/news/index'
      }
    ]
  },

  getDashboardInfo(info = {}) {
    return {
      stage_text: info.stage_text || '习惯养成期',
      current_day: safeNumber(info.current_day, 1),
      remain_task_text:
        info.remain_task_text ||
        '今天还差 1 次课程打卡，完成后可累计本周进度。',
      today_task_list: Array.isArray(info.today_task_list) ? info.today_task_list : [],
      current_weight: info.current_weight || '--',
      lost_weight: info.lost_weight || '--',
      distance_weight: info.distance_weight || '--',
      week_done: safeNumber(info.week_done, 0),
      week_total: safeNumber(info.week_total, 0),
      progress_percent: safeNumber(info.progress_percent, 0)
    }
  },

  getHistorySummary(info = {}) {
    const currentWeight = info.current_weight || '--'
    const lostWeight = info.lost_weight || '--'
    const distanceWeight = info.distance_weight || '--'

    return {
      summaryCards: [
        {
          key: 'current_weight',
          title: '当前体重',
          value: currentWeight,
          unit: currentWeight === '--' ? '' : 'kg'
        },
        {
          key: 'lost_weight',
          title: '已减重',
          value: lostWeight,
          unit: lostWeight === '--' ? '' : 'kg'
        },
        {
          key: 'distance_weight',
          title: '距目标',
          value: distanceWeight,
          unit: distanceWeight === '--' ? '' : 'kg'
        }
      ],
      actionText: '查看结果'
    }
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

  async loadCurrentCampList() {
    try {
      const res = await campService.getCampList({})
      console.log('camp list for detail res = ', res)

      if (Number(res.code) !== 200) {
        this.setData({
          currentCampList: []
        })
        return
      }

      const summary = normalizeCampData(res.data || {})
      const currentCampList = (summary.currentCamps || []).map(item => ({
        ...item,
        camp_name:
          item.activityName ||
          item.activity_name ||
          item.camp_name ||
          `训练营${item.activityId || item.activity_id || item.camp_id || ''}`,
        company_name: item.companyName || item.company_name || '--',
        remain_days: this.getRemainDays(item.start_time)
      }))

      this.setData({
        currentCampList
      })
    } catch (err) {
      console.log('loadCurrentCampList error = ', err)
      this.setData({
        currentCampList: []
      })
    }
  },

  syncCurrentCampIndex(campId) {
    const list = this.data.currentCampList || []
    const index = list.findIndex(
      item => String(item.activityId || item.activity_id || item.camp_id) === String(campId)
    )

    this.setData({
      currentCampIndex: index > -1 ? index : 0
    })
  },

  async getDetail() {
    const { camp_id } = this.data
    if (!camp_id) return

    this.setData({ loading: true })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
      const res = await campService.getCampDetail({
        camp_id,
        activity_id: camp_id
      })

      console.log('camp detail res = ', res)

      if (Number(res.code) === 200) {
        const info = res.data || {}
        const statusText = this.formatStatusText(info.status)
        const pageMode = info.status === 'ended' ? 'ended' : 'ongoing'
        const taskList = this.getTaskList(info)
        const dashboardInfo = this.getDashboardInfo(info)
        const historySummary = this.getHistorySummary(info)

        this.setData({
          info,
          statusText,
          pageMode,
          taskList,
          dashboardInfo,
          historySummary
        })

        await this.loadCurrentCampList()
        this.syncCurrentCampIndex(camp_id)

        if (pageMode === 'ongoing') {
          this.loadWeightTrend()
        } else {
          this.loadWeightTrend()
        }
      } else {
        wx.showToast({
          title: res.message || '活动详情加载失败',
          icon: 'none'
        })
      }
    } catch (err) {
      console.log('getDetail error = ', err)
      wx.showToast({
        title: '活动详情加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
      wx.hideLoading()
    }
  },

  handleSwitchCamp(e) {
    const item = e.currentTarget.dataset.item || {}
    const activityId = this.getActivityId(item)

    if (!activityId || activityId === this.data.camp_id) return

    wx.navigateTo({
      url: `/pages/user/campDetail/index?camp_id=${activityId}&activity_id=${activityId}`
    })
  },

  buildCommonQuery(extra = {}) {
    const info = this.data.info || {}

    const query = {
      fromCamp: 1,
      camp_id: info.camp_id || info.activity_id || this.data.camp_id || '',
      activity_id: info.activity_id || info.camp_id || this.data.activity_id || '',
      project_id: info.project_id || '',
      group_id: info.group_id || '',
      member_id: info.member_id || '',
      camp_name: this.getActivityName(info) || '',
      ...extra
    }

    return Object.keys(query)
      .filter(key => query[key] !== undefined && query[key] !== null && query[key] !== '')
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&')
  },

  goTask(e) {
    const item = e.currentTarget.dataset.item || {}
    const url = item.url || ''
    if (!url) return

    const query = this.buildCommonQuery()

    wx.navigateTo({
      url: `${url}${url.includes('?') ? '&' : '?'}${query}`
    })
  },

  goMotion() {
    const query = this.buildCommonQuery()
    wx.navigateTo({
      url: `/pages/motion/index?${query}`
    })
  },

  goFood() {
    const query = this.buildCommonQuery()
    wx.navigateTo({
      url: `/pages/food/index?${query}`
    })
  },

  goPoint() {
    wx.navigateTo({
      url: '/pages/user/point/index'
    })
  },

  goNews() {
    wx.navigateTo({
      url: '/pages/news/index'
    })
  },

  handlePrimaryAction() {
    const pageMode = this.data.pageMode
    if (pageMode === 'ended') {
      this.goMotion()
      return
    }
    this.goMotion()
  },

  handleWeightAction() {
    const query = this.buildCommonQuery()
    wx.navigateTo({
      url: `/pages/sports/weight/index?${query}`
    })
  },

  loadWeightTrend(period = 'week') {
    try {
      const trendData = getTrendDataByPeriod(period)
      const list = Array.isArray(trendData?.list) ? trendData.list : []

      if (!list.length) {
        this.setData({
          ...buildEmptyChart(),
          activePeriod: period
        })
        return
      }

      const chartLabels = list.map(item => item.date || '')
      const chartData = list.map(item => safeNumber(item.weight, 0))
      const chartPoints = list.map((item, index) => ({
        index,
        date: item.date || '',
        weight: safeNumber(item.weight, 0)
      }))

      const currentWeight = list[list.length - 1]?.weight || '--'
      const firstWeight = safeNumber(list[0]?.weight, 0)
      const lastWeight = safeNumber(list[list.length - 1]?.weight, 0)
      const delta = Number((lastWeight - firstWeight).toFixed(1))
      let trendDesc = '持平'

      if (delta > 0) {
        trendDesc = `较起点 +${delta.toFixed(1)}kg`
      } else if (delta < 0) {
        trendDesc = `较起点 ${delta.toFixed(1)}kg`
      }

      const selectedPointIndex = chartPoints.length - 1
      const selectedPointInfo = chartPoints[selectedPointIndex] || null

      this.setData({
        chartReady: true,
        activePeriod: period,
        periodTabs: PERIOD_TABS,
        chartPoints,
        chartLabels,
        chartData,
        currentWeight,
        trendDesc,
        selectedPointIndex,
        selectedPointInfo,
        chartMeta: trendData?.meta || null
      })
    } catch (err) {
      console.log('loadWeightTrend error = ', err)
      this.setData({
        ...buildEmptyChart(),
        activePeriod: period
      })
    }
  },

  handlePeriodChange(e) {
    const key = e.currentTarget.dataset.key || 'week'
    if (key === this.data.activePeriod) return
    this.loadWeightTrend(key)
  },

  handleSelectPoint(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(index)) return

    const point = (this.data.chartPoints || [])[index]
    if (!point) return

    this.setData({
      selectedPointIndex: index,
      selectedPointInfo: point
    })
  },

  onCourseCheckinSuccess(payload = {}) {
    console.log('camp detail onCourseCheckinSuccess = ', payload)
    this.getDetail()
  },

  goback() {
    wx.navigateBack({
      delta: 1
    })
  }
})