// pagedoctor/pages/effect/index.js
import api from '../../../request/index'
import moment from "../../../utils/moment";
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    selectAll: false,
    actions: [],
    tagid: [],
    selectedTags: [],
    result: [],
    tablist: [
      { 
        type: 1,
        color: '#FA746B'
      },
      { 
        type: 3,
        color: '#FFD14B'
      },
      { 
        type: 2,
        color: '#3ED4A7'
      },
    ],
    activelist: [],
    urid: null,
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(e) {
    this.setData({
      result: e.detail,
    });
  },
  choosecolor(e) {
    console.log(e.currentTarget.dataset,11);
    const {index,tagname,type} = e.currentTarget.dataset;
    this.setData({
      [`activelist[${index}].tag`]: tagname,
      [`activelist[${index}].active`]: true,
      [`activelist[${index}].type`]: type,
    });
    console.log(this.data.activelist,22);
  },
  // 选择标签
  onSelect() {
    const result = this.data.result;
    const activelist = this.data.activelist;
    const selectedTags = [];
    result.forEach(tag => {
      const matchedItem = activelist.find(item => item.tag === tag);
      if (matchedItem) {
        selectedTags.push({
          tag: matchedItem.tag,
          type: matchedItem.type
        });
      }
    });
    console.log('选中并处理后的标签:', selectedTags);
    if (selectedTags.length > 0) {
      this.getAddtags(selectedTags);
    }
    this.onClose();
    },
  deleteTag:  function(e){
    const id = e.currentTarget.dataset.tagid;
    wx.showModal({
      title: '删除标签',
      content: '确认删除？',
      success: (res) => {
        if (res.confirm) {
            this.getDeletetags(id);
        }
      },
    })
  },
  
  goreject() {
    wx.showModal({
      title: '驳回',
      content: '确认驳回？',
      success:(res) => {
        if (res.confirm) {
          wx.showToast({ title: '已驳回' });
        }
      }
    })
  },
  getEditpatient: function(state) {
      const uid = this.data.urid;
      let params = {};
      params.state = state;
      params.purid = uid;
      api.doctor.getEditpatient(params).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          this.setData({
            editpatient: res.data
          });
        }
        wx.showToast({ title: '已驳回' });
          wx.navigateBack({
            delta: 1
          });
      });
    },
  getPatientdetail: function() {
    const uid = this.data.urid;
    api.doctor.getPatientdetail({purid:uid}).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        res.data.create_time = moment(res.data.create_time*1000).format('YYYY-MM-DD HH:mm'),
        res.data.expired_time =  moment(res.data.expired_time*1000).format('YYYY-MM-DD HH:mm'),
        res.data.birthdate = util.calculateAge(res.data.birthdate),
        res.data.gender = util.getGenderText(res.data.gender)
        this.setData({
          patientinfo: res.data
        });
      }
    });
  },
  getSystags: function() {
    const uid = this.data.urid;
    api.doctor.getSystags({purid:uid}).then(res => {
      if (res.code == 200) {
        let actions =[];
        let activelist  = [];
        let tablist = this.data.tablist
        res.data.forEach(item => {
          actions.push({
            name: item.tag,
            tablist: tablist
          })
          activelist.push({
            tag: item.tag,
            type: 1,
            active: false
          })
        });
        console.log(res.data,activelist,'activelist');
        this.setData({
          actions, 
          activelist
        });
      }
    });
  },
  getAddtags: function(name) {
    const uid = this.data.urid;
    const tags = name;
    const jsonString = JSON.stringify(tags);
    api.doctor.getAddtags({purid:uid,tags:jsonString}).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        this.setData({
          addtags: res.data
        });
        this.getPatientdetail();
      }
    });
  },
  getDeletetags:  function(value) {
    const uid = this.data.urid;
    const tagid = value;
    api.doctor.getDeletetags({ purid: uid, tagids: tagid }).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        this.setData({
          deletetags: res.data
        });
        this.getPatientdetail();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options;
    this.setData({
      urid: options.urid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getPatientdetail();
    this.getSystags();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
})