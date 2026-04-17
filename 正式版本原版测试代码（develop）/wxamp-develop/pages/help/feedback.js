var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import api from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typelist:[
      {
        name:'功能异常',
        value:'功能异常'
      },
      {
        name:'体验问题',
        value:'体验问题'
      },
      {
        name:'功能建议',
        value:'功能建议'
      },
      {
        name:'其他反馈',
        value:'其他反馈'
      }
    ],
    choosetab: null,
    allinput: {
      phone: '',
      content: '',
      type: '',
      images: []
    },
    fileList: [],

  },
  choosetabs(e) {
    const type = e.currentTarget.dataset.type;
    const value = e.currentTarget.dataset.value;
    this.setData({
      choosetab: type,
      [`allinput.type`]: value,
    })
  },
  onInput1(e) {
    this.setData({
      [`allinput.content`]: e.detail.value,
    });
  },
  onInput2(e) {
    this.setData({
      [`allinput.phone`]: e.detail.value,
    });
  },
  // 同步上传图片
  async afterRead(e) {
    let that = this;
    const { file } = e.detail;
    console.log('file', file)
    for (let i = 0; i < file.length; i++) {
      try {
        const res = await new Promise((resolve, reject) => {
          wx.uploadFile({
            url: pararms.uploadurl,
            filePath: file[i].url,
            name: 'file',
            formData: utils.uploadparams(),
            success: resolve,
            fail: reject
          });
        });
          var data = JSON.parse(res.data);
          if (data.code == 200) {
            const fileList = that.data.fileList;
            const images = that.data.allinput.images;
            fileList.push({ ...file[i], url: data.data.imgurl });
            images.push(data.data.imgurl);
            that.setData({
              [`allinput.images`]: images,
              fileList: fileList
            })
            console.log('images', images, i)
          } else {
            utils.ALERT(data.message);
          }
      } catch (err) {
        utils.ALERT('上传失败');
      }
    }
  },
  // 删除图片
  deleteimg(e){
    const index = e.detail.index;
    const newFileList = this.data.fileList.filter((_, i) => i !== index);
    this.setData({
      fileList: newFileList,
      'allinput.images': newFileList.map(f => f.url)
    });
  },
  submitinput(){
    const params = {
      content: this.data.allinput.content,
      images: this.data.allinput.images,
      type: this.data.allinput.type,
      phone: this.data.allinput.phone
    }
    if(params.content == '' || params.type == '' || params.phone == ''){
      wx.showToast({
        title: '请填写反馈内容',
        icon: 'none'
      })
      return
    }
    console.log('params', params)
    api.user.addfeedback(params).then(res => {
      if (res.code == 200) {
        utils.ALERT('提交成功');
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/help/hisfeback'
          })
        }, 1000);
      }
    });
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