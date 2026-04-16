import { request } from "./request";

const JSON_HEADER = {
  'Content-Type': 'application/json'
};

export default {
  getUserInfo: data => request('user/userinfo', data),
  editInfo: data => request('user/edit-user-info', data),
  getUserPointList: data => request('user/point-list', data),
  pointexpire: data => request('user/expire', data),
  getSteps: data => request('user/commituserrecord', data),
  getPoints: data => request('point/getpoint', data),
  bindAdmin: data => request('user/bind-admin', data),
  sourcelist: data => request('user/sourcelist', data),
  selectsrc: data => request('user/selectsrc', data),
  skipguide: data => request('user/skipguide', data),

  // 训练营
  myCamps: data => request('camp/mycamps', data, null, 'POST', JSON_HEADER),
  myCampsAlias: data => request('camp/my', data, null, 'POST', JSON_HEADER),
  sendRegisterVerify: data => request('sms/registerverify', data, null, 'POST', JSON_HEADER),
  bindCamp: data => request('camp/bind', data, null, 'POST', JSON_HEADER),
  campDetail: data => request('camp/detail', data, null, 'POST', JSON_HEADER),
  
  // 下面这几个要等后端确认
  // changeCampMobile: data => request('camp/change-mobile', data, null, 'POST', JSON_HEADER),
  // unbindCampMobile: data => request('camp/unbind', data, null, 'POST', JSON_HEADER),

}