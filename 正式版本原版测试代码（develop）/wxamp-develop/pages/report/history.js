// pages/report/history.js
import api from '../../request/index';
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: {
        currentPage: 1,
        pageCount: 1
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

  getList($refresh) {
    if ($refresh) {
      this.data.page.currentPage = 1;
    } else {
      this.data.page.currentPage++;
      if (this.data.page.currentPage > this.data.page.pageCount) {
          this.data.page.currentPage = this.data.page.pageCount;
          return;
      }
    }
    wx.showNavigationBarLoading();
    wx.showLoading({
        title: "加载中..."
    });
    let query = {
      page: this.data.page.currentPage,
    };
    api.medical.myReports(query).then(res=>{
      wx.stopPullDownRefresh();
      wx.hideLoading();
      wx.hideNavigationBarLoading()

      let list = this.data.list;
      
      if (!$refresh) {
          list = list.concat(res.data.list);
      } else {
          list = res.data.list;
      }
      console.log(list)

      let page = {
        currentPage: res.data.page*1,
        pageCount: res.data.pages*1
      }

      this.setData({
          page: page,
          list: list
      });
    })
  },

  openorc(e) {
    var { id,state,type } = e.currentTarget.dataset
    api.medical.reportOrigin({reportid: id}).then(res=>{
      if(res.code == 200 && res.data.length>0) {
        if(res.data[0].file_type === 'application/pdf') {
          utils.openDoc(res.data[0].url)
        } else {
          wx.previewImage({
            current: res.data[0].url,
            urls: [res.data[0].url]
          });
        }        
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getList(true);
  },

  goResult(e) {
    var { id,state } = e.currentTarget.dataset
    if(state*1 >= 4) {
      utils.ALERT('文件异常，无法解读')
      return
    }
    if(state*1 < 3) {
      utils.ALERT('识别中，请耐心等待')
      return
    }
    
    wx.navigateTo({
      url: '/pages/report/view?id=' + id
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

  }
})