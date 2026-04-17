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
    userInfo: {},
    chatlist: [],
    urid: null,
  },
  gopatient:  function (e) {
    const urid = e.currentTarget.dataset.urid;
    const mode = e.currentTarget.dataset.mode;
    if (mode==1) {
      wx.navigateTo({
        url: `/pagedoctor/pages/patient/index?urid=${urid}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options;
    this.setData({
      urid: options.urid,
    });
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
    // this.getChat()
  },
  //  获取聊天记录
  // getChat: function () {
  //     api.doctor.getChatmassage({purid:2}).then(res => {
  //           if (res.code == 200) {
  //             console.log(res.data);
  //             this.setData({
  //               chatlist: res.data,
  //             });
  //           }
  //         })
  //   },

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
    const uid = this.data.urid;
    api.doctor.addChat({content:this.data.content,purid:uid}).then(res=>{
      if(res.code == 200) {
        this.setData({
          content: ''
        })
        this.init()
      }
    })
  },

  sendImage(url) {
    const uid = this.data.urid;
    api.doctor.addChat({image:url,purid:uid}).then(res=>{
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
    const uid = this.data.urid;
    api.doctor.getChatmassage({purid:uid}).then(res => {
      if(res.code == 200) {
        const list = utils.formatData(res.data);
        const patientName = this.options.name || '我的消息';
        console.log(list,111)
        this.setData({
          list
        })
        wx.setNavigationBarTitle({
          title: patientName,
          success: function() {
            console.log('设置标题成功');
          },
          fail: function(err) {
            console.log('设置标题失败', err);
          }
        }); 
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