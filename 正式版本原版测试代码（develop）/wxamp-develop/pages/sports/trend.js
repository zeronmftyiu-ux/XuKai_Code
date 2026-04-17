import api from '../../request/index'
import moment from "../../utils/moment"
import util from "../../utils/util"
import { mergeWeightMap, getLatestWeightRecord } from "../../utils/weight-record"

Page({
  data: {
    userInfo: {},
    channel: {},
    weightMap: {},

    periodTabs: [
      { key: 'week', name: '周' },
      { key: 'month', name: '月' },
      { key: 'quarter', name: '季度' }
    ],
    activePeriod: 'week',

    currentWeight: '--',
    bmi: '--',
    suggestWeight: '--',
    label: '--',
    width: 0,

    selectedPoint: null,
    selectedIndex: -1,
    trendDesc: '--',
    tooltipLeft: 0,
    tooltipTop: 0,
    showTooltip: false
  },

  onLoad() {
    this.canvasNode = null
    this.ctx = null
    this.canvasWidth = 0
    this.canvasHeight = 0
    this.dpr = 1
    this.chartRect = null
    this.chartMeta = null
    this.chartData = {
      xData: [],
      yData: [],
      rawDates: []
    }
    this.activePointIndex = -1

    this.getInfo()
  },

  onReady() {
    this.initCanvas()
    this.cacheChartRect()
  },

  handlePeriodChange(e) {
    const { key } = e.currentTarget.dataset
    if (!key || key === this.data.activePeriod) return

    this.setData({
      activePeriod: key,
      selectedPoint: null,
      selectedIndex: -1,
      showTooltip: false,
      tooltipLeft: 0,
      tooltipTop: 0
    }, () => {
      this.activePointIndex = -1
      this.getTrendData()
    })
  },

  initCanvas() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#weightTrendCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) return

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
        const dpr = windowInfo.pixelRatio || 1
        const width = res[0].width
        const height = res[0].height

        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        this.canvasNode = canvas
        this.ctx = ctx
        this.canvasWidth = width
        this.canvasHeight = height
        this.dpr = dpr

        if (this.chartData.xData.length) {
          this.drawLineChart(this.chartData.xData, this.chartData.yData, this.chartData.rawDates)
        }
      })
  },

  cacheChartRect(callback) {
    const query = wx.createSelectorQuery().in(this)
    query.select('#trendCanvasBox').boundingClientRect(rect => {
      this.chartRect = rect || null
      if (typeof callback === 'function') callback(rect || null)
    }).exec()
  },

  getLocalTouchPoint(e) {
    if (!this.chartRect) return null
  
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
  
    const localX = clientX - this.chartRect.left
    const localY = clientY - this.chartRect.top
  
    if (Number.isNaN(localX) || Number.isNaN(localY)) return null
  
    return { localX, localY }
  },
  
  getNearestPointIndexByX(localX) {
    const points = (this.chartMeta && this.chartMeta.points) || []
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
  
  selectPointByIndex(index) {
    if (index < 0 || !this.chartData || !this.chartData.yData.length) return
  
    this.activePointIndex = index
  
    const selectedPoint = this.buildSelectedPoint(
      index,
      this.chartData.xData,
      this.chartData.yData,
      this.chartData.rawDates
    )
  
    this.setData({
      selectedIndex: index,
      selectedPoint
    }, () => {
      this.drawLineChart(this.chartData.xData, this.chartData.yData, this.chartData.rawDates)
      this.updateTooltipPosition()
    })
  },

  handleChartTap(e) {
    if (!this.chartMeta || !this.chartMeta.points || !this.chartMeta.points.length) return
  
    this.cacheChartRect(() => {
      const localPoint = this.getLocalTouchPoint(e)
      if (!localPoint) return
  
      const { localX, localY } = localPoint
      const points = this.chartMeta.points
  
      let nearestIndex = this.getNearestPointIndexByX(localX)
      if (nearestIndex === -1) return
  
      const targetPoint = points[nearestIndex]
      if (!targetPoint) return
  
      // 给一个更宽松的命中范围：
      // 用户只要点在该点附近竖向区域内，就算命中
      const hitX = Math.abs(targetPoint.x - localX)
      const hitY = Math.abs(targetPoint.y - localY)
  
      const canSelect = hitX <= 36 || (hitX <= 52 && hitY <= 90)
  
      if (!canSelect) return
  
      this.selectPointByIndex(nearestIndex)
    })
  },

  getInfo() {
    wx.showLoading({
      title: '请稍候...'
    })

    api.user.getUserInfo().then(res => {
      if (Number(res.code) !== 200) {
        wx.hideLoading()
        return
      }

      const userInfo = res.data || {}
      const channel = userInfo.channel && userInfo.channel.length > 0 ? userInfo.channel[0] : {}
      const rawWeight = channel.weight || userInfo.weight || ''
      const rawHeight = channel.height || userInfo.height || ''

      const currentWeight = rawWeight ? Number(rawWeight).toFixed(2) : '--'
      const bmi = (rawWeight && rawHeight) ? util.calculateBMI(rawWeight, rawHeight) : '--'
      const suggestWeight = rawHeight ? this.calcSuggestWeight(rawHeight) : '--'
      const label = this.getBmiLabel(bmi)
      const width = this.getBmiPointerWidth(bmi)

      this.setData({
        userInfo,
        channel,
        currentWeight,
        bmi,
        suggestWeight,
        label,
        width
      })

      this.getTrendData()
    }).catch(() => {
      wx.hideLoading()
    })
  },

  calcSuggestWeight(height) {
    const h = Number(height)
    if (!h) return '--'
    return Number(23.9 * h * h / 10000).toFixed(2)
  },

  getBmiLabel(bmi) {
    const value = Number(bmi)
    if (!value) return '--'
    if (value < 18.5) return '偏瘦'
    if (value < 24) return '正常'
    if (value < 28) return '超重'
    return '肥胖'
  },

  getBmiPointerWidth(bmi) {
    const value = Number(bmi)
    if (!value) return 0

    if (value <= 18.5) {
      return Math.max(0, Number((170 * value / 18.5).toFixed(2)) - 13)
    } else if (value <= 24) {
      return Number(((200 * (value - 18.5)) / 5.5).toFixed(2)) - 13 + 172
    } else if (value <= 28) {
      return Number(((144 * (value - 24)) / 4).toFixed(2)) - 13 + 374
    }

    return Math.min(650, Number(((170 * (value - 28)) / 12).toFixed(2)) - 13 + 520)
  },

  getRangeByPeriod(period) {
    const end = moment()
    let start = moment()

    if (period === 'week') {
      start = moment().clone().subtract(6, 'days')
    } else if (period === 'month') {
      start = moment().clone().subtract(29, 'days')
    } else {
      start = moment().clone().subtract(89, 'days')
    }

    return {
      sdate: start.format('YYYY-MM-DD'),
      edate: end.format('YYYY-MM-DD')
    }
  },

  filterWeightMapByRange(weightMap, sdate, edate) {
    const map = weightMap || {}
    const filtered = {}
    const startNum = Number(moment(sdate).format('YYYYMMDD'))
    const endNum = Number(moment(edate).format('YYYYMMDD'))

    Object.keys(map).forEach(dateKey => {
      const cur = Number(moment(dateKey).format('YYYYMMDD'))
      if (cur >= startNum && cur <= endNum) {
        filtered[dateKey] = map[dateKey]
      }
    })

    return filtered
  },

  getTrendData() {
    const { sdate, edate } = this.getRangeByPeriod(this.data.activePeriod)

    api.movewell.getWeightData({ sdate, edate }).then(r => {
      wx.hideLoading()

      if (Number(r.code) !== 200) return

      const mergedMap = mergeWeightMap(r.data || {})
      const scopedMap = this.filterWeightMapByRange(mergedMap, sdate, edate)

      this.setData({ weightMap: scopedMap })

      const { xData, yData, rawDates } = this.buildChartData(scopedMap)
      this.chartData = { xData, yData, rawDates }

      const latestRecord = getLatestWeightRecord(mergedMap)
      const height = this.data.channel.height || this.data.userInfo.height || ''

      if (latestRecord) {
        const latestWeight = Number(latestRecord.weight).toFixed(2)
        const bmi = height ? util.calculateBMI(latestRecord.weight, height) : '--'

        this.setData({
          currentWeight: latestWeight,
          bmi,
          label: this.getBmiLabel(bmi),
          width: this.getBmiPointerWidth(bmi)
        })
      }

      if (yData.length) {
        this.activePointIndex = yData.length - 1
        this.setData({
          selectedIndex: this.activePointIndex,
          selectedPoint: this.buildSelectedPoint(this.activePointIndex, xData, yData, rawDates),
          trendDesc: this.buildTrendDesc(yData),
          showTooltip: false
        })
      } else {
        this.activePointIndex = -1
        this.setData({
          selectedIndex: -1,
          selectedPoint: null,
          trendDesc: '--',
          showTooltip: false,
          tooltipLeft: 0,
          tooltipTop: 0
        })
      }

      setTimeout(() => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#trendCanvasBox').boundingClientRect(rect => {
          this.chartRect = rect || null
      
          if (!this.ctx) {
            this.initCanvas()
          } else {
            this.drawLineChart(xData, yData, rawDates)
            this.updateTooltipPosition()
          }
        }).exec()
      }, 60)
    }).catch(() => {
      wx.hideLoading()
    })
  },

  buildChartData(weightMap) {
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

  buildSelectedPoint(index, xData, yData, rawDates) {
    if (index < 0 || index >= yData.length) return null

    return {
      date: rawDates[index] || xData[index] || '',
      labelDate: this.formatDisplayDate(rawDates[index] || xData[index] || ''),
      weight: Number(yData[index]).toFixed(2)
    }
  },

  formatDisplayDate(dateStr) {
    if (!dateStr) return '--'
    if (dateStr.includes('-')) {
      return moment(dateStr).format('M月D日')
    }
    return dateStr
  },

  buildTrendDesc(yData) {
    if (!yData || yData.length <= 1) return '暂无明显变化'

    const first = Number(yData[0])
    const last = Number(yData[yData.length - 1])
    const diff = Number((last - first).toFixed(2))

    if (diff > 0) return `较起点 +${diff.toFixed(2)}kg`
    if (diff < 0) return `较起点 ${diff.toFixed(2)}kg`
    return '整体持平'
  },

  getXAxisLabelIndexes(count) {
    const period = this.data.activePeriod
    if (count <= 1) return [0]
    if (count <= 4) return [...Array(count).keys()]

    const set = new Set()

    if (period === 'week') {
      if (count <= 7) {
        for (let i = 0; i < count; i++) set.add(i)
      } else {
        set.add(0)
        set.add(Math.floor((count - 1) / 2))
        set.add(count - 1)
      }
    } else if (period === 'month') {
      set.add(0)
      set.add(Math.floor((count - 1) / 4))
      set.add(Math.floor((count - 1) / 2))
      set.add(Math.floor(((count - 1) * 3) / 4))
      set.add(count - 1)
    } else {
      set.add(0)
      set.add(Math.floor((count - 1) / 5))
      set.add(Math.floor(((count - 1) * 2) / 5))
      set.add(Math.floor(((count - 1) * 3) / 5))
      set.add(Math.floor(((count - 1) * 4) / 5))
      set.add(count - 1)
    }

    return Array.from(set).filter(i => i >= 0 && i < count).sort((a, b) => a - b)
  },

  drawSmoothLine(ctx, points) {
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

  updateTooltipPosition() {
    if (!this.chartMeta || !this.chartMeta.points || this.activePointIndex < 0) {
      this.setData({
        tooltipLeft: 0,
        tooltipTop: 0,
        showTooltip: false
      })
      return
    }
  
    const point = this.chartMeta.points[this.activePointIndex]
    if (!point) {
      this.setData({
        tooltipLeft: 0,
        tooltipTop: 0,
        showTooltip: false
      })
      return
    }
  
    const tooltipHalfW = 56
    const tooltipH = 92
    const canvasW = this.canvasWidth || 327
    const canvasH = this.canvasHeight || 210
    const edgeGap = 8
  
    let left = point.x
    let top = point.y - tooltipH - 16
  
    // 左右边界：left 按“中心点”处理
    if (left < tooltipHalfW + edgeGap) {
      left = tooltipHalfW + edgeGap
    }
    if (left > canvasW - tooltipHalfW - edgeGap) {
      left = canvasW - tooltipHalfW - edgeGap
    }
  
    // 先优先显示在点上方；如果上方放不下，就放到下方
    if (top < edgeGap) {
      top = point.y + 16
    }
  
    // 下方也不能超出容器
    if (top > canvasH - tooltipH - edgeGap) {
      top = canvasH - tooltipH - edgeGap
    }
  
    this.setData({
      tooltipLeft: left,
      tooltipTop: top,
      showTooltip: true
    })
  },

  drawLineChart(xData, yData, rawDates = []) {
    if (!this.ctx) return

    const ctx = this.ctx
    const canvasW = this.canvasWidth || 654
    const canvasH = this.canvasHeight || 420

    const paddingLeft = 24
    const paddingRight = 56
    const paddingTop = 54
    const paddingBottom = 56

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

    const xLabelIndexes = this.getXAxisLabelIndexes(count)
    xLabelIndexes.forEach(index => {
      const point = points[index]
      if (!point) return
      ctx.fillStyle = '#98A1AF'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(xData[index], point.x, paddingTop + chartH + 24)
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

      this.chartMeta = { points }

      if (this.activePointIndex > -1) {
        this.updateTooltipPosition()
      }
      return
    }

    const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH)
    gradient.addColorStop(0, 'rgba(17, 197, 201, 0.18)')
    gradient.addColorStop(1, 'rgba(17, 197, 201, 0.04)')

    ctx.beginPath()
    ctx.moveTo(points[0].x, paddingTop + chartH)
    this.drawSmoothLine(ctx, points)
    ctx.lineTo(points[points.length - 1].x, paddingTop + chartH)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = '#11C5C9'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    this.drawSmoothLine(ctx, points)
    ctx.stroke()

    const activeIndex = this.activePointIndex
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
      const isActive = this.activePointIndex === index

      ctx.beginPath()
      ctx.fillStyle = isActive ? 'rgba(17, 197, 201, 0.16)' : '#11C5C9'
      ctx.arc(point.x, point.y, isActive ? 7 : 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = '#FFFFFF'
      ctx.arc(point.x, point.y, isActive ? 3.6 : 2, 0, Math.PI * 2)
      ctx.fill()
    })

    this.chartMeta = { points }

    if (this.activePointIndex > -1) {
      this.updateTooltipPosition()
    }
  }
})