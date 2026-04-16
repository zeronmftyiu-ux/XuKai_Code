// pages/lead/sixth/index.js
import api from '../../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    attrs: [
      {
        keyname: 'motiontype',
        title: '你平时更喜欢哪些运动类型？',
        type: 2,
        value: '',
        custom: ['跳绳','跑步','游泳','骑自行车','羽毛球','乒乓球','网球','其他']
      },
      {
        keyname: 'time',
        title: '你每天可以有多长的运动时间？',
        type: 1,
        value: '',
        custom: ['10分钟','15分钟','30分钟','45分钟','1小时','1小时以上']
      },
      {
        keyname: 'place',
        title: '一般运动场所是在哪里？',
        type: 1,
        value: '',
        custom: ['户外运动','居家运动','专业场所']
      },
      {
        keyname: 'chronic',
        title: '你是否有以下疾病？',
        type: 2,
        value: '',
        custom: ['糖尿病','脂肪肝','高血压','心血管疾病','睡眠呼吸暂停综合症','骨关节疾病','胆囊疾病']
      },
      {
        keyname: 'take',
        title: '你是否正在服用药物？',
        type: 1,
        value: '',
        custom: ['是','否']
      }
    ],
    show: false,
    custom: [],
    keyname: '',
    title: '',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type
    })
    this.config()
  },

  config() {
    api.movewell.survey({surveyid: 1}).then(res=>{
      res.data.questions.forEach(item=>{
        if(item.question_type == 1) {
          item.custom = []
          item.options.forEach(row=>{
            item.custom.push(row.content)
          })
        }
      })
      this.setData({
        attrs: res.data.questions
      })
    })
  },

  bindChange: function(e) {
    console.log(e)
    // let form = this.data.form
    let { name,custom,index,options } = e.currentTarget.dataset
    // form[name] = custom[e.detail.value]
    this.setData({
      [`form.${name}`]: {option_id:options[e.detail.value].option_id},
      [`attrs[${index}].value`]: e.detail.value
    })
  },

  bindInput: function (e) {
    let { name,index } = e.currentTarget.dataset
    this.setData({
      [`form.${name}`]: {content:e.detail.value},
      [`attrs[${index}].value`]: e.detail.value
    })
  },

  showtap(e) {
    let { name,custom,title, item } = e.currentTarget.dataset
    console.log(item,'item')
    if(item.value) {
      let arr = item.value.split(',');
      custom.forEach(item=>{
        let i = arr.findIndex(row=>row == item.content)
        if(i !==-1 ) {
          item.check = true
        } else {
          item.check = false
        }
        
      })
    } else {
      custom.forEach(item=>{
        item.check = false
      })
    }
    
    this.setData({
      title,
      custom: custom,
      keyname: name,
      show: true
    })
  },

  change(e) {
    let { check,index } = e.currentTarget.dataset
    this.setData({
      [`custom[${index}].check`]: !check
    });
  },

  handleSubmit() {
    let arr = []
    let values = []
    this.data.custom.forEach(item=>{
      if(item.check) {
        arr.push(item.option_id)
        values.push(item.content)
      }
    })
    let key = this.data.keyname
    let index = this.data.attrs.findIndex(row=> row.question_id == key)
    this.setData({
      [`form.${key}`]: {option_id:arr.toString()},
      [`attrs[${index}].value`]: values.toString(),
      show: false
    })
  },

  onClose() {
    this.setData({
      show: false
    })
  },

  next() {
    let isvalid = true
    this.data.attrs.forEach(item=>{
      if(item.is_required == 1 && (!item.value || item.value == '') ) {
        isvalid = false
      }
    })
    if(!isvalid) {
      wx.showToast({
        title: '请填写完',
        icon: 'fail'
      })
      return
    }

    let type = this.data.type
    api.movewell.surveysummit({surveyid:1,answers: JSON.stringify(this.data.form)}).then(res=>{
      if(res.code == 200) {
        switch(type) {
          case '1':
          case '2':
          case '4':
            wx.switchTab({
              url: '/pages/index/index'
            })
            break
          case '3':      
            wx.navigateTo({
              url: '/pages/lead/seven/index'
            })
            break
        }

        api.user.skipguide({type: 2})
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

  }
})