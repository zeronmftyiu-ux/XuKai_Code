// pages/user/message/index.js
import api from '../../../request/index';
var utils = require("../../../utils/util.js");
var pararms = require("../../../utils/params.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    content: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
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
    this.init()
  },

  getUserInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: res.data
        });
      }
    });
  },

  chooseImage() {
    var _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(res.tempFiles[0].size)
        // var tempFilePaths = res.tempFilePaths;
        wx.showLoading({ title: '上传中' });
        wx.uploadFile({
          url: pararms.uploadurl,
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          formData: utils.uploadparams(),
          success: function (res) {
            var data = res.data;
            // console.log('res.data', res.data)
            // //do something\
            var data = JSON.parse(data);
            if (data.code == 200) {
              _this.sendImage(data.data.imgurl);
            } else {
              utils.ALERT(data.message);
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        });
      }
    })
  },

  send() {
    if(this.data.content == '') {
      return
    }
    let docotr = this.data.userInfo.bdinfo.docotr
    api.movewell.addChat({content:this.data.content,userid: docotr.userid}).then(res=>{
      if(res.code == 200) {
        this.setData({
          content: ''
        })
        this.init()
      }
    })
  },

  sendImage(url) {
    let docotr = this.data.userInfo.bdinfo.docotr
    api.movewell.addChat({image:url,userid: docotr.userid}).then(res=>{
      if(res.code == 200) {
        this.init()
      }
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  init() {
    api.movewell.getMychat().then(res=>{
      if(res.code == 200) {
        const list = utils.formatData(res.data)
        console.log(list,111)
        this.setData({
          list
        })
        this.scrollToBottom()
      }
    })
  },

  scrollToBottom() {
    const query = wx.createSelectorQuery();
    query.select('#scrollView').boundingClientRect(rect => {
      if (rect) {
        wx.pageScrollTo({
          scrollTop: rect.height,
          duration: 300,
        });
      }
    }).exec();
  },

  showimg(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
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

  }
})