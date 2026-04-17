import api from '../../request/index'
import moment from "../../utils/moment";

const COURSE_RECORD_STORAGE_KEY = 'MOTION_COURSE_RECORDS'

Page({
  data: {
    currentDate: '',
    sdate: '',
    edate: '',
    weekDays: [],
    list: [],
    detail: {},
    date: moment().format('YYYY-MM-DD'),
    selectedDate: moment().format('YYYY-MM-DD'),
    auth: false,
    weekDataMap: {},

    fromCamp: 0,
    camp_id: '',
    activity_id: '',
    project_id: '',
    group_id: '',
    member_id: '',
    camp_name: '',
    campTaskInfo: {
      title: '每日运动',
      targetText: '完成今日运动打卡',
      pointText: '完成后可获得积分'
    }
  },

  onLoad(options) {
    const activityId = options.activity_id || options.camp_id || ''
    const campName = decodeURIComponent(options.camp_name || '')
  
    this.setData({
      fromCamp: Number(options.fromCamp || 0),
      camp_id: String(activityId || ''),
      activity_id: String(activityId || ''),
      project_id: String(options.project_id || ''),
      group_id: String(options.group_id || ''),
      member_id: String(options.member_id || ''),
      camp_name: campName,
      campTaskInfo: {
        title: '每日运动',
        targetText: campName ? `当前活动：${campName}` : '当前活动任务页',
        pointText: '完成运动打卡后将同步到活动记录'
      }
    })
  
    this.setCurrentDate(moment())
  },

  getStoredCourseRecords() {
    try {
      const list = wx.getStorageSync(COURSE_RECORD_STORAGE_KEY)
      return Array.isArray(list) ? list : []
    } catch (err) {
      return []
    }
  },

  isDateInRange(date, sdate, edate) {
    if (!date || !sdate || !edate) return false
    return date >= sdate && date <= edate
  },

  normalizeCourseRecord(record = {}) {
    return {
      id: record.id || `course_${Date.now()}`,
      title: record.title || '课程跟练',
      source: record.source || '课程跟练',
      calorie: Number(record.calorie || 0),
      icon: record.icon || 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      type: record.type || 'course_follow',
      date: record.date || ''
    }
  },

  mergeCourseRecords(dayMap = {}, sdate = '', edate = '') {
    const mergedMap = JSON.parse(JSON.stringify(dayMap || {}))
    const localRecords = this.getStoredCourseRecords()
    const currentCampId = String(this.data.activity_id || this.data.camp_id || '')

    localRecords.forEach(record => {
      const recordDate = record.date || ''
      if (!this.isDateInRange(recordDate, sdate, edate)) return

      if (this.data.fromCamp && currentCampId) {
        if (String(record.camp_id || '') !== currentCampId) {
          return
        }
      }

      if (!mergedMap[recordDate]) {
        mergedMap[recordDate] = { act: [] }
      }

      if (!Array.isArray(mergedMap[recordDate].act)) {
        mergedMap[recordDate].act = []
      }

      const normalized = this.normalizeCourseRecord(record)
      mergedMap[recordDate].act.unshift(normalized)
    })

    return mergedMap
  },

  setCurrentDate(date) {
    this.setData({
      currentDate: date
    })
    this.generateCalendar()
  },

  goTaskPage() {
    let url = '/pages/motion/task/index'
  
    const query = []
    if (this.data.fromCamp) query.push('fromCamp=1')
    if (this.data.activity_id) query.push(`activity_id=${encodeURIComponent(this.data.activity_id)}`)
    if (this.data.camp_id) query.push(`camp_id=${encodeURIComponent(this.data.camp_id)}`)
    if (this.data.project_id) query.push(`project_id=${encodeURIComponent(this.data.project_id)}`)
    if (this.data.group_id) query.push(`group_id=${encodeURIComponent(this.data.group_id)}`)
    if (this.data.member_id) query.push(`member_id=${encodeURIComponent(this.data.member_id)}`)
    if (this.data.camp_name) query.push(`camp_name=${encodeURIComponent(this.data.camp_name)}`)
  
    if (query.length) {
      url += `?${query.join('&')}`
    }
  
    wx.navigateTo({ url })
  },

  showTag() {
    if (this.data.auth) {
      api.movewell.syncHuaWeiData().then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '同步数据完成',
            icon: 'success',
            duration: 2000
          })
          this.generateCalendar()
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/health/list'
      })
    }
  },

  getWeekSummary(dayMap, startOfWeek) {
    let activeDays = 0
    let totalCal = 0
    let maxStreak = 0
    let currentStreak = 0

    for (let i = 0; i < 7; i++) {
      const currentDay = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
      const dayData = dayMap[currentDay] || {}
      const actList = Array.isArray(dayData.act) ? dayData.act : []
      const hasAct = actList.length > 0

      if (hasAct) {
        activeDays += 1
        currentStreak += 1
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak
        }
        actList.forEach(row => {
          totalCal += Number(row.calorie || 0)
        })
      } else {
        currentStreak = 0
      }
    }

    return {
      streakDays: maxStreak,
      activeDays,
      cal: Number(totalCal.toFixed(2))
    }
  },

  buildWeekDays(startOfWeek, selectedDate, dayMap) {
    const today = moment().format('YYYY-MM-DD')
    const todayMoment = moment(today)
    const weekDays = []

    for (let i = 0; i < 7; i++) {
      const currentMoment = startOfWeek.clone().add(i, 'days')
      const currentDay = currentMoment.format('YYYY-MM-DD')
      const actList = (dayMap[currentDay] && Array.isArray(dayMap[currentDay].act))
        ? dayMap[currentDay].act
        : []

      const isFuture = currentMoment.isAfter(todayMoment, 'day')

      weekDays.push({
        value: currentMoment.format('D'),
        date: currentDay,
        checked: currentDay === selectedDate,
        isToday: currentDay === today,
        hasRecord: actList.length > 0,
        isFuture
      })
    }

    return weekDays
  },

  syncSelectedDate(dayMap, startOfWeek) {
    const currentSelectedDate = this.data.selectedDate
    const weekStart = startOfWeek.clone().startOf('day')
    const weekEnd = startOfWeek.clone().endOf('week')
    const selectedMoment = moment(currentSelectedDate)

    if (selectedMoment.isBetween(weekStart, weekEnd, null, '[]') && !selectedMoment.isAfter(moment(), 'day')) {
      return currentSelectedDate
    }

    const today = moment().format('YYYY-MM-DD')
    if (moment(today).isBetween(weekStart, weekEnd, null, '[]')) {
      return today
    }

    for (let i = 6; i >= 0; i--) {
      const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
      const dateMoment = moment(date)
      if (dateMoment.isAfter(moment(), 'day')) continue

      const actList = (dayMap[date] && Array.isArray(dayMap[date].act))
        ? dayMap[date].act
        : []
      if (actList.length > 0) {
        return date
      }
    }

    for (let i = 6; i >= 0; i--) {
      const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
      const dateMoment = moment(date)
      if (!dateMoment.isAfter(moment(), 'day')) {
        return date
      }
    }

    return startOfWeek.format('YYYY-MM-DD')
  },

  updateSelectedDayList(selectedDate, dayMap) {
    const dayData = dayMap[selectedDate] || {}
    const actList = Array.isArray(dayData.act) ? dayData.act : []

    this.setData({
      date: selectedDate,
      selectedDate,
      list: actList
    })
  },

  generateCalendar() {
    const now = this.data.currentDate
    const startOfCurrentWeek = now.clone().startOf('week')
    const endOfCurrentWeek = now.clone().endOf('week')
    const sdate = startOfCurrentWeek.format('YYYY-MM-DD')
    const edate = endOfCurrentWeek.format('YYYY-MM-DD')

    api.movewell.myactlist({ sdate, edate }).then(res => {
      if (res.code == 200) {
        const apiDayMap = res.data || {}
        const mergedDayMap = this.mergeCourseRecords(apiDayMap, sdate, edate)
        const selectedDate = this.syncSelectedDate(mergedDayMap, startOfCurrentWeek)
        const weekDays = this.buildWeekDays(startOfCurrentWeek, selectedDate, mergedDayMap)
        const detail = this.getWeekSummary(mergedDayMap, startOfCurrentWeek)

        this.setData({
          sdate,
          edate,
          weekDays,
          weekDataMap: mergedDayMap,
          detail
        })

        this.updateSelectedDayList(selectedDate, mergedDayMap)
      }
    })
  },

  chooseDay(e) {
    const { date, future } = e.currentTarget.dataset
    if (!date) return
    if (future) return

    const weekDays = this.data.weekDays.map(item => {
      return Object.assign({}, item, {
        checked: item.date === date
      })
    })

    this.setData({ weekDays })
    this.updateSelectedDayList(date, this.data.weekDataMap)
  },

  prevMonth() {
    const newDate = this.data.currentDate.clone().subtract(1, 'weeks')
    this.setCurrentDate(newDate)
  },

  nextMonth() {
    const targetDate = this.data.currentDate.clone().add(1, 'weeks')
    const targetWeekStart = targetDate.clone().startOf('week')
    const today = moment()

    if (targetWeekStart.isAfter(today, 'day')) {
      return
    }

    this.setCurrentDate(targetDate)
  },

  showEdit() {
    wx.showToast({
      title: '请通过打卡模块完成记录',
      icon: 'none'
    })
  },

  goCampDetail() {
    wx.navigateBack({
      delta: 1
    })
  },

  goback() {
    wx.navigateBack({
      delta: 1
    })
  },

  onShow() {
    this.generateCalendar()
    this.config()
  },

  config() {
    api.movewell.isAuth().then(res => {
      this.setData({
        auth: res && res.data ? res.data.auth : false
      })
    })
  }
})