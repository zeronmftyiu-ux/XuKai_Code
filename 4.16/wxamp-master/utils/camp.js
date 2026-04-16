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
  const raw = String(status || item.status || item.participation_status || '').toLowerCase()

  const map = {
    not_open: 'upcoming',
    upcoming: 'upcoming',
    pending: 'upcoming',
    imported_unbound: 'upcoming',
    ongoing: 'ongoing',
    active: 'ongoing',
    active_bound: 'ongoing',
    running: 'ongoing',
    ended: 'ended',
    finished: 'ended',
    complete: 'ended',
    completed: 'ended',
    left: 'ended',
    offline: 'ended',
    archived: 'ended'
  }

  if (map[raw]) return map[raw]

  const numeric = Number(raw)
  if (!Number.isNaN(numeric) && raw !== '') {
    if (numeric === 1) return 'ongoing'
    if (numeric === 2) return 'ended'
  }

  const startTime = pickFirst(item.activity_start_at, item.start_time, item.start_at)
  const endTime = pickFirst(item.activity_end_at, item.end_time, item.end_at)
  const now = Date.now()

  if (startTime && endTime) {
    const startMs = new Date(startTime).getTime()
    const endMs = new Date(endTime).getTime()
    if (!Number.isNaN(startMs) && !Number.isNaN(endMs)) {
      if (now < startMs) return 'upcoming'
      if (now > endMs) return 'ended'
      return 'ongoing'
    }
  }

  return raw || 'upcoming'
}

function formatCampStatusText(status) {
  const map = {
    not_open: '未开始',
    upcoming: '未开始',
    ongoing: '进行中',
    active: '进行中',
    ended: '已结束',
    offline: '已结束'
  }
  return map[status] || status || '--'
}

function getCampId(item = {}, activity = {}) {
  return pickFirst(
    item.camp_id,
    item.activity_id,
    item.id,
    activity.camp_id,
    activity.activity_id,
    activity.id,
    ''
  )
}

function getCampName(item = {}, activity = {}, project = {}) {
  return pickFirst(
    item.camp_name,
    item.name,
    item.title,
    item.activity_name,
    activity.camp_name,
    activity.name,
    activity.title,
    activity.activity_name,
    item.camp_code,
    activity.camp_code,
    project.project_name,
    ''
  )
}

function getCompanyName(item = {}, activity = {}, project = {}) {
  return pickFirst(
    item.company,
    item.company_name,
    item.sponsor_name,
    activity.company,
    activity.company_name,
    project.sponsor_name,
    project.project_name,
    item.project_name,
    activity.project_name,
    ''
  )
}

function getMotionModules(item = {}, activity = {}, displayJson = {}) {
  const fromDisplay = displayJson.motion_modules || displayJson.motionModules
  const fromActivityDisplay = safeParseJson(activity.display_json || activity.displayJson, {})
  const modules = pickFirst(
    item.motion_modules,
    activity.motion_modules,
    fromDisplay,
    fromActivityDisplay.motion_modules,
    fromActivityDisplay.motionModules,
    []
  )
  return Array.isArray(modules) ? modules : []
}

function normalizeCampItem(rawItem = {}) {
  const activity = rawItem.activity || rawItem.camp_activity || {}
  const project = rawItem.project || rawItem.camp_project || {}
  const group = rawItem.group || rawItem.camp_group || {}
  const member = rawItem.member || rawItem.camp_member || rawItem.activity_member || {}
  const extraJson = safeParseJson(rawItem.extra_json || member.extra_json, {})
  const displayJson = safeParseJson(
    pickFirst(rawItem.display_json, activity.display_json, project.display_json),
    {}
  )

  const campId = getCampId(rawItem, activity)
  const status = normalizeCampStatus(
    pickFirst(rawItem.status, rawItem.participation_status, activity.status, member.participation_status),
    {
      ...rawItem,
      ...activity
    }
  )

  const canEnter = rawItem.can_enter !== undefined
    ? Number(rawItem.can_enter) === 1
    : status === 'ongoing' || status === 'ended'

  return {
    ...rawItem,
    activity,
    project,
    group,
    member,
    extra_json_obj: extraJson,
    display_json_obj: displayJson,

    camp_id: String(campId || ''),
    activity_id: campId,
    project_id: pickFirst(rawItem.project_id, activity.project_id, project.project_id, ''),
    group_id: pickFirst(rawItem.group_id, member.group_id, group.group_id, ''),
    member_id: pickFirst(rawItem.member_id, member.member_id, ''),

    camp_name: getCampName(rawItem, activity, project),
    name: getCampName(rawItem, activity, project),
    title: pickFirst(rawItem.title, activity.title, rawItem.activity_name, activity.activity_name, getCampName(rawItem, activity, project)),
    activity_name: pickFirst(rawItem.activity_name, activity.activity_name, getCampName(rawItem, activity, project)),
    company: getCompanyName(rawItem, activity, project),
    company_name: getCompanyName(rawItem, activity, project),
    sponsor_name: pickFirst(rawItem.sponsor_name, project.sponsor_name, activity.sponsor_name, ''),
    project_name: pickFirst(rawItem.project_name, project.project_name, activity.project_name, ''),

    camp_code: pickFirst(rawItem.camp_code, activity.camp_code, activity.activity_code, rawItem.activity_code, ''),
    status,
    status_text: formatCampStatusText(status),
    can_enter: canEnter,

    start_time: normalizeDateText(pickFirst(rawItem.start_time, rawItem.activity_start_at, activity.start_time, activity.activity_start_at)),
    end_time: normalizeDateText(pickFirst(rawItem.end_time, rawItem.activity_end_at, activity.end_time, activity.activity_end_at)),
    activity_start_at: pickFirst(rawItem.activity_start_at, activity.activity_start_at, rawItem.start_time, activity.start_time, ''),
    activity_end_at: pickFirst(rawItem.activity_end_at, activity.activity_end_at, rawItem.end_time, activity.end_time, ''),

    participation_status: pickFirst(rawItem.participation_status, member.participation_status, ''),
    bind_source: pickFirst(rawItem.bind_source, member.bind_source, ''),
    bind_phone_snapshot: pickFirst(rawItem.bind_phone_snapshot, member.bind_phone_snapshot, ''),
    phone: pickFirst(rawItem.phone, rawItem.phone_e164, member.phone, member.phone_e164, ''),
    member_name: pickFirst(rawItem.member_name, member.member_name, ''),
    group_name: pickFirst(rawItem.group_name, group.group_name, ''),
    group_code: pickFirst(rawItem.group_code, group.group_code, ''),

    desc: pickFirst(rawItem.desc, rawItem.remark, activity.remark, displayJson.desc, displayJson.description, ''),
    content: pickFirst(rawItem.content, displayJson.content, displayJson.detail_content, displayJson.description, ''),
    initial_weight: pickFirst(rawItem.initial_weight, extraJson.initial_weight, displayJson.initial_weight, ''),
    target_weight: pickFirst(rawItem.target_weight, extraJson.target_weight, displayJson.target_weight, ''),
    motion_modules: getMotionModules(rawItem, activity, displayJson)
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
  if (Array.isArray(data)) {
    return splitCampListByStatus(data)
  }

  const currentSource = pickFirst(
    data.current_camps,
    data.currentCamps,
    data.current_activities,
    data.active_camps,
    data.active_activities,
    null
  )
  const futureSource = pickFirst(
    data.future_camps,
    data.futureCamps,
    data.upcoming_camps,
    data.upcoming_activities,
    null
  )
  const historySource = pickFirst(
    data.history_camps,
    data.historyCamps,
    data.ended_camps,
    data.ended_activities,
    null
  )

  if (currentSource || futureSource || historySource) {
    return {
      current_camps: toArray(currentSource).map(normalizeCampItem),
      future_camps: toArray(futureSource).map(normalizeCampItem),
      history_camps: toArray(historySource).map(normalizeCampItem)
    }
  }

  const flatList = toArray(
    pickFirst(
      data.list,
      data.rows,
      data.records,
      data.activities,
      data.activity_list,
      data.camps,
      data.items,
      []
    )
  )

  return splitCampListByStatus(flatList)
}

function normalizeCampData(data = {}) {
  const summaryRaw = normalizeCampSummaryResponse(data)
  const futureCamps = summaryRaw.future_camps || []
  const currentCamps = summaryRaw.current_camps || []
  const historyCamps = summaryRaw.history_camps || []

  const hasAnyCamp =
    futureCamps.length > 0 ||
    currentCamps.length > 0 ||
    historyCamps.length > 0

  return {
    futureCamps,
    currentCamps,
    historyCamps,
    hasAnyCamp,
    currentCount: currentCamps.length,
    futureCount: futureCamps.length,
    historyCount: historyCamps.length,
    currentCamp: currentCamps[0] || null,
    latestCamp: currentCamps[0] || futureCamps[0] || historyCamps[0] || null
  }
}

function normalizeCampDetail(data = {}) {
  const normalized = normalizeCampItem(data)
  const displayJson = normalized.display_json_obj || {}
  const extraJson = normalized.extra_json_obj || {}
  const dashboard = displayJson.dashboard || {}
  const reportSummary = displayJson.report_summary || displayJson.reportSummary || {}
  const signSummary = displayJson.sign_summary || displayJson.signSummary || {}
  const rankingSummary = displayJson.ranking_summary || displayJson.rankingSummary || {}

  return {
    ...normalized,
    stage_text: pickFirst(normalized.stage_text, dashboard.stage_text, dashboard.stageText, displayJson.stage_text, '减脂期'),
    current_day: Number(pickFirst(normalized.current_day, dashboard.current_day, dashboard.currentDay, displayJson.current_day, 1)) || 1,
    remain_task_text: pickFirst(normalized.remain_task_text, dashboard.remain_task_text, dashboard.remainTaskText, displayJson.remain_task_text, '今天还差 1 次任务，完成后就离目标更近一点。'),
    today_task_list: toArray(pickFirst(normalized.today_task_list, dashboard.today_task_list, dashboard.todayTaskList, displayJson.today_task_list, [])),
    current_weight: pickFirst(normalized.current_weight, dashboard.current_weight, dashboard.currentWeight, displayJson.current_weight, extraJson.current_weight, '--'),
    lost_weight: pickFirst(normalized.lost_weight, dashboard.lost_weight, dashboard.lostWeight, displayJson.lost_weight, extraJson.lost_weight, '--'),
    distance_weight: pickFirst(normalized.distance_weight, dashboard.distance_weight, dashboard.distanceWeight, displayJson.distance_weight, extraJson.distance_weight, '--'),
    week_done: Number(pickFirst(normalized.week_done, dashboard.week_done, dashboard.weekDone, displayJson.week_done, 0)) || 0,
    week_total: Number(pickFirst(normalized.week_total, dashboard.week_total, dashboard.weekTotal, displayJson.week_total, 0)) || 0,
    progress_percent: Number(pickFirst(normalized.progress_percent, dashboard.progress_percent, dashboard.progressPercent, displayJson.progress_percent, 0)) || 0,
    report_latest_date: pickFirst(normalized.report_latest_date, reportSummary.latest_date, reportSummary.latestDate, displayJson.report_latest_date, ''),
    sign_latest_list: toArray(pickFirst(normalized.sign_latest_list, signSummary.latest_list, signSummary.latestList, displayJson.sign_latest_list, [])),
    my_rank: pickFirst(normalized.my_rank, rankingSummary.my_rank, rankingSummary.myRank, ''),
    ranking_top_list: toArray(pickFirst(normalized.ranking_top_list, rankingSummary.top_list, rankingSummary.topList, []))
  }
}

function normalizeBindResponse(data = {}) {
  const campId = pickFirst(data.camp_id, data.activity_id, data.id, '')
  return {
    ...data,
    camp_id: String(campId || ''),
    activity_id: campId,
    member_id: pickFirst(data.member_id, data.bind_id, ''),
    is_idempotent: Number(pickFirst(data.is_idempotent, data.idempotent, 0)) === 1 ? 1 : 0,
    mobile: pickFirst(data.mobile, data.phone, data.phone_e164, '')
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
