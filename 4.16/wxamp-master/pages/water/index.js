// pages/food/index.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekConfig: {
      0: '日',
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
    },
    week: ['日', '一', '二', '三', '四', '五', '六'],
    day: [],
    idx: 0,
    date: '',
    now_water: 0,
    now_percent: 0,
    remain_water: 0,
    total_water: 1500,
    total_day: 0,
    balance_water: 0,
    water: 100,
    list: [{
      type: '1',
      time: '08:32:00',
      food: [{
        url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        name: '脱脂牛奶',
        kcal: '-',
        num: 9,
        unit: '杯'
      }, {
        url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        name: '煮玉米',
        kcal: '20',
        num: 1,
        unit: '根'
      }]
    }, {
      type: '2',
      time: '12:32:00',
      food: [{
        url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        name: '炒菜',
        kcal: '-',
        num: 1,
        unit: '盘'
      }, {
        url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        name: '凉拌鸡胸肉',
        kcal: '20',
        num: 1,
        unit: '盘'
      }]
    }, {
      type: '3',
      time: '18:32:00',
      food: [{
        url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        name: '米饭',
        kcal: '300',
        num: 1,
        unit: '碗'
      }]
    }],

    img_url: 'https://oss.mcloud.moveclub.cn/mcloudbkh5/20241227/1735288097-676e6521e2139.jpeg',
    show: false,
    food_name: '',
    food_num: '',
    option1: [
      { text: '克', value: '克' },
      { text: '盘', value: '盘' },
      { text: '小盘', value: '小盘' },
      { text: '杯', value: '杯' },
      { text: '瓶', value: '瓶' },
      { text: '个', value: '个' },
      { text: '只', value: '只' },
      { text: '片', value: '片' },
      { text: '盒', value: '盒' },
      { text: '袋', value: '袋' },
    ],
    value1: '个',

    types: ['早餐', '午餐', '晚餐', '其他'],
    tidx: 0,

  },
  chooseImage() {
    var _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(res.tempFiles[0].size)
        // var tempFilePaths = res.tempFilePaths;
        wx.showLoading({ title: '上传中' });
        wx.uploadFile({
          url: pararms.uploadurl,
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          formData: utils.uploadparams(),
          success: function (res) {
            var data = res.data;
            // console.log('res.data', res.data)
            // //do something\
            var data = JSON.parse(data);
            if (data.code == 200) {
              _this.setData({
                img_url: data.data.imgurl,
                show: true,
              })
              // that.changestate(key, data.data.imgurl);
            } else {
              utils.ALERT(data.message);
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        });
      }
    })
  },

  onClose(){
    this.setData({
      show: false
    })
  },


  goback() {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: moment().format('YYYY-MM-DD')
    })
    this.today()
    this.getData()
    this.getTotalData()

  },

  today() {
    let startOfWeek = moment().startOf('week'); // 当前周的开始（周日）
    console.log(startOfWeek)
    // 创建一个数组来保存一周的日期
    let arr = [];

    for (let i = 0; i < 7; i++) {
        arr.push({
          value: startOfWeek.clone().add(i, 'days').format('D'),
          date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
        })
    }
    console.log(arr,'arr')
    this.setData({
      day: arr,
      idx: 0
    })
  },

  up() {
    let idx = this.data.idx
    idx += -1
    let startOfWeek = ''
    if(idx == 0) {
      this.today()
      return      
    } else if(idx <0) {
      startOfWeek = moment().subtract(Math.abs(idx), 'week').startOf('week');
    } else {
      startOfWeek = moment().add(idx, 'week').startOf('week');
    }
    // 创建一个数组来保存一周的日期
    let arr = [];

    for (let i = 0; i < 7; i++) {
        arr.push({
          value: startOfWeek.clone().add(i, 'days').format('D'),
          date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
        })
    }
    console.log(arr,'arr')
    this.setData({
      day: arr,
      idx: idx
    })
  },

  down() {
    let idx = this.data.idx
    idx += 1
    let startOfWeek = ''
    if(idx == 0) {
      this.today()
      return      
    } else if(idx <0) {
      startOfWeek = moment().subtract(Math.abs(idx), 'week').startOf('week');
    } else {
      startOfWeek = moment().add(idx, 'week').startOf('week');
    }
      // 当前周的开始（周日）
    console.log(startOfWeek)
    // 创建一个数组来保存一周的日期
    let arr = [];

    for (let i = 0; i < 7; i++) {
        arr.push({
          value: startOfWeek.clone().add(i, 'days').format('D'),
          date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
        })
    }
    console.log(arr,'arr')
    this.setData({
      day: arr,
      idx: idx
    })
  },
  getTotalData(){
    var data = {
      sdate: moment().startOf('month').format('YYYY-MM-DD'),
      edate: moment().endOf('month').format('YYYY-MM-DD'),
    }
    wx.showLoading({
      title: '请稍候...'
    })
    api.movewell.getWaterData(data).then(r => {
      wx.hideLoading()
      if (r.code == 200) {
        // console.log(r.data)
        if(r.data.length == 0){
          this.setData({
            total_day: 0,
            balance_water: 0,
          })
        }else{
          var d = 0
          var total = 0
          r.data.forEach(item => {
            total = total + Number(item.amount)
            if(Number(item.amount) == this.data.total_water){      
              d++
            }
          })
          this.setData({
            total_day: d,
            balance_water: (total/r.data.length).toFixed(2)
          })
        }     
      }
    })
  },
  toggleDate(e){
    this.setData({
      idx: e.currentTarget.dataset.index,
      date: e.currentTarget.dataset.date
    })
    this.getData()
  },
  getData(){
    var data = {
      sdate: this.data.date,
      edate: this.data.date,
    }
    // now_water: 0,
    // now_percent: 0,
    // remain_water: 0,
    // total_water: 1500,
    wx.showLoading({
      title: '请稍候...'
    })
    api.movewell.getWaterData(data).then(r => {
      wx.hideLoading()
      if (r.code == 200) {
        console.log(r.data)
        if(r.data.length == 0){
          this.setData({
            now_water: 0,
            now_percent: 0,
            remain_water: this.data.total_water,
          })
        }else{
          this.setData({
            now_water: (Number(r.data[0].amount)).toFixed(0),
            now_percent: ((Number(r.data[0].amount)/Number(this.data.total_water))*100).toFixed(2),
            remain_water: Number(this.data.total_water) - Number(r.data[0].amount)
          })
        }     
      }
    })
  },
  handleSet(e){
    var { flag } = e.currentTarget.dataset
    switch(flag*1) {
      case 1:
        if(this.data.now_water <= 0){
          wx.showToast({
            title: '当前饮水量为0！',
            icon: 'none'
          })
          return
        }
        var data = {
          date: this.data.date,
          amount: -100
        }
        wx.showLoading({
          title: '请稍候...'
        })
        api.movewell.setWaterData(data).then(r => {
          wx.hideLoading()
          if (r.code == 200) {
            this.getData()
            this.getTotalData()
          }
        })
        break
      case 2:
        if(this.data.now_water >= this.data.total_water){
          wx.showToast({
            title: '当天已达到饮水标准！',
            icon: 'none'
          })
          return
        }
        var data = {
          date: this.data.date,
          amount: 100
        }
        wx.showLoading({
          title: '请稍候...'
        })
        api.movewell.setWaterData(data).then(r => {
          wx.hideLoading()
          if (r.code == 200) {
            this.getData()
            this.getTotalData()
          }
        })
        break
      case 3:
        this.setData({
          show: true
        })
        break
    }
  },

  changenum(e) {
    this.setData({
      water: e.detail
    })
  },

  submit() {
    if(this.data.water <= 0) {
      wx.showToast({
        title: '请先设置标准！',
        icon: 'none'
      })
      return
    }
    api.movewell.setStandard({signtype: 2,value: this.data.water}).then(res=>{
      if(res.code == 200) {
        wx.showToast({
          title: '设置成功！',
          icon: 'none'
        })
        this.setData({
          show: false
        })
      }
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

  }
})