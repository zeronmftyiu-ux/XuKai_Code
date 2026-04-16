import moment from '../../../utils/moment'
//import { CAMP_USE_MOCK } from '../../../utils/mock'
import courseService from '../../../services/courseService'

const COURSE_RECORD_STORAGE_KEY = 'MOTION_COURSE_RECORDS'
const MAX_SINGLE_PAUSE_SECOND = 120
const MAX_TOTAL_PAUSE_SECOND = 300
const CONFIRM_EXPIRE_SECOND = 180
const SEEK_FORWARD_ALLOW_SECOND = 1.5

Page({
  data: {
    camp_id: '',
    activity_id: '',
    project_id: '',
    group_id: '',
    member_id: '',
    camp_name: '',
    fromCamp: 0,

    courseInfo: {},

    videoReady: false,
    videoFinished: false,
    watchValid: true,
    invalidReason: '',

    startedAt: 0,
    endedAt: 0,

    currentTime: 0,
    watchedMaxTime: 0,
    durationSecond: 0,

    lastPauseAt: 0,
    totalPauseSecond: 0,
    singlePauseSecond: 0,
    currentPauseSecond: 0,

    confirmLeftSecond: CONFIRM_EXPIRE_SECOND,

    showConfirmPopup: false,
    showPosterPopup: false,

    statusText: '待开始',
    progressText: '0s / 0s'
  },

  onLoad(options = {}) {
    this.videoCtx = null
    this.confirmTimer = null
    this.pauseWatchTimer = null
    this.invalidHandled = false
    this.pendingHideInvalid = false
    this.ignoreNextHide = false

    this.setData({
      camp_id: String(options.camp_id || options.activity_id || ''),
      activity_id: String(options.activity_id || options.camp_id || ''),
      project_id: String(options.project_id || ''),
      group_id: String(options.group_id || ''),
      member_id: String(options.member_id || ''),
      camp_name: decodeURIComponent(options.camp_name || ''),
      fromCamp: Number(options.fromCamp || 0),
      courseInfo: {
        id: options.id || options.course_id || '',
        course_id: options.course_id || options.id || '',
        course_code: decodeURIComponent(options.course_code || ''),
        title: decodeURIComponent(options.title || options.course_name || ''),
        course_name: decodeURIComponent(options.course_name || options.title || ''),
        duration_minute: Number(options.duration_minute || 0),
        duration_seconds: Number(options.duration_seconds || 0),
        calorie: Number(options.calorie || 0),
        is_required: Number(options.is_required || 0) === 1,
        source_type: decodeURIComponent(options.source_type || ''),
        video_url: decodeURIComponent(options.video_url || '')
      }
    })
  },

  onReady() {
    this.videoCtx = wx.createVideoContext('courseVideo', this)
  },

  onShow() {
    if (this.pendingHideInvalid) {
      this.pendingHideInvalid = false
      wx.showModal({
        title: '提示',
        content: this.data.invalidReason || '已离开播放页，本次打卡作废',
        showCancel: false,
        success: () => {
          this.ignoreNextHide = true
          wx.navigateBack({ delta: 1 })
        }
      })
    }
  },

  onHide() {
    if (this.ignoreNextHide) {
      this.ignoreNextHide = false
      return
    }

    if (this.data.showPosterPopup || this.invalidHandled) return

    if (this.data.startedAt || this.data.showConfirmPopup) {
      this.invalidateRecord('已切后台或离开播放页，本次打卡作废', {
        silent: true,
        deferBackOnShow: true
      })
    }
  },

  onUnload() {
    this.clearConfirmTimer()
    this.clearPauseWatchTimer()
  },

  formatSecond(sec = 0) {
    return `${Math.max(0, Math.floor(sec))}s`
  },

  updateProgressText(currentTime = 0, durationSecond = 0) {
    this.setData({
      progressText: `${this.formatSecond(currentTime)} / ${this.formatSecond(durationSecond)}`
    })
  },

  goBack() {
    if (!this.data.showPosterPopup && !this.invalidHandled && (this.data.startedAt || this.data.showConfirmPopup)) {
      this.invalidateRecord('中途退出，本次打卡作废', {
        navigateBack: true
      })
      return
    }

    this.ignoreNextHide = true
    wx.navigateBack({ delta: 1 })
  },

  handleVideoLoaded(e) {
    const duration = Number((e.detail && e.detail.duration) || 0)

    this.setData({
      videoReady: true,
      durationSecond: duration,
      statusText: this.data.courseInfo.video_url ? '可开始跟练' : '未配置视频'
    })

    this.updateProgressText(0, duration)
  },

  handleVideoPlay() {
    if (!this.data.courseInfo.video_url) {
      wx.showToast({
        title: '未配置视频地址',
        icon: 'none'
      })
      return
    }

    if (!this.data.watchValid || this.data.showConfirmPopup) {
      this.safePauseVideo()
      return
    }

    const now = Date.now()

    if (!this.data.startedAt) {
      this.setData({ startedAt: now })
    }

    if (this.data.lastPauseAt) {
      const singlePauseSecond = Math.floor((now - this.data.lastPauseAt) / 1000)
      const totalPauseSecond = this.data.totalPauseSecond + singlePauseSecond

      if (singlePauseSecond > MAX_SINGLE_PAUSE_SECOND) {
        this.invalidateRecord('单次暂停超过2分钟，本次打卡作废', {
          navigateBack: true
        })
        return
      }

      if (totalPauseSecond > MAX_TOTAL_PAUSE_SECOND) {
        this.invalidateRecord('累计暂停超过5分钟，本次打卡作废', {
          navigateBack: true
        })
        return
      }

      this.setData({
        singlePauseSecond,
        totalPauseSecond,
        currentPauseSecond: 0,
        lastPauseAt: 0
      })
    }

    this.clearPauseWatchTimer()

    this.setData({
      statusText: '跟练中'
    })
  },

  handleVideoPause() {
    if (
      !this.data.startedAt ||
      this.data.videoFinished ||
      this.data.showConfirmPopup ||
      !this.data.watchValid ||
      this.invalidHandled
    ) {
      return
    }

    const now = Date.now()

    this.setData({
      lastPauseAt: now,
      currentPauseSecond: 0,
      statusText: '已暂停'
    })

    this.startPauseWatchTimer()
  },

  handleTimeUpdate(e) {
    if (!this.data.watchValid || this.invalidHandled) return

    const currentTime = Number((e.detail && e.detail.currentTime) || 0)
    const lastWatchedMaxTime = Number(this.data.watchedMaxTime || 0)

    if (currentTime - lastWatchedMaxTime > SEEK_FORWARD_ALLOW_SECOND) {
      wx.showToast({
        title: '不可跳播未播放内容',
        icon: 'none'
      })

      setTimeout(() => {
        if (this.videoCtx) {
          this.videoCtx.seek(lastWatchedMaxTime)
        }
      }, 60)

      this.setData({
        currentTime: lastWatchedMaxTime
      })
      this.updateProgressText(lastWatchedMaxTime, this.data.durationSecond)
      return
    }

    const watchedMaxTime = Math.max(lastWatchedMaxTime, currentTime)

    this.setData({
      currentTime,
      watchedMaxTime
    })

    this.updateProgressText(currentTime, this.data.durationSecond)
  },

  handleSeeking(e) {
    if (!this.data.watchValid || this.invalidHandled) return

    const seekTime = Number((e.detail && e.detail.currentTime) || 0)
    const allowMax = Number(this.data.watchedMaxTime || 0) + 1

    if (seekTime > allowMax) {
      wx.showToast({
        title: '不可跳播未播放内容',
        icon: 'none'
      })

      setTimeout(() => {
        if (this.videoCtx) {
          this.videoCtx.seek(this.data.watchedMaxTime)
        }
      }, 80)
    }
  },

  handleEnded() {
    if (!this.data.watchValid || this.invalidHandled) return

    this.clearPauseWatchTimer()
    this.clearConfirmTimer()

    const durationSecond = Number(this.data.durationSecond || 0)
    const watchedMaxTime = Number(this.data.watchedMaxTime || 0)

    if (durationSecond > 0 && watchedMaxTime + 1 < durationSecond) {
      this.invalidateRecord('存在未完成播放内容，本次打卡作废', {
        navigateBack: true
      })
      return
    }

    this.setData({
      videoFinished: true,
      endedAt: Date.now(),
      currentTime: durationSecond,
      watchedMaxTime: Math.max(watchedMaxTime, durationSecond),
      showConfirmPopup: true,
      confirmLeftSecond: CONFIRM_EXPIRE_SECOND,
      statusText: '播放完成，待确认'
    })

    this.updateProgressText(durationSecond, durationSecond)
    this.startConfirmTimer()
  },

  handleError() {
    this.invalidateRecord('视频播放异常，本次打卡作废', {
      navigateBack: true
    })
  },

  startPauseWatchTimer() {
    this.clearPauseWatchTimer()

    this.pauseWatchTimer = setInterval(() => {
      if (!this.data.lastPauseAt || !this.data.watchValid || this.invalidHandled) {
        this.clearPauseWatchTimer()
        return
      }

      const currentPauseSecond = Math.floor((Date.now() - this.data.lastPauseAt) / 1000)
      const totalPauseSecond = Number(this.data.totalPauseSecond || 0) + currentPauseSecond

      this.setData({ currentPauseSecond })

      if (currentPauseSecond > MAX_SINGLE_PAUSE_SECOND) {
        this.invalidateRecord('单次暂停超过2分钟，本次打卡作废', {
          navigateBack: true
        })
        return
      }

      if (totalPauseSecond > MAX_TOTAL_PAUSE_SECOND) {
        this.invalidateRecord('累计暂停超过5分钟，本次打卡作废', {
          navigateBack: true
        })
      }
    }, 1000)
  },

  clearPauseWatchTimer() {
    if (this.pauseWatchTimer) {
      clearInterval(this.pauseWatchTimer)
      this.pauseWatchTimer = null
    }
  },

  startConfirmTimer() {
    this.clearConfirmTimer()

    this.confirmTimer = setInterval(() => {
      const next = this.data.confirmLeftSecond - 1

      if (next <= 0) {
        this.clearConfirmTimer()
        this.invalidateRecord('播放完成后超时未确认，本次打卡作废', {
          navigateBack: true
        })
        return
      }

      this.setData({ confirmLeftSecond: next })
    }, 1000)
  },

  clearConfirmTimer() {
    if (this.confirmTimer) {
      clearInterval(this.confirmTimer)
      this.confirmTimer = null
    }
  },

  safePauseVideo() {
    if (this.videoCtx) {
      try {
        this.videoCtx.pause()
      } catch (err) {}
    }
  },

  invalidateRecord(message = '本次打卡作废', options = {}) {
    if (this.invalidHandled) return
    this.invalidHandled = true

    const {
      silent = false,
      navigateBack = false,
      deferBackOnShow = false
    } = options

    this.clearConfirmTimer()
    this.clearPauseWatchTimer()
    this.safePauseVideo()

    this.setData({
      watchValid: false,
      invalidReason: message,
      showConfirmPopup: false,
      lastPauseAt: 0,
      currentPauseSecond: 0,
      statusText: '打卡作废'
    })

    if (deferBackOnShow) {
      this.pendingHideInvalid = true
      return
    }

    if (silent) {
      return
    }

    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      success: () => {
        if (navigateBack) {
          this.ignoreNextHide = true
          wx.navigateBack({ delta: 1 })
        }
      }
    })
  },

  getStorageList() {
    try {
      const list = wx.getStorageSync(COURSE_RECORD_STORAGE_KEY)
      return Array.isArray(list) ? list : []
    } catch (err) {
      return []
    }
  },

  setStorageList(list = []) {
    wx.setStorageSync(COURSE_RECORD_STORAGE_KEY, list)
  },

  async confirmFinish() {
    if (!this.data.watchValid || this.invalidHandled) return

    this.clearConfirmTimer()
    this.clearPauseWatchTimer()

    const {
      courseInfo,
      camp_id,
      activity_id,
      project_id,
      group_id,
      member_id,
      camp_name,
      fromCamp
    } = this.data
    const now = Date.now()
    const today = moment().format('YYYY-MM-DD')
    const storageList = this.getStorageList()
    const totalPauseSecond = Number(this.data.totalPauseSecond || 0) + Number(this.data.currentPauseSecond || 0)
    const effectiveSeconds = Math.floor(this.data.watchedMaxTime || 0)
    const durationSeconds = Number(this.data.durationSecond || courseInfo.duration_seconds || courseInfo.duration_minute * 60 || 0)
    const completionRate = durationSeconds > 0 ? Number((effectiveSeconds / durationSeconds).toFixed(4)) : 0
    const confirmDeadlineAt = this.data.endedAt ? this.data.endedAt + CONFIRM_EXPIRE_SECOND * 1000 : 0

    const record = {
      id: `course_${courseInfo.id}_${now}`,
      date: today,
      camp_id,
      activity_id,
      project_id,
      group_id,
      member_id,
      camp_name,
      courseKey: courseInfo.id,
      course_id: Number(courseInfo.course_id || courseInfo.id || 0),
      course_code: courseInfo.course_code || '',
      title: courseInfo.title,
      source: '课程跟练',
      calorie: Number(courseInfo.calorie || 0),
      icon: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      type: 'course_follow',
      duration_text: `${courseInfo.duration_minute || 0}分钟`,
      start_play_at: this.formatDateTime(this.data.startedAt),
      end_play_at: this.formatDateTime(this.data.endedAt || Date.now()),
      total_pause_second: totalPauseSecond,
      watched_second: effectiveSeconds
    }

    storageList.unshift(record)
    this.setStorageList(storageList)

    if (fromCamp && activity_id) {
      const submitRes = await courseService.submitCampCourseCheckin({
        activity_id: String(activity_id || '1'),
        course_id: Number(courseInfo.course_id || courseInfo.id || 0),
        course_name_snapshot: courseInfo.course_name || courseInfo.title || '',
        play_started_at: this.formatDateTime(this.data.startedAt),
        play_ended_at: this.formatDateTime(this.data.endedAt || Date.now()),
        effective_seconds: effectiveSeconds,
        completion_rate: completionRate,
        confirm_deadline_at: this.formatDateTime(confirmDeadlineAt),
        confirmed_at: moment(now).format('YYYY-MM-DD'),
        validation_result: 'valid',
        validation_reason: ''
      })
    
      if (Number(submitRes.code) !== 200) {
        wx.showToast({
          title: submitRes.message || '后端打卡提交失败',
          icon: 'none'
        })
        return
      }
    }

    this.setData({
      showConfirmPopup: false,
      showPosterPopup: true,
      totalPauseSecond,
      currentPauseSecond: 0,
      lastPauseAt: 0,
      statusText: '打卡成功'
    })
  },

  formatDateTime(ts) {
    if (!ts) return ''
    return moment(ts).format('YYYY-MM-DD HH:mm:ss')
  },

  closePoster() {
    this.setData({
      showPosterPopup: false
    })

    setTimeout(() => {
      this.ignoreNextHide = true
      wx.navigateBack({ delta: 2 })
    }, 100)
  },

  mockShare() {
    wx.showToast({
      title: '分享能力待接入',
      icon: 'none'
    })
  }
})