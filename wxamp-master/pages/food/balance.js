// pages/food/balance.js
import api from '../../request/index'
import moment from "../../utils/moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdate: moment().startOf('month').format('YYYY-MM-DD'),
    edate: moment().endOf('month').format('YYYY-MM-DD'),
    calendar: [],
    currentMonth: '', // 当前月份显示
    currentDate: null,
    width: 29,
    daydata: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setCurrentDate(moment()); // 初始化为当前日期
    const widthInPx = this.rpxToPx(58);
    this.setData({ width: widthInPx });
  },

  rpxToPx(rpx) {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth;
    return (rpx * screenWidth) / 750;
  },

  init() {
    
  },

  goback() {
    wx.navigateBack()
  },

  // 设置当前日期
  setCurrentDate(date) {
    this.setData({
      currentDate: date,
    });
    this.generateCalendar();
  },

  // 生成日历
  generateCalendar() {
    const now = this.data.currentDate; // 当前日期
    const startOfMonth = now.clone().startOf('month'); // 当月第一天
    const endOfMonth = now.clone().endOf('month'); // 当月最后一天
    console.log(startOfMonth.format('YYYY-MM-DD'),endOfMonth.format('YYYY-MM-DD'))
    const daysInMonth = endOfMonth.date(); // 当月天数
    const firstDayOfWeek = startOfMonth.day(); // 当月第一天是星期几 (0-6)
    const sdate = startOfMonth.format('YYYY-MM-DD')
    const edate = endOfMonth.format('YYYY-MM-DD')

    const calendar = [];
    
    api.movewell.getBalance({
      sdate: sdate,
      edate: edate
    }).then(res=>{
      if(res.code == 200) {
        let datas = res.data
        let color = ''
        let date = {}
        let value = 0
        let list = []
        let more = 0
        let nal = 0
        let less = 0
        // 填充上个月的空白
        for (let i = 0; i < firstDayOfWeek; i++) {
          calendar.push(null); // 空白占位
        }
        // 填充当月的日期
        for (let i = 0; i < daysInMonth; i++) {
          color = '#CDE0DD'
          value = 0
          
          date = datas[startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD')]?datas[startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD')]:{}
          if(date.banlance) {
            if(date.banlance<0) {
              value = 100
              color =  '#FF8D4F'
              more++
            } else if (date.banlance == 0) {
              value = 100
              color =  '#00C7C7'
              nal++
            } else {
              color =  '#16BF92'
              value = Math.floor(100 - (date.banlance * 100 / date.standard_intake*1))
              less++
            }

            list.push({
              date: startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
              calorie_intake: date.calorie_intake,
              exercise: date.exercise,
              standard_intake: date.standard_intake,
              banlance: date.banlance,
              color
            })
          }
          calendar.push({
            value: startOfMonth.clone().add(i, 'days').format('D'),
            date: startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
            color,
            pro:value
          })
          
        }
        // 更新数据
        this.setData({
          calendar: calendar,
          currentMonth: now.format('YYYY年MM月'), // 显示当前月份
          list: list,
          daydata: {
            more: more,
            nal: nal,
            less: less
          }
        });
      }
    })
  
  },

  // 切换到上一月
  prevMonth() {
    const newDate = this.data.currentDate.clone().subtract(1, 'month');
    console.log(newDate,'newDate')
    this.setCurrentDate(newDate);
  },

  // 切换到下一月
  nextMonth() {
    const newDate = this.data.currentDate.clone().add(1, 'month');
    console.log(newDate,'newDate')
    this.setCurrentDate(newDate);
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

  }
})