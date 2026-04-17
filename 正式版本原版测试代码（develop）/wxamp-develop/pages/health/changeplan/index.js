// pages/health/changeplan/index.js
import api from '../../../request/index'
import moment from '../../../utils/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    weightinfo: {},
    show: false,
    title: '',
    dvalue: '',
    fieldSource: '',
    tempUserInfo: {},
    target: '',
    minDate: new Date(1949, 0, 1).getTime(),
    currentDate: new Date(1990, 0, 1).getTime(),
    list: ['6个月','1个月','半个月'],
    index: 0,
    today: '',
    item: {},
    canClickNext: true,
  },

  // getcyclelist() {
  //   api.movewell.mycyclelist().then(res=>{
  //     if (res.code == 200) {
  //       this.setData({
  //         weightinfo: res.data[0],
  //         tempWeightInfo: res.data[0]
  //       })
  //     }
  //   })
  // },
  init() {
    api.movewell.cyclelist().then(res=>{
      if(res.code == 200) {
        let com = []
        let weights = Array.from({ length: 201 }, (_, i) => 30 + i)
        res.data.forEach(item=>{
          com.push(item.title)
        })
        let item = []
        let channel = this.data.userinfo.channel?this.data.userinfo.channel[0]:{}
        
        let selectedWeight = channel.weight*1>0?(Math.floor(channel.weight*1) - 17): 38
        let weight = selectedWeight + 17
        let check = this.data.check
        item = res.data[0]
        if(weight - channel.weight*1 > 0) {
          item.lweight = ((weight - channel.weight*1)/item.week).toFixed(2)
          check = 1
        } else {
          item.lweight = ((channel.weight - weight*1)/item.week).toFixed(2)
          check = 2
        }
        weights = Array.from({ length: Math.floor(item.safe_high)+1 }, (_, i) => Math.floor(item.safe_low) + i)

        const middleIndexWeight = channel.weight*1>0?weights.indexOf(channel.weight*1-17):weights.indexOf(38);
        const weightScrollLeft = middleIndexWeight * 20
        this.setData({
          typelist: res.data,
          list: com,
          weights:weights,
          item,
          check,
          weightScrollLeft: weightScrollLeft
        })
      }
      
    })
  },
  getuserinfo() {
    api.user.getUserInfo().then(res=>{
      if (res.code == 200) {
        const target = (res.data.channel[0].weight * 1.0 - 10.00).toFixed(2);
        this.setData({
          userinfo: res.data,
          tempUserInfo: res.data,
          target: target,
        })
      }
    })
  },
  bindChange: function(e) {
    let typelist = this.data.typelist
    let channel = this.data.userinfo.channel?this.data.userinfo.channel[0]:{}
    let weight = this.data.selectedWeight + 17
    let check = this.data.check
    let item = typelist[e.detail.value]
    if(weight - channel.weight*1 > 0) {
      item.lweight = ((weight - channel.weight*1)/item.week).toFixed(2)
      check = 1
    } else {
      item.lweight = ((channel.weight*1 - weight)/item.week).toFixed(2)
      check = 2
    }
    // let weight = Array.from({ length: Math.floor(item.safe_high) - 8 }, (_, i) => (Math.floor(item.safe_low) - 17) + i)
    console.log(item)
    this.setData({
      index: e.detail.value,
      item: item,
      check
      // weights: weight
    })
  },
  showDialog(e) {
    const label = e.currentTarget.dataset.label || e.currentTarget.dataset.title;
    let value, source;
    if (label === '性别') {
        value = this.data.tempUserInfo.gender;
        source = 'gender';
    } else if (label === '生日') {
        value = this.data.tempUserInfo.birthday;
        source = 'birthday';
    } else if (label === '身高') {
        value = this.data.tempUserInfo.channel[0].height;
        source = 'height';
    } else if (label === '当前体重') {
        value = this.data.tempUserInfo.channel[0].weight;
        source = 'weight';
    } else if (label === '目标体重') {
        value = this.data.target;
        source = 'target';
    }
    this.setData({
        show: true,
        title: label,
        dvalue: value,
        fieldSource: source
    });
  },
  onClose(){
    this.setData({
      show: false,
    })
  },
  onChange(e){
    this.setData({
      dvalue: e.detail,
    });
  },
  handleSubmit() {
    const { fieldSource, dvalue, tempUserInfo } = this.data;
    let newTempUserInfo = { ...tempUserInfo };
    let newtarget = this.data.target;
    console.log(fieldSource );
    switch (fieldSource) {
        case 'gender':
            newTempUserInfo.gender = dvalue;
            break;
        case 'birthday':
            newTempUserInfo.birthday = dvalue;
            break;
        case 'height':
            newTempUserInfo.channel = [{ ...newTempUserInfo.channel[0], height: dvalue }];
            break;
        case 'weight':
            newTempUserInfo.channel = [{ ...newTempUserInfo.channel[0], weight: dvalue }];
            break;
        case 'target':
            newtarget = dvalue;
            break;
    }
    this.setData({
        show: false,
        tempUserInfo: newTempUserInfo,
        target: newtarget
    });
  },
  changeDate(event) {
    console.log('event', event.detail.getColumnValue(0))
    this.setData({
      dvalue: `${event.detail.getColumnValue(0)}-${event.detail.getColumnValue(1)}-${event.detail.getColumnValue(2)}`
    });
  },

  editInfo() {
    let query = {}
    query.height = this.data.tempUserInfo.channel[0].height,
    query.weight = this.data.tempUserInfo.channel[0].weight,
    query.gender = this.data.tempUserInfo.gender*1,
    query.birth = this.data.tempUserInfo.birthday,
    api.user.editInfo(query).then(res=>{
      if(res.code == 200) {
        this.next()
      }
    })
  },
  next() {
    if (!this.data.canClickNext) return;
    this.setData({ canClickNext: false });
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    let query = {
      cycleid: this.data.item.id,
      target: this.data.target
    }
    api.movewell.setCycle(query).then(res=>{
      if(res.code == 200) {
        api.movewell.generatecycle({cycleid: res.data.cycleid})
        if(res.code == 200) {
          wx.redirectTo({
            url: `/pages/lead/seven/index?Isgo=1`
          })
        }
      }
      this.setData({ canClickNext: true });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
    this.getuserinfo()
    // this.getcyclelist()
    this.init();
    const today = moment().format('YYYY-MM-DD');
    this.setData({
      today: today
    });
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