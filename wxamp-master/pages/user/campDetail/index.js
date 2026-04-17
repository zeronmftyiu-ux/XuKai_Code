import campService from '../../../services/campService'
import api from '../../../request/index'
import moment from '../../../utils/moment'
import { mergeWeightMap, getLatestWeightRecord } from '../../../utils/weight-record'
import { formatCampStatusText, normalizeCampData } from '../../../utils/camp'

Page({
  data: {
    camp_id: '',
    urid: '',
    token: '',
    from: '',
    loading: false,

    info: {},
    statusText: '',
    pageMode: 'ongoing', // ongoing | ended

    // 仅进行中使用
    currentCampList: [],
    currentCampIndex: 0,

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
    weightTrend: {
      currentWeight: '--',
      trendDesc: '--',
      hasData: false,
      selectedPoint: null,
      selectedIndex: -1,
      tooltipLeft: 0,
      tooltipTop: 0,
      showTooltip: false
    },

    // 历史详情使用
    historySummary: {
      totalLoss: '--',
      finishRate: '--',
      actionText: '查看成果',
      resultTitle: '本期成果摘要',
      resultDesc: '本期训练营已完成，可查看成果与变化。',
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
        url: '/pages/motion/course/index'
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
    const userInfo = wx.getStorageSync('userInfo') || {}

    this.setData({
      camp_id: String(campId || ''),
      urid: options.urid || userInfo.urid || '',
      token: options.token || userInfo.token || '',
      from: options.from || ''
    })

    if (!campId && this.data.from !== 'current') {
      wx.showToast({
        title: '活动ID缺失',
        icon: 'none'
      })
      return
    }

    await this.getDetail()
  },

  onReady() {
    this.trendCanvasNode = null
    this.trendCtx = null
    this.trendCanvasWidth = 0
    this.trendCanvasHeight = 0
    this.trendDpr = 1
    this.trendChartRect = null
    this.trendChartMeta = null
    this.trendChartData = {
      xData: [],
      yData: [],
      rawDates: []
    }
    this.trendActivePointIndex = -1
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
    const { camp_id, urid, token } = this.data
    if (!camp_id && !urid) return

    this.setData({ loading: true })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
      const detailParams = {
        camp_id
      }

      if (urid) detailParams.urid = urid
      if (token) detailParams.token = token

      const res = await campService.getCampDetail(detailParams)

      console.log('camp detail res = ', res)

      if (Number(res.code) === 200) {
        const info = res.data || {}
        const statusText = this.formatStatusText(info.status)
        const pageMode = info.status === 'ended' ? 'ended' : 'ongoing'

        this.setData({
          info,
          statusText,
          pageMode
        })

        if (pageMode === 'ongoing') {
          await this.loadCurrentCampList()
          this.syncCurrentCampIndex(info.camp_id || camp_id)
          this.buildDashboard(info)
          this.loadWeightTrend()
        } else {
          this.setData({
            currentCampList: [],
            currentCampIndex: 0,
            weightTrend: {
              currentWeight: '--',
              trendDesc: '--',
              hasData: false,
              selectedPoint: null,
              selectedIndex: -1,
              tooltipLeft: 0,
              tooltipTop: 0,
              showTooltip: false
            }
          })
          this.buildHistorySummary(info)
        }

        this.buildReportSummary(info)
        this.buildSignSummary(info)
        this.buildRankingSummary(info)
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

  getTrendRange() {
    return {
      sdate: moment().clone().subtract(6, 'days').format('YYYY-MM-DD'),
      edate: moment().format('YYYY-MM-DD')
    }
  },
  
  cacheTrendChartRect(callback) {
    const query = wx.createSelectorQuery().in(this)
    query.select('#campWeightTrendBox').boundingClientRect(rect => {
      this.trendChartRect = rect || null
      if (typeof callback === 'function') callback(rect || null)
    }).exec()
  },
  
  initTrendCanvas(callback) {
    const query = wx.createSelectorQuery().in(this)
    query.select('#campWeightTrendCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          if (typeof callback === 'function') callback()
          return
        }
  
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
        const dpr = windowInfo.pixelRatio || 1
        const width = res[0].width
        const height = res[0].height
  
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
  
        this.trendCanvasNode = canvas
        this.trendCtx = ctx
        this.trendCanvasWidth = width
        this.trendCanvasHeight = height
        this.trendDpr = dpr
  
        if (typeof callback === 'function') callback()
      })
  },
  
  loadWeightTrend() {
    const { sdate, edate } = this.getTrendRange()
  
    api.movewell.getWeightData({ sdate, edate }).then(res => {
      if (Number(res.code) !== 200) return
  
      const mergedMap = mergeWeightMap(res.data || {})
      const { xData, yData, rawDates } = this.buildTrendChartData(mergedMap)
  
      this.trendChartData = { xData, yData, rawDates }
  
      const latestRecord = getLatestWeightRecord(mergedMap)
      const currentWeight = latestRecord ? Number(latestRecord.weight).toFixed(2) : '--'
      const trendDesc = this.buildWeightTrendDesc(yData)
  
      if (yData.length) {
        this.trendActivePointIndex = yData.length - 1
      } else {
        this.trendActivePointIndex = -1
      }
  
      this.setData({
        weightTrend: {
          currentWeight,
          trendDesc,
          hasData: !!yData.length,
          selectedIndex: this.trendActivePointIndex,
          selectedPoint: this.buildTrendSelectedPoint(this.trendActivePointIndex, xData, yData, rawDates),
          tooltipLeft: 0,
          tooltipTop: 0,
          showTooltip: false
        }
      }, () => {
        this.cacheTrendChartRect(() => {
          this.initTrendCanvas(() => {
            this.drawWeightTrendChart(xData, yData, rawDates)
            this.updateTrendTooltipPosition()
          })
        })
      })
    }).catch(err => {
      console.log('loadWeightTrend error = ', err)
    })
  },
  
  buildTrendChartData(weightMap = {}) {
    const keys = Object.keys(weightMap || {}).sort()
    const xData = []
    const yData = []
    const rawDates = []
  
    keys.forEach(dateKey => {
      const list = weightMap[dateKey] || []
      if (!list.length) return
  
      const lastRow = list[list.length - 1]
      rawDates.push(dateKey)
      xData.push(moment(dateKey).format('MM/DD'))
      yData.push(Number(lastRow.weight))
    })
  
    return { xData, yData, rawDates }
  },
  
  buildTrendSelectedPoint(index, xData = [], yData = [], rawDates = []) {
    if (index < 0 || index >= yData.length) return null
  
    return {
      date: rawDates[index] || xData[index] || '',
      labelDate: this.formatTrendDisplayDate(rawDates[index] || xData[index] || ''),
      weight: Number(yData[index]).toFixed(2)
    }
  },
  
  formatTrendDisplayDate(dateStr) {
    if (!dateStr) return '--'
    if (dateStr.includes('-')) return moment(dateStr).format('M月D日')
    return dateStr
  },
  
  buildWeightTrendDesc(yData = []) {
    if (!yData || yData.length <= 1) return '暂无明显变化'
  
    const first = Number(yData[0])
    const last = Number(yData[yData.length - 1])
    const diff = Number((last - first).toFixed(2))
  
    if (diff > 0) return `较起点 +${diff.toFixed(2)}kg`
    if (diff < 0) return `较起点 ${diff.toFixed(2)}kg`
    return '整体持平'
  },
  
  getTrendXAxisLabelIndexes(count) {
    if (count <= 1) return [0]
    if (count <= 4) return [...Array(count).keys()]
  
    const set = new Set()
    set.add(0)
    set.add(Math.floor((count - 1) / 2))
    set.add(count - 1)
  
    return Array.from(set).filter(i => i >= 0 && i < count).sort((a, b) => a - b)
  },
  
  drawTrendSmoothLine(ctx, points) {
    if (!points.length) return
  
    if (points.length === 1) {
      ctx.moveTo(points[0].x, points[0].y)
      ctx.lineTo(points[0].x + 0.1, points[0].y)
      return
    }
  
    ctx.moveTo(points[0].x, points[0].y)
  
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]
      const midX = (current.x + next.x) / 2
      const midY = (current.y + next.y) / 2
      ctx.quadraticCurveTo(current.x, current.y, midX, midY)
    }
  
    const last = points[points.length - 1]
    ctx.lineTo(last.x, last.y)
  },
  
  getTrendLocalTouchPoint(e) {
    if (!this.trendChartRect) return null
  
    const touch =
      (e.changedTouches && e.changedTouches[0]) ||
      (e.touches && e.touches[0]) ||
      null
  
    if (!touch) return null
  
    let clientX = null
    let clientY = null
  
    if (typeof touch.clientX === 'number' && typeof touch.clientY === 'number') {
      clientX = touch.clientX
      clientY = touch.clientY
    } else if (typeof touch.x === 'number' && typeof touch.y === 'number') {
      clientX = touch.x
      clientY = touch.y
    } else if (typeof touch.pageX === 'number' && typeof touch.pageY === 'number') {
      clientX = touch.pageX
      clientY = touch.pageY
    }
  
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return null
  
    const localX = clientX - this.trendChartRect.left
    const localY = clientY - this.trendChartRect.top
  
    if (Number.isNaN(localX) || Number.isNaN(localY)) return null
  
    return { localX, localY }
  },
  
  getTrendNearestPointIndexByX(localX) {
    const points = (this.trendChartMeta && this.trendChartMeta.points) || []
    if (!points.length) return -1
  
    let nearestIndex = -1
    let nearestDistance = Infinity
  
    points.forEach((point, index) => {
      const dist = Math.abs(point.x - localX)
      if (dist < nearestDistance) {
        nearestDistance = dist
        nearestIndex = index
      }
    })
  
    return nearestIndex
  },
  
  selectTrendPointByIndex(index) {
    if (index < 0 || !this.trendChartData || !this.trendChartData.yData.length) return
  
    this.trendActivePointIndex = index
  
    const selectedPoint = this.buildTrendSelectedPoint(
      index,
      this.trendChartData.xData,
      this.trendChartData.yData,
      this.trendChartData.rawDates
    )
  
    this.setData({
      'weightTrend.selectedIndex': index,
      'weightTrend.selectedPoint': selectedPoint
    }, () => {
      this.drawWeightTrendChart(
        this.trendChartData.xData,
        this.trendChartData.yData,
        this.trendChartData.rawDates
      )
      this.updateTrendTooltipPosition()
    })
  },
  
  handleWeightTrendTap(e) {
    if (!this.trendChartMeta || !this.trendChartMeta.points || !this.trendChartMeta.points.length) return
  
    this.cacheTrendChartRect(() => {
      const localPoint = this.getTrendLocalTouchPoint(e)
      if (!localPoint) return
  
      const { localX, localY } = localPoint
      const points = this.trendChartMeta.points
  
      const nearestIndex = this.getTrendNearestPointIndexByX(localX)
      if (nearestIndex === -1) return
  
      const targetPoint = points[nearestIndex]
      if (!targetPoint) return
  
      const hitX = Math.abs(targetPoint.x - localX)
      const hitY = Math.abs(targetPoint.y - localY)
  
      const canSelect = hitX <= 36 || (hitX <= 52 && hitY <= 90)
      if (!canSelect) return
  
      this.selectTrendPointByIndex(nearestIndex)
    })
  },
  
  updateTrendTooltipPosition() {
    if (!this.trendChartMeta || !this.trendChartMeta.points || this.trendActivePointIndex < 0) {
      this.setData({
        'weightTrend.tooltipLeft': 0,
        'weightTrend.tooltipTop': 0,
        'weightTrend.showTooltip': false
      })
      return
    }
  
    const point = this.trendChartMeta.points[this.trendActivePointIndex]
    if (!point) {
      this.setData({
        'weightTrend.tooltipLeft': 0,
        'weightTrend.tooltipTop': 0,
        'weightTrend.showTooltip': false
      })
      return
    }
  
    const tooltipHalfW = 56
    const tooltipH = 92
    const canvasW = this.trendCanvasWidth || 327
    const canvasH = this.trendCanvasHeight || 160
    const edgeGap = 8
  
    let left = point.x
    let top = point.y - tooltipH - 16
  
    if (left < tooltipHalfW + edgeGap) {
      left = tooltipHalfW + edgeGap
    }
    if (left > canvasW - tooltipHalfW - edgeGap) {
      left = canvasW - tooltipHalfW - edgeGap
    }
  
    if (top < edgeGap) {
      top = point.y + 16
    }
  
    if (top > canvasH - tooltipH - edgeGap) {
      top = canvasH - tooltipH - edgeGap
    }
  
    this.setData({
      'weightTrend.tooltipLeft': left,
      'weightTrend.tooltipTop': top,
      'weightTrend.showTooltip': true
    })
  },
  
  drawWeightTrendChart(xData = [], yData = [], rawDates = []) {
    if (!this.trendCtx) return
  
    const ctx = this.trendCtx
    const canvasW = this.trendCanvasWidth || 654
    const canvasH = this.trendCanvasHeight || 320
  
    const paddingLeft = 24
    const paddingRight = 54
    const paddingTop = 24
    const paddingBottom = 48
  
    const chartW = canvasW - paddingLeft - paddingRight
    const chartH = canvasH - paddingTop - paddingBottom
  
    ctx.clearRect(0, 0, canvasW, canvasH)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasW, canvasH)
  
    if (!yData.length) {
      ctx.fillStyle = '#A0A7B4'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('暂无体重趋势数据', canvasW / 2, canvasH / 2)
      ctx.textAlign = 'left'
      return
    }
  
    const rawMin = Math.min(...yData)
    const rawMax = Math.max(...yData)
  
    let minVal = Number((rawMin - Math.max(0.6, (rawMax - rawMin) * 0.2 || 1)).toFixed(1))
    let maxVal = Number((rawMax + Math.max(0.6, (rawMax - rawMin) * 0.2 || 1)).toFixed(1))
  
    if (minVal === maxVal) {
      minVal -= 1
      maxVal += 1
    }
  
    const valueRange = maxVal - minVal || 1
    const gridCount = 4
  
    for (let i = 0; i <= gridCount; i++) {
      const y = paddingTop + (chartH / gridCount) * i
      ctx.beginPath()
      ctx.setLineDash(i === 0 ? [] : [4, 4])
      ctx.strokeStyle = i === 0 ? '#DDE3EA' : '#E7EBF0'
      ctx.lineWidth = 1
      ctx.moveTo(paddingLeft, y)
      ctx.lineTo(paddingLeft + chartW, y)
      ctx.stroke()
    }
    ctx.setLineDash([])
  
    ctx.fillStyle = '#98A1AF'
    ctx.font = '10px sans-serif'
    for (let i = 0; i <= gridCount; i++) {
      const value = maxVal - (valueRange / gridCount) * i
      const y = paddingTop + (chartH / gridCount) * i + 3
      ctx.fillText(String(value.toFixed(1)), paddingLeft + chartW + 8, y)
    }
  
    const count = xData.length
    const points = yData.map((value, index) => {
      const x = count === 1
        ? paddingLeft + chartW / 2
        : paddingLeft + (chartW / (count - 1)) * index
  
      const y = paddingTop + ((maxVal - value) / valueRange) * chartH
  
      return {
        x,
        y,
        value,
        date: rawDates[index] || xData[index]
      }
    })
  
    const xLabelIndexes = this.getTrendXAxisLabelIndexes(count)
    xLabelIndexes.forEach(index => {
      const point = points[index]
      if (!point) return
      ctx.fillStyle = '#98A1AF'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(xData[index], point.x, paddingTop + chartH + 22)
    })
    ctx.textAlign = 'left'
  
    if (points.length === 1) {
      const point = points[0]
  
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(17, 197, 201, 0.24)'
      ctx.lineWidth = 2
      ctx.moveTo(paddingLeft + 18, point.y)
      ctx.lineTo(paddingLeft + chartW - 18, point.y)
      ctx.stroke()
  
      ctx.beginPath()
      ctx.fillStyle = 'rgba(17, 197, 201, 0.16)'
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fill()
  
      ctx.beginPath()
      ctx.fillStyle = '#11C5C9'
      ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2)
      ctx.fill()
  
      this.trendChartMeta = { points }
  
      if (this.trendActivePointIndex > -1) {
        this.updateTrendTooltipPosition()
      }
      return
    }
  
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH)
    gradient.addColorStop(0, 'rgba(17, 197, 201, 0.18)')
    gradient.addColorStop(1, 'rgba(17, 197, 201, 0.04)')
  
    ctx.beginPath()
    ctx.moveTo(points[0].x, paddingTop + chartH)
    this.drawTrendSmoothLine(ctx, points)
    ctx.lineTo(points[points.length - 1].x, paddingTop + chartH)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
  
    ctx.beginPath()
    ctx.strokeStyle = '#11C5C9'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    this.drawTrendSmoothLine(ctx, points)
    ctx.stroke()
  
    const activeIndex = this.trendActivePointIndex
    if (activeIndex > -1 && points[activeIndex]) {
      const activePoint = points[activeIndex]
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(17, 197, 201, 0.32)'
      ctx.lineWidth = 1
      ctx.moveTo(activePoint.x, paddingTop)
      ctx.lineTo(activePoint.x, paddingTop + chartH)
      ctx.stroke()
      ctx.setLineDash([])
    }
  
    points.forEach((point, index) => {
      const isActive = this.trendActivePointIndex === index
  
      ctx.beginPath()
      ctx.fillStyle = isActive ? 'rgba(17, 197, 201, 0.16)' : '#11C5C9'
      ctx.arc(point.x, point.y, isActive ? 7 : 4, 0, Math.PI * 2)
      ctx.fill()
  
      ctx.beginPath()
      ctx.fillStyle = '#FFFFFF'
      ctx.arc(point.x, point.y, isActive ? 3.6 : 2, 0, Math.PI * 2)
      ctx.fill()
    })
  
    this.trendChartMeta = { points }
  
    if (this.trendActivePointIndex > -1) {
      this.updateTrendTooltipPosition()
    }
  },

  buildHistorySummary(info = {}) {
    const campId = String(info.camp_id || '')
    const lossMap = {
      '41': '4.6 kg',
      '42': '3.2 kg',
      '43': '2.1 kg'
    }
    const rateMap = {
      '41': '92%',
      '42': '84%',
      '43': '76%'
    }
    const actionMap = {
      '41': '查看成果',
      '42': '查看复盘',
      '43': '查看结果'
    }
    const resultDescMap = {
      '41': '本期训练营已完成，你在本期中保持了较好的执行节奏，可查看成果与变化。',
      '42': '本期训练营已完成，可回顾完成情况与训练收获，查看本期复盘内容。',
      '43': '本期训练营已结束，可查看最终结果与变化趋势，回顾本期表现。'
    }

    const finishRate = rateMap[campId] || '80%'
    const numericRate = Number(String(finishRate).replace('%', '')) || 0

    this.setData({
      historySummary: {
        totalLoss: lossMap[campId] || '2.8 kg',
        finishRate,
        actionText: actionMap[campId] || '查看详情',
        resultTitle: '本期成果摘要',
        resultDesc: resultDescMap[campId] || '本期训练营已完成，可查看成果与变化。',
        progressStyle: `width: ${numericRate}%;`
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

  buildRankingSummary(info = {}) {
    if (info.status === 'ended') {
      const campId = String(info.camp_id || '')
      const rankMap = {
        '41': 3,
        '42': 6,
        '43': 9
      }

      this.setData({
        rankingSummary: {
          myRank: rankMap[campId] || 8,
          topList: [
            { name: '张三', value: '6.2%' },
            { name: '李四', value: '5.8%' },
            { name: '王五', value: '5.1%' }
          ]
        }
      })
      return
    }

    this.setData({
      rankingSummary: {
        myRank: 8,
        topList: [
          { name: '张三', value: '6.2%' },
          { name: '李四', value: '5.8%' },
          { name: '王五', value: '5.1%' }
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

  goResultPage() {
    wx.showToast({
      title: '成果与变化页下一步接入',
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