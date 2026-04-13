Page({
  data: {
    courseInfo: {},
    camp_id: '',
    camp_name: '',
    fromCamp: 0
  },

  onLoad(options = {}) {
    this.setData({
      camp_id: String(options.camp_id || ''),
      camp_name: decodeURIComponent(options.camp_name || ''),
      fromCamp: Number(options.fromCamp || 0),
      courseInfo: {
        id: options.id || '',
        title: decodeURIComponent(options.title || ''),
        sub_title: decodeURIComponent(options.sub_title || ''),
        level_text: decodeURIComponent(options.level_text || ''),
        duration_minute: Number(options.duration_minute || 0),
        calorie: Number(options.calorie || 0),
        cover: decodeURIComponent(options.cover || ''),
        intro: decodeURIComponent(options.intro || ''),
        train_part: decodeURIComponent(options.train_part || ''),
        series_title: decodeURIComponent(options.series_title || ''),
        video_url: decodeURIComponent(options.video_url || '')
      }
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  startTraining() {
    const { courseInfo, camp_id, camp_name, fromCamp } = this.data
    const query = [
      `id=${encodeURIComponent(courseInfo.id || '')}`,
      `title=${encodeURIComponent(courseInfo.title || '')}`,
      `duration_minute=${encodeURIComponent(courseInfo.duration_minute || 0)}`,
      `calorie=${encodeURIComponent(courseInfo.calorie || 0)}`,
      `video_url=${encodeURIComponent(courseInfo.video_url || '')}`
    ]

    if (camp_id) query.push(`camp_id=${encodeURIComponent(camp_id)}`)
    if (camp_name) query.push(`camp_name=${encodeURIComponent(camp_name)}`)
    if (fromCamp) query.push('fromCamp=1')

    wx.navigateTo({
      url: `/pages/motion/course/player?${query.join('&')}`
    })
  }
})