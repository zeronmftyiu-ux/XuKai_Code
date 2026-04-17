// pages/report/view.js
import api from '../../request/index';
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    recommend: [],
    abnormal: [],
    normal: [],
    active: 1,
    reportid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      reportid: options.id
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  init() {
    api.medical.reportAnalyze({reportid: this.data.reportid}).then(res=>{
      if(res.code == 200) {
        let recommends = [
          {
            type: 1,
            typename: '紧急事项：',
            list: []
          },
          {
            type: 2,
            typename: '⽣活⽅式优化：',
            list: []
          }
        ]
        res.data.explain.recommends.forEach(item=>{
          if(item.type==1) {
            recommends[0].list.push(item)
          } else {
            recommends[1].list.push(item)
          }
        })
        this.setData({
          normal: res.data.explain.normals,
          abnormal: res.data.explain.abnormals,
          recommend: recommends,
          detail: res.data
        })
      }
    })
  },

  openorc() {
    api.medical.reportOrigin({reportid: this.data.reportid}).then(res=>{
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
    

change(e) {
    var { type,active } = e.currentTarget.dataset
    this.setData({
      active: active*1
    })
    console.log('type', type,active);
    // 设置标志位，表示这是由点击tab触发的滚动
    this.isUserScrolling = false;
    this.manualScrolling = true;
    setTimeout(() => {
      this.manualScrolling = false;
    }, 500);

    // 滚动到页面底部
    if (active == 3) {
      // 创建查询对象
      const query = wx.createSelectorQuery();
      // 查询页面整体高度
      query.selectViewport().scrollOffset();
      query.select('.main').boundingClientRect();
      query.exec((res) => {
        const scrollTop = 99999;
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300
        });
      });
    } else {
      const query = wx.createSelectorQuery();
      query.select(type).boundingClientRect(rect => {
        if (rect) {
          wx.pageScrollTo({
            scrollTop: rect.top - 80,
            duration: 300
          });
        }
      }).exec();
    }
  },

  onPageScroll(e) {
    // 手动滚动自动检测tab
    if (this.manualScrolling) {
      return;
    }
    
    // 标记为用户滚动
    this.isUserScrolling = true;

    // 防抖处理
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('#abnormal').boundingClientRect();
      query.select('#normal').boundingClientRect();
      query.select('#recommend').boundingClientRect();
      query.selectViewport().scrollOffset();
      
      query.exec((res) => {
        const scrollTop = e.scrollTop;
        const abnormalTop = res[0]?.top + scrollTop || 0;
        const normalTop = res[1]?.top + scrollTop || 0;
        const recommendTop = res[2]?.top + scrollTop || 0;
        
        // 计算当前应该激活的tab
        let currentActive = 1;
        if (scrollTop >= recommendTop - 80) {
          currentActive = 3;
        } else if (scrollTop >= normalTop - 80) {
          currentActive = 2;
        } else if (scrollTop >= abnormalTop - 80) {
          currentActive = 1;
        }
        
        // 更新active状态
        if (this.data.active !== currentActive) {
          this.setData({
            active: currentActive
          });
        }
      });
    }, 50);
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
    clearTimeout(this.scrollTimer);
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