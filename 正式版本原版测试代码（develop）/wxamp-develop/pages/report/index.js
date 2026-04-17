// pages/report/index.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import api from '../../request/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    progress: 0,
    active: 1 // 控制显示哪个状态页面
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
    this.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  goback() {
    wx.navigateBack({
      fail: function () {
        wx.switchTab({
            url: '/pages/index/index'
        });
      }
    })
  },

  init() {
    api.medical.myReports({page:1}).then(res=>{
      if(res.code == 200) {
        let active = 1
        let progress = 0
        if(res.data.list.length > 0) {
          let data = res.data.list[0]
          if(data.readflag == 0 && data.state < 4) {
            if(data.state < 3) {
              active = 2
            } else {
              active = 3
            }

            switch(data.state*1){
              case 0:
                progress = 25
                break
              case 1:
                progress = 50
                break
              case 2:
                progress = 75
                break
            }
            this.startTimer();
          }

          this.setData({
            progress,
            info: data
          })
        }

        this.setData({
            active: active
        })
      }
    })
  },

  startTimer() {
    let that = this
    const timer = setInterval(() => {
       api.medical.myReports({page:1}).then(res=>{
        if(res.code == 200) {
          let active = 1
          let progress = 0
          if(res.data.list.length > 0) {
            let data = res.data.list[0]
            if(data.readflag == 0 && data.state < 4) {
              if(data.state < 3) {
                active = 2
              } else {
                active = 3
              }

              switch(data.state*1){
                case 0:
                  progress = 25
                  break
                case 1:
                  progress = 50
                  break
                case 2:
                  progress = 75
                  break
              }
            } else {
              let timer2 = that.data.timer;
              if (timer2) {
                clearInterval(timer2);
                that.setData({ timer: null });
              }   
            }

            that.setData({
              progress,
              info: data
            })
          }

          that.setData({
              active: active
          })
        }
      })
      console.log('计数:', this.data.count);
    }, 1000);

    // 保存定时器 ID 到页面实例或 data 中
    this.setData({ timer });
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
    const timer = this.data.timer;
    if (timer) {
      clearInterval(timer);
      this.setData({ timer: null });
    }
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

  // 跳转到历史记录页面
  goHistory() {
    wx.navigateTo({
      url: '/pages/report/history'
    });
  },

  // 跳转到结果页面
  goResult() {
    wx.navigateTo({
      url: '/pages/report/view?id='+this.data.info.report_id
    });
  },

  // 上传文件
  uploadFile(e) {
    var { type } = e.currentTarget.dataset

    switch(type*1) {
      case 1:
      case 2:
        this.chooseImage(type);
        break
      case 3:
        this.chooseMessageFile();
        break
    }
  },

  // 选择图片
  chooseImage(type) {
    let sourceType = ['album']
    if(type == 1) {
      sourceType = ['camera']
    }
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: sourceType,
      success: (res) => {
        var tempFilePaths = res.tempFiles;
        // console.log(res,'tempFilePaths')
        this.uploadToOSS(tempFilePaths[0].tempFilePath);
      },
      fail: (res) => {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 选择文件
  chooseMessageFile() {
    if (wx.chooseMessageFile) {
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['pdf','PDF'],
        success: (res) => {
          var tempFilePaths = res.tempFiles;
          // console.log(tempFilePaths,'tempFilePaths')
          if (tempFilePaths.length > 0) {
            this.uploadToOSS(tempFilePaths[0].path);
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '选择文件失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '微信版本不支持文件选择',
        icon: 'none'
      });
    }
  },

  // 上传到OSS
  uploadToOSS(filePath) {
    let that = this
    // 模拟上传过程
    wx.showLoading({
      title: '上传中...',
    });
    wx.uploadFile({
      url: pararms.uploadurl2,
      filePath: filePath,
      name: 'file',
      formData: utils.uploadparams(),
      success: function (res) {
        var data = res.data;
        console.log('res.data', res.data)
        // //do something\
        var data = JSON.parse(data);
        if (data.code == 200) {
          var imgUrl = data.data.imgurl;
          // 1. 找到第一个 "//" 之后的部分，然后提取路径
          var pathStart = imgUrl.indexOf('//') + 2;
          var pathOnly = imgUrl.substring(imgUrl.indexOf('/', pathStart)); // 从第一个路径 / 开始截取

          var pathWithoutSlash = pathOnly.substring(1);

          // 2. 提取文件名（路径最后一部分）
          var fileName = pathOnly.split('/').pop();

          // 输出
          console.log('去掉域名的路径:', pathOnly);     // /movewell/20251010/1760060251-68e8635b77e07.pdf
          console.log('文件名:', fileName);  
          api.medical.reportUpload({url: pathWithoutSlash,filename: fileName}).then(res=>{
            that.init()
          })
          // _this.setData({
          //   'form.imgurl': data.data.imgurl
          // })
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
});