// pages/login/index.js
import api from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    btntips: '获取验证码',
    smsdisabled: false,
  },

  onPhoneChange(event) {
    this.setData({
      phone: event.detail,
    });
  },
  onCodeChange(event) {
    this.setData({
      code: event.detail,
    });
  },
  send(){
    if (this.checkMobile(this.data.phone)) {
      var that = this;
      var sec = 60;
      if (that.data.smsdisabled) {
        return;
      }
      // 设置禁用状态
      that.setData({
        smsdisabled: true
      });
      for (let i = 0; i <= 60; i++) {
          setTimeout(function () {
              if (sec != 0) {
                  that.setData({
                      btntips: sec + "秒后重发",
                      smsdisabled: true
                  });
                  sec--;
              } else {
                  sec = 60;  //倒计时结束就让‘获取验证码’显示出来
                  that.setData({
                      btntips: '获取验证码',
                      smsdisabled: false
                  })
              }
          }, i * 1000)
      }
      this.sendVerify()
    }
  },
  checkMobile(mobile) {
    console.log('mobile:', mobile)
    // 1. 非空验证
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号', // 提示内容
        icon: 'none',   // 图标，可选值：'success', 'loading', 'none'
        duration: 2000     // 显示时长(毫秒)，默认1500
      })
      return false;
    }
    // 2. 去除可能存在的空格
    mobile = mobile.trim();
    // 3. 长度验证
    if (mobile.length !== 11) {
      console.log('手机号码应为11位数字');
      return false;
    }
    // 4. 纯数字验证
    if (!/^\d+$/.test(mobile)) {
      console.log('手机号码只能包含数字');
      return false;
    }
    // 5. 手机号格式验证
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(mobile)) {
      console.log('请输入正确的手机号码');
      return false;
    }
    return true;
  },

  sendVerify: function () {
    const num = this.data.phone;
    api.doctor.sendVerify({phone:num}).then(res => {
      if (res.code == 200) {
        console.log('发送验证码成功');
      }
    })
  },
  verifyDoctor: function () {
    const num = this.data.phone;
    const code = this.data.code;
    api.doctor.verifyDoctor({phone:num,code:code}).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '验证成功',
          icon: 'success',
          duration: 2000
        })
        wx.redirectTo({
          url: `/pagedoctor/pages/index/index`
        })
      } else {
        wx.showToast({
          title: '验证码错误',
          icon: 'failed',
          duration: 2000
        })
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})