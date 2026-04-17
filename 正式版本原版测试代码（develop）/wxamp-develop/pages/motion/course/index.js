import moment from '../../../utils/moment'
//import { CAMP_USE_MOCK } from '../../../utils/mock'
import courseService from '../../../services/courseService'
import { buildCourseTabMap } from '../../../utils/course'

const MY_COURSE_STORAGE_KEY = 'MOTION_MY_COURSES'

const COURSE_DATA = {
  recommend: [
    {
      id: 'c101',
      title: '3分钟工位运动视频',
      sub_title: '轻松工间操',
      level_text: 'L1级别',
      duration_minute: 3,
      calorie: 22,
      category: 'recommend',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '适合办公室场景的轻量训练，帮助快速激活肩颈与下肢。',
      train_part: '工位空间',
      series_title: '工间操5天健康拉伸计划',
      video_url: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
    },
    {
      id: 'c102',
      title: '8分钟晨间燃脂课',
      sub_title: '唤醒活力',
      level_text: 'L1级别',
      duration_minute: 8,
      calorie: 58,
      category: 'recommend',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '适合早晨进行的有氧训练，帮助提升当天活跃状态。',
      train_part: '全身',
      series_title: '晨间轻燃计划',
      video_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    }
  ],
  aerobic: [
    {
      id: 'c201',
      title: '15分钟低冲击有氧',
      sub_title: '轻松燃脂',
      level_text: 'L1级别',
      duration_minute: 15,
      calorie: 98,
      category: 'aerobic',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '低门槛有氧训练，适合日常坚持打卡。',
      train_part: '全身',
      series_title: '燃脂习惯养成营',
      video_url: 'http://172.18.192.1:8000/demo1.mp4'
    },
    {
      id: 'c202',
      title: '20分钟快走节奏课',
      sub_title: '节奏训练',
      level_text: 'L1级别',
      duration_minute: 20,
      calorie: 126,
      category: 'aerobic',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '跟随节奏完成有氧训练，提升心肺耐力。',
      train_part: '下肢',
      series_title: '活力晨跑打卡营',
      video_url: 'http://172.18.192.1:8000/demo2.mp4'
    }
  ],
  strength: [
    {
      id: 'c301',
      title: '12分钟核心激活',
      sub_title: '力量训练',
      level_text: 'L2级别',
      duration_minute: 12,
      calorie: 86,
      category: 'strength',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '强化核心稳定，改善体态控制。',
      train_part: '核心',
      series_title: '夏季塑形训练营',
      video_url: 'http://172.18.192.1:8000/demo3.mp4'
    },
    {
      id: 'c302',
      title: '18分钟下肢力量课',
      sub_title: '耐力提升',
      level_text: 'L2级别',
      duration_minute: 18,
      calorie: 132,
      category: 'strength',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '提高腿部力量与稳定性。',
      train_part: '下肢',
      series_title: '力量基础计划',
      video_url: 'https://mvcdn.moveclub.cn/2026gwpx/AED_xinzangchuchanyi_yuCPR_jishu.mp4'
    }
  ],
  stretch: [
    {
      id: 'c401',
      title: '10分钟肩颈拉伸',
      sub_title: '放松恢复',
      level_text: 'L1级别',
      duration_minute: 10,
      calorie: 46,
      category: 'stretch',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '针对久坐人群设计的肩颈拉伸课程。',
      train_part: '肩颈',
      series_title: '工位舒展计划',
      video_url: 'https://mvcdn.moveclub.cn/2026gwpx/jiushengyuan_fujiu_jishu.mp4'
    },
    {
      id: 'c402',
      title: '12分钟睡前放松课',
      sub_title: '拉伸恢复',
      level_text: 'L1级别',
      duration_minute: 12,
      calorie: 55,
      category: 'stretch',
      cover: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
      intro: '帮助舒缓肌肉紧张，提升身体放松感。',
      train_part: '全身',
      series_title: '夜间恢复计划',
      video_url: 'https://mvcdn.moveclub.cn/2026gwpx/jiushengzhang_gongzuozhize_yuyiwaishijian_anlifenxi.mp4'
    }
  ]
}

Page({
  data: {
    camp_id: '',
    activity_id: '',
    project_id: '',
    group_id: '',
    member_id: '',
    camp_name: '',
    fromCamp: 0,
    today: moment().format('YYYY-MM-DD'),

    tabList: [
      { key: 'recommend', label: '推荐' },
      { key: 'aerobic', label: '有氧' },
      { key: 'strength', label: '力量' },
      { key: 'stretch', label: '拉伸' }
    ],
    activeTab: 'recommend',

    featuredList: [],
    seriesList: [],
    myCourseCount: 0,
    courseDataMap: {},
    useBackendData: false
  },

  onLoad(options = {}) {
    const activityId = options.activity_id || options.camp_id || ''
    const campName = decodeURIComponent(options.camp_name || '')

    this.setData({
      camp_id: String(activityId || ''),
      activity_id: String(activityId || ''),
      project_id: String(options.project_id || ''),
      group_id: String(options.group_id || ''),
      member_id: String(options.member_id || ''),
      camp_name: campName,
      fromCamp: Number(options.fromCamp || 0)
    })

    this.refreshPageData()
  },

  onShow() {
    this.refreshMyCourseCount()
  },

  getStorageList() {
    try {
      const list = wx.getStorageSync(MY_COURSE_STORAGE_KEY)
      return Array.isArray(list) ? list : []
    } catch (err) {
      return []
    }
  },

  setStorageList(list = []) {
    wx.setStorageSync(MY_COURSE_STORAGE_KEY, list)
  },

  normalizeLocalCourseItem(item = {}) {
    const durationSeconds = Number(item.durationSeconds || item.duration_seconds || ((item.duration_minute || 0) * 60) || 0)
    const durationMinute = Number(item.duration_minute || Math.floor(durationSeconds / 60) || 0)
    const courseId = Number(item.courseId || item.course_id || item.id || 0)

    return {
      ...item,
      id: item.id || String(courseId || ''),
      courseId,
      course_id: Number(item.course_id || courseId || 0),
      courseCode: item.courseCode || item.course_code || '',
      course_code: item.course_code || item.courseCode || '',
      courseName: item.courseName || item.course_name || item.title || '',
      course_name: item.course_name || item.courseName || item.title || '',
      title: item.title || item.course_name || item.courseName || '',
      courseType: item.courseType || item.course_type || item.category || '',
      course_type: item.course_type || item.courseType || item.category || '',
      category: item.category || item.course_type || item.courseType || 'recommend',
      durationSeconds,
      duration_seconds: durationSeconds,
      duration_minute: durationMinute,
      difficultyLevel: item.difficultyLevel || item.difficulty_level || '',
      difficulty_level: item.difficulty_level || item.difficultyLevel || '',
      difficultyLabel: item.difficultyLabel || item.level_text || '',
      level_text: item.level_text || item.difficultyLabel || '',
      coverUrl: item.coverUrl || item.cover_url || item.cover || '',
      cover_url: item.cover_url || item.coverUrl || item.cover || '',
      cover: item.cover || item.cover_url || item.coverUrl || '',
      videoUrl: item.videoUrl || item.video_url || item.url || '',
      video_url: item.video_url || item.videoUrl || item.url || '',
      introText: item.introText || item.intro_text || item.intro || item.sub_title || '',
      intro_text: item.intro_text || item.introText || item.intro || item.sub_title || '',
      intro: item.intro || item.intro_text || item.introText || item.sub_title || '',
      sub_title: item.sub_title || '',
      train_part: item.train_part || '',
      series_title: item.series_title || item.courseName || item.course_name || item.title || '',
      calorie: Number(item.calorie || 0),
      tagList: Array.isArray(item.tagList) ? item.tagList : [],
      isRequired: !!item.isRequired || Number(item.is_required || 0) === 1,
      is_required: Number(item.is_required || (item.isRequired ? 1 : 0)),
      source_type: item.source_type || '',
      group_id: item.group_id || this.data.group_id || '',
      project_id: item.project_id || this.data.project_id || '',
      member_id: item.member_id || this.data.member_id || ''
    }
  },

  buildCampQuery(extra = {}) {
    const query = {
      fromCamp: this.data.fromCamp ? 1 : 0,
      camp_id: this.data.camp_id || '',
      activity_id: this.data.activity_id || this.data.camp_id || '',
      project_id: this.data.project_id || '',
      group_id: this.data.group_id || '',
      member_id: this.data.member_id || '',
      camp_name: this.data.camp_name || '',
      ...extra
    }

    return Object.keys(query)
      .filter(key => query[key] !== undefined && query[key] !== null && query[key] !== '')
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&')
  },

  normalizeCourseMap(map = {}) {
    return Object.keys(map).reduce((acc, key) => {
      acc[key] = (map[key] || []).map(item => this.normalizeLocalCourseItem(item))
      return acc
    }, {
      recommend: [],
      aerobic: [],
      strength: [],
      stretch: []
    })
  },

  async refreshPageData() {
    if (this.data.fromCamp && this.data.activity_id) {
      const loaded = await this.loadBackendCourseList()
      if (!loaded) {
        this.applyLocalCourseData()
      }
    } else {
      this.applyLocalCourseData()
    }

    this.refreshMyCourseCount()
  },

  async loadBackendCourseList() {
    const res = await courseService.getCampCourseList({
      page: 1,
      page_size: 10,
      camp_id: this.data.camp_id,
      activity_id: this.data.activity_id,
      project_id: this.data.project_id,
      group_id: this.data.group_id,
      member_id: this.data.member_id
    })

    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data && res.data.list)
        ? res.data.list
        : []

    if (Number(res.code) !== 200 || !list.length) {
      return false
    }

    const courseDataMapRaw = buildCourseTabMap(list)
    const courseDataMap = this.normalizeCourseMap(courseDataMapRaw)

    this.setData({
      courseDataMap,
      useBackendData: true
    })

    this.refreshList()
    return true
  },

  applyLocalCourseData() {
    const normalizedMap = this.normalizeCourseMap(COURSE_DATA)

    this.setData({
      courseDataMap: normalizedMap,
      useBackendData: false
    })
    this.refreshList()
  },

  refreshMyCourseCount() {
    const list = this.getStorageList()
    this.setData({
      myCourseCount: list.length
    })
  },

  buildSeriesList(activeTab) {
    const sourceMap = this.data.courseDataMap || {}
    const source = activeTab === 'recommend'
      ? [
          ...(sourceMap.recommend || []),
          ...(sourceMap.aerobic || [])
        ]
      : (sourceMap[activeTab] || [])

    return source.map(item => ({
      ...item,
      brief: item.introText || item.intro || `${item.courseName || item.title}，课程简介待后端补充`
    }))
  },

  refreshList() {
    const { activeTab, courseDataMap } = this.data
    const sourceMap = courseDataMap || {}
    const featuredList = activeTab === 'recommend'
      ? (sourceMap.recommend || [])
      : (sourceMap[activeTab] || []).slice(0, 2)

    const seriesList = this.buildSeriesList(activeTab)

    this.setData({
      featuredList,
      seriesList
    })
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key || 'recommend'
    if (key === this.data.activeTab) return

    this.setData({
      activeTab: key
    }, () => {
      this.refreshList()
    })
  },

  openMyCourses() {
    const myCourseList = this.getStorageList()
    if (!myCourseList.length) {
      wx.showToast({
        title: '我的课程暂时为空',
        icon: 'none'
      })
      return
    }

    const firstCourse = myCourseList[0]
    this.goDetailByCourse(firstCourse)
  },

  addToMyCourses(course = {}) {
    const normalizedCourse = this.normalizeLocalCourseItem(course)
    const list = this.getStorageList()
    const exists = list.some(item => {
      const a = String(item.courseId || item.course_id || item.id || '')
      const b = String(normalizedCourse.courseId || normalizedCourse.course_id || normalizedCourse.id || '')
      return a && b && a === b
    })

    if (exists) {
      wx.showToast({
        title: '已加入我的课程',
        icon: 'none'
      })
      return
    }

    list.unshift(normalizedCourse)
    this.setStorageList(list)
    this.refreshMyCourseCount()

    wx.showToast({
      title: '已加入我的课程',
      icon: 'success'
    })
  },

  handleAddMyCourse(e) {
    const item = e.currentTarget.dataset.item || {}
    const courseId = item.courseId || item.course_id || item.id || ''
    if (!courseId) return
    this.addToMyCourses(item)
  },

  goDetail(e) {
    const item = e.currentTarget.dataset.item || {}
    this.goDetailByCourse(item)
  },

  goDetailByCourse(item = {}) {
    const course = this.normalizeLocalCourseItem(item)
    const courseId = course.courseId || course.course_id || course.id || ''
    if (!courseId) return

    const query = this.buildCampQuery({
      id: course.id || '',
      course_id: course.course_id || course.courseId || '',
      course_code: course.course_code || '',
      title: course.title || '',
      course_name: course.course_name || course.title || '',
      course_type: course.course_type || course.category || '',
      sub_title: course.sub_title || '',
      level_text: course.level_text || '',
      difficulty_level: course.difficulty_level || '',
      difficulty_label: course.difficultyLabel || course.level_text || '',
      duration_minute: course.duration_minute || 0,
      duration_seconds: course.duration_seconds || 0,
      calorie: course.calorie || 0,
      cover: course.cover || '',
      cover_url: course.cover_url || course.cover || '',
      intro: course.intro || '',
      intro_text: course.intro_text || course.intro || '',
      train_part: course.train_part || '',
      series_title: course.series_title || '',
      video_url: course.video_url || '',
      group_id: course.group_id || this.data.group_id || '',
      is_required: course.is_required ? 1 : 0,
      source_type: course.source_type || ''
    })

    wx.navigateTo({
      url: `/pages/motion/course/detail?${query}`
    })
  }
})