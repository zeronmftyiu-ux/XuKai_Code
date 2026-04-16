// pages/sports/index.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['周', '月', '年', '总'],
    idx: 0,
    weekValue: '',
    months: [],
    month_idx: 0,
    years: [],
    year_idx: 0,
    total_date: '',

    sports: [{
      id: 1,
      name: '仰卧起坐',
      time: '3:09:02',
      percent: 36
    }, {
      id: 2,
      name: '户外跑步',
      time: '3:09:02',
      percent: 32
    }, {
      id: 3,
      name: '户外骑行',
      time: '3:09:02',
      percent: 32
    }],

    sports_times: 0,
    total_time: '00:00:00',
    distance: 0,
    calorie: 0,

  },
  toggleTab(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    })
    if (this.data.idx == 0) {
      this.setData({
        weekValue: moment().startOf('week').format('YYYY-MM-DD') + '~' + moment().endOf('week').format('YYYY-MM-DD')
      })
    } else if (this.data.idx == 1) {
      this.setData({
        month_idx: this.data.months.length - 1,
      })
    } else if (this.data.idx == 2) {
      this.setData({
        year_idx: 2,
      })
    } else {
      // 当年1月1号到12月31号
      this.setData({
        total_date: moment().format('YYYY-01-01') + '~' + moment().format('YYYY-12-31')
      })
    }
    this.getData()
  },
  toggleMonth(e) {
    this.setData({
      month_idx: e.currentTarget.dataset.idx
    })
    this.getData()
  },
  toggleYear(e) {
    this.setData({
      year_idx: e.currentTarget.dataset.idx
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var months = []
    for (var i = 0; i < 6; i++) {
      months.unshift({
        month: moment().subtract(i, 'months').format('MM月'),
        date: moment().subtract(i, 'months').format('YYYY-MM')
      })
    }
    this.setData({
      months: months,
      month_idx: months.length - 1,
    })
    if (this.data.idx == 0) {
      this.setData({
        weekValue: moment().startOf('week').format('YYYY-MM-DD') + '~' + moment().endOf('week').format('YYYY-MM-DD')
      })
    }
    var nowYear = moment().format('YYYY')
    this.setData({
      years: [nowYear - 2, nowYear - 1, nowYear],
      year_idx: 2,
    })
    this.getData()
  },
  getData() {
    if (this.data.idx == 0) {
      var data = {
        sdate: moment().startOf('week').format('YYYY-MM-DD'),
        edate: moment().endOf('week').format('YYYY-MM-DD'),
      }
    } else if (this.data.idx == 1) {
      var data = {
        sdate: this.data.months[this.data.month_idx].date + '-01',
        edate: moment(this.data.months[this.data.month_idx].date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
      }
    } else if (this.data.idx == 2) {
      var data = {
        sdate: this.data.years[this.data.year_idx] + '-01-01',
        edate: this.data.years[this.data.year_idx] + '-12-31',
      }
    } else {
      var data = {
        sdate: moment().format('YYYY-01-01'),
        edate: moment().format('YYYY-12-31'),
      }
    }
    console.log(data, 'data')
    wx.showLoading({
      title: '加载中...',
    })
    api.movewell.getSportData(data).then(res => {    
      if (res.code == 200) {
        wx.hideLoading()
        var sports_times = 0
        var total_time_bak = 0
        var total_time = '00:00:00'
        var distance = 0
        var calorie = 0
        var odata = []
        var sports = []
        for (var key in res.data) {
          if (res.data[key].length > 0) {
            odata = odata.concat(res.data[key])

            res.data[key].forEach(item => {
              // 计算总距离和总卡路里
              var dataSummary = JSON.parse(item.dataSummary)
              dataSummary.forEach(item => {
                if (item.dataTypeName == 'com.huawei.continuous.distance.total') {
                  item.value.forEach(value => {
                    distance = distance + Number(value.floatValue)
                  })
                  // distance = distance + Number(item.value[0].floatValue)
                }
                if (item.dataTypeName == 'com.huawei.continuous.calories.burnt.total') {
                  item.value.forEach(value => {
                    calorie = calorie + Number(value.floatValue)
                  })
                }
              })

              console.log(JSON.parse(item.dataSummary), 'JSON.parse(res.data[key])')
              total_time_bak = total_time_bak + Number(item.activityTime)
              sports_times++
            })
          }
        }
        total_time = this.formatMilliseconds(total_time_bak)
        // 根据odata数组里的type_desc进行分类
        var sports_map = {}
        odata.forEach(item => {
          if (sports_map[item.type_desc]) {
            sports_map[item.type_desc].push(item)
          } else {
            sports_map[item.type_desc] = [item]
          }
        })
        var sports_arr = []
        for (var key in sports_map) {
          sports_arr.push({
            name: key,
            list: sports_map[key]
          })
        }
        var total_time_bak = 0
        sports_arr.forEach(item => {
          item.list.forEach(sport => {
            total_time_bak += Number(sport.activityTime)
          })  
        })
        sports_arr.forEach(item => {
          var t = 0
          item.list.forEach(sport => {
            t = t + Number(sport.activityTime)
          })
          item.percent = (100*t/total_time_bak).toFixed(2)
          item.time_str = this.formatMilliseconds(t)
        })

        this.setData({
          sports_times: sports_times,
          total_time: total_time,
          distance: (distance / 1000).toFixed(2),
          calorie: calorie,
          sports: sports_arr
        })

      }
      // console.log(res,'res')
      // var sports = res.data.sports
      // var sports_times = 0
      // var total_time = '00:00:00'
      // var distance = 0
      // var calorie = 0
      // for(var i=0;i<sports.length;i++){
      //   sports_times += sports[i].time
      //   total_time = utils.formatTime(sports_times)
      //   distance += sports[i].distance
      //   calorie += sports[i].calorie
      // }
      // this.setData({
      //   sports: sports,
      //   sports_times: sports_times,
      //   total_time: total_time,
      //   distance: distance,
      //   calorie: calorie,
      // })
    })
  },
  formatMilliseconds(value) {
    // 如果value不是数字或者小于0，直接返回'00:00:00'
    if (isNaN(value) || value < 0) return '00:00:00';

    // 计算小时、分钟和秒
    let hours = Math.floor(value / 3600000);
    let minutes = Math.floor((value % 3600000) / 60000);
    let seconds = Math.floor((value % 60000) / 1000);

    // 格式化为两位数字的字符串
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // 返回格式化后的字符串
    return `${hours}:${minutes}:${seconds}`;
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