import {request} from "./request";
import moment from "../utils/moment";

const TEST_COURSE_LIST_URL = 'http://192.168.110.5:9001/index.php?r=course/mycourselist'
const TEST_SAVE_USER_COURSE_URL = 'http://192.168.110.5:9001/index.php?r=course/saveusercourse'
const TEST_URID = 2
const TEST_TOKEN = 'x5bixv0llp1180'

function buildCourseTestPayload(data = {}) {
  const userInfo = wx.getStorageSync('userInfo') || {}

  return {
    urid: data.urid || userInfo.urid || TEST_URID,
    token: data.token || userInfo.token || TEST_TOKEN,
    ...data
  }
}

function postCourseTest(url, data = {}) {
  return new Promise((resolve, reject) => {
    console.log('postCourseTest url = ', url)
    console.log('postCourseTest data = ', data)

    wx.request({
      url,
      method: 'POST',
      data: JSON.stringify(data),
      timeout: 60000,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        console.log('course response statusCode = ', res.statusCode)
        console.log('course response header = ', res.header)
        console.log('course raw response = ', res.data)
        resolve(res.data)
      },
      fail: err => {
        console.log('course request fail = ', err)
        reject(err)
      },
      complete: res => {
        console.log('course request complete = ', res)
      }
    })
  })
}//测试使用

const JSON_HEADER = {
    'Content-Type': 'application/json'
};
export default {
    getWaterData: data => {
      return request('user/mywater-list', data);
    },
    getFoodData: data => {
      return request('user/mydiet-detail', data);
    },
    setWaterData: data => {
      return request('user/add-water', data);
    },
    setFoodData: data => {
      return request('user/add-diet', data);
    },
    deleteFoodData: data => {
      return request('user/delete-diet', data);
    },
    editDietDetail: data => {
      return request('user/edit-diet-detail', data);
    },
    syncHuaWeiData: data => {
      return request('user/syncdata', data);
    },
    getWeightData: data => {
      return request('user/myweight-list', data);
    },
    submitWeightData: data => {
      return request('user/add-weight', data);
    },
    signCheck: data => {
      return request('user/checkin', data);
    },
    getSportData: data => {
      return request('user/activity-list', data);
    },
    getSleepData: data => {
      return request('user/sleep-list', data);
    },
    getCommonSportData: data => {
      return request('user/healthy-sample', data);
    },
    getNewsData: data => {
      return request('health/news', data);
    },
    getMychat: data => {
      return request('health/mychat', data);
    },
    addChat: data => {
      return request('health/addchat', data);
    },
    getNewsdetail: data => {
      return request('health/news-detail', data).then(r => {
        r.data.forEach(item=>{
          item.datetime = moment(item.create_time * 1000).format('YYYY/MM/DD HH:mm:ss');
        })
        
  
        return r;
      });
    },
    authInfo: data => {
      return request('huawei/auth-info', data);
    },
    isAuth: data => {
      return request('huawei/is-auth', data);
    },
    cancelAuth: data => {
      return request('huawei/cancel-auth', data);
    },
    adviceList: data => {
      return request('health/myhealth-advice', data).then(r => {
        r.data.date = moment(r.data.create_time * 1000).format('YYYY-MM-DD');
  
        return r;
      });
    },
    adviceDetail: data => {
      return request('health/myhealth-advice-detail', data);
    },
    diettpl: data => {
      return request('health/diettpl', data);
    },
    addDietUsetpl: data => {
      return request('health/add-diet-usetpl', data);
    },
    addDietWithtpl: data => {
      return request('health/add-diet-withtpl', data);
    },
    cyclelist: data => {
      return request('health/cyclelist', data);
    },
    setCycle: data => {
      return request('health/set-cycle', data);
    },
    mycycle: data => {
      return request('health/my-cyclelist', data);
    },
    editDiettpl: data => {
      return request('health/edit-diettpl', data);
    },
    cycleDetail: data => {
      return request('health/cycle-detail', data);
    },
    survey: data => {
      return request('question/survey-detail', data);
    },
    surveysummit: data => {
      return request('question/submit', data);
    },
    mycyclelist: data => {
      return request('health/my-cyclelist', data);
    },
    getStandard: data => {
      return request('health/get-standard', data);
    },
    getCampCourseList: data => {
      return postCourseTest(
        TEST_COURSE_LIST_URL,
        buildCourseTestPayload({
          ...data,
          activity_id: String(data.activity_id || '1'),
          page: Number(data.page || 1),
          page_size: Number(data.page_size || 10)
        })
      );
    },//测试使用
    
    submitCampCourseCheckin: data => {
      return postCourseTest(
        TEST_SAVE_USER_COURSE_URL,
        buildCourseTestPayload({
          ...data,
          activity_id: String(data.activity_id || '1'),
          course_id: Number(data.course_id || 0),
          course_name_snapshot: data.course_name_snapshot || '',
          play_started_at: data.play_started_at || '',
          play_ended_at: data.play_ended_at || '',
          effective_seconds: Number(data.effective_seconds || 0),
          completion_rate: Number(data.completion_rate || 0),
          confirm_deadline_at: data.confirm_deadline_at || '',
          confirmed_at: data.confirmed_at || '',
          validation_result: data.validation_result || 'valid',
          validation_reason: data.validation_reason || ''
        })
      );
    },//测试使用
    getBalance: data => {
      return request('health/balance', data);
    },
    generatecycle: data => {
      return request('health/generate-cycle', data);
    },
    myactlist: data => {
      return request('activity/myactlist', data);
    },
    tpls: data => {
      return request('activity/tpls', data);
    },
    editMyact: data => {
      return request('activity/edit-myact', data);
    },
    tplDeatil: data => {
      return request('activity/tpl-detail', data);
    },

    dietTplDeatil: data => {
      return request('health/diet-tpl-detail', data);
    },
    setStandard: data => {
      return request('health/set-standard', data);
    },
    editDietWithtpl: data => {
      return request('health/edit-diet-withtpl', data);
    },

}