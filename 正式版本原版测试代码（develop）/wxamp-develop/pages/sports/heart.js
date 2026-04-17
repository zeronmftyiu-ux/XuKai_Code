// pages/sports/heart.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uselist: [
      "https://www.huawei.com/healthkit/step.read",
      "https://www.huawei.com/healthkit/activityrecord.read",
      "https://www.huawei.com/healthkit/hearthealth.read",
      "https://www.huawei.com/healthkit/sleep.read",
      "https://www.huawei.com/healthkit/oxygensaturation.read",
      "https://www.huawei.com/healthkit/calories.read",
      "https://www.huawei.com/healthkit/heightweight.read",
      "https://www.huawei.com/healthkit/heartrate.read",
      "https://www.huawei.com/healthkit/stress.read",
      "https://www.huawei.com/healthkit/distance.read",
      "https://www.huawei.com/healthkit/activity.read",
      "https://www.huawei.com/healthkit/location.read",
      "https://www.huawei.com/healthkit/strength.read",
      "https://www.huawei.com/healthkit/historydata.open.month",
      "https://www.huawei.com/healthkit/activehours.read",
      "https://www.huawei.com/healthkit/dailyactivitysummary.read",
    ],
    tab: ['周', '月'],
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
    option: {},

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
    } else if (this.data.tab[this.data.idx] == '日') {
      this.setData({
        dayValue: moment().format('YYYY-MM-DD'),
      })
    }
    this.getData()
    // this.setEchart()
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
    if (this.data.tab[this.data.idx] == '日') {
      this.setData({
        dayValue: moment(e.detail).format('YYYY-MM-DD'),
        show: false
      })
    } else {
      this.setData({
        dayValue: moment(e.detail).format('YYYY-MM-DD'),
        weekValue: moment(e.detail).startOf('week').format('YYYY-MM-DD') + '~' + moment(e.detail).endOf('week').format('YYYY-MM-DD'),
        show: false
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
    // this.setEchart()
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
    } else if (this.data.tab[this.data.idx] == '日') {
      var data = {
        sdate: this.data.dayValue,
        edate: this.data.dayValue,
      }
    }
    console.log(data, 'data')
    wx.showLoading({
      title: '加载中...',
    })
    data.healthy_type = 'com.huawei.instantaneous.heart_rate'
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

        for(var key in res.data){
          if(!Array.isArray(res.data[key])){
            t++
            xData.push(key)
            yData1.push(Number(res.data[key].minvalue))
            yData2.push(Number(res.data[key].maxvalue) == Number(res.data[key].minvalue) ? 2 : Number(res.data[key].maxvalue) - Number(res.data[key].minvalue))
            maxvalue = maxvalue + Number(res.data[key].maxvalue)
            minvalue = minvalue + Number(res.data[key].minvalue)
            lastvalue = lastvalue + Number(res.data[key].lastvalue)
            avgvalue = avgvalue + Number(res.data[key].avgvalue)
          } else {
            xData.push(key)
            yData1.push(0)
            yData2.push(0)
          }
        }
        this.setData({
          maxvalue: t == 0 ? 0 : (maxvalue/t).toFixed(0),
          minvalue: t == 0 ? 0 : (minvalue/t).toFixed(0),
          lastvalue:  t == 0 ? 0 : (lastvalue/t).toFixed(0), 
          avgvalue:  t == 0 ? 0 :(avgvalue/t).toFixed(0),
        })
        this.setEchart(xData, yData1, yData2)
        console.log(xData, yData1, yData2, 'res.data')
      } else {
        this.setEchart([], [], [])
        this.config() //  
      }
    })
  },
  config() {
    api.movewell.authInfo().then(res=>{
      const arr = res.data.detail.map(item => item.auth); // 提取 auth 列表
      const filteredList = this.data.uselist.filter(item => !arr.includes(item)); // 过滤出不包含在 arr 中的项
      this.setData({
        uselist: filteredList
      });
      this.bind()
    })
  },
  bind() {
    let time = new Date().getTime()
    let gid = 'U1BtaGs3eXl3dDA9_' + time
    wx.navigateToMiniProgram({
      appId: "wxa6c04f899577d944",
      path: "pages/authLogin/authLogin",
      envVersion: "release",
      extraData: {
        lang: "zh-CN",
        // client_id: "106489783",
        client_id: "114439515", //新id
        scope: this.data.uselist,
        state: gid
      }
    })
    const enterOptions = wx.getEnterOptionsSync();
    console.log(enterOptions.referrerInfo.extraData,'extraData')
    if(enterOptions.referrerInfo && enterOptions.referrerInfo.extraData) {
      const { code, error, state } = enterOptions.referrerInfo.extraData
      api.common.loginAuth({state: state,auth_code:code,app_source:1}).then(res=>{
        setTimeout(() => {
          wx.navigateBack()
        }, 3000)
      })
    }
  },
  setEchart(xData, yData1, yData2) {
    // if (this.data.idx == 0) {
    //   var xData = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00']
    //   var yData1 = [50, 42, 60, 49, 56, 67, 72]
    //   var yData2 = [30, 60, 20, 30, 40, 12, 21]
    // } else if (this.data.idx == 1) {
    //   var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
    //   var yData1 = [50, 42, 60, 49, 56]
    //   var yData2 = [30, 60, 20, 30, 40]
    // } else {
    //   var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
    //   var yData1 = [50, 42, 60, 49, 56]
    //   var yData2 = [30, 60, 20, 30, 40]
    // }
    var xdatas = xData.map(date => {
      const [year, month, day] = date.split('-');
      return `${month}.${day}`;
    });
    var tts = 0;
    var ttx = 5;
    if (this.data.tab[this.data.idx] == '周') {
      tts = 0
      ttx = 5
    }
    else if (this.data.tab[this.data.idx] == '月') {
      tts = 7
      ttx = 5
    }
    else if (this.data.tab[this.data.idx] == '年') {
      tts = 31
      ttx = 2
    }
    const option = {
      // tooltip: {
      //   trigger: 'item'
      // },
      // legend: {
      //   top: '5%',
      //   left: 'center'
      // },
      color: ['#FE5955', '#FE5955'],
      grid: {
        top: '10%',
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      textStyle: {color: '#8B9299'},
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        axisLabel: { show: true },
        splitLine: {
          show: true, // 确保 x 轴分割线显示
          lineStyle: {
              color: '#e6e6e6', // 设置分割线颜色
              type: 'dashed' // 可选：设置分割线样式
          }
        },
        axisLabel: { 
          show: true,
          fontSize: 12,
          interval: tts,
          formatter: function (value) {
            return value.substring(0, ttx); // 截取前两位
          },
        },
        axisLine: {
          lineStyle: {
              color: '#e6e6e6' // 设置为红色作为示例，可以根据需要调整颜色
          }
        },
        data: xdatas
      },
      yAxis: {
        type: 'value',
        interval: 45,
        min: 0, // 显式设置 y 轴最小值
        max: 180,// 直接指定刻度值
        axisLabel: {
          color: '#8B9299' // 设置为红色作为示例，可以根据需要调整颜色
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
        }
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: yData1
        },
        {
          name: 'Life Cost',
          type: 'bar',
          stack: 'Total',
          label: {
            // show: true,
            position: 'inside'
          },
          data: yData2,
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 5, 5]
            }
          }
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

})