function safeParseJson(value, fallback = {}) {
  if (!value) return fallback
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return fallback
  try {
    return JSON.parse(value)
  } catch (err) {
    return fallback
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function pickFirst(...values) {
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i]
    if (value === 0 || value === false) return value
    if (value !== undefined && value !== null && value !== '') return value
  }
  return ''
}

function readVideoUrl(mediaJson) {
  const media = safeParseJson(mediaJson, mediaJson || {})
  if (typeof media === 'string') return media
  if (Array.isArray(media)) {
    const first = media[0] || {}
    return pickFirst(first.url, first.play_url, first.playUrl, '')
  }
  return pickFirst(
    media.url,
    media.play_url,
    media.playUrl,
    media.src,
    media.hd_url,
    media.origin_url,
    ''
  )
}

function normalizeCourseCategory(courseType = '') {
  const raw = String(courseType || '').toLowerCase()
  if (['follow', 'tabata', 'cardio', 'aerobic', 'walk', 'run'].includes(raw)) return 'aerobic'
  if (['strength', 'muscle', 'power'].includes(raw)) return 'strength'
  if (['stretch', 'yoga', 'relax', 'mobility'].includes(raw)) return 'stretch'
  return 'recommend'
}

function normalizeDifficultyLabel(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return 'L1级别'
  if (/^l\d/i.test(raw)) return `${raw.toUpperCase()}级别`
  return raw
}

function normalizeCourseItem(rawItem = {}, extra = {}) {
  const course = rawItem.course || rawItem.video_course || rawItem.movewell_video_course || rawItem
  const relation = rawItem.group_course || rawItem.camp_course_group || rawItem.relation || {}
  const equipment = safeParseJson(course.equipment_json, [])
  const tags = safeParseJson(course.tag_json, [])
  const durationSeconds = Number(pickFirst(course.duration_seconds, rawItem.duration_seconds, rawItem.durationSecond, 0)) || 0
  const category = pickFirst(rawItem.category, normalizeCourseCategory(course.course_type))
  const subTitle = pickFirst(rawItem.sub_title, course.course_type, Array.isArray(tags) ? tags[0] : '', '')

  return {
    ...rawItem,
    ...extra,
    course,
    relation,
    id: String(pickFirst(rawItem.id, rawItem.course_id, course.course_id, course.id, '')),
    course_id: pickFirst(rawItem.course_id, course.course_id, rawItem.id, course.id, ''),
    course_code: pickFirst(rawItem.course_code, course.course_code, ''),
    title: pickFirst(rawItem.title, rawItem.course_name, course.course_name, course.title, '未命名课程'),
    course_name: pickFirst(rawItem.course_name, course.course_name, rawItem.title, course.title, '未命名课程'),
    sub_title: subTitle,
    level_text: normalizeDifficultyLabel(pickFirst(rawItem.level_text, course.difficulty_level, 'L1')),
    duration_minute: Number(pickFirst(rawItem.duration_minute, Math.ceil(durationSeconds / 60), 0)) || 0,
    duration_seconds: durationSeconds,
    calorie: Number(pickFirst(rawItem.calorie, rawItem.estimate_calorie, 0)) || 0,
    category,
    cover: pickFirst(rawItem.cover, rawItem.cover_url, course.cover_url, ''),
    cover_url: pickFirst(rawItem.cover_url, course.cover_url, rawItem.cover, ''),
    intro: pickFirst(rawItem.intro, course.intro_text, rawItem.intro_text, ''),
    intro_text: pickFirst(course.intro_text, rawItem.intro_text, rawItem.intro, ''),
    train_part: pickFirst(rawItem.train_part, Array.isArray(equipment) ? equipment.join(' / ') : '', ''),
    series_title: pickFirst(rawItem.series_title, rawItem.group_name, relation.group_name, ''),
    video_url: pickFirst(rawItem.video_url, readVideoUrl(course.media_json), readVideoUrl(rawItem.media_json), ''),
    media_json: pickFirst(course.media_json, rawItem.media_json, {}),
    group_id: pickFirst(rawItem.group_id, relation.group_id, ''),
    sort_no: Number(pickFirst(rawItem.sort_no, relation.sort_no, 0)) || 0,
    is_required: Boolean(pickFirst(rawItem.is_required, relation.is_required, false)),
    source_type: pickFirst(rawItem.source_type, relation.source_type, ''),
    equipment_json: equipment,
    tag_json: tags,
    status: pickFirst(rawItem.status, course.status, 'published')
  }
}

function flattenCourseResponse(data = {}) {
  if (Array.isArray(data)) {
    return data
  }

  const grouped = []
  const groups = toArray(pickFirst(data.groups, data.group_list, data.course_groups, []))
  groups.forEach(group => {
    const courseList = toArray(pickFirst(group.courses, group.course_list, group.list, []))
    courseList.forEach(courseItem => {
      grouped.push({
        ...courseItem,
        group_id: pickFirst(courseItem.group_id, group.group_id, ''),
        group_name: pickFirst(courseItem.group_name, group.group_name, ''),
        sort_no: pickFirst(courseItem.sort_no, group.sort_no, 0)
      })
    })
  })

  if (grouped.length) return grouped

  return toArray(
    pickFirst(
      data.list,
      data.records,
      data.rows,
      data.course_list,
      data.courses,
      data.items,
      []
    )
  )
}

function normalizeCourseList(data = {}, extra = {}) {
  const list = flattenCourseResponse(data)
  return list
    .map(item => normalizeCourseItem(item, extra))
    .sort((a, b) => {
      const sortA = Number(a.sort_no || 0)
      const sortB = Number(b.sort_no || 0)
      if (sortA !== sortB) return sortA - sortB
      return String(a.title || '').localeCompare(String(b.title || ''))
    })
}

function buildCourseTabMap(list = []) {
  const map = {
    recommend: [],
    aerobic: [],
    strength: [],
    stretch: []
  }

  list.forEach(item => {
    const key = map[item.category] ? item.category : 'recommend'
    map[key].push(item)
  })

  if (!map.recommend.length) {
    map.recommend = [
      ...(map.aerobic || []).slice(0, 2),
      ...(map.strength || []).slice(0, 1),
      ...(map.stretch || []).slice(0, 1)
    ].slice(0, 4)
  }

  return map
}

module.exports = {
  safeParseJson,
  normalizeCourseItem,
  normalizeCourseList,
  buildCourseTabMap
}
