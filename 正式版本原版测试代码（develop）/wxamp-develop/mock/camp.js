const deepClone = (data) => JSON.parse(JSON.stringify(data))
import { CAMP_MOCK_SCENE } from '../utils/mockScene'

const motionModuleMap = {
  18: ['step', 'course', 'water'],
  19: ['step', 'course'],
  20: ['step', 'water'],
  21: ['step'],
  default: ['step']
}

function buildActivity({
  activityId,
  projectId,
  activityName,
  companyName,
  activityType,
  startAt,
  endAt,
  status,
  coachName,
  remark,
  initialWeight,
  targetWeight,
  motionModules
}) {
  return {
    activity: {
      activity_id: activityId,
      project_id: projectId,
      activity_name: activityName,
      activity_type: activityType || 'fat_loss',
      activity_start_at: `${startAt} 00:00:00`,
      activity_end_at: `${endAt} 23:59:59`,
      status,
      coach_name: coachName || '',
      coach_phone_snapshot: '',
      coach_assigned_at: '',
      display_json: JSON.stringify({
        company_name: companyName,
        content: '活动期间请按要求完成每日运动、每日饮食打卡，并关注推荐阅读内容。',
        motion_modules: motionModules || motionModuleMap.default
      }),
      remark: remark || '',
      created_at: `${startAt} 00:00:00`,
      updated_at: `${startAt} 00:00:00`
    },
    project: {
      project_id: projectId,
      project_name: companyName,
      sponsor_name: companyName,
      status: 1,
      display_json: JSON.stringify({
        company_name: companyName
      }),
      created_at: `${startAt} 00:00:00`,
      updated_at: `${startAt} 00:00:00`
    },
    group: {
      group_id: Number(`${activityId}01`),
      activity_id: activityId,
      group_code: `G${activityId}`,
      group_name: `${activityName}默认组`,
      sort_no: 1,
      coach_note: '请按活动要求完成本周打卡',
      display_json: JSON.stringify({
        motion_modules: motionModules || motionModuleMap.default
      }),
      status: 1,
      created_at: `${startAt} 00:00:00`,
      updated_at: `${startAt} 00:00:00`
    },
    member: {
      member_id: Number(`${activityId}99`),
      activity_id: activityId,
      urid: 2,
      member_name: '测试学员',
      phone: '13800138000',
      group_id: Number(`${activityId}01`),
      status: 1,
      bind_urid: 2,
      bind_phone_snapshot: '13800138000',
      extra_json: JSON.stringify({
        initial_weight: initialWeight || '',
        target_weight: targetWeight || ''
      }),
      created_at: `${startAt} 00:00:00`,
      updated_at: `${startAt} 00:00:00`
    }
  }
}

const allCurrentCamps = [
  buildActivity({
    activityId: 18,
    projectId: 1001,
    activityName: '春季轻盈减重营',
    companyName: '远洋物流集团',
    activityType: 'fat_loss',
    startAt: '2026-03-20',
    endAt: '2026-04-20',
    status: 1,
    coachName: '李教练',
    remark: '这是前端 mock 的进行中训练营 1',
    initialWeight: '65',
    targetWeight: '60',
    motionModules: motionModuleMap[18]
  }),
  buildActivity({
    activityId: 19,
    projectId: 1002,
    activityName: '燃脂习惯养成营',
    companyName: '华新科技',
    activityType: 'fat_loss',
    startAt: '2026-03-18',
    endAt: '2026-04-18',
    status: 1,
    coachName: '王教练',
    remark: '这是前端 mock 的进行中训练营 2',
    initialWeight: '72',
    targetWeight: '66',
    motionModules: motionModuleMap[19]
  }),
  buildActivity({
    activityId: 20,
    projectId: 1003,
    activityName: '夏季塑形训练营',
    companyName: '安联制造',
    activityType: 'shape',
    startAt: '2026-03-25',
    endAt: '2026-04-30',
    status: 1,
    coachName: '赵教练',
    remark: '这是前端 mock 的进行中训练营 3',
    initialWeight: '70',
    targetWeight: '64',
    motionModules: motionModuleMap[20]
  }),
  buildActivity({
    activityId: 21,
    projectId: 1004,
    activityName: '职场健康管理营',
    companyName: '云启服务',
    activityType: 'health',
    startAt: '2026-03-22',
    endAt: '2026-04-22',
    status: 1,
    coachName: '陈教练',
    remark: '这是前端 mock 的进行中训练营 4',
    initialWeight: '68',
    targetWeight: '63',
    motionModules: motionModuleMap[21]
  })
]

const allFutureCamps = [
  buildActivity({
    activityId: 31,
    projectId: 1005,
    activityName: '五月控糖减脂营',
    companyName: '锦程物流',
    activityType: 'fat_loss',
    startAt: '2026-05-06',
    endAt: '2026-06-06',
    status: 1,
    coachName: '刘教练',
    remark: '训练营即将开始，请留意开营通知。',
    initialWeight: '66',
    targetWeight: '61'
  }),
  buildActivity({
    activityId: 32,
    projectId: 1006,
    activityName: '活力晨跑打卡营',
    companyName: '卓越零售',
    activityType: 'running',
    startAt: '2026-05-10',
    endAt: '2026-06-10',
    status: 1,
    coachName: '周教练',
    remark: '训练营即将开始，请留意开营通知。',
    initialWeight: '74',
    targetWeight: '69'
  }),
  buildActivity({
    activityId: 33,
    projectId: 1007,
    activityName: '夏日前体态调整营',
    companyName: '新望实业',
    activityType: 'posture',
    startAt: '2026-05-15',
    endAt: '2026-06-15',
    status: 1,
    coachName: '吴教练',
    remark: '训练营即将开始，请留意开营通知。',
    initialWeight: '63',
    targetWeight: '58'
  })
]

const allHistoryCamps = [
  buildActivity({
    activityId: 41,
    projectId: 1008,
    activityName: '新春减脂训练营',
    companyName: '东方供应链',
    activityType: 'fat_loss',
    startAt: '2026-01-05',
    endAt: '2026-02-05',
    status: 2,
    coachName: '李教练',
    remark: '活动已结束，可查看历史成果与摘要。',
    initialWeight: '69',
    targetWeight: '64'
  }),
  buildActivity({
    activityId: 42,
    projectId: 1009,
    activityName: '职工体重管理营',
    companyName: '博远建设',
    activityType: 'weight',
    startAt: '2025-11-10',
    endAt: '2025-12-10',
    status: 2,
    coachName: '王教练',
    remark: '活动已结束，可查看历史成果与摘要。',
    initialWeight: '75',
    targetWeight: '68'
  }),
  buildActivity({
    activityId: 43,
    projectId: 1010,
    activityName: '秋季健康打卡营',
    companyName: '联成制造',
    activityType: 'health',
    startAt: '2025-09-15',
    endAt: '2025-10-15',
    status: 2,
    coachName: '赵教练',
    remark: '活动已结束，可查看历史成果与摘要。',
    initialWeight: '62',
    targetWeight: '58'
  })
]

const campDetailMap = {
  '18': {
    ...deepClone(allCurrentCamps[0]),
    dashboard: {
      stage_text: '减脂期',
      current_day: 37,
      remain_task_text: '今天还差 1 次体重记录，完成后就离目标更近一点。',
      today_task_list: ['体重记录 1 次', '午间快走 20 分钟', '晚间饮水 1500 ml'],
      current_weight: '61.8',
      lost_weight: '4.6',
      distance_weight: '3.2',
      week_done: 8,
      week_total: 12,
      progress_percent: 62
    }
  },
  '19': {
    ...deepClone(allCurrentCamps[1]),
    dashboard: {
      stage_text: '习惯养成期',
      current_day: 28,
      remain_task_text: '今天还差 1 次课程打卡，完成后可累计本周进度。',
      today_task_list: ['完成课程跟练 1 次', '午休后步行 15 分钟', '晚餐后记录饮食 1 次'],
      current_weight: '69.5',
      lost_weight: '2.5',
      distance_weight: '3.5',
      week_done: 6,
      week_total: 10,
      progress_percent: 60
    }
  },
  '20': {
    ...deepClone(allCurrentCamps[2]),
    dashboard: {
      stage_text: '塑形期',
      current_day: 19,
      remain_task_text: '今天还差 1 次运动打卡，完成后可解锁阶段目标。',
      today_task_list: ['完成核心训练 1 次', '晚间拉伸 15 分钟', '记录全天饮食 1 次'],
      current_weight: '67.2',
      lost_weight: '2.8',
      distance_weight: '3.2',
      week_done: 5,
      week_total: 9,
      progress_percent: 56
    }
  },
  '21': {
    ...deepClone(allCurrentCamps[3]),
    dashboard: {
      stage_text: '巩固期',
      current_day: 15,
      remain_task_text: '今天还差 1 次饮食记录，完成后可提升本周完成率。',
      today_task_list: ['早餐打卡 1 次', '午间快走 30 分钟', '睡前饮水 1000 ml'],
      current_weight: '66.4',
      lost_weight: '1.6',
      distance_weight: '3.4',
      week_done: 7,
      week_total: 11,
      progress_percent: 64
    }
  }
}

const mockScenes = {
  unbound: {
    current_camps: [],
    future_camps: [],
    history_camps: []
  },
  only_current: {
    current_camps: [allCurrentCamps[0]],
    future_camps: [],
    history_camps: []
  },
  only_future: {
    current_camps: [],
    future_camps: allFutureCamps,
    history_camps: []
  },
  only_history: {
    current_camps: [],
    future_camps: [],
    history_camps: allHistoryCamps
  },
  future_history: {
    current_camps: [],
    future_camps: allFutureCamps,
    history_camps: allHistoryCamps
  },
  full_mix: {
    current_camps: allCurrentCamps,
    future_camps: allFutureCamps,
    history_camps: allHistoryCamps
  },
  user_a: {
    current_camps: [allCurrentCamps[0]],
    future_camps: allFutureCamps.slice(0, 1),
    history_camps: allHistoryCamps.slice(0, 1)
  },
  user_b: {
    current_camps: [allCurrentCamps[1]],
    future_camps: allFutureCamps.slice(0, 2),
    history_camps: allHistoryCamps.slice(0, 2)
  },
  user_c: {
    current_camps: [],
    future_camps: allFutureCamps.slice(0, 2),
    history_camps: allHistoryCamps.slice(0, 2)
  }
}

function getSceneData() {
  return deepClone(mockScenes[CAMP_MOCK_SCENE] || mockScenes.full_mix)
}

function buildSuccess(data = {}, message = '成功') {
  return {
    status: 'success',
    code: 200,
    message,
    data: deepClone(data)
  }
}

function buildFail(message = '请求失败', code = 500, data = {}) {
  return {
    status: 'fail',
    code,
    message,
    data: deepClone(data)
  }
}

export function getMockCampSummary() {
  return Promise.resolve(buildSuccess(getSceneData()))
}

export function getMockCampList() {
  return Promise.resolve(buildSuccess(getSceneData()))
}

export function getMockCampDetail(campId) {
  const key = String(campId || '')
  const detail = campDetailMap[key]

  if (!detail) {
    return Promise.resolve(buildFail('未找到训练营详情', 404, {}))
  }

  return Promise.resolve(buildSuccess(detail))
}

export function getMockSendCode() {
  return Promise.resolve(
    buildSuccess(
      {
        phone: '13800138000',
        expire_seconds: 60
      },
      '验证码发送成功'
    )
  )
}

export function getMockBindCamp(params = {}) {
  const phone = params.phone || params.mobile || '13800138000'
  const sceneData = getSceneData()
  const firstCamp =
    sceneData.current_camps[0] ||
    sceneData.future_camps[0] ||
    sceneData.history_camps[0] || {}

  const activity = firstCamp.activity || {}
  const member = firstCamp.member || {}
  const group = firstCamp.group || {}

  return Promise.resolve(
    buildSuccess(
      {
        activity_id: activity.activity_id || 18,
        member_id: member.member_id || 12,
        group_id: group.group_id || 1801,
        is_idempotent: 1,
        phone,
        message: '已绑定当前训练营'
      },
      '已绑定当前训练营'
    )
  )
}

export default {
  getMockCampSummary,
  getMockCampList,
  getMockCampDetail,
  getMockSendCode,
  getMockBindCamp
}