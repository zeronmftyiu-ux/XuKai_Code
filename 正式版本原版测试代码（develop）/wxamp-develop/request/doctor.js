import {request} from "./request";

export default {
    getDoctorinfo: (data) => {
      return request('user-doctor/info', data)
    },
    getWeight: (data) => {
      return request('user-doctor/balance-list', data)
    },
    getMassage: (data) => {
      return request('user-doctor/chat-list', data)
    },
    getChatmassage: (data) => {
      return request('user-doctor/chatinfo', data)
    },
    addChat: (data) => {
      return request('user-doctor/addchat', data)
    },
    getAbnormal: (data) => {
      return request('user-doctor/alert-list', data)
    },
    getFeeds: (data) => {
      return request('user-doctor/feeds', data)
    },
    getMypatients: (data) => {
      return request('user-doctor/my-patients', data)
    },
    getAlertchat: (data) => {
      return request('user-doctor/alertchat', data)
    },
    getEditpatient: (data) => {
      return request('user-doctor/edit-patient', data)
    },
    getPatientdetail: (data) => {
      return request('user-doctor/patient-detail', data)
    },
    getPatientinfo: (data) => {
      return request('user-doctor/patient-info', data)
    },
    getPatientcycle: (data) => {
      return request('user-doctor/patient-cycle', data)
    },
    getPatientassessment: (data) => {
      return request('user-doctor/patient-assessment', data)
    },
    getAddtags: (data) => {
      return request('user-doctor/add-tags', data)
    },
    getDeletetags: (data) => {
      return request('user-doctor/delete-tags', data)
    },
    getSystags: (data) => {
      return request('user-doctor/systags', data)
    },
    sendVerify: (data) => {
      return request('user/sendverify', data)
    },
    verifyDoctor: (data) => {
      return request('user/verifydoctor', data)
    },
    exrxList: (data) => { //医嘱列表
      return request('health/exrxlist', data)
    },
    exrxDetail: (data) => { //医嘱详情
      return request('health/exrxdetail', data)
    },
}