import campService from '../../../services/campService'

Page({
  data: {
    loading: true,

    fromCamp: 0,
    camp_id: '',
    camp_name: '',

    hasActiveCamp: false,
    currentCampList: [],
    activeCampId: '',
    activeCamp: null,
    taskCards: [],

    lockByCamp: false
  },

  onLoad(options = {}) {
    this.setData({
      fromCamp: Number(options.fromCamp || 0),
      camp_id: options.camp_id || '',
      camp_name: decodeURIComponent(options.camp_name || ''),
      lockByCamp: Number(options.fromCamp || 0) === 1 && !!options.camp_id
    })
  },

  onShow() {
    this.loadTaskCards()
  },

  getArray(val) {
    return Array.isArray(val) ? val : []
  },

  getCampId(camp = {}) {
    return String(camp.camp_id || camp.id || '')
  },

  getCampName(camp = {}) {
    return camp.camp_name || camp.name || camp.title || camp.company || ''
  },

  getModuleConfigMap() {
    return {
      step: {
        key: 'step',
        title: '微信步数',
        desc: '同步微信运动步数到每日运动',
        iconText: '步',
        iconClass: 'wechat'
      },
      course: {
        key: 'course',
        title: '课程跟练',
        desc: '完成课程训练后记录到每日运动',
        iconText: '课',
        iconClass: 'course'
      },
      water: {
        key: 'water',
        title: '饮水记录',
        desc: '记录饮水情况并同步到活动任务',
        iconText: '水',
        iconClass: 'water'
      }
    }
  },

  getDefaultModuleKeys() {
    return ['step']
  },

  buildTaskCards(moduleKeys = []) {
    const map = this.getModuleConfigMap()
    return moduleKeys
      .filter(key => !!map[key])
      .map(key => map[key])
  },

  getCampModuleKeys(camp = null) {
    if (camp && Array.isArray(camp.motion_modules) && camp.motion_modules.length) {
      return camp.motion_modules
    }
    return this.getDefaultModuleKeys()
  },

  normalizeCurrentCampList(currentCamps = []) {
    return currentCamps.map(item => ({
      ...item,
      camp_id: this.getCampId(item),
      camp_name: this.getCampName(item),
      motion_modules: Array.isArray(item.motion_modules) ? item.motion_modules : []
    }))
  },

  getActiveCampFromList(currentCampList = []) {
    const { lockByCamp, camp_id, camp_name } = this.data

    if (!currentCampList.length) {
      return null
    }

    if (lockByCamp && camp_id) {
      const matchedByLockId = currentCampList.find(
        item => String(item.camp_id) === String(camp_id)
      )
      if (matchedByLockId) return matchedByLockId
    }

    if (camp_id) {
      const matchedById = currentCampList.find(
        item => String(item.camp_id) === String(camp_id)
      )
      if (matchedById) return matchedById
    }

    if (camp_name) {
      const matchedByName = currentCampList.find(
        item => item.camp_name === camp_name
      )
      if (matchedByName) return matchedByName
    }

    return currentCampList[0]
  },

  async loadTaskCards() {
    this.setData({ loading: true })

    try {
      const res = await campService.getCampSummary({})
      const data = (res && res.data) || {}

      const currentCamps = this.getArray(data.current_camps)
      const currentCampList = this.normalizeCurrentCampList(currentCamps)
      const activeCamp = this.getActiveCampFromList(currentCampList)

      const hasActiveCamp = !!activeCamp
      const activeCampId = activeCamp ? String(activeCamp.camp_id) : ''
      const moduleKeys = hasActiveCamp
        ? this.getCampModuleKeys(activeCamp)
        : this.getDefaultModuleKeys()

      this.setData({
        hasActiveCamp,
        currentCampList,
        activeCampId,
        activeCamp,
        taskCards: this.buildTaskCards(moduleKeys),
        loading: false
      })
    } catch (err) {
      console.log('motion task loadTaskCards error = ', err)

      this.setData({
        hasActiveCamp: false,
        currentCampList: [],
        activeCampId: '',
        activeCamp: null,
        taskCards: this.buildTaskCards(this.getDefaultModuleKeys()),
        loading: false
      })
    }
  },

  handleSwitchCamp(e) {
    const campId = String(e.currentTarget.dataset.campId || '')
    const { currentCampList, activeCampId } = this.data

    if (!campId || campId === activeCampId) return

    const activeCamp = currentCampList.find(
      item => String(item.camp_id) === campId
    )

    if (!activeCamp) return

    const moduleKeys = this.getCampModuleKeys(activeCamp)

    this.setData({
      activeCampId: campId,
      activeCamp,
      taskCards: this.buildTaskCards(moduleKeys)
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  handleCardTap(e) {
    const item = e.currentTarget.dataset.item || {}
    const key = item.key || ''

    if (key === 'step') {
      this.handleWechatSync()
      return
    }

    if (key === 'course') {
      this.handleCourseFollow()
      return
    }

    if (key === 'water') {
      this.handleWaterRecord()
      return
    }
  },

  handleWechatSync() {
    wx.showToast({
      title: '微信运动同步待接入',
      icon: 'none'
    })
  },

  handleCourseFollow() {
    let url = '/pages/motion/course/index'
    const { activeCamp } = this.data

    const query = []
    if (activeCamp && activeCamp.camp_id) {
      query.push(`camp_id=${encodeURIComponent(activeCamp.camp_id)}`)
    }
    if (activeCamp && activeCamp.camp_name) {
      query.push(`camp_name=${encodeURIComponent(activeCamp.camp_name)}`)
    }
    if (query.length) {
      query.push('fromCamp=1')
      url += `?${query.join('&')}`
    }

    wx.navigateTo({ url })
  },

  handleWaterRecord() {
    let url = '/pages/water/index'
    const { activeCamp } = this.data

    const query = []
    if (activeCamp && activeCamp.camp_id) {
      query.push(`camp_id=${encodeURIComponent(activeCamp.camp_id)}`)
    }
    if (activeCamp && activeCamp.camp_name) {
      query.push(`camp_name=${encodeURIComponent(activeCamp.camp_name)}`)
    }
    if (query.length) {
      query.push('fromCamp=1')
      url += `?${query.join('&')}`
    }

    wx.navigateTo({ url })
  }
})