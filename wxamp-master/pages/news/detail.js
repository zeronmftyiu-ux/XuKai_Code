// pages/news/detail.js
import api from '../../request/index';

Page({
  data: {
    newsid: null,
    current: {},
    fromCamp: 0,
    camp_id: '',
    camp_name: ''
  },

  onLoad(options) {
    this.setData(
      {
        newsid: options.id,
        fromCamp: Number(options.fromCamp || 0),
        camp_id: options.camp_id || '',
        camp_name: decodeURIComponent(options.camp_name || '')
      },
      () => {
        this.get_news_detail();
      }
    );
  },

  get_news_detail() {
    api.movewell.getNewsdetail({ nid: this.data.newsid }).then(r => {
      wx.stopPullDownRefresh();
      this.setData({
        current: r.data || {}
      });
    });
  },

  goCampDetail() {
    const { camp_id } = this.data
    if (!camp_id) {
      wx.navigateBack()
      return
    }

    wx.navigateTo({
      url: `/pages/user/campDetail/index?camp_id=${camp_id}`
    })
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})