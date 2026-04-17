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
    const durationSeconds = Number(options.duration_seconds || 0)
    const durationMinute = Number(options.duration_minute || Math.floor(durationSeconds / 60) || 0)

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
        courseId: Number(options.course_id || options.id || 0),
        course_id: Number(options.course_id || options.id || 0),
        courseCode: decodeURIComponent(options.course_code || ''),
        course_code: decodeURIComponent(options.course_code || ''),
        title: decodeURIComponent(options.title || options.course_name || ''),
        courseName: decodeURIComponent(options.course_name || options.title || ''),
        course_name: decodeURIComponent(options.course_name || options.title || ''),
        courseType: decodeURIComponent(options.course_type || ''),
        course_type: decodeURIComponent(options.course_type || ''),
        sub_title: decodeURIComponent(options.sub_title || ''),
        level_text: decodeURIComponent(options.level_text || options.difficulty_label || ''),
        difficultyLevel: decodeURIComponent(options.difficulty_level || ''),
        difficultyLabel: decodeURIComponent(options.difficulty_label || options.level_text || ''),
        durationMinute,
        duration_minute: durationMinute,
        durationSeconds,
        duration_seconds: durationSeconds,
        calorie: Number(options.calorie || 0),
        cover: decodeURIComponent(options.cover || options.cover_url || ''),
        coverUrl: decodeURIComponent(options.cover_url || options.cover || ''),
        cover_url: decodeURIComponent(options.cover_url || options.cover || ''),
        intro: decodeURIComponent(options.intro || options.intro_text || ''),
        introText: decodeURIComponent(options.intro_text || options.intro || ''),
        intro_text: decodeURIComponent(options.intro_text || options.intro || ''),
        train_part: decodeURIComponent(options.train_part || ''),
        series_title: decodeURIComponent(options.series_title || ''),
        videoUrl: decodeURIComponent(options.video_url || ''),
        video_url: decodeURIComponent(options.video_url || ''),
        isRequired: Number(options.is_required || 0) === 1,
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
      `course_id=${encodeURIComponent(courseInfo.course_id || courseInfo.courseId || '')}`,
      `course_code=${encodeURIComponent(courseInfo.course_code || '')}`,
      `title=${encodeURIComponent(courseInfo.title || '')}`,
      `course_name=${encodeURIComponent(courseInfo.course_name || courseInfo.title || '')}`,
      `course_type=${encodeURIComponent(courseInfo.course_type || '')}`,
      `sub_title=${encodeURIComponent(courseInfo.sub_title || '')}`,
      `level_text=${encodeURIComponent(courseInfo.level_text || '')}`,
      `difficulty_level=${encodeURIComponent(courseInfo.difficultyLevel || '')}`,
      `difficulty_label=${encodeURIComponent(courseInfo.difficultyLabel || courseInfo.level_text || '')}`,
      `duration_minute=${encodeURIComponent(courseInfo.duration_minute || 0)}`,
      `duration_seconds=${encodeURIComponent(courseInfo.duration_seconds || 0)}`,
      `calorie=${encodeURIComponent(courseInfo.calorie || 0)}`,
      `cover=${encodeURIComponent(courseInfo.cover || '')}`,
      `cover_url=${encodeURIComponent(courseInfo.cover_url || courseInfo.cover || '')}`,
      `intro=${encodeURIComponent(courseInfo.intro || '')}`,
      `intro_text=${encodeURIComponent(courseInfo.intro_text || courseInfo.intro || '')}`,
      `train_part=${encodeURIComponent(courseInfo.train_part || '')}`,
      `series_title=${encodeURIComponent(courseInfo.series_title || '')}`,
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