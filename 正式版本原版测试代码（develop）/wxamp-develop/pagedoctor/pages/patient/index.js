// pagedoctor/pages/patient/index.js
import api from '../../../request/index'
import moment from "../../../utils/moment";
var util = require("../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isOpen: true,
    contentHeight: 45,
    activeTab: 'diet',
    choose: 0,
    selectdate: '',
    aerobicSports: [],
    // diet:[
    //   {
    //     avatar:"http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E8%A7%92.png",
    //     name:'脱脂牛奶',
    //     cup:'1杯',
    //     kaluli:'33千卡'
    //   },
    //   {
    //     avatar:"http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E8%A7%92.png",
    //     name:'煮玉米',
    //     cup:'1根',
    //     kaluli:'107千卡'
    //   },
    //   {
    //     avatar:"http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E8%A7%92.png",
    //     name:'煎鸡蛋',
    //     cup:'2个',
    //     kaluli:'273千卡'
    //   }
    // ],
    exercise: [],
    // 日历数据
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
    isplan: false,
    dongtai: false,
    urid: null,
    chooseday: null,
    chooseweek: '',
    lastScrollTop: 0,
    reportlist: [],
  },

  getPreport: function() {
    const uid = this.data.urid;
    api.user.getpatientreport({purid:uid}).then(res=>{
      if (res.code == 200) {
        this.setData({
          reportlist: res.data.list
        })
      }
    })
  },
  godetail(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/pdfreport/view?url='+url
    });
  },
  getPatientinfo: function () { 
    const uid = this.data.urid;
    const date = this.data.selectdate;
    api.doctor.getPatientinfo({purid:uid, qdate:date}).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        res.data.create_time = moment(res.data.create_time*1000).format('YYYY-MM-DD HH:mm'),
        res.data.expired_time =  moment(res.data.expired_time*1000).format('YYYY-MM-DD HH:mm'),
        res.data.birthdate = util.calculateAge(res.data.birthdate),
        res.data.gender = util.getGenderText(res.data.gender);
        if (res.data.dietinfo) {
            Object.values(res.data.dietinfo).forEach(dayData => {
                dayData.forEach(item => {
                  const numericValue = Number(item.value);
                  item.value = numericValue.toFixed(2); // 保留两位小数
                });
            });
        };
        this.setData({
          patientinfo: res.data,
          exercise:  res.data.actinfo[date],
        });
      }
    })
  },
  getPatientcycle: function () { 
    const uid = this.data.urid;
    api.doctor.getPatientcycle({purid:uid}).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          let sportsData = '';
          if(res.data.motion.length>0){
            sportsData=JSON.parse(res.data.motion[0].sports);
          }
          console.log(sportsData,'sportsData');
          let keys =  Object.keys(sportsData);
          let values =  Object.values(sportsData);
          
          let list = [];
          keys.forEach((item,index)=>{
            list.push({
              key: item,
              value: Array.isArray(values[index])?values[index].toString():values[index]
            })
          })
          console.log(list,'111');
          this.setData({
            patientcycle: res.data,
            aerobicSports: list,
          });
        }
      })
  },
  getPatientassessment: function () { 
    const uid = this.data.urid;
    api.doctor.getPatientassessment({purid:uid}).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          this.setData({
            assessmentinfo: res.data,
          });
        }
      })
  },
  
  gogogo:  function (e) {
    const state = e.currentTarget.dataset.state;
    const urid = this.data.urid;
    const dongtai = this.data.dongtai;
    let urls = '';
    if  (state == 1) {
      urls = `/pagedoctor/pages/effect/index?urid=${urid}&dongtai=${dongtai}`
    } else {
      urls = `/pagedoctor/pages/expire/index?urid=${urid}`
    }
    wx.navigateTo({
      url: urls
    })
  },
  gomessage: function (e) {
    // const urid = e.currentTarget.dataset.urid;
    const urid = this.data.urid;
    wx.navigateTo({
      url: `/pagedoctor/pages/message/index?urid=${urid}`
    })
  },
  dateClick: function(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
          activeIndex: index,
          selectdate: e.currentTarget.dataset.date
      });
      this.getPatientinfo();
  },
  calculateContentHeight() {
    const query = wx.createSelectorQuery();
    query.select('.content-inner').boundingClientRect();
    query.exec(res => {
      if (res[0]) {
        this.setData({ contentHeight: res[0].height });
      }
    });
  },
  toggleAccordion() {
    this.setData({ isOpen: !this.data.isOpen });
  },
  // 页面滚动事件（适用于整个页面滚动）
  onPageScroll(e) {
    const scrollTop = e.scrollTop; // 当前滚动位置
    const lastScrollTop = this.data.lastScrollTop;
    // 判断滚动方向（向下滚动：scrollTop > lastScrollTop）
    if (scrollTop > lastScrollTop) {
      console.log('向下滚动');
      this.setData({ isOpen: false }); // 向下滚动时关闭手风琴
    }
    // 更新上次滚动位置
    this.setData({ lastScrollTop: scrollTop });
  },
  
  handleTab(e) {
    const tab = e.currentTarget.dataset.tab; // 获取 data-tab 的值
    this.setData({
      activeTab: tab
    });
  },
  chooseTab(e) {
    const index = e.currentTarget.dataset.index; // 获取点击的标签索引
    this.setData({
      choose: index
    });
  },

  setDefaultDate: function() {
    const today = this.getTodayDate();
    const dateStr = this.data.chooseday;
    const formattedDate = moment(dateStr).format('YYYY-MM-DD');
    this.setData({
      selectdate: dateStr<=0?today:formattedDate
    });
  },
  // 获取今天日期的函数（格式化为YYYY-MM-DD）
  getTodayDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 设置当前日期
  setCurrentDate(date) {
    this.setData({
      currentDate: date
    });
    this.generateCalendar();
  },
  // 生成日历
  generateCalendar() {
    const nowweek = this.data.currentDate;
    const now = nowweek; // 当前日期
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
            num,cal:parseFloat(cal.toFixed(2)),pin: Math.floor(pin/num),pcal: Math.floor(cal/num),pro:Math.floor((cal/num)/pin*100)>100?100:Math.floor((cal/num)/pin*100)
          }
        })
      }
    })
  },
  // 切换到上一月
  prevMonth() {
    // 获取当前选择的日期（YYYY-MM-DD格式）
    const currentSelectDate = this.data.selectdate; 
    let newDate;
    if (currentSelectDate) {
      // 如果已选择日期，则基于该日期计算上周同一天
      const momentDate = moment(currentSelectDate, 'YYYY-MM-DD').subtract(1, 'weeks');
      newDate = momentDate.clone();
      this.setData({
        selectdate: momentDate.format('YYYY-MM-DD') // 更新为上周同一天的日期
      });
    } else {
      // 如果没有选择日期，则默认用当前日期计算
      newDate = this.data.currentDate.clone().subtract(1, 'weeks');
      this.setData({
        selectdate: newDate.format('YYYY-MM-DD') // 设置为计算后的日期
      });
    }
    this.setCurrentDate(newDate);
    this.getPatientinfo();
    this.setData({
      activeIndex: '',
    });
  },
  // 切换到下一月
  nextMonth() {
    // 获取当前选择的日期（YYYY-MM-DD格式）
    const currentSelectDate = this.data.selectdate; 
    let newDate;
    if (currentSelectDate) {
      // 如果已选择日期，则基于该日期计算上周同一天
      const momentDate = moment(currentSelectDate, 'YYYY-MM-DD').add(1, 'weeks');
      newDate = momentDate.clone();
      this.setData({
        selectdate: momentDate.format('YYYY-MM-DD') // 更新为上周同一天的日期
      });
    } else {
      // 如果没有选择日期，则默认用当前日期计算
      newDate = this.data.currentDate.clone().add(1, 'weeks');
      this.setData({
        selectdate: newDate.format('YYYY-MM-DD') // 设置为计算后的日期
      });
    }
    this.setCurrentDate(newDate);
    this.getPatientinfo();
    this.setData({
      activeIndex: '',
    });
  },
  today() {
      this.setData({
        selectdate: '',
        activeIndex: '',
      });
      this.setDefaultDate();
      this.getPatientinfo();
      this.setCurrentDate(moment());
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      this.options = options;
      this.setData({
        urid: options.urid,
        dongtai: options.dongtai?options.dongtai:false,
        chooseday: options.day===null?moment():moment(options.day),
      })
      this.setCurrentDate(this.data.chooseday); // 初始化当前日期  
      this.init()
      this.setDefaultDate();
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.calculateContentHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getPatientinfo();
    this.getPatientcycle();
    this.getPatientassessment();
    this.getPreport();
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
    // this.setData({
    //   isOpen: false,
    // });
  },
})