// pagedoctor/pages/index/index.js
import api from '../../../request/index'
import drawQrcode from '../../../utils/weapp.qrcode.esm'
import posterdata from '../../../utils/detailposter';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    closeurl: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/close-circle%402x.png',
    feedslist: [],
    massagelist:  [],
    width: 164,
    show: false,
    bcode: 123456,
    imagePath: '',
    posterdata: {},
  },
  onImgOK(e) {
      console.log(e);
      this.setData({
          imagePath: e.detail.path
      });
    },
  onImgErr: function (e) {
      console.log(e);
  },
  // 获取系统信息计算适合的二维码尺寸
  getSystemInfo() {
      let self = this
      wx.getSystemInfo({
          success: function (res) {
              console.log(res)
              let width = res.windowWidth
              let scre = 750 / res.windowWidth
              let min = 330*scre
              console.log(min,111)
              self.setData({
                  width: Math.floor(min)
              })
          }
      })
  },
  // 生成二维码
  generateQRCode() {
    let that = this
    drawQrcode({
      text: that.data.bcode,
      width: 90,
      height: 90,
      canvasId: 'myQrcode',
      callback: (res) => {
        console.log('居中二维码路径:', res);
        that.handleLongPressSave();
      }
    });
    // wx.setScreenBrightness({
    //   value: 0.8,    //屏幕亮度值，范围 0~1，0 最暗，1 最亮
    // })
  },
  handleLongPressSave() {
    // wx.showLoading({ title: '准备保存...' });
    // 将canvas转为临时图片
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      success: (res) => {
        // this.saveImageToAlbum(res.tempFilePath);
        that.setData({
          posterdata: new posterdata().palette(res.tempFilePath)
        })
      },
      fail: (err) => {
        console.error('转换失败:', err);
        // wx.hideLoading();
        // wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 保存二维码
  // saveImage() {
  //     var that = this;
  //     wx.authorize({
  //         scope: 'scope.writePhotosAlbum',
  //         success: function () {
  //             wx.showLoading({
  //                 title: '保存中...'
  //             });
  //             wx.saveImageToPhotosAlbum({
  //                 filePath: that.imagePath,
  //                 success: function () {
  //                     wx.showToast({
  //                         title: '保存成功!'
  //                     });
  //                 },
  //                 complete: function () {
  //                     wx.hideLoading();
  //                 },
  //                 fail: function (e) {
  //                     console.log(e);
  //                     wx.showToast({
  //                         icon: 'none',
  //                         title: '保存失败!'
  //                     });
  //                 }
  //             });
  //         },
  //         fail: function () {
  //             wx.showModal({
  //                 title: '无法保存到相册',
  //                 content:
  //                     '请依次点击小程序 右上角 - 关于 - 右上角 - 设置 打开保存到相册权限'
  //             });
  //         }
  //     });
  // },
  // 保存到相册
  saveImageToAlbum() {
    const tempFilePath = this.data.imagePath;
    // 检查权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 请求权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this._doSave(tempFilePath);
            },
            fail: () => {
              wx.hideLoading();
              this.showPermissionModal();
            }
          });
        } else {
          // 已有权限
          this._doSave(tempFilePath);
        }
      }
    });
  },
  // 实际保存操作
  _doSave(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.hideLoading();
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },
  // 显示权限提示弹窗
  showPermissionModal() {
    wx.showModal({
      title: '权限申请',
      content: '需要相册权限才能保存图片',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting();
        }
      }
    });
  },

  gopatient: function (e) {
    console.log(e.currentTarget.dataset)
    const {index,dongtai} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pagedoctor/pages/patient/index?urid=${index}&dongtai=${dongtai}`
    })
  },
  goweight() {
    wx.navigateTo({
      url: '/pagedoctor/pages/weight/index'
    })
  },
  goabnormal() {
    wx.navigateTo({
      url: '/pagedoctor/pages/abnormal/index'
    })
  },
  goreminder() {
    wx.navigateTo({
      url: '/pagedoctor/pages/reminder/index'
    })
  },
  gosign() {
    wx.navigateTo({
      url: '/pagedoctor/pages/Management/index'
    })
  },
  getDoctorInfo: function () {
      api.doctor.getDoctorinfo().then(res => {
        if (res.code == 200) {
          console.log(res.data)
          this.setData({
            doctorinfo: res.data,
            bcode: res.data.bcode,
            // posterdata: new posterdata().palette(
            //                 res.data.bcode
            //             )
          })
          this.generateQRCode();
        }
      });
  },
  getFeeds: function () {
      api.doctor.getFeeds().then(res => {
        if (res.code == 200) {
          console.log(res.data)
          const formattedFeedslist = [];
          if (res.data.list) {
            res.data.list.forEach(item => {
              formattedFeedslist.push({
                ...item,
                formatted_time: this.formatTime(item.create_time)
              });
            });
          }
          this.setData({ feedslist: formattedFeedslist });
        }
      });
  },
  formatTime: function (timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${month}-${day} ${hours}:${minutes}`;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSystemInfo();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });
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
    this.getDoctorInfo()
    this.getFeeds()
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
    return {
      title: '这里是您的体重管理医生，快来绑定专属医生',
      path: `/pages/user/bind/detail?bcode=${this.data.bcode}`,
      imageUrl: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E9%82%80%E8%AF%B7%E5%A1%AB%E5%86%99%402x.png',
      success: () => {
        console.log('分享成功');
      }
    };
  },
})