// pages/health/index.js
import moment from "../../utils/moment";
import api from '../../request/index'
import util from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1,
        name: '运动记录',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E8%BF%90%E5%8A%A8%E8%AE%B0%E5%BD%95%402x.png',
        desc: '记录您的运动数据',
        col: 2,
        imgurl: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E8%BF%90%E5%8A%A8%E8%AE%B0%E5%BD%95-img%402x.png',
        value: '',
        isechat: 0
      },
      {
        id: 11,
        name: '每日饮食',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/foodicon.png',
        desc: '记录您的四季三餐',
        col: 2,
        imgurl: 'https://oss.mcloud.moveclub.cn/2024/movewell/food.png',
        value: '',
        isechat: 0
      },
      {
        id: 3,
        name: '睡眠',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E7%9D%A1%E7%9C%A0%402x.png',
        desc: '舒眠减压 监测睡眠',
        col: 1,
        imgurl: '',
        value: '',
        isechat: 0
      },
      {
        id: 4,
        name: '心率',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E5%BF%83%E7%8E%87%402x.png',
        desc: '心率监测 心电图解读',
        col: 1,
        imgurl: '',
        value: '',
        isechat: 0
      },
      {
        id: 5,
        name: '压力',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E5%8E%8B%E5%8A%9B%402x.png',
        desc: '压力测试 压力分析',
        col: 1,
        imgurl: '',
        value: '',
        isechat: 0
      },
      {
        id: 6,
        name: '血氧饱和',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E8%A1%80%E6%B0%A7%402x.png',
        desc: '连续血氧 高原血氧',
        col: 1,
        imgurl: '',
        value: '',
        isechat: 0
      },
      {
        id: 7,
        name: '摄氧量',
        icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E5%8E%8B%E5%8A%9B%402x.png',
        desc: '记录您的最大摄氧量',
        col: 1,
        imgurl: '',
        value: '',
        isechat: 0
      },
      // {
      //   id: 2,
      //   name: '体重',
      //   icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/weight.png',
      //   desc: '记录您的体重趋势变化',
      //   col: 1,
      //   imgurl: '',
      //   value: '',
      //   isechat: 0
      // },
      // {
      //   id: 8,
      //   name: '血糖',
      //   icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E8%A1%80%E7%B3%96%402x.png',
      //   desc: '记录您的血糖数据',
      //   col: 1,
      //   imgurl: '',
      //   value: '',
      //   isechat: 0
      // },
      // {
      //   id: 9,
      //   name: '体温',
      //   icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E4%BD%93%E6%B8%A9%402x.png',
      //   desc: '体温监测 体温记录',
      //   col: 1,
      //   imgurl: '',
      //   value: '',
      //   isechat: 0
      // },
      // {
      //   id: 10,
      //   name: '生理周期',
      //   icon: 'https://oss.mcloud.moveclub.cn/2024/movewell/%E7%94%9F%E7%90%86%402x.png',
      //   desc: '经期记录 孕期预测',
      //   col: 1,
      //   imgurl: '',
      //   value: '',
      //   isechat: 0
      // },
    ],
    option: {},
    current_weight: 0,
    auth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    const app = getApp();
    if (app.globalData.globalInitialized) {
      // 全局方法已经执行完毕，执行页面的方法
      console.log('页面的 onLoad 方法执行');
      // this.getInfo()  
      this.init()
    } else {
      // 全局方法还未执行完毕，等待
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          // 全局方法执行完毕后，执行页面的方法
          console.log('页面的 onLoad 方法执行');
          // this.getInfo()  
          this.init()
        } else {
          // 继续等待
          setTimeout(checkGlobalInitialized, 100);
        }
      };
      checkGlobalInitialized();
    }
  },
  getInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        
        if(res.data.channel){
          res.data.weight = res.data.channel[0].weight
          res.data.bmi = util.calculateBMI(res.data.channel[0].weight,res.data.channel[0].height)
          res.data.update_time = res.data.channel[0].update_time
        }
        this.setData({
          userInfo: res.data
        })
      }
    });
  },
  setEchats(xData, yData) {
    const option = {
      grid: {
        left: '8%',
        right: '8%',
        bottom: '8%',
        top: '8%',
        containLabel: true
      },
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
  },

  go(e){
    var id = e.currentTarget.dataset.id
    if(id != 11 && !this.data.auth) {
      wx.showModal({
        title: '提示',
        content: '如需绑定，点击查看按钮',
        confirmText:'查看',
        confirmColor: '#00C7C7',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/user/health/image'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      }) 
      return
    }
    switch (id) {
      case 1:
        wx.navigateTo({
          url: '/pages/sports/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/sports/weight',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/sports/sleep',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/sports/heart',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/sports/pressure',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/sports/oximetry',
        })
        break;
      case 7:
        // wx.navigateTo({
        //   url: '/pages/sports/blood_pressure',
        // })
        wx.navigateTo({
          url: '/pages/sports/oxygen',
        })
        break;
      case 8:
        // wx.navigateTo({
        //   url: '/pages/bloodsugar/index',
        // })
        break;
      case 9:
        wx.navigateTo({
          url: '/pages/sports/temperature',
        })
        break;
      case 10:
        // wx.navigateTo({
        //   url: '/pages/physiologicalcycle/index',
        // })
        break;
      case 11:
        wx.navigateTo({
          url: '/pages/food/index',
        })
        break;
    
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  init() {
      // 获取体重数据
      var data = {
        sdate: moment().format('YYYY-MM-DD'),
        edate: moment().format('YYYY-MM-DD'),
      }
      api.movewell.getWeightData(data).then(r => {
        if (r.code == 200) {
          var xData = []
          var yData = []
          if (r.data[moment().format('YYYY-MM-DD')].length != 0) {
            this.setData({  
              current_weight: r.data[moment().format('YYYY-MM-DD')][r.data[moment().format('YYYY-MM-DD')].length - 1].weight,
            })
            for (var i = 0; i < r.data[moment().format('YYYY-MM-DD')].length; i++) {
              xData.push(moment(Number(r.data[moment().format('YYYY-MM-DD')][i].rdatetime) * 1000 ).format('HH:mm'))
              yData.push(Number(r.data[moment().format('YYYY-MM-DD')][i].weight))
            }
          } else{
            this.setData({
              current_weight: 0,
            })
          }
          this.setEchats(xData, yData)
        }
      })
      
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = getApp();
    if (app.globalData.globalInitialized) {
      // 全局方法已经执行完毕，执行页面的方法
      console.log('页面的 onLoad 方法执行');
      this.getInfo()  
      this.init()
      this.config()
    } else {
      // 全局方法还未执行完毕，等待
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          // 全局方法执行完毕后，执行页面的方法
          console.log('页面的 onLoad 方法执行');
          this.getInfo()  
          this.init()
          this.config()
        } else {
          // 继续等待
          setTimeout(checkGlobalInitialized, 100);
        }
      };
      checkGlobalInitialized();
    }
  },

  config() {
    api.movewell.authInfo().then(res=>{
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