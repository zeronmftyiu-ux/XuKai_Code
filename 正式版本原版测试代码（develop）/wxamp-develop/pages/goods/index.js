// pages/goods/index.js
import api from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateid: '',
    page: 1,
    pages: 1,
    cateList: [],
    List: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getcate()
  },

  getcate() {
    api.goods.getCateList().then(res => {
      console.log(res,'res')
      this.setData({
        cateList: res.data,
        cateid: res.data.length>0?res.data[0]['cate_id']*1:0
      })
      this.getlist(true)
    })
    
  },

  godetail(e) {
    let { goodsid } = e.currentTarget.dataset;
    wx.navigateToMiniProgram({
      appId: 'wxa863d79fc207f115',
      path: 'pages/goods/detail/index?goodsid=' + goodsid
    })
  },

  getlist($refresh) {
    if ($refresh) {
      this.data.page = 1;
    } else {
      this.data.page++;
      if (this.data.page > this.data.pages) {
        this.data.page = this.data.pages;
        return;
      }
    }
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    });
    let query = {
      page: this.data.page,
      cate_id:this.data.cateid,
      app: 'welfare'
    }
    api.goods.getList(query).then(res => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      let list = this.data.List

      if (!$refresh) {
        list = list.concat(res.data.list);
      } else {
        list = res.data.list;
      }
      this.setData({
        page: res.data.page,
        pages: res.data.pages,
        List: list
      });
    })
  },

  gocate(e) {
    let { cateid } = e.currentTarget.dataset;
    this.setData({
      cateid: cateid
    })
    this.getlist(true)
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
    this.getlist(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getlist(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})