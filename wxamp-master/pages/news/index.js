// pages/news/index.js
import moment from "../../utils/moment";
import api from '../../request/index';

Page({
  data: {
    newlist: [],
    page: 1,
    fromCamp: 0,
    camp_id: '',
    camp_name: ''
  },

  onLoad(options) {
    this.setData({
      fromCamp: Number(options.fromCamp || 0),
      camp_id: options.camp_id || '',
      camp_name: decodeURIComponent(options.camp_name || '')
    })
    this.getNews()
  },

  getNews() {
    var data = {
      page: this.data.page,
    }

    wx.showLoading({
      title: '加载中',
    })

    api.movewell.getNewsData(data).then(r => {
      if (r.code == 200) {
        wx.hideLoading()
        const list = (r.data.list || []).map(item => {
          item.create_time = moment(Number(item.create_time) * 1000).format('YYYY-MM-DD HH:mm:ss')
          return item
        })

        this.setData({
          newlist: this.data.newlist.concat(list),
        })
      } else {
        wx.hideLoading()
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({
        title: '资讯加载失败',
        icon: 'none'
      })
    })
  },

  go_news_detail(e) {
    let id = e.currentTarget.dataset.id;
    let url = `./detail?id=${id}`

    if (this.data.fromCamp && this.data.camp_id) {
      url += `&camp_id=${encodeURIComponent(this.data.camp_id)}&camp_name=${encodeURIComponent(this.data.camp_name || '')}&fromCamp=1`
    }

    wx.navigateTo({ url });
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

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getNews()
  },

  onShareAppMessage() {}
})