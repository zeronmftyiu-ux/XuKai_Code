var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['日', '总统计'],
    idx: 0,
    dayValue: '',
    total_date: '2024年9月30日-2024年12月31日',

    show: false,
    minDate: new Date(2023, 0, 1).getTime(),
    option: {},
    heallist: {
      name: 'BMI',
      value: 45.0,
      list: [
        {
          value: 52,
          date: '11:55'
        },
        {
          value: 45,
          date: '20:42'
        }
      ]
    },
    heallist2: {
      name: 'BMI',
      value: 45.0,
      list: [
        {
          value: 52,
          date: '8/16'
        },
        {
          value: 45,
          date: '8/17'
        },
        {
          value: 20,
          date: '8/18'
        },
        {
          value: 60,
          date: '8/19'
        },
        {
          value: 50,
          date: '8/20'
        }
      ]
    },
    bmi: 0,
    weight: '暂无',
    label: '暂无',
    width: 0,

    show2: false,
    weight_value: '',

  },
  toggleTab(e) {
    this.setData({
      idx: e.currentTarget.dataset.idx
    })
    if (this.data.idx == 0) {
      this.setData({
        dayValue: moment().format('YYYY-MM-DD')
      })
    } else {
      // 当年的一号到今年的最后一天
      this.setData({
        total_date: moment().format('YYYY') + '-01-01~' + moment().format('YYYY') + '-12-31'
      })
    }
    this.getData()
    // this.setEchats()
  },
  showDate() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  selectDate(e) {
    this.setData({ show: false });
    // console.log(e, 'e')
    this.setData({
      dayValue: moment(e.detail).format('YYYY-MM-DD')
    })
    this.getData()
  },
  setEchats(xData, yData) {
    if (this.data.idx == 0) {
      // let xitem = []
      // let data = []
      // this.data.heallist.list.forEach(item => {
      //   xitem.push(item.date)
      //   data.push(item.value)
      // })
      const option = {
        grid: {
          left: '8%',
          right: '8%',
          bottom: '8%',
          top: '8%',
          containLabel: true
        },
        textStyle: {color: '#333'},
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
          position: 'right', // 将 y 轴放置在右侧
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
          }
        },
        series: [
          {
            name: '体重',
            type: 'line',
            stack: 'Total',
            itemStyle: {
              color: '#00BCFE' // 设置折线的颜色为红色
            },
            areaStyle: {
              color: 'rgba(0,188,254,0.20)'
            },
            emphasis: {
              focus: 'series'
            },
            data: yData
          }
        ]
      }
      this.setData({ option })
    } else {
      let xitem = []
      let data = []
      this.data.heallist2.list.forEach(item => {
        xitem.push(item.date)
        data.push(item.value)
      })
      const option = {
        grid: {
          left: '10%',
          right: '8%',
          bottom: '8%',
          top: '8%',
          containLabel: true
        },
        textStyle: {color: '#333'},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value',
          position: 'right', // 将 y 轴放置在右侧
          interval: 20,
          axisLine: { // 设置轴线样式
            show: true,
            lineStyle: {
              type: 'dashed', // 设置为虚线
              color: '#333'   // 设置颜色
            }
          },
          splitLine: { // 设置网格线样式
            show: true,
            lineStyle: {
              type: 'dashed', // 设置为虚线
              color: '#ccc'   // 设置颜色
            }
          }
        },
        series: [
          {
            name: '体重',
            type: 'line',
            stack: 'Total',
            itemStyle: {
              color: '#00BCFE' // 设置折线的颜色为红色
            },
            areaStyle: {
              color: 'rgba(0,188,254,0.20)'
            },
            emphasis: {
              focus: 'series'
            },
            data: yData
          }
        ]
      }
      this.setData({ option })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      dayValue: moment().format('YYYY-MM-DD')
    })
    this.getData()
    

  },
  showPopup2() {    
    this.setData({
      show2: true
    })
  },
  onClose2(){
    this.setData({
      show2: false,
      weight_value: ''
    })
  },
  getData(){
    // 获取体重数据
    if(this.data.tab[this.data.idx] == '日'){
      var data = {
        sdate: this.data.dayValue,
        edate: this.data.dayValue
      }
      wx.showLoading({
        title: '请稍候...'
      })
      api.movewell.getWeightData(data).then(r => {
        if (r.code == 200) {
          wx.hideLoading()
          var xData = []
          var yData = []
          if (r.data[this.data.dayValue].length == 0) {
            this.setData({
              bmi: 0,
              weight: '暂无',
              label: '暂无',
            })
          } else {
            this.setData({
              bmi: Number(r.data[this.data.dayValue][r.data[this.data.dayValue].length - 1].BMI).toFixed(2),
              weight: Number(r.data[this.data.dayValue][r.data[this.data.dayValue].length - 1].weight).toFixed(2),
            })
            if (this.data.bmi <= 18.5) {
              this.setData({
                label: '偏瘦',
                width: (170 * this.data.bmi / 18.5).toFixed(2) - 13
              })
            } else if (this.data.bmi <= 24 && this.data.bmi > 18.5) {
              this.setData({
                label: '正常',
                width: (((200 * (this.data.bmi - 18.5))) / 5.5).toFixed(2) - 13 + 172
              })
            } else if (this.data.bmi <= 28 && this.data.bmi > 24) {
              this.setData({
                label: '超重',
                width: (((144 * (this.data.bmi - 24))) / 4).toFixed(2) - 13 + 374
              })
            } else {
              this.setData({
                label: '肥胖',
                width: (((170 * (this.data.bmi - 28))) / 12).toFixed(2) - 13 + 520
              })
            }
            for (var i = 0; i < r.data[this.data.dayValue].length; i++) {
              xData.push(moment(Number(r.data[this.data.dayValue][i].rdatetime) * 1000 ).format('HH:mm'))
              yData.push(Number(r.data[this.data.dayValue][i].weight))
            }
          }
          this.setEchats(xData, yData)
        }
      })
    }else{
      var data = {
        sdate: moment().format('YYYY-01-01'),
        edate: moment().format('YYYY-12-31')
      }
      wx.showLoading({
        title: '请稍候...'
      })
      api.movewell.getWeightData(data).then(r => {
        if (r.code == 200) {
          wx.hideLoading()
          var xData = []
          var yData = []
          for(var key in r.data){
            if(r.data[key].length > 0){
              xData.push(key)
              yData.push(Number(r.data[key][r.data[key].length - 1].weight))  
            }
          }
          // if (r.data.length == 0) {
          //   this.setData({
          //     bmi: 0,
          //     weight: '暂无',
          //     label: '暂无',
          //   })
          // } else {
          //   this.setData({
          //     bmi: Number(r.data[this.data.dayValue][r.data[this.data.dayValue].length - 1].BMI).toFixed(2),
          //     weight: Number(r.data[this.data.dayValue][r.data[this.data.dayValue].length - 1].weight).toFixed(2),
          //   })
          //   if (this.data.bmi <= 18.5) {
          //     this.setData({
          //       label: '偏瘦',
          //       width: (170 * this.data.bmi / 18.5).toFixed(2) - 13
          //     })
          //   } else if (this.data.bmi <= 24 && this.data.bmi > 18.5) {
          //     this.setData({
          //       label: '正常',
          //       width: (((200 * (this.data.bmi - 18.5))) / 5.5).toFixed(2) - 13 + 172
          //     })
          //   } else if (this.data.bmi <= 28 && this.data.bmi > 24) {
          //     this.setData({
          //       label: '超重',
          //       width: (((144 * (this.data.bmi - 24))) / 4).toFixed(2) - 13 + 374
          //     })
          //   } else {
          //     this.setData({
          //       label: '肥胖',
          //       width: (((170 * (this.data.bmi - 28))) / 12).toFixed(2) - 13 + 520
          //     })
          //   }
            
          // }
          this.setEchats(xData, yData)
        }
      })
    }
    
  },
  onSubmit(){
    var data = {
      date: moment().format('YYYY-MM-DD'),
      weight: this.data.weight_value
    }
    wx.showLoading({
      title: '请稍候...'
    })
    api.movewell.submitWeightData(data).then(r => {
      if (r.code == 200) {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        this.onClose2()
        this.getData()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})