import campService from '../../../services/campService'
import { formatCampStatusText, normalizeCampData } from '../../../utils/camp'

Page({
  data: {
    camp_id: '',
    loading: false,

    info: {},
    statusText: '',

    // 顶部：所有进行中训练营切换
    currentCampList: [],
    currentCampIndex: 0,

    // 工作台数据
    dashboard: {
      stageText: '减脂期',
      currentDay: 1,
      remainTaskText: '今天还差 1 次任务，完成后就离目标更近一点。',
      todayTaskList: [],
      currentWeight: '--',
      lostWeight: '--',
      distanceWeight: '--',
      weekDone: 0,
      weekTotal: 0,
      progressPercent: 0,
      progressStyle: 'width: 0%;'
    },

    rankingSummary: {
      myRank: 8,
      topList: [
        { name: '张三', value: '6.2%' },
        { name: '李四', value: '5.8%' },
        { name: '王五', value: '5.1%' }
      ]
    },

    reportSummary: {
      hasReport: true,
      latestDate: '2026-03-22',
      label: '最近一次体测报告'
    },

    signSummary: {
      hasRecord: true,
      latestList: [
        { title: '开营签到', time: '2026-03-20 09:00', location: 'A馆' },
        { title: '线下课程签到', time: '2026-03-23 18:30', location: 'B馆' }
      ]
    },

    taskList: [
      {
        key: 'motion',
        title: '每日运动',
        desc: '完成运动课程或运动打卡',
        url: '/pages/motion/list'
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

  async onLoad(options = {}) {
    const campId = options.camp_id || ''

    this.setData({
      camp_id: String(campId || '')
    })

    await this.loadCurrentCampList()

    if (campId) {
      this.syncCurrentCampIndex(campId)
      this.getDetail()
      return
    }

    const firstCamp = (this.data.currentCampList || [])[0]
    if (firstCamp && firstCamp.camp_id) {
      this.setData({
        camp_id: String(firstCamp.camp_id)
      })
      this.syncCurrentCampIndex(firstCamp.camp_id)
      this.getDetail()
      return
    }

    wx.showToast({
      title: '活动ID缺失',
      icon: 'none'
    })
  },

  formatStatusText(status) {
    return formatCampStatusText(status)
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
          item.name ||
          item.company ||
          item.title ||
          item.camp_code ||
          `训练营${item.camp_id || ''}`
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
    const index = list.findIndex(item => String(item.camp_id) === String(campId))

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
        camp_id
      })

      console.log('camp detail res = ', res)

      if (Number(res.code) === 200) {
        const info = res.data || {}

        this.setData({
          info,
          statusText: this.formatStatusText(info.status)
        })

        this.buildDashboard(info)
        this.buildReportSummary(info)
        this.buildSignSummary(info)
      } else {
        wx.showToast({
          title: res.message || '详情加载失败',
          icon: 'none'
        })
      }
    } catch (err) {
      console.log('camp detail error = ', err)
      wx.showToast({
        title: '详情加载失败',
        icon: 'none'
      })
    }

    this.setData({ loading: false })

    setTimeout(() => {
      wx.hideLoading()
    }, 100)
  },

  buildDashboard(info = {}) {
    const progressPercent = Number(info.progress_percent || 0)
  
    this.setData({
      dashboard: {
        stageText: info.stage_text || '减脂期',
        currentDay: info.current_day || 1,
        remainTaskText: info.remain_task_text || '今天还差 1 次任务，完成后就离目标更近一点。',
        todayTaskList: info.today_task_list || [],
        currentWeight: info.current_weight || '--',
        lostWeight: info.lost_weight || '--',
        distanceWeight: info.distance_weight || '--',
        weekDone: info.week_done || 0,
        weekTotal: info.week_total || 0,
        progressPercent,
        progressStyle: `width: ${progressPercent}%;`
      }
    })
  },

  buildReportSummary(info = {}) {
    this.setData({
      reportSummary: {
        hasReport: true,
        latestDate: info.report_latest_date || '2026-03-22',
        label: '最近一次体测报告'
      }
    })
  },

  buildSignSummary(info = {}) {
    this.setData({
      signSummary: {
        hasRecord: true,
        latestList: info.sign_latest_list || [
          { title: '开营签到', time: '2026-03-20 09:00', location: 'A馆' },
          { title: '线下课程签到', time: '2026-03-23 18:30', location: 'B馆' }
        ]
      }
    })
  },

  handleSwitchCamp(e) {
    const campId = e.currentTarget.dataset.campId
    if (!campId || String(campId) === String(this.data.camp_id)) return

    this.setData({
      camp_id: String(campId)
    })

    this.syncCurrentCampIndex(campId)
    this.getDetail()
  },

  goTaskPage(e) {
    const { url } = e.currentTarget.dataset
    const { camp_id, info } = this.data

    if (!url) return

    const campName =
      info.name ||
      info.company ||
      info.title ||
      info.camp_code ||
      ''

    const query = [
      `camp_id=${encodeURIComponent(camp_id || '')}`,
      `camp_name=${encodeURIComponent(campName)}`,
      'fromCamp=1'
    ].join('&')

    wx.navigateTo({
      url: `${url}?${query}`
    })
  },

  goCheckIn() {
    const motionTask = (this.data.taskList || []).find(item => item.key === 'motion')
    if (!motionTask) return

    this.goTaskPage({
      currentTarget: {
        dataset: {
          url: motionTask.url
        }
      }
    })
  },

  goWeightRecord() {
    wx.showToast({
      title: '录入体重下一步接入',
      icon: 'none'
    })
  },

  goReportPage() {
    wx.showToast({
      title: '体测报告页下一步接入',
      icon: 'none'
    })
  },

  goSignPage() {
    wx.showToast({
      title: '签到记录页下一步接入',
      icon: 'none'
    })
  },

  goBack() {
    wx.navigateBack()
  }
})