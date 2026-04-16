// pages/food/config.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import api from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      imgurl: '',
      component: '',
      amount: '',
      unit: '',
      energy: '',
      carbohydrate: '',
      protein: '',
      fat: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
              _this.setData({
                'form.imgurl': data.data.imgurl
              })
              // that.changestate(key, data.data.imgurl);
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

  onChange(e) {
    console.log(e,'e')
    let name = e.currentTarget.dataset.name;
    this.data.form[name] = e.detail;
  },

  submit() {
    console.log(this.data.form)
    if(this.data.form.component == '' || this.data.form.amount == '' || 
      this.data.form.unit == '' || this.data.form.energy == ''
    ) {
      wx.showToast({
        title: '内容有误',
        icon: 'error',
        duration: 2000
      })
      return      
    }
    let query = Object.assign({},this.data.form)

    if(query.imgurl == ''){
      query.imgurl = 'https://oss.mcloud.moveclub.cn/movewell/img/food.png'
    }

    api.movewell.editDiettpl(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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