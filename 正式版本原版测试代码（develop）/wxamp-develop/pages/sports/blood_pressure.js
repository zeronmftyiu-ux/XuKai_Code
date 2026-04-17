// pages/sports/heart.js
import moment from "../../utils/moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: {
      a: '高压（收缩压）',
      b: '低压（舒张压）',
    },
   
    tab: ['日', '周', '月'],
    idx: 0,
    dayValue: '2024年10月6日',
    weekValue: '2024年9月30日-2024年10月6日',
    total_date: '2024年9月30日-2024年12月31日',
    months: ['6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    month_idx: 0,
    years: ['2023年', '2024年', '2025年'],
    year_idx: 0,
    show: false,
    minDate: new Date(2023, 0, 1).getTime(),
    list: [1,1,1,1],
    option: {}
  },
  toggleTab(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    })
    this.setEcharts()
  },
  showDate() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  selectDate(e) {
    this.setData({ show: false });
    console.log(e, 'e')
    this.setData({
      dayValue: moment(e.detail).format('YYYY年MM月DD日')
    })
  },
  toggleMonth(e) {
    this.setData({
      month_idx: e.currentTarget.dataset.idx
    })
  },
  toggleYear(e) {
    this.setData({
      year_idx: e.currentTarget.dataset.idx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setEcharts()
  },
  setEcharts(){
    if(this.data.idx == 0){
      var xData = ['00:00', '06:00', '12:00', '18:00', '24:00']
      var yData1 = [88, 72, 60, 80, 90]
      var yData2 = [128, 112, 100, 120, 130]
    }else if(this.data.idx == 1){
      var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
      var yData1 = [88, 72, 60, 80, 66]
      var yData2 = [138, 122, 111, 120, 130]
    }else {
      var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
      var yData1 = [78, 82, 75, 81, 69]
      var yData2 = [138, 138, 111, 120, 130]
    }
    const option = {
      color: ['#88CEFA', '#EAA646'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      textStyle: {color: '#333'},
      xAxis: {
        type: 'category',
        data: xData    
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      series: [
        {
          name: '低压',
          type: 'bar',
          data: yData1
        },
        {
          name: '高压',
          type: 'bar',
          data: yData2
        }
      ]
    }
    this.setData({ 
      option: option
    })
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