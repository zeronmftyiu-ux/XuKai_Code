// pages/user/info.js
import api from '../../request/index';
import moment from "../../utils/moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '昵称',
    // realname: '张某',
    gender: '男',
    birth: '1998年9月20日',
    height: '170cm',
    weight: '60.00kg',
    show: false,
    title: '',
    dvalue: '',
    minDate: new Date(1949, 0, 1).getTime(),
    currentDate: new Date(1990, 0, 1).getTime(),
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
    console.log(111)
    const app = getApp();
    console.log(app)
    if (app.globalData.globalInitialized) {
      // 全局方法已经执行完毕，执行页面的方法
      this.getUserInfo();

    } else {
      // 全局方法还未执行完毕，等待
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          // 全局方法执行完毕后，执行页面的方法
          console.log('页面的 onLoad 方法执行');
          this.getUserInfo();
        } else {
          // 继续等待
          setTimeout(checkGlobalInitialized, 100);
        }
      };
      checkGlobalInitialized();
    } 
  },
  getUserInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        this.setData({
          nickname: res.data.nickname,
          // realname: '张某',
          gender: res.data.gender ? res.data.gender : '',
          birth: res.data.birthday ? res.data.birthday : '',
          height: res.data.channel.length ? res.data.channel[0].height : '',
          weight: res.data.channel.length ? res.data.channel[0].weight : '',
        });
      }
    });
  },
  showDialog(e){
    console.log('e.currentTarget.dataset.label', this.data)
    this.setData({
      show: true,
      title: e.currentTarget.dataset.label
    })
    if(this.data.title == '昵称'){
      this.setData({
        dvalue: this.data.nickname
      })
    }
    if(this.data.title == '身高'){
      this.setData({
        dvalue: this.data.height
      })
    }
    if(this.data.title == '体重'){
      this.setData({
        dvalue: this.data.weight
      })
    }
    if(this.data.title == '性别'){
      this.setData({
        dvalue: this.data.gender == '男' || this.data.gender == '未知' ? '1' : '2'
      })
    }
    if(this.data.title == '出生日期'){
      this.setData({
        dvalue: new Date(1949, 0, 1).getTime(),
      })
    }
  },
  onClose(){
    this.setData({
      show: false,
    })
  },
  onChange(e){
    this.setData({
      dvalue: e.detail,
    });
  },
  handleSubmit(){
    console.log('提交')
    let query = {}
    if(this.data.title == '昵称'){
      query.nickname = this.data.dvalue
    }
    if(this.data.title == '身高'){
      query.height = this.data.dvalue
    }
    if(this.data.title == '体重'){
      query.weight = this.data.dvalue
    }
    if(this.data.title == '性别'){
      query.gender = this.data.dvalue*1
    }
    if(this.data.title == '出生日期'){
      query.birth = this.data.dvalue
    }
    console.log(query,'query')
    api.user.editInfo(query).then(res=>{
      if(res.code == 200) {
        this.getUserInfo()
      }
    })
    this.onClose()
  },
  changeDate(event) {
    console.log('event', event.detail.getColumnValue(0))
    this.setData({
      dvalue: `${event.detail.getColumnValue(0)}-${event.detail.getColumnValue(1)}-${event.detail.getColumnValue(2)}`
    });
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