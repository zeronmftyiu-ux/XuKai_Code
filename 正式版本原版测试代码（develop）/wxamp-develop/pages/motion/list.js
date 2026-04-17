// pages/motion/list.js
import api from '../../request/index'
import moment from "../../utils/moment";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    sdate: '',
    edate: '',
    weekDays: [],
    list: [],
    detail: {},
    date: moment().format('YYYY-MM-DD'),
    show: false,
    maxDate: moment().valueOf(),
    minDate: moment().subtract(3, 'days').valueOf(),
    showS: false,
    showT: false,
    radio: null,
    sourelist: [],
    auth: false,
    isplan: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setCurrentDate(moment()); // 初始化为当前日期  
    this.init()
  },

  init() {
    api.user.sourcelist().then(res=>{
      if(res.code == 200) {
        this.setData({
          sourelist: res.data,
          radio: res.data.length>0?res.data[0].id:null
        })
      }
    })
  },

  // 设置当前日期
  setCurrentDate(date) {
    this.setData({
      currentDate: date,
    });
    this.generateCalendar();
  },

  add() {
    this.setData({
      show: true
    })
  },

  showTag() {
    if(this.data.auth) {
      api.movewell.syncHuaWeiData().then(res=>{
        if(res.code == 200) {
          wx.showToast({
            title: '同步数据完成',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/health/list'
      })
    }
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  onClose() {
    this.setData({
      show: false,
      showS: false,
      showT: false
    })
  },

  onConfirmT() {
    api.user.selectsrc({srcid: this.data.radio}).then(res=>{
      if(res.code == 200) {
        wx.showToast({
          title: '已选择完毕',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          show: false,
          showS: false,
          showT: false
        })
      }
    })  
  },
  
  changenum(e) {
    this.setData({
      'item.value': e.detail
    })
  },

  delFood() {
    let data = this.data.item
    if(data.value<=0) {
      wx.showToast({
        title: '请填写',
        icon: 'error',
        duration: 2000
      })
      return 
    }
    let query = {
      id: data.id,
      tplid: data.tplid,
      value: data.value,
      status: 2
    }
    api.movewell.editMyact(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        this.generateCalendar();
        this.setData({
          showS: false
        })
      }
    });
  },

  addFood() {
    let data = this.data.item
    if(data.value<=0) {
      wx.showToast({
        title: '请填写',
        icon: 'error',
        duration: 2000
      })
      return 
    }
    let query = {
      id: data.id,
      tplid: data.tplid,
      value: data.value
    }
    api.movewell.editMyact(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        this.generateCalendar();
        this.setData({
          showS: false
        })
      }
    });
  },

  onConfirm(event) {
    this.setData({
      show: false,
      date: moment(event.detail).format('YYYY-MM-DD'),
    });
    wx.navigateTo({
      url: "/pages/motion/add?date="+moment(event.detail).format('YYYY-MM-DD'),
    })
  },

  showEdit(e) {
    let { item } = e.currentTarget.dataset
    if(item.source == '手动添加') {
      api.movewell.tplDeatil({tplid: item.tplid}).then(res=>{
        if(res.code == 200) {
          item.unit = res.data.unit
          item.unitvalue = Math.floor(res.data.unitvalue*1)
          item.energy = res.data.value
          this.setData({
            item: item,
            showS: true
          })
        }
      })   
    }
  },

  gomo() {
    // wx.navigateTo({
    //   url: "/pages/motion/index"
    // })
  },

  // 生成日历
  generateCalendar() {
    const now = this.data.currentDate; // 当前日期
    // 获取当前周的起始日期（周一）和结束日期（周日）
    const startOfCurrentWeek = now.clone().startOf('week'); // 周一
    const endOfCurrentWeek = now.clone().endOf('week');   // 周日
    const sdate = startOfCurrentWeek.format('YYYY-MM-DD')
    const edate = endOfCurrentWeek.format('YYYY-MM-DD')
    const weekDays = [];
    api.movewell.myactlist({sdate,edate}).then(res=>{
      if(res.code == 200) {
        let list = []
        let item = []
        let num = 0
        let cal = 0
        let pin = 0
        let isplan = false
        for (let i = 0; i < 7; i++) {
          if(res.data[startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD')].act) {
            item = res.data[startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD')].act
            num += 1
            pin += res.data[startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD')].plan*1
            item.forEach(row=>{
              cal+= row.calorie*1
            })
            if(res.data[startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD')].plan*1 > 0) {
              isplan = true
            }
            list.unshift({
              date: startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD'),
              item
            })
          }
          
          weekDays.push({
            value: startOfCurrentWeek.clone().add(i, 'days').format('D'),
            date: startOfCurrentWeek.clone().add(i, 'days').format('YYYY-MM-DD')
          })
        }
        this.setData({
          sdate,edate,weekDays,list,
          isplan,
          detail: {
            num,cal:parseFloat(cal.toFixed(2)),pin: parseFloat(pin/num).toFixed(2),pcal: parseFloat(cal/num).toFixed(2),pro:Math.floor((cal/num)/pin*100)>100?100:Math.floor((cal/num)/pin*100)
          }
        })
      }
    })
  },

  // 切换到上一月
  prevMonth() {
    const newDate = this.data.currentDate.clone().subtract(1, 'weeks');
    console.log(newDate,'newDate')
    this.setCurrentDate(newDate);
  },

  // 切换到下一月
  nextMonth() {
    const newDate = this.data.currentDate.clone().add(1, 'weeks');
    console.log(newDate,'newDate')
    const today = moment().format('YYYY-MM-DD')
    if(newDate.format('YYYY-MM-DD') > today){
      wx.showToast({
        title: '下周的运动还未开始哦～',
        icon: 'none'
      })
      return
    }
    this.setCurrentDate(newDate);
  },

  goback() {
    wx.navigateBack()
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
    this.generateCalendar();
    this.config()
  },

  config() {
    api.movewell.isAuth().then(res=>{
      this.setData({
        auth: res.data.auth
      })
    })
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