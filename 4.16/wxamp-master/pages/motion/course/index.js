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
    courseDataMap: COURSE_DATA,
    useBackendData: false
  },

  onLoad(options = {}) {
    this.setData({
      camp_id: String(options.camp_id || options.activity_id || ''),
      activity_id: String(options.activity_id || options.camp_id || ''),
      project_id: String(options.project_id || ''),
      group_id: String(options.group_id || ''),
      member_id: String(options.member_id || ''),
      camp_name: decodeURIComponent(options.camp_name || ''),
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

    if (Number(res.code) !== 200 || !Array.isArray(res.data) || !res.data.length) {
      return false
    }

    const courseDataMap = buildCourseTabMap(res.data)

    this.setData({
      courseDataMap,
      useBackendData: true
    })

    this.refreshList()
    return true
  },

  applyLocalCourseData() {
    this.setData({
      courseDataMap: COURSE_DATA,
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
    const sourceMap = this.data.courseDataMap || COURSE_DATA
    const source = activeTab === 'recommend'
      ? [
          ...(sourceMap.recommend || []),
          ...(sourceMap.aerobic || [])
        ]
      : (sourceMap[activeTab] || [])

    return source.map(item => ({
      ...item,
      brief: item.intro || `${item.title}，课程简介待后端补充`
    }))
  },

  refreshList() {
    const { activeTab, courseDataMap } = this.data
    const sourceMap = courseDataMap || COURSE_DATA
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
    const list = this.getStorageList()
    const exists = list.some(item => String(item.id) === String(course.id))

    if (exists) {
      wx.showToast({
        title: '已加入我的课程',
        icon: 'none'
      })
      return
    }

    list.unshift(course)
    this.setStorageList(list)
    this.refreshMyCourseCount()

    wx.showToast({
      title: '已加入我的课程',
      icon: 'success'
    })
  },

  handleAddMyCourse(e) {
    const item = e.currentTarget.dataset.item || {}
    if (!item.id) return
    this.addToMyCourses(item)
  },

  goDetail(e) {
    const item = e.currentTarget.dataset.item || {}
    this.goDetailByCourse(item)
  },

  goDetailByCourse(item = {}) {
    if (!item.id) return

    const query = [
      `id=${encodeURIComponent(item.id)}`,
      `course_id=${encodeURIComponent(item.course_id || item.id || '')}`,
      `course_code=${encodeURIComponent(item.course_code || '')}`,
      `title=${encodeURIComponent(item.title || '')}`,
      `course_name=${encodeURIComponent(item.course_name || item.title || '')}`,
      `sub_title=${encodeURIComponent(item.sub_title || '')}`,
      `level_text=${encodeURIComponent(item.level_text || '')}`,
      `duration_minute=${encodeURIComponent(item.duration_minute || 0)}`,
      `duration_seconds=${encodeURIComponent(item.duration_seconds || 0)}`,
      `calorie=${encodeURIComponent(item.calorie || 0)}`,
      `cover=${encodeURIComponent(item.cover || '')}`,
      `cover_url=${encodeURIComponent(item.cover_url || item.cover || '')}`,
      `intro=${encodeURIComponent(item.intro || '')}`,
      `intro_text=${encodeURIComponent(item.intro_text || item.intro || '')}`,
      `train_part=${encodeURIComponent(item.train_part || '')}`,
      `series_title=${encodeURIComponent(item.series_title || '')}`,
      `video_url=${encodeURIComponent(item.video_url || '')}`,
      `group_id=${encodeURIComponent(item.group_id || this.data.group_id || '')}`,
      `is_required=${encodeURIComponent(item.is_required ? 1 : 0)}`,
      `source_type=${encodeURIComponent(item.source_type || '')}`
    ]

    if (this.data.camp_id) query.push(`camp_id=${encodeURIComponent(this.data.camp_id)}`)
    if (this.data.activity_id) query.push(`activity_id=${encodeURIComponent(this.data.activity_id)}`)
    if (this.data.project_id) query.push(`project_id=${encodeURIComponent(this.data.project_id)}`)
    if (this.data.group_id) query.push(`group_id=${encodeURIComponent(this.data.group_id)}`)
    if (this.data.member_id) query.push(`member_id=${encodeURIComponent(this.data.member_id)}`)
    if (this.data.camp_name) query.push(`camp_name=${encodeURIComponent(this.data.camp_name)}`)
    if (this.data.fromCamp) query.push('fromCamp=1')

    wx.navigateTo({
      url: `/pages/motion/course/detail?${query.join('&')}`
    })
  }
})
