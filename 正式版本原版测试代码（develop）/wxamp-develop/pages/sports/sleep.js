// pages/sports/sleep.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
// const echarts = require('echarts');
import * as ec from '../../utils/echarts.min.js';
const comp = requirePlugin('echarts');
// 设置自行引入的 echarts 依赖库
comp.echarts = ec;
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
    tab: ['周', '月', '年'],
    // tab: ['日', '周', '月', '年'],
    // 
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
    option2: {},
    option3: {},

    hours: 0,
    minutes: 0,
    ndata: [],
  },
  toggleTab(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    })
    if (this.data.tab[this.data.idx] == '周') {
      this.setData({
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
    // this.setEchats()
    // this.setBarEchart()
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
      weekValue: moment(e.detail).startOf('week').format('YYYY-MM-DD') + '~' + moment(e.detail).endOf('week').format('YYYY-MM-DD')
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
    api.movewell.getSleepData(data).then(res => {
          if (res.code == 200) {
            wx.hideLoading()
            var xData = []
            var yData1 = []
            var yData2 = []
            var yData3 = []
            for(var key in res.data){
              xData.push(key)
              if(res.data[key].length > 0){
                // 判断是否有deep_sleep_time字段
                if(res.data[key][0].rawvalue.some(item => item.fieldName == 'deep_sleep_time')){
                  res.data[key][0].rawvalue.forEach(item => {
                    if(item.fieldName == 'deep_sleep_time'){
                      yData1.push(item.integerValue)
                    }
                    // if(item.fieldName == 'light_sleep_time'){
                    //   yData2.push(item.integerValue)
                    // }
                    // if(item.fieldName == 'dream_time'){
                    //   yData3.push(item.integerValue)
                    // }
                  })
                }else{
                  yData1.push(0)
                }
                if(res.data[key][0].rawvalue.some(item => item.fieldName == 'light_sleep_time')){
                  res.data[key][0].rawvalue.forEach(item => {
                    // if(item.fieldName == 'deep_sleep_time'){
                    //   yData1.push(item.integerValue)
                    // }
                    if(item.fieldName == 'light_sleep_time'){
                      yData2.push(item.integerValue)
                    }
                    // if(item.fieldName == 'dream_time'){
                    //   yData3.push(item.integerValue)
                    // }
                  })
                }else{
                  yData2.push(0)
                }
                if(res.data[key][0].rawvalue.some(item => item.fieldName == 'dream_time')){
                  res.data[key][0].rawvalue.forEach(item => {
                    // if(item.fieldName == 'deep_sleep_time'){
                    //   yData1.push(item.integerValue)
                    // }
                    // if(item.fieldName == 'light_sleep_time'){
                    //   yData2.push(item.integerValue)
                    // }
                    if(item.fieldName == 'dream_time'){
                      yData3.push(item.integerValue)
                    }
                  })
                }else{
                  yData3.push(0)
                }   
              }else{
                yData1.push(0)
                yData2.push(0)
                yData3.push(0)
              }
              
            }
            var total_minute = 0
            yData1.forEach(item => {
              total_minute += item
            })
            yData2.forEach(item => {
              total_minute += item
            })
            yData3.forEach(item => {
              total_minute += item
            })
            this.setData({
              hours: (this.formatMinutes(total_minute)).hours,
              minutes: (this.formatMinutes(total_minute)).minutes,
            })
            
            // console.log('09900', xData, yData1, yData2, yData3)
            this.setBarEchart(xData, yData1, yData2, yData3)
            var ndata = []
            var deep_sleep_time = 0
            var t1 = 0
            var light_sleep_time = 0
            var t2 = 0
            var dream_time = 0
            var t3 = 0
            yData1.forEach(item => {
              if(item > 0){
                t1 += 1         
              }
              deep_sleep_time += item
            })
            yData2.forEach(item => {
              if(item > 0){
                t2 += 1
              }
              light_sleep_time += item
            })
            yData3.forEach(item => {
              if(item > 0){
                t3 += 1
              }
              dream_time += item
            })
            ndata.push({
              name: '深睡',
              value: t1 == 0 ? 0 : (deep_sleep_time/t1).toFixed(2)
            })
            ndata.push({
              name: '浅睡',
              value: t2 == 0 ? 0 : (light_sleep_time/t2).toFixed(2)
            })
            ndata.push({
              name: '快速眼动',
              value: t3 == 0 ? 0 : (dream_time/t3).toFixed(2)
            })
            this.setData({
              ndata: ndata
            })
            this.setPieEchart(ndata)
          } else {
            this.setBarEchart([], [], [], [])  
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
  formatMinutes(value) {
    // 根据value分钟格式化时间 {hours: 0, minutes: 0}
    var hours = Math.floor(value / 60)
    var minutes = value % 60
    return {
      hours: hours,
      minutes: minutes
    }
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
      dayValue: moment().format('YYYY-MM-DD'),
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
    // this.setEchats()
    // this.setPieEchart()
    // this.setBarEchart()
  },
  setBarEchart(xData, yData1, yData2, yData3) {
    // if (this.data.idx == 1) {
    //   var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05', '2024-12-06', '2024-12-07', '2024-12-08']
    //   var yData1 = [50, 42, 60, 49, 56, 67, 72]
    //   var yData2 = [30, 60, 20, 30, 40, 12, 21]
    //   var yData3 = [20, 30, 40, 50, 60, 70, 80]
    //   var yData4 = [10, 20, 30, 40, 50, 60, 70]
    // } else if (this.data.idx == 2) {
    //   var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
    //   var yData1 = [50, 42, 60, 49, 56]
    //   var yData2 = [30, 60, 20, 30, 40]
    //   var yData3 = [20, 30, 40, 50, 60]
    //   var yData4 = [10, 20, 30, 40, 50]
    // } else if (this.data.idx == 3) {
    //   var xData = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05']
    //   var yData1 = [50, 42, 60, 49, 56]
    //   var yData2 = [30, 60, 20, 30, 40]
    //   var yData3 = [20, 30, 40, 50, 60]
    //   var yData4 = [10, 20, 30, 40, 50]
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
    var Data1 = yData1.map(function(minutes) {
      return parseFloat((minutes / 60).toFixed(2));
    });
    var Data2 = yData2.map(function(minutes) {
      return parseFloat((minutes / 60).toFixed(2));
    });
    var Data3 = yData3.map(function(minutes) {
      return parseFloat((minutes / 60).toFixed(2));
    });
    const option = {
      // tooltip: {
      //   trigger: 'item'
      // },
      // legend: {
      //   top: '5%',
      //   left: 'center'
      // },
      color: ['#8781EC', '#88CEFA', '#F7B500', '#01DE6C'],
      textStyle: {color: '#8B9299'},
      grid: {
        top: '10%',
        left: '0%',
        right: '1%',
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
        interval: 2,
        min: 0, // 显式设置 y 轴最小值
        max: 10,// 直接指定刻度值
        axisLabel: {
          formatter: '{value} 时',
          color: '#8B9299'
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
          name: '深睡',
          type: 'bar',
          stack: 'Total',
          barWidth: 10,
          // emphasis: {
          //   itemStyle: {
          //     borderColor: 'transparent',
          //     color: 'transparent'
          //   }
          // },
          data: Data1
        },
        {
          name: '浅睡',
          type: 'bar',
          stack: 'Total',
          label: {
            // show: true,
            position: 'inside'
          },
          data: Data2,
          barWidth: 10,
          // itemStyle: {
          //   normal: {
          //     barBorderRadius: [5,5,5,5]
          //   }
          // }
        }, {
          name: '快速眼动',
          type: 'bar',
          stack: 'Total',
          label: {
            // show: true,
            position: 'inside'
          },
          data: Data3,
          barWidth: 10,
          // itemStyle: {
          //   normal: {
          //     barBorderRadius: [5,5,5,5]
          //   }
          // }
        }
        // , {
        //   name: '清醒',
        //   type: 'bar',
        //   stack: 'Total',
        //   label: {
        //     // show: true,
        //     position: 'inside'
        //   },
        //   data: yData4,
        //   barWidth: 10,
        //   // itemStyle: {
        //   //   normal: {
        //   //     barBorderRadius: [5,5,5,5]
        //   //   }
        //   // }
        // }
      ]
    }
    this.setData({
      option3: option
    })
  },
  setPieEchart(ndata) {
    const option = {
      // tooltip: {
      //   trigger: 'item'
      // },
      // legend: {
      //   top: '5%',
      //   left: 'center'
      // },
      color: ['#8781EC', '#88CEFA', '#F7B500', '#01DE6C'],
      graphic: [
        {
          //环形图中间添加文字
          type: "text", //通过不同top值可以设置上下显示
          left: "center",
          top: "center",
          style: {
            text: `睡眠\n比例`,
            textAlign: "center",
            fill: "#505D6F", //文字的颜色
            fontSize: 12,
            lineHeight: 15,
          },
        },
      ],
      series: [
        {
          name: '睡眠比例',
          type: 'pie',
          radius: ['60%', '100%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: ndata
        }
      ]
    }
    this.setData({
      option2: option
    })
  },
  setEchats() {
    let xitem = []
    let data = []
    // this.data.heallist.list.forEach(item => {
    //   xitem.push(item.date)
    //   data.push(item.value)
    // })
    var colors = ['#8781EC', '#88CEFA', '#F7B500', '#01DE6C']
    var state = ['深睡', '浅睡', '快速眼动', '清醒']
    const option = {
      color: colors,
      grid: {
        left: '4%',
        right: '4%',
        bottom: '8%',
        top: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        interval: 3600 * 1000,   //以一个小时递增 
        min: '2009/6/1 1:00', //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
        axisLabel: {
          formatter: function (value) {
            var date = new Date(value); return getzf(date.getHours()) + ':00';
            function getzf(num) {
              if (parseInt(num) < 10) { num = '0' + num; }
              return num;
            }
          },
        }
      },
      yAxis: {
        data: ['深睡', '浅睡', '快速眼动', '清醒'],
        axisLabel: {
          show: false // 隐藏 y 轴的文字
        },
      },
      series: [
        // 用空bar来显示三个图例
        { name: state[0], type: 'bar', data: [] },
        { name: state[1], type: 'bar', data: [] },
        { name: state[2], type: 'bar', data: [] },
        { name: state[3], type: 'bar', data: [] },
        {
          type: 'custom',
          renderItem: function (params, api) {//开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
            var categoryIndex = api.value(0);//这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
            var start = api.coord([api.value(1), categoryIndex]); // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
            var end = api.coord([api.value(2), categoryIndex]);
            var height = api.size([0, 1])[1];
            return {
              type: 'rect',// 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
              shape: comp.echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
              }, { // 当前坐标系的包围盒。
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              }),
              style: api.style()
            };
          },
          encode: {
            x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
            y: 0// data 中『维度0』对应到 Y 轴
          },
          data: [ // 维度0 维度1 维度2
            {
              itemStyle: { normal: { color: colors[0] } },//条形颜色
              name: '深睡',
              value: [0, '2009/6/1 1:28', '2009/6/1 5:00']//0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
            },
            {
              itemStyle: { normal: { color: colors[0] } },
              name: '深睡',
              value: [0, '2009/6/1 6:13', '2009/6/1 8:22']
            },
            {
              itemStyle: { normal: { color: colors[1] } },
              name: '浅睡',
              value: [1, '2009/6/1 5:00', '2009/6/1 6:13']
            },
            {
              itemStyle: { normal: { color: colors[1] } },
              name: '浅睡',
              value: [1, '2009/6/1 8:22', '2009/6/1 9:10']
            },
            {
              itemStyle: { normal: { color: colors[1] } },
              name: '浅睡',
              value: [1, '2009/6/1 12:47', '2009/6/1 14:52']
            },
            {
              itemStyle: { normal: { color: colors[2] } },
              name: '快速眼动',
              value: [2, '2009/6/1 9:10', '2009/6/1 12:47']
            },
            {
              itemStyle: { normal: { color: colors[2] } },
              name: '快速眼动',
              value: [2, '2009/6/1 14:52', '2009/6/1 17:00']
            },
            {
              itemStyle: { normal: { color: colors[3] } },
              name: '清醒',
              value: [3, '2009/6/1 17:00', '2009/6/1 18:47']
            },
          ]
        }
      ]
    }
    this.setData({ option })

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