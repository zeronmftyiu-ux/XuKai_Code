var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: {
      a: '放松',
      b: '正常',
      c: '中等',
      d: '偏高'
    },

    tab: ['周', '月', '年'],
    idx: 0,
    dayValue: '',
    weekValue: '',
    total_date: '',
    months: [],
    month_idx: 0,
    years: [],
    year_idx: 0,
    show: false,
    minDate: new Date(2023, 0, 1).getTime(),
    list: [1, 1, 1, 1],
    option: {},

    pressureData: [{
      type: '放松',
      value: 2,
      time: '2分钟',
      color: 'color1',
      border: 'border1'
    }, {
      type: '正常',
      value: 98,
      time: '1 小时 47 分钟',
      color: 'color2',
      border: 'border2'
    }, {
      type: '中等',
      value: 0,
      time: '0分钟',
      color: 'color3',
      border: ''
    }, {
      type: '偏高',
      value: 0,
      time: '0分钟',
      color: 'color4',
      border: ''
    }],

    maxvalue: 0,
    minvalue: 0,
    lastvalue: 0,
    avgvalue: 0,

  },
  toggleTab(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    })
    if (this.data.tab[this.data.idx] == '周') {
      this.setData({
        dayValue: moment().format('YYYY-MM-DD'),
        weekValue: moment().startOf('week').format('YYYY-MM-DD') + '~' + moment().endOf('week').format('YYYY-MM-DD')
      })
    } else if (this.data.tab[this.data.idx] == '月') {
      this.setData({
        month_idx: this.data.months.length - 1,
      })
    } else if (this.data.tab[this.data.idx] == '年') {
      this.setData({
        year_idx: 2,
      })
    }
    this.getData()
    // this.setEcharts()
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
      dayValue: moment(e.detail).format('YYYY-MM-DD'),
      weekValue: moment(e.detail).startOf('week').format('YYYY-MM-DD') + '~' + moment(e.detail).endOf('week').format('YYYY-MM-DD'),
      show: false
    })
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
      dayValue: moment().format('YYYY-MM-DD')
    })
    // if (this.data.idx == 0) {
    //   this.setData({
    //     dayValue: moment().format('YYYY-MM-DD')
    //   })
    // }
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
    // this.setEcharts()
  },
  getData() {
    if (this.data.tab[this.data.idx] == '周') {
      var data = {
        sdate: moment(this.data.dayValue).startOf('week').format('YYYY-MM-DD'),
        edate: moment(this.data.dayValue).endOf('week').format('YYYY-MM-DD'),
      }
    } else if (this.data.tab[this.data.idx] == '月') {
      var data = {
        sdate: this.data.months[this.data.month_idx].date + '-01',
        edate: moment(this.data.months[this.data.month_idx].date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
      }
    } else if (this.data.tab[this.data.idx] == '年') {
      var data = {
        sdate: this.data.years[this.data.year_idx] + '-01-01',
        edate: this.data.years[this.data.year_idx] + '-12-31',
      }
    }
    console.log(data, 'data')
    wx.showLoading({
      title: '加载中...',
    })
    data.healthy_type = 'com.huawei.vo2max'
    api.movewell.getCommonSportData(data).then(res => {
      if (res.code == 200) {
        wx.hideLoading()
        var xData = []
        var yData1 = []
        var yData2 = []
        var maxvalue = 0
        var minvalue = 0
        var lastvalue = 0
        var avgvalue = 0
        var t = 0

        for (var key in res.data) {
          if (!Array.isArray(res.data[key])) {
            t++
            xData.push(key)
            yData1.push(Number(res.data[key].avgvalue))
            // yData2.push(Number(res.data[key].maxvalue) == Number(res.data[key].minvalue) ? 2 : Number(res.data[key].maxvalue) - Number(res.data[key].minvalue))
            maxvalue = maxvalue + Number(res.data[key].maxvalue)
            minvalue = minvalue + Number(res.data[key].minvalue)
            lastvalue = lastvalue + Number(res.data[key].lastvalue)
            avgvalue = avgvalue + Number(res.data[key].avgvalue)
          }
        }
        this.setData({
          maxvalue: t == 0 ? 0 : (maxvalue / t).toFixed(0),
          minvalue: t == 0 ? 0 : (minvalue / t).toFixed(0),
          lastvalue: t == 0 ? 0 : (lastvalue / t).toFixed(0),
          avgvalue: t == 0 ? 0 : (avgvalue / t).toFixed(0),
        })
        this.setEcharts(xData, yData1)
        console.log(xData, yData1, yData2, 'res.data')
      } else {
        this.setEcharts([], [])
      }
    })
  },
  setEcharts(xData, yData1) {
    const option = {
      color: ['#88CEFA', '#EAA646'],
      grid: {
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLabel: { show: true },
        splitLine: {
          show: true, // 确保 x 轴分割线显示
          lineStyle: {
              color: '#e6e6e6', // 设置分割线颜色
              type: 'dashed' // 可选：设置分割线样式
          }
        },
        axisLine: {
          lineStyle: {
              color: '#e6e6e6' // 设置为红色作为示例，可以根据需要调整颜色
          }
        },
        data: xData
      },
      yAxis: {
        type: 'value',
        interval: 20,
        min: 0, // 显式设置 y 轴最小值
        max: 100,// 直接指定刻度值
        axisLabel: {
          color: '#aaa' // 设置为红色作为示例，可以根据需要调整颜色
        },
        axisLine: { // 设置轴线样式
          show: true,
          lineStyle: {
            type: 'dashed', // 设置为虚线
            color: '#e6e6e6'   // 设置颜色
          }
        },
        splitLine: { // 设置网格线样式
          show: true,
          lineStyle: {
            type: 'dashed', // 设置为虚线
            color: '#e6e6e6'   // 设置颜色
          }
        },
        boundaryGap: [0, 0.01],
        // axisLabel: {
        //   formatter: '{value}%'  // 将数值格式化为百分比
        // }
      },
      series: [
        {
          name: '摄氧量',
          type: 'bar',
          data: yData1,
          // markLine: {
          //     data: [
          //         {type: 'average', name: '平均值'}, // 平均值线(可选)
          //         [
          //             {coord: ['A', 15]}, // 自定义起点
          //             {coord: ['E', 15]} // 自定义终点
          //         ],
          //         { xAxis: 'B', yAxis: 25 }
          //     ],
          //     lineStyle: { type: 'dashed', color: 'gray' } // 虚线效果
          // }
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