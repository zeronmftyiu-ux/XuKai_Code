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

function normalizeDateText(value) {
  if (!value) return ''
  const text = String(value)
  if (text.includes('T')) return text.split('T')[0]
  if (text.includes(' ')) return text.split(' ')[0]
  return text
}

function normalizeCampStatus(status, item = {}) {
  const numeric = Number(status)
  const raw = String(status === undefined ? '' : status).toLowerCase()

  const startAt = pickFirst(item.activity_start_at, item.start_time, '')
  const endAt = pickFirst(item.activity_end_at, item.end_time, '')
  const now = Date.now()
  const startMs = startAt ? new Date(startAt).getTime() : NaN
  const endMs = endAt ? new Date(endAt).getTime() : NaN

  if (!Number.isNaN(numeric) && raw !== '') {
    if (numeric === 2) return 'ended'

    if (numeric === 1) {
      if (!Number.isNaN(startMs) && now < startMs) return 'upcoming'
      if (!Number.isNaN(endMs) && now > endMs) return 'ended'
      return 'ongoing'
    }
  }

  if (raw === 'ended' || raw === 'offline') return 'ended'
  if (raw === 'ongoing' || raw === 'active') return 'ongoing'
  if (raw === 'upcoming') return 'upcoming'

  return 'upcoming'
}

function formatCampStatusText(status) {
  const map = {
    upcoming: '未开始',
    ongoing: '进行中',
    ended: '已结束'
  }
  return map[status] || '--'
}

function getMotionModules(displayJson = {}, groupDisplayJson = {}) {
  const value =
    displayJson.motion_modules ||
    displayJson.motionModules ||
    groupDisplayJson.motion_modules ||
    groupDisplayJson.motionModules ||
    []

  return Array.isArray(value) ? value : []
}

function normalizeCampItem(rawItem = {}) {
  const activity = rawItem.activity || {}
  const project = rawItem.project || {}
  const group = rawItem.group || {}
  const member = rawItem.member || {}

  const activityId = pickFirst(
    rawItem.activity_id,
    activity.activity_id,
    rawItem.camp_id,
    rawItem.id,
    ''
  )

  const projectId = pickFirst(
    rawItem.project_id,
    activity.project_id,
    project.project_id,
    ''
  )

  const groupId = pickFirst(
    rawItem.group_id,
    group.group_id,
    member.group_id,
    ''
  )

  const memberId = pickFirst(
    rawItem.member_id,
    member.member_id,
    ''
  )

  const activityName = pickFirst(
    rawItem.activity_name,
    activity.activity_name,
    rawItem.camp_name,
    rawItem.name,
    rawItem.title,
    ''
  )

  const startAt = pickFirst(
    rawItem.activity_start_at,
    activity.activity_start_at,
    rawItem.start_time,
    ''
  )

  const endAt = pickFirst(
    rawItem.activity_end_at,
    activity.activity_end_at,
    rawItem.end_time,
    ''
  )

  const activityDisplayJson = safeParseJson(
    pickFirst(rawItem.display_json, activity.display_json),
    {}
  )

  const projectDisplayJson = safeParseJson(
    pickFirst(project.display_json),
    {}
  )

  const groupDisplayJson = safeParseJson(
    pickFirst(group.display_json),
    {}
  )

  const memberExtraJson = safeParseJson(
    pickFirst(rawItem.extra_json, member.extra_json),
    {}
  )

  const displayJson = {
    ...projectDisplayJson,
    ...activityDisplayJson
  }

  const companyName = pickFirst(
    rawItem.company_name,
    displayJson.company_name,
    project.project_name,
    project.sponsor_name,
    rawItem.group_name,
    ''
  )

  const status = normalizeCampStatus(
    pickFirst(rawItem.status, activity.status, member.status, ''),
    {
      activity_start_at: startAt,
      activity_end_at: endAt
    }
  )

  return {
    raw: rawItem,
    activity,
    project,
    group,
    member,

    display_json_obj: displayJson,
    extra_json_obj: memberExtraJson,

    camp_id: String(activityId || ''),
    activity_id: String(activityId || ''),
    activityId: String(activityId || ''),

    project_id: String(projectId || ''),
    projectId: String(projectId || ''),

    group_id: String(groupId || ''),
    groupId: String(groupId || ''),
    group_name: pickFirst(rawItem.group_name, group.group_name, ''),
    groupName: pickFirst(rawItem.group_name, group.group_name, ''),

    member_id: String(memberId || ''),
    memberId: String(memberId || ''),

    camp_name: activityName,
    name: activityName,
    title: activityName,
    activity_name: activityName,
    activityName,

    activity_type: pickFirst(rawItem.activity_type, activity.activity_type, ''),
    activityType: pickFirst(rawItem.activity_type, activity.activity_type, ''),

    company_name: companyName,
    companyName,

    camp_code: pickFirst(rawItem.activity_code, rawItem.camp_code, activityId, ''),
    status,
    status_text: formatCampStatusText(status),
    statusText: formatCampStatusText(status),

    can_enter: status === 'ongoing' || status === 'ended',
    canEnter: status === 'ongoing' || status === 'ended',

    start_time: normalizeDateText(startAt),
    end_time: normalizeDateText(endAt),
    activity_start_at: startAt,
    activity_end_at: endAt,
    activityStartAt: startAt,
    activityEndAt: endAt,

    participation_status: pickFirst(rawItem.member_status, member.status, ''),
    bind_phone_snapshot: pickFirst(rawItem.bind_phone_snapshot, member.bind_phone_snapshot, ''),
    phone: pickFirst(rawItem.phone, member.phone, ''),
    member_name: pickFirst(rawItem.member_name, member.member_name, ''),

    desc: pickFirst(rawItem.remark, activity.remark, ''),
    content: pickFirst(displayJson.content, ''),
    initial_weight: pickFirst(memberExtraJson.initial_weight, ''),
    target_weight: pickFirst(memberExtraJson.target_weight, ''),
    motion_modules: getMotionModules(displayJson, groupDisplayJson),

    coachName: pickFirst(rawItem.coach_name, activity.coach_name, ''),
    remark: pickFirst(rawItem.remark, activity.remark, ''),
    displayJson,
    extraJson: memberExtraJson
  }
}

function splitCampListByStatus(list = []) {
  const future_camps = []
  const current_camps = []
  const history_camps = []

  list.forEach(item => {
    const normalized = normalizeCampItem(item)

    if (normalized.status === 'upcoming') {
      future_camps.push(normalized)
      return
    }

    if (normalized.status === 'ended') {
      history_camps.push(normalized)
      return
    }

    current_camps.push(normalized)
  })

  return {
    future_camps,
    current_camps,
    history_camps
  }
}

function normalizeCampSummaryResponse(data = {}) {
  const currentSource = toArray(data.current_camps || data.currentCamps || [])
  const futureSource = toArray(data.future_camps || data.futureCamps || [])
  const historySource = toArray(data.history_camps || data.historyCamps || [])

  if (currentSource.length || futureSource.length || historySource.length) {
    return {
      current_camps: currentSource.map(normalizeCampItem),
      future_camps: futureSource.map(normalizeCampItem),
      history_camps: historySource.map(normalizeCampItem)
    }
  }

  return splitCampListByStatus(toArray(data.list || []))
}

function normalizeCampData(data = {}) {
  const summaryRaw = normalizeCampSummaryResponse(data)
  const futureCamps = summaryRaw.future_camps || []
  const currentCamps = summaryRaw.current_camps || []
  const historyCamps = summaryRaw.history_camps || []

  return {
    futureCamps,
    currentCamps,
    historyCamps,
    hasAnyCamp: !!(futureCamps.length || currentCamps.length || historyCamps.length),
    currentCount: currentCamps.length,
    futureCount: futureCamps.length,
    historyCount: historyCamps.length,
    currentCamp: currentCamps[0] || null,
    latestCamp: currentCamps[0] || futureCamps[0] || historyCamps[0] || null
  }
}

function normalizeCampDetail(data = {}) {
  const normalized = normalizeCampItem(data)
  const dashboard = data.dashboard || {}
  const displayJson = normalized.display_json_obj || {}
  const reportSummary = displayJson.report_summary || displayJson.reportSummary || {}
  const signSummary = displayJson.sign_summary || displayJson.signSummary || {}
  const rankingSummary = displayJson.ranking_summary || displayJson.rankingSummary || {}

  return {
    ...normalized,
    stage_text: pickFirst(dashboard.stage_text, '习惯养成期'),
    current_day: Number(pickFirst(dashboard.current_day, 1)) || 1,
    remain_task_text: pickFirst(
      dashboard.remain_task_text,
      '今天还差 1 次课程打卡，完成后可累计本周进度。'
    ),
    today_task_list: toArray(dashboard.today_task_list || []),
    current_weight: pickFirst(dashboard.current_weight, '--'),
    lost_weight: pickFirst(dashboard.lost_weight, '--'),
    distance_weight: pickFirst(dashboard.distance_weight, '--'),
    week_done: Number(pickFirst(dashboard.week_done, 0)) || 0,
    week_total: Number(pickFirst(dashboard.week_total, 0)) || 0,
    progress_percent: Number(pickFirst(dashboard.progress_percent, 0)) || 0,
    report_latest_date: pickFirst(reportSummary.latest_date, reportSummary.latestDate, ''),
    sign_latest_list: toArray(signSummary.latest_list || signSummary.latestList || []),
    my_rank: pickFirst(rankingSummary.my_rank, rankingSummary.myRank, ''),
    ranking_top_list: toArray(rankingSummary.top_list || rankingSummary.topList || [])
  }
}

function normalizeBindResponse(data = {}) {
  const activityId = pickFirst(data.activity_id, data.camp_id, '')
  return {
    ...data,
    camp_id: String(activityId || ''),
    activity_id: String(activityId || ''),
    member_id: pickFirst(data.member_id, ''),
    group_id: pickFirst(data.group_id, ''),
    is_idempotent: Number(pickFirst(data.is_idempotent, 0)) === 1 ? 1 : 0,
    mobile: pickFirst(data.mobile, data.phone, ''),
    phone: pickFirst(data.phone, data.mobile, '')
  }
}

function getBestCampEntry(campSummary = {}) {
  if (campSummary.currentCamp && campSummary.currentCamp.can_enter) {
    return {
      type: 'detail',
      campId: campSummary.currentCamp.camp_id
    }
  }

  if (campSummary.hasAnyCamp) {
    return {
      type: 'list'
    }
  }

  return {
    type: 'bind'
  }
}

module.exports = {
  safeParseJson,
  formatCampStatusText,
  normalizeCampStatus,
  normalizeCampItem,
  normalizeCampSummaryResponse,
  normalizeCampData,
  normalizeCampDetail,
  normalizeBindResponse,
  getBestCampEntry
}