const deepClone = (data) => JSON.parse(JSON.stringify(data))
import { CAMP_MOCK_SCENE } from '../utils/mockScene'

const motionModuleMap = {
  1: ['step', 'course', 'water'],
  19: ['step', 'course'],
  20: ['step', 'water'],
  21: ['step'],
  default: ['step']
}

const allCurrentCamps = [
  {
    camp_id: 1,
    camp_code: 'CAMP202603',
    name: '春季轻盈减重营',
    company: '远洋物流集团',
    title: '春季轻盈减重营',
    start_time: '2026-03-20',
    end_time: '2026-04-20',
    status: 'ongoing',
    can_enter: 1,
    initial_weight: '65',
    target_weight: '60',
    bind_status: '',
    desc: '这是前端 mock 的进行中训练营 1',
    motion_modules: motionModuleMap[18]
  },
  {
    camp_id: 19,
    camp_code: 'CAMP202604',
    name: '燃脂习惯养成营',
    company: '华新科技',
    title: '燃脂习惯养成营',
    start_time: '2026-03-18',
    end_time: '2026-04-18',
    status: 'ongoing',
    can_enter: 1,
    initial_weight: '72',
    target_weight: '66',
    bind_status: '',
    desc: '这是前端 mock 的进行中训练营 2',
    motion_modules: motionModuleMap[19]
  },
  {
    camp_id: 20,
    camp_code: 'CAMP202605',
    name: '夏季塑形训练营',
    company: '安联制造',
    title: '夏季塑形训练营',
    start_time: '2026-03-25',
    end_time: '2026-04-30',
    status: 'ongoing',
    can_enter: 1,
    initial_weight: '70',
    target_weight: '64',
    bind_status: '',
    desc: '这是前端 mock 的进行中训练营 3',
    motion_modules: motionModuleMap[20]
  },
  {
    camp_id: 21,
    camp_code: 'CAMP202606',
    name: '职场健康管理营',
    company: '云启服务',
    title: '职场健康管理营',
    start_time: '2026-03-22',
    end_time: '2026-04-22',
    status: 'ongoing',
    can_enter: 1,
    initial_weight: '68',
    target_weight: '63',
    bind_status: '',
    desc: '这是前端 mock 的进行中训练营 4',
    motion_modules: motionModuleMap[21]
  }
]

const allFutureCamps = [
  {
    camp_id: 31,
    camp_code: 'CAMP202607',
    name: '五月控糖减脂营',
    company: '锦程物流',
    title: '五月控糖减脂营',
    start_time: '2026-05-06',
    end_time: '2026-06-06',
    status: 'upcoming',
    can_enter: 0,
    initial_weight: '66',
    target_weight: '61',
    bind_status: '已绑定',
    desc: '训练营即将开始，请留意开营通知。'
  },
  {
    camp_id: 32,
    camp_code: 'CAMP202608',
    name: '活力晨跑打卡营',
    company: '卓越零售',
    title: '活力晨跑打卡营',
    start_time: '2026-05-10',
    end_time: '2026-06-10',
    status: 'upcoming',
    can_enter: 0,
    initial_weight: '74',
    target_weight: '69',
    bind_status: '已绑定',
    desc: '训练营即将开始，请留意开营通知。'
  },
  {
    camp_id: 33,
    camp_code: 'CAMP202609',
    name: '夏日前体态调整营',
    company: '新望实业',
    title: '夏日前体态调整营',
    start_time: '2026-05-15',
    end_time: '2026-06-15',
    status: 'upcoming',
    can_enter: 0,
    initial_weight: '63',
    target_weight: '58',
    bind_status: '已绑定',
    desc: '训练营即将开始，请留意开营通知。'
  }
]

const allHistoryCamps = [
  {
    camp_id: 41,
    camp_code: 'CAMP202512',
    name: '新春减脂训练营',
    company: '东方供应链',
    title: '新春减脂训练营',
    start_time: '2026-01-05',
    end_time: '2026-02-05',
    status: 'ended',
    can_enter: 1,
    initial_weight: '69',
    target_weight: '64',
    bind_status: '已完成',
    desc: '活动已结束，可查看历史成果与摘要。'
  },
  {
    camp_id: 42,
    camp_code: 'CAMP202511',
    name: '职工体重管理营',
    company: '博远建设',
    title: '职工体重管理营',
    start_time: '2025-11-10',
    end_time: '2025-12-10',
    status: 'ended',
    can_enter: 1,
    initial_weight: '75',
    target_weight: '68',
    bind_status: '已完成',
    desc: '活动已结束，可查看历史成果与摘要。'
  },
  {
    camp_id: 43,
    camp_code: 'CAMP202510',
    name: '秋季健康打卡营',
    company: '联成制造',
    title: '秋季健康打卡营',
    start_time: '2025-09-15',
    end_time: '2025-10-15',
    status: 'ended',
    can_enter: 1,
    initial_weight: '62',
    target_weight: '58',
    bind_status: '已完成',
    desc: '活动已结束，可查看历史成果与摘要。'
  }
]

const campDetailMap = {
  '1': {
    camp_id: 1,
    name: '春季轻盈减重营',
    company: '远洋物流集团',
    title: '春季轻盈减重营',
    camp_code: 'CAMP202603',
    start_time: '2026-03-20',
    end_time: '2026-04-20',
    status: 'ongoing',
    desc: '这是前端本地调试用的活动详情数据，后续以后端真实接口为准。',
    content: '活动期间请按要求完成每日运动、每日饮食打卡，并关注推荐阅读内容。',
    initial_weight: '65',
    target_weight: '60',
    stage_text: '减脂期',
    current_day: 37,
    remain_task_text: '今天还差 1 次体重记录，完成后就离目标更近一点。',
    today_task_list: ['体重记录 1 次', '午间快走 20 分钟', '晚间饮水 1500 ml'],
    current_weight: '61.8',
    lost_weight: '4.6',
    distance_weight: '3.2',
    week_done: 8,
    week_total: 12,
    progress_percent: 62,
    motion_modules: motionModuleMap[18]
  },
  '19': {
    camp_id: 19,
    name: '燃脂习惯养成营',
    company: '华新科技',
    title: '燃脂习惯养成营',
    camp_code: 'CAMP202604',
    start_time: '2026-03-18',
    end_time: '2026-04-18',
    status: 'ongoing',
    desc: '这是前端本地调试用的活动详情数据，后续以后端真实接口为准。',
    content: '当前营期聚焦饮食规律、日常步数与课程打卡。',
    initial_weight: '72',
    target_weight: '66',
    stage_text: '习惯养成期',
    current_day: 28,
    remain_task_text: '今天还差 1 次课程打卡，完成后可累计本周进度。',
    today_task_list: ['完成课程跟练 1 次', '午休后步行 15 分钟', '晚餐后记录饮食 1 次'],
    current_weight: '69.5',
    lost_weight: '2.5',
    distance_weight: '3.5',
    week_done: 6,
    week_total: 10,
    progress_percent: 60,
    motion_modules: motionModuleMap[19]
  },
  '20': {
    camp_id: 20,
    name: '夏季塑形训练营',
    company: '安联制造',
    title: '夏季塑形训练营',
    camp_code: 'CAMP202605',
    start_time: '2026-03-25',
    end_time: '2026-04-30',
    status: 'ongoing',
    desc: '这是前端本地调试用的活动详情数据，后续以后端真实接口为准。',
    content: '当前营期聚焦核心训练、拉伸与饮食打卡协同。',
    initial_weight: '70',
    target_weight: '64',
    stage_text: '塑形期',
    current_day: 19,
    remain_task_text: '今天还差 1 次运动打卡，完成后可解锁阶段目标。',
    today_task_list: ['完成核心训练 1 次', '晚间拉伸 15 分钟', '记录全天饮食 1 次'],
    current_weight: '67.2',
    lost_weight: '2.8',
    distance_weight: '3.2',
    week_done: 5,
    week_total: 9,
    progress_percent: 56,
    motion_modules: motionModuleMap[20]
  },
  '21': {
    camp_id: 21,
    name: '职场健康管理营',
    company: '云启服务',
    title: '职场健康管理营',
    camp_code: 'CAMP202606',
    start_time: '2026-03-22',
    end_time: '2026-04-22',
    status: 'ongoing',
    desc: '这是前端本地调试用的活动详情数据，后续以后端真实接口为准。',
    content: '当前营期聚焦体重管理、步数提升与作息调整。',
    initial_weight: '68',
    target_weight: '63',
    stage_text: '巩固期',
    current_day: 15,
    remain_task_text: '今天还差 1 次饮食记录，完成后可提升本周完成率。',
    today_task_list: ['早餐打卡 1 次', '午间快走 30 分钟', '睡前饮水 1000 ml'],
    current_weight: '66.4',
    lost_weight: '1.6',
    distance_weight: '3.4',
    week_done: 7,
    week_total: 11,
    progress_percent: 64,
    motion_modules: motionModuleMap[21]
  },
  '31': {
    camp_id: 31,
    name: '五月控糖减脂营',
    company: '锦程物流',
    title: '五月控糖减脂营',
    camp_code: 'CAMP202607',
    start_time: '2026-05-06',
    end_time: '2026-06-06',
    status: 'upcoming',
    desc: '待开始训练营 mock 数据。',
    content: '活动即将开始，请留意开营通知。',
    initial_weight: '66',
    target_weight: '61'
  },
  '32': {
    camp_id: 32,
    name: '活力晨跑打卡营',
    company: '卓越零售',
    title: '活力晨跑打卡营',
    camp_code: 'CAMP202608',
    start_time: '2026-05-10',
    end_time: '2026-06-10',
    status: 'upcoming',
    desc: '待开始训练营 mock 数据。',
    content: '活动即将开始，请留意开营通知。',
    initial_weight: '74',
    target_weight: '69'
  },
  '33': {
    camp_id: 33,
    name: '夏日前体态调整营',
    company: '新望实业',
    title: '夏日前体态调整营',
    camp_code: 'CAMP202609',
    start_time: '2026-05-15',
    end_time: '2026-06-15',
    status: 'upcoming',
    desc: '待开始训练营 mock 数据。',
    content: '活动即将开始，请留意开营通知。',
    initial_weight: '63',
    target_weight: '58'
  },
  '41': {
    camp_id: 41,
    name: '新春减脂训练营',
    company: '东方供应链',
    title: '新春减脂训练营',
    camp_code: 'CAMP202512',
    start_time: '2026-01-05',
    end_time: '2026-02-05',
    status: 'ended',
    desc: '历史训练营 mock 数据。',
    content: '活动已结束，可查看历史成果与摘要。',
    initial_weight: '69',
    target_weight: '64'
  },
  '42': {
    camp_id: 42,
    name: '职工体重管理营',
    company: '博远建设',
    title: '职工体重管理营',
    camp_code: 'CAMP202511',
    start_time: '2025-11-10',
    end_time: '2025-12-10',
    status: 'ended',
    desc: '历史训练营 mock 数据。',
    content: '活动已结束，可查看历史成果与摘要。',
    initial_weight: '75',
    target_weight: '68'
  },
  '43': {
    camp_id: 43,
    name: '秋季健康打卡营',
    company: '联成制造',
    title: '秋季健康打卡营',
    camp_code: 'CAMP202510',
    start_time: '2025-09-15',
    end_time: '2025-10-15',
    status: 'ended',
    desc: '历史训练营 mock 数据。',
    content: '活动已结束，可查看历史成果与摘要。',
    initial_weight: '62',
    target_weight: '58'
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
        mobile: '13800138000',
        expire_seconds: 60
      },
      '验证码发送成功'
    )
  )
}

export function getMockBindCamp(params = {}) {
  const mobile = params.mobile || '13800138000'
  const sceneData = getSceneData()
  const firstCamp =
    sceneData.current_camps[0] ||
    sceneData.future_camps[0] ||
    sceneData.history_camps[0] || {}

  return Promise.resolve(
    buildSuccess(
      {
        camp_id: firstCamp.camp_id || 18,
        bind_id: 12,
        is_idempotent: 1,
        mobile,
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