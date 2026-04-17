import api from '../../request/index';
import moment from "../../utils/moment";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  getmyfeedback() { 
    api.user.myfeedback().then(res => { 
      if (res.code == 200) {
        console.log(res.data,'feedlist');
        res.data.forEach(item => {
          item.create_time = moment(item.create_time*1000).format('YYYY-MM-DD HH:mm')
        });
        this.setData({
          list: res.data
        });
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
    this.getmyfeedback();
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