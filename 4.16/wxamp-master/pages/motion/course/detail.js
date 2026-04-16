Page({
  data: {
    courseInfo: {},
    camp_id: '',
    activity_id: '',
    project_id: '',
    group_id: '',
    member_id: '',
    camp_name: '',
    fromCamp: 0
  },

  onLoad(options = {}) {
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
        sub_title: decodeURIComponent(options.sub_title || ''),
        level_text: decodeURIComponent(options.level_text || ''),
        duration_minute: Number(options.duration_minute || 0),
        duration_seconds: Number(options.duration_seconds || 0),
        calorie: Number(options.calorie || 0),
        cover: decodeURIComponent(options.cover || options.cover_url || ''),
        cover_url: decodeURIComponent(options.cover_url || options.cover || ''),
        intro: decodeURIComponent(options.intro || options.intro_text || ''),
        intro_text: decodeURIComponent(options.intro_text || options.intro || ''),
        train_part: decodeURIComponent(options.train_part || ''),
        series_title: decodeURIComponent(options.series_title || ''),
        video_url: decodeURIComponent(options.video_url || ''),
        is_required: Number(options.is_required || 0) === 1,
        source_type: decodeURIComponent(options.source_type || '')
      }
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  startTraining() {
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

    const query = [
      `id=${encodeURIComponent(courseInfo.id || '')}`,
      `course_id=${encodeURIComponent(courseInfo.course_id || courseInfo.id || '')}`,
      `course_code=${encodeURIComponent(courseInfo.course_code || '')}`,
      `title=${encodeURIComponent(courseInfo.title || '')}`,
      `course_name=${encodeURIComponent(courseInfo.course_name || courseInfo.title || '')}`,
      `duration_minute=${encodeURIComponent(courseInfo.duration_minute || 0)}`,
      `duration_seconds=${encodeURIComponent(courseInfo.duration_seconds || 0)}`,
      `calorie=${encodeURIComponent(courseInfo.calorie || 0)}`,
      `video_url=${encodeURIComponent(courseInfo.video_url || '')}`,
      `group_id=${encodeURIComponent(group_id || '')}`,
      `project_id=${encodeURIComponent(project_id || '')}`,
      `member_id=${encodeURIComponent(member_id || '')}`,
      `is_required=${encodeURIComponent(courseInfo.is_required ? 1 : 0)}`,
      `source_type=${encodeURIComponent(courseInfo.source_type || '')}`
    ]

    if (camp_id) query.push(`camp_id=${encodeURIComponent(camp_id)}`)
    if (activity_id) query.push(`activity_id=${encodeURIComponent(activity_id)}`)
    if (camp_name) query.push(`camp_name=${encodeURIComponent(camp_name)}`)
    if (fromCamp) query.push('fromCamp=1')

    wx.navigateTo({
      url: `/pages/motion/course/player?${query.join('&')}`
    })
  }
})
