
import api from '../../request/index'
import moment from "../../utils/moment";
import util from "../../utils/util";

Page({
  data: {
    currentIndex: 0,
    bannerList: [
      {
        id: 1,
        img_url: 'https://oss.mcloud.moveclub.cn/2024/movewell/banner%402x.png',
        jump_type: '',
        app_id: '',
        jump_url: ''
      }
    ],
    points: [],
    userInfo: {
      points: 10
    },
    totalpoint: 0,
    tags: [  
      {
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/food.png',
        title: '每日饮食',
        jumpurl: '/pages/food/index'
      },
      {
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/water.png',
        title: '每日饮水',
        jumpurl: '/pages/water/index'
      },
      {
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/sports.png',
        title: '每日运动',
        jumpurl: '/pages/motion/list'
      }
    ],
    cyclelist: [],
    weight: {},
    option: {},
    newlist: [],
    list: [],
    show: false,
    typelist: [
      {
        type: 1,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/1%402x.png',
        name: '偏瘦',
        color: '#E5E9F1',
        min: 0,
        max: 18.4,
        lv: 18.4,
        desc: '体型偏瘦，建议营养科随诊，建议体重管理目标调整为提升身体素质。'
      },
      {
        type: 2,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/2%402x.png',
        name: '正常',
        color: '#86E0A4',
        min: 18.5,
        max: 24.9,
        lv: 6.4,
        desc: '标准体重，进阶管理保持动吃平衡，需要提升代谢水平。'
      },
      {
        type: 3,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/3%402x.png',
        name: '偏胖',
        color: '#FFD739',
        min: 25,
        max: 29.9,
        lv: 4.9,
        desc: '超重了，稍微努力一下，就能拥有完美体重，我们将为你定制科学方案。'
      },
      {
        type: 4,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/4.png',
        name: '很胖',
        color: '#FF8E00',
        min: 30,
        max: 100,
        lv: 10,
        desc: '肥胖，首要任务是控制糖分，管住嘴迈开腿，健康科学减重。'
      }
    ],
    maxDate: moment().valueOf(),
    minDate: moment().clone().subtract(1, 'months').valueOf(),
    weight_value: '',
    show2: false,
    show3: false,
    dayF: moment().unix(),
    dayValue: moment().format('YYYY-MM-DD HH:mm'),
    prose: 0,
    pro: 0,
    info: {},
    balance: {},
    startValue: [0, 0, 0],
    pickerColumns: [],
    showt: false
  },
  toWeight() {
    this.setData({
      show2: true
    })
  },
  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current,
    });
  },
  onClickHidet() {
    this.setData({
      showt: false
    })
  },

  showt() {
    this.setData({
      showt: true
    })
  },

  onSubmit(){
    if(this.data.weight_value == '' || this.data.weight_value<0){
      wx.showToast({
        title: '体重有误',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var data = {
      // date: this.data.dayValue,
      datetime: this.data.dayF,
      weight: this.data.weight_value
    }
    if(this.data.cyclelist.length>0) {
      data.cycleid = this.data.cyclelist[0].id
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
        this.getCycle()
        this.getInfo() 
      }
    })
  },

  // selectDate(e) {
  //   this.setData({ show3: false });
  //   console.log(e, 'e')
  //   this.setData({
  //     dayF:moment(e.detail).unix(),
  //     dayValue: moment(e.detail).format('YYYY-MM-DD')
  //   })
  // },
  showDate() {
    this.setData({
      show3: true
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      weight_value: e.detail.value
    })
  },
  onClose2(){
    this.setData({
      show2: false,
      weight_value: ''
    })
  },

  onClose3(){
    this.setData({
      show3: false
    })
  },
  getPoints() {
    wx.navigateTo({
      url: '/pages/user/point/index'
    })
  },
  goadvice() {
    wx.navigateTo({
      url: '/pages/user/advice/index'
    })
  },
  toRead(){
    wx.navigateTo({
      url: '/pages/news/index'
    })
  },
  toPage() { // 跳转智能问答
    // wx.showToast({
    //   title: '暂未开放，敬情期待',
    //   icon: 'none',
    //   duration: 2000
    // })
    // return
    wx.navigateTo({
      url: '/pages/webview/index?src=https://movewell-questionh5-develop.dev.moveclub.cn'
    })
  },
  pointTap(e) {
    // console.log('e', e)
    // wx.showLoading({
    //   title: '领取中...'
    // })
    let points = this.data.totalpoint
    let list = this.data.points
    api.user
      .getPoints({ pid: e.currentTarget.dataset.point.id })
      .then((r) => {
        console.log('r', r)
        if (r.code == 200) {
          // wx.hideLoading()
          // wx.showToast({
          //   title: '领取成功',
          //   icon: 'success',
          //   duration: 2000
          // })
          let newArr = list.filter(item => item.id != e.currentTarget.dataset.point.id);
          points = points*1 + e.currentTarget.dataset.point.value*1
          this.setData({totalpoint:points,points:newArr})
        }
      })
  },
  jumpurl(e) {
    let url = e.currentTarget.dataset.url
    // if(url == '/pages/motion/index') {
    //   util.ALERT('敬请期待')
    //   return
    // }
    wx.navigateTo({
      url: url,
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.init()
  },
  onLoad: function (options) {
    
  },
  getwx() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.werun']) {
          // 用户同意授权
          that.getUserRunData();
        } else {
          //步数
          wx.authorize({
            scope: 'scope.werun',
            success() {
              that.getUserRunData();
            },
            fail(res) {
              that.setData({
                authWerun: false,
              });
            },
            complete(res) {
              console.log(res);
            },
          });
        }
      },
      fail(res) {
        console.log(res);
      },
    });

  },

  getUserRunData: function () {
    var that = this;
    that.setData({
      authWerun: true,
    });
    wx.login({
      success(res) {
        if (res.code) {
          var code = res.code
          wx.getWeRunData({
            success(res) {
              // wx.showLoading({
              //     title: '加载中',
              // });
              let { iv, encryptedData } = res;
              that.commitRunData(encryptedData, iv, code);
              // that.cavs()
            },
          });

        }
      },
    });
  },

  commitRunData: function (rundata, iv, code) {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    api.user
      .getSteps({ steps: rundata, iv: iv, wxcode: code })
      .then((r) => {
        if (r.code == 200) {
          wx.hideLoading()
        }
    });
  }, 
  
  getInfo: function () {
    let typelist = this.data.typelist
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        if(res.data.channel) {
          res.data.weight = res.data.channel[0].weight
          res.data.bmi = util.calculateBMI(res.data.channel[0].weight,res.data.channel[0].height)
          res.data.update_time = res.data.channel[0].update_time
          let item = {}
          if(res.data.bmi>= 40) {
            item = typelist[3]
            this.setData({
              info: item
            })
          } else {
            item = typelist.find(row=> res.data.bmi <= row.max )
            this.setData({
              info: item
            })
          }
        }
        
        this.setData({
          userInfo: res.data
        })
        this.getCycle()
        
        if(res.data.bdinfo.bdstate ==1) {
          this.ainit()
        }
        if(res.data.guide.info == 0){
          wx.navigateTo({
            url: '/pages/lead/first/index'
          })
        }
      }
    });
  },

  getWeight() {
    var that = this;
    const query = wx.createSelectorQuery();
    api.movewell.getBalance({
      sdate: moment().format('YYYY-MM-DD'),
      edate: moment().format('YYYY-MM-DD')
    }).then(res=>{
      if(res.code == 200) {
        let date = moment().format('YYYY-MM-DD')
        let i = res.data[date]?res.data[date]:{}
        let balance1 = parseInt(i.calorie_intake);
        let balance2 = parseInt(i.banlance);
        let balance3 = parseInt(i.exercise);
        let balance4 = parseInt(i.standard_intake);
        this.setData({
          balance: i,
          balance1: balance1,
          balance2: balance2,
          balance3: balance3,
          balance4: balance4
        })
        query
          .select('#canvas')
          .fields({
            node: true,
            size: true,
          })
          .exec((res) => {
            if (res && res[0] && res[0].node) {
              that.draw(res);
            } else {
              console.warn("Canvas node not available");
            }
          });
      }
    })
  },

  plan() {
    wx.navigateTo({
      url: '/pages/lead/first/index'
    })
  },

  gobalance() {
    wx.navigateTo({
      url: '/pages/food/balance'
    })
  },

  getCycle() {    
    api.movewell.mycycle().then(res=>{
      if(res.code == 200) {
        if(res.data.length>0){
          let cycle = res.data[0]
          let channel = this.data.userInfo.channel[0] //目前
          let weight = cycle.weight[0].weight*1 //初始
          let prose =  parseFloat((weight - channel.weight*1).toFixed(2)) //改变量
          let pro = parseFloat(((weight - channel.weight*1) * 100 / (weight - cycle.target*1)).toFixed(2))
          pro = pro > 100 ? 100 : (pro < 0 ? 0 : pro)
          this.setData({
            prose,
            pro
          })
        }
        this.setData({
          cyclelist:res.data
        })
        this.getWeight()
      }
    })
  },

  ainit() {
    api.doctor.exrxList().then(res=>{
      if (res.code == 200) {
        res.data.list.forEach(item=>{
          item.create_time = moment(Number(item.create_time)*1000).format('YYYY-MM-DD')
        })
        this.setData({
          list: res.data.list
        })
      }
    })
  },

  gopoint() {
    wx.navigateTo({
      url: '/pages/user/point/index'
    })
  },

  gomessage() {
    let bdinfo = this.data.userInfo.bdinfo
    if(bdinfo.bdstate == 0 || bdinfo.bdstate == 2){
      util.ALERT('暂无消息')
      return
    }
    wx.navigateTo({
      url: '/pages/user/message/index'
    })
  },
  onShow() {
    const app = getApp();
    if (app.globalData.globalInitialized) {
      // 全局方法已经执行完毕，执行页面的方法
      console.log('页面的 onLoad 方法执行');
      this.getInfo()  
      this.init()
      this.getwx()
      this.initPickerData();
    } else {
      // 全局方法还未执行完毕，等待
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          // 全局方法执行完毕后，执行页面的方法
          console.log('页面的 onLoad 方法执行');
          this.getInfo()  
          this.init()
          this.getwx()
          this.initPickerData();
        } else {
          // 继续等待
          setTimeout(checkGlobalInitialized, 100);
        }
      };
      checkGlobalInitialized();
    }
  },

  initPickerData() {
    const dates = util.getDateList();
    const hours = util.getHourList();
    const minutes = util.getMinuteList();
    console.log([dates, hours, minutes])
    let dayValue =  moment().format('YYYY-MM-DD HH:mm')
    let date = moment().format('YYYY-MM-DD')
    let hour = moment().format('HH时')
    let min = moment().format('mm分')
    let x = dates.days.findIndex(row=>row == date)
    let y = hours.days.findIndex(row=>row == hour)
    let z = minutes.days.findIndex(row=>row == min)
    this.setData({
      pickerColumns: [dates.days, hours.days, minutes.days],
      raw: [dates.rows, hours.rows, minutes.rows], // 保留原始数据
      dayValue,
      startValue: [x,y,z]
    });
  },

  gotrend() {
    if(this.data.cyclelist.length>0) {
      wx.navigateTo({
        url: '/pages/sports/trend?id='+this.data.cyclelist[0].id
      })
    } else {
      wx.navigateTo({
        url: '/pages/sports/trend?id=0'
      })
    }
  },

  go_news_detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news/detail?id=' + id
    });
  },
  getNews(){
    api.movewell.getNewsData().then(r => {
      if (r.code == 200) {
        r.data.list.forEach(item => {
          item.create_time = moment(Number(item.create_time)*1000).format('YYYY-MM-DD HH:mm:ss')
        })
        // 选择前10个数据
        r.data.list = r.data.list.slice(0, 10)
        this.setData({
          newlist: r.data.list
        })
      }
    })
  },
  init() {
    // this.getWeight()
    this.getNews()
    
  },
  draw(res) {
    console.log(res,'draw')
    const canvas = res[0].node;
    if (!this.ctx) {
      this.ctx = canvas.getContext('2d');
    }

    const dpr = wx.getSystemInfoSync().pixelRatio;
    const screenWidth = wx.getSystemInfoSync().screenWidth;
    const canvasWidthPx = (300 / 750) * screenWidth * dpr; // 宽度
    const canvasHeightPx = (200 / 750) * screenWidth * dpr; // 高度
    console.log(canvasWidthPx,canvasHeightPx, 'dpr')

    // width = width * dpr;
    // height = height * dpr;
    canvas.width = canvasWidthPx;
    canvas.height = canvasHeightPx;
    // // 清除 Canvas 内容
    this.ctx.clearRect(0, 0, canvasWidthPx, canvasHeightPx);
    let balance = this.data.balance
    let deg = (balance.banlance?(balance.standard_intake*1 - balance.banlance*1):0) / (balance.standard_intake*1);
    
    deg = deg > 1 ? 1 : deg;
    if(deg < 0) deg = 0
    deg = deg * 100;
    // this.deg = 0
    console.log(deg,'deg')
    this._render(this.ctx,deg, dpr);

  },
  _render(ctx,progress,dpr) {
    const centerX = 78 * dpr; // 圆心 X 坐标（基于 300rpx 宽度的一半）
    const centerY = 70 * dpr; // 圆心 Y 坐标（靠近底部）
    const radius = 60 * dpr;
    const startAngle = Math.PI; // 起始角度：180度（π 弧度），即左侧
    const endAngle = Math.PI * 2; // 结束角度：0度，即右侧

    // 动态点亮的角度（从 startAngle 开始逐渐增加）
    let currentAngle = Math.PI + (progress / 100) * Math.PI;

    // 绘制未点亮的部分（灰色弧线）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 10 * dpr;
    ctx.strokeStyle = '#ebedf0'; // 灰色
    ctx.stroke();

    // 绘制点亮的部分
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.lineWidth = 10 * dpr;
    ctx.strokeStyle = '#00C7C7';
    ctx.stroke();
  },

  bindPickerChange(e) {
    console.log(e,'bindPickerChange',e.detail.value)
    const [dateIndex, hourIndex, minIndex] = e.detail.value;
    const selectedDate = this.data.raw[0][dateIndex].value;
    const hour = this.data.raw[1][hourIndex].value;
    const minute = this.data.raw[2][minIndex].value;
    
    // 格式化为字符串示例：3月3日 周一 12:20
    const dateStr = `${this.data.raw[0][dateIndex].label} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const date = `${selectedDate} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
    
    let time = moment(date, "YYYY-MM-DD HH:mm:ss").unix();

    this.setData({
      dayF: time,
      dayValue: dateStr,
      startValue: e.detail.value
    })
  },

  bindColumnChange(e) {
    console.log(e,'bindColumnChange')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
