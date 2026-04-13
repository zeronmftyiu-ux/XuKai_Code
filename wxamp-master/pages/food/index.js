// pages/food/index.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';

Page({
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
    list: [],
    img_url: 'https://oss.mcloud.moveclub.cn/mcloudbkh5/20241227/1735288097-676e6521e2139.jpeg',
    show: false,
    food_name: '',
    food_num: '',
    food_time: '',
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

    types: ['早餐', '午餐', '晚餐', '加餐'],
    tidx: 0,
    show2: false,
    currentDate: '12:00',
    minHour: 0,
    maxHour: 24,
    show3: false,
    sign_num: 0,
    detail: {},
    datelist: [],
    width: 32,
    balance: {},
    showS: false,
    item: {},

    // 训练营态最小改造
    isCampMode: false,
    campId: '',
    campName: '',
    campInfo: null,

    safeTop: 0,
    capsuleHeight: 32
  },

  toggleType(e) {
    this.setData({
      tidx: e.currentTarget.dataset.index
    })
  },

  showEdit(e) {
    let { item } = e.currentTarget.dataset
    api.movewell.dietTplDeatil({ tplid: item.tplid }).then(res => {
      if (res.code == 200) {
        item.unit = res.data.unit
        item.unitvalue = Math.floor(res.data.amount * 1)
        item.energy = res.data.energy
        this.setData({
          item: item,
          showS: true
        })
      }
    })
  },

  showTime() {
    this.setData({
      show2: true
    })
  },

  onInput(event) {
    this.setData({
      food_time: event.detail,
    })
  },

  onClose2() {
    this.setData({
      show2: false
    })
  },

  onConfirm2(event) {
    console.log(event, 'time')
    this.setData({
      food_time: event.detail,
      show2: false
    })
  },

  onSelect1(event) {
    console.log(event)
    this.setData({
      value1: event.detail,
    })
  },

  chooseImage() {
    var _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        wx.showLoading({ title: '上传中' });
        wx.uploadFile({
          url: pararms.uploadurl,
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          formData: utils.uploadparams(),
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == 200) {
              _this.setData({
                img_url: data.data.imgurl,
                show: true,
              })
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

  goback() {
    wx.navigateBack()
  },

  onClose() {
    this.setData({
      show: false
    })
  },

  onCloses() {
    this.setData({
      showS: false
    })
  },

  buildCampQuery() {
    const { isCampMode, campId, campName } = this.data
    if (!isCampMode || !campId) return ''
    return '&camp_id=' + encodeURIComponent(campId) + '&camp_name=' + encodeURIComponent(campName || '') + '&fromCamp=1'
  },

onLoad(options) {
  const campId = options.camp_id || options.campId || ''
  const campName = decodeURIComponent(options.camp_name || options.campName || '')

  const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
  const menuButtonInfo = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null

  let safeTop = 0
  let capsuleHeight = 32

  if (menuButtonInfo) {
    safeTop = menuButtonInfo.top
    capsuleHeight = menuButtonInfo.height
  } else {
    safeTop = (windowInfo.statusBarHeight || 20) + 8
    capsuleHeight = 32
  }

  this.setData({
    date: moment().format('YYYY-MM-DD'),
    currentDate: moment().format('HH:mm'),

    isCampMode: !!campId,
    campId: campId,
    campName: campName,
    campInfo: campId ? {
      camp_id: campId,
      camp_name: campName
    } : null,

    safeTop,
    capsuleHeight
  })

  const widthInPx = this.rpxToPx(65)
  this.setData({ width: widthInPx })

  this.getBalance()
  this.getTotalData()
  this.getConfig()
},

  getConfig() {
    api.movewell.getStandard({ signtype: 3, date: this.data.date })
  },

  rpxToPx(rpx) {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth;
    return (rpx * screenWidth) / 750;
  },

  today() {
    let startOfWeek = moment().startOf('week');
    console.log(startOfWeek)

    api.movewell.getBalance({
      sdate: moment().startOf('week').format('YYYY-MM-DD'),
      edate: moment().endOf('week').format('YYYY-MM-DD')
    }).then(res => {
      if (res.code == 200) {
        let datas = res.data
        let arr = [];
        let color = ''
        let date = []
        let value = 0
        for (let i = 0; i < 7; i++) {
          color = '#CDE0DD'
          value = 0
          date = datas[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] ? datas[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] : {}
          if (date.banlance) {
            if (date.banlance < 0) {
              value = 100
              color = '#FF8D4F'
            } else if (date.banlance == 0) {
              value = 100
              color = '#00C7C7'
            } else {
              color = '#16BF92'
              value = Math.floor(100 - (date.banlance * 100 / date.standard_intake * 1))
            }
          }
          arr.push({
            value: startOfWeek.clone().add(i, 'days').format('D'),
            date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'),
            color,
            pro: value
          })
        }
        console.log(arr, 'arr')
        this.setData({
          day: arr,
          idx: 0
        })
      }
    })
  },

  up() {
    let idx = this.data.idx
    idx += -1
    let startOfWeek = ''
    let endOfWeek = ''
    if (idx == 0) {
      this.today()
      return
    } else if (idx < 0) {
      startOfWeek = moment().subtract(Math.abs(idx), 'week').startOf('week');
      endOfWeek = moment().subtract(Math.abs(idx), 'week').endOf('week');
    } else {
      startOfWeek = moment().add(idx, 'week').startOf('week');
      endOfWeek = moment().add(idx, 'week').endOf('week');
    }
    api.movewell.getBalance({
      sdate: startOfWeek.format('YYYY-MM-DD'),
      edate: endOfWeek.format('YYYY-MM-DD')
    }).then(res => {
      if (res.code == 200) {
        let arr = [];
        let dates = res.data
        let color = ''
        let date = {}
        let value = 0
        for (let i = 0; i < 7; i++) {
          color = '#CDE0DD'
          value = 0
          date = dates[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] ? dates[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] : {}
          if (date.banlance) {
            if (date.banlance < 0) {
              value = 100
              color = '#FF8D4F'
            } else if (date.banlance == 0) {
              value = 100
              color = '#00C7C7'
            } else {
              color = '#16BF92'
              value = Math.floor(100 - (date.banlance * 100 / date.standard_intake * 1))
            }
          }
          arr.push({
            value: startOfWeek.clone().add(i, 'days').format('D'),
            date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'),
            color,
            pro: value
          })
        }
        console.log(arr, 'arr')
        this.setData({
          day: arr,
          idx: idx
        })
      }
    })
  },

  down() {
    let idx = this.data.idx
    idx += 1
    let startOfWeek = ''
    if (idx == 0) {
      this.today()
      return
    } else if (idx < 0) {
      startOfWeek = moment().subtract(Math.abs(idx), 'week').startOf('week');
    } else {
      startOfWeek = moment().add(idx, 'week').startOf('week');
    }

    console.log(startOfWeek)
    let arr = [];
    let dates = this.data.datelist
    let color = ''
    let date = []
    let value = 0
    for (let i = 0; i < 7; i++) {
      color = '#CDE0DD'
      value = 0
      date = dates[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] ? dates[startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')] : {}
      if (date.value) {
        color = '#16BF92'
        value = Math.floor(date.value * 100 / date.standard)
        if (value > 100) {
          color = '#FF8D4F'
        } else if (value == 100) {
          color = '#00C7C7'
        } else {
          color = '#16BF92'
        }
      }
      arr.push({
        value: startOfWeek.clone().add(i, 'days').format('D'),
        date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'),
        color,
        pro: value
      })
    }
    console.log(arr, 'arr')
    this.setData({
      day: arr,
      idx: idx
    })
  },

  godetail(e) {
    let { item } = e.currentTarget.dataset
    this.setData({
      detail: item,
      show3: true
    })
  },

  onClose3() {
    this.setData({
      show3: false
    })
  },

  toggleDate(e) {
    this.setData({
      date: e.currentTarget.dataset.date
    })
    this.getData()
    this.getConfig()
    this.getBalance()
  },

  getTotalData() {
    var data = {
      sdate: moment().clone().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
      edate: moment().clone().add(1, 'months').endOf('month').format('YYYY-MM-DD'),
      sign_type: 3
    }
    wx.showLoading({
      title: '请稍候...'
    })
    api.movewell.signCheck(data).then(res => {
      if (res.code == 200) {
        wx.hideLoading()
        this.setData({
          sign_num: res.data.totalnum,
          datelist: res.data.list
        })
        this.today()
      }
    })
  },

  getBalance() {
    api.movewell.getBalance({
      sdate: this.data.date,
      edate: this.data.date
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          balance: res.data[this.data.date]
        })
      }
    })
  },

  getData() {
    var data = {
      date: this.data.date,
    }
    wx.showLoading({
      title: '请稍候...'
    })
    api.movewell.getFoodData(data).then(res => {
      if (res.code == 200) {
        wx.hideLoading()
        var list = []
        if (res.data['1'].length != 0) {
          list.push({
            type: '1',
            food: res.data['1']
          })
        }
        if (res.data['2'].length != 0) {
          list.push({
            type: '2',
            food: res.data['2']
          })
        }
        if (res.data['3'].length != 0) {
          list.push({
            type: '3',
            food: res.data['3']
          })
        }
        if (res.data['4'].length != 0) {
          list.push({
            type: '4',
            food: res.data['4']
          })
        }
        console.log(list, 'list')
        this.setData({
          list: list
        })
      }
    })
  },

  gotype(e) {
    var { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: './add?type=' + type + '&date=' + this.data.date + '&time=' + this.data.currentDate + this.buildCampQuery()
    })
  },
  
  add(e) {
    var { type, item } = e.currentTarget.dataset
    wx.navigateTo({
      url: './add?type=' + type + '&date=' + this.data.date + '&time=' + this.data.currentDate + '&dietid=' + item.food[0].details[0].diet_id + this.buildCampQuery()
    })
  },

  deleteFood(e) {
    var _this = this
    var item = this.data.item
    wx.showModal({
      title: '提示',
      content: '确定删除该食物吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...'
          })
          var data = {
            diet_id: item.diet_id,
            detailid: item.detailid,
            status: 2
          }
          api.movewell.editDietDetail(data).then(res => {
            if (res.code == 200) {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              _this.getData()
              _this.getBalance()
              _this.setData({
                showS: false
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  addFood() {
    console.log('8888', this.data.food_name, this.data.food_num, this.data.food_time, this.data.img_url, this.data.value1, this.data.tidx + 1)
    if (this.data.food_time == '') {
      utils.ALERT('请输入食物时间')
      return
    }
    if (this.data.img_url == '') {
      utils.ALERT('请上传图片')
      return
    }
    var data = {
      date: this.data.date,
      type: this.data.tidx + 1,
      time: this.data.food_time,
      imgurl: this.data.img_url,
    }
    wx.showLoading({
      title: '提交中...'
    })
    api.movewell.setFoodData(data).then(res => {
      wx.hideLoading()
      if (res.code == 200) {
        utils.ALERT('提交成功，上传后需等待片刻后，自动上传，数据如有偏差，可手动上传或修改')
        this.setData({
          show: false,
          food_name: '',
          food_num: '',
          food_time: '',
          img_url: '',
          value1: '个',
        })
        this.getData()
      }
    })
  },

  changenum(e) {
    this.setData({
      'item.amount': e.detail
    })
  },

  editFood() {
    let data = this.data.item
    console.log(data, 'data')
    if (data.amount <= 0) {
      wx.showToast({
        title: '请填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    let query = {
      detailid: data.detailid,
      tplid: data.tplid,
      total: data.amount
    }
    api.movewell.editDietWithtpl(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        this.getData()
        this.getBalance()
        this.setData({
          showS: false
        })
      }
    });
  },

  onReady() {},

  onShow() {
    this.getData()
    this.getBalance()
  },

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  goBackCampDetail() {
    const { campId } = this.data
    if (!campId) return
  
    wx.navigateTo({
      url: '/pages/user/campDetail/index?camp_id=' + encodeURIComponent(campId)
    })
  }
})