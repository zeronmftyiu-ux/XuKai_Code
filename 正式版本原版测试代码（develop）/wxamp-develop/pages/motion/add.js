// pages/food/add.js
import api from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    type: 0,
    value: '',
    active: 0,
    list: [],
    checklist: [],
    detail: {},
    show: false,
    typename: '运动',
    date: '',
    time: '',
    showadd: false,
    dietid: '',
    alllist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      date: options.date
    })
  },

  onSearch(e) {
    console.log(e,'onSearch')
    let searchTerm = e.detail
    let list = this.data.list
    let newlist = list.filter(item => item.title.includes(searchTerm));
    if(searchTerm !== '') {
      this.setData({
        list: newlist
      })
    } else {
      this.init()
    }
    this.setData({
      value: e.detail
    })
  },

  changenum(e) {
    this.setData({
      'detail.num': e.detail
    })
  },

  onClose() {
    this.setData({
      show: false,
      detail: {}
    })
  },
  
  showtap() {
    let list = this.data.checklist
    if(list.length == 0) {
      this.setData({
        showadd: false
      })
      return
    }
    this.setData({
      showadd: !this.data.showadd
    })
  },

  onCloseA() {
    this.setData({
      showadd: false
    })
  },

  onCancel() {
    console.log(1,'onCancel')
    this.setData({
      value: ''
    })
    this.init()
  },

  setconfig() {
    wx.navigateTo({
      url: './config'
    })
  },

  changecheck(e) {
    let { index } = e.currentTarget.dataset
    let num = e.detail
    let list = this.data.checklist
    if(num == 0) {
      list.splice(index, 1);
    } else {
      list[index]['num'] = e.detail
    }

    this.setData({
      checklist: list
    })
    if(list.length == 0) {
      this.setData({
        showadd: false
      })
    }

    this.selectList()
  },

  add(e) {
    let { item } = e.currentTarget.dataset
    let detail = this.data.detail
    let list = this.data.checklist
    if (JSON.stringify(detail) != '{}' && detail.tplid === item.tplid) {
      this.setData({
        show: true
      })
      return
    }
    if(list.length>0) {
      let citem = list.find(row=>row.tplid===item.tplid)
      if(citem) {
        this.setData({
          show: true,
          detail: citem
        })
        return
      }  
    }
    let data = Object.assign({},item)
    data.num = 30
    this.setData({
      show: true,
      detail: data
    })
  },

  addFood() {
    let data = this.data.detail
    if(!data.num || data.num<=0) {
      wx.showToast({
        title: '请填写',
        icon: 'error',
        duration: 2000
      })
      return 
    }
    let query = {
      tplid: data.tplid,
      value: data.num,
      date: this.data.date,
    }
    api.movewell.editMyact(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      }
    });
    // let list = this.data.checklist
    // let data = this.data.detail
    // if(data.num && data.num> 0){ 
    //   let i = list.findIndex(row=>row.tplid===data.tplid)
    //   if(i === -1) {
    //     list.push(this.data.detail) 
    //   } else {
    //     list.splice(i, 1, data);
    //   }
      
    // }
    // this.setData({
    //   checklist: list,
    //   show: false
    // })

    // this.selectList()
  },

  change(e) {
    let { type } = e.currentTarget.dataset
    let alllist = this.data.alllist
    let list = alllist[type]
    list.forEach(item=>{
      item.unitvalue = Math.floor(item.unitvalue*1)
    })
    this.setData({
      active: type,
      list: list
    })
  },

  init() {
    api.movewell.tpls().then(res=>{
      if(res.code == 200) {
        let alllist = res.data
        let active = this.data.active
        let arr = Object.values(alllist)
        let list = arr[active]
        list.forEach(item=>{
          item.unitvalue = Math.floor(item.unitvalue*1)
        })
        console.log(list,'list');
        this.setData({
          tabList: Object.keys(alllist),
          list: list,
          alllist: arr
        })
      }
    })
  },

  selectList() {
    let list = this.data.checklist
    let alllist = this.data.list

    alllist.forEach(item=>{
      let citem = list.find(row=>row.tplid === item.tplid)
      if(citem) {
        item.num = citem.num
      } else {
        item.num = 0
      }
    })

    this.setData({
      list: alllist
    })
  },

  submit() {
    console.log(this.data.form)
    if(this.data.checklist.length == 0) {
      wx.showToast({
        title: '请填写',
        icon: 'error',
        duration: 2000
      })
      return      
    }
    let arr = []
    this.data.checklist.forEach(item=>{
      for(let i = 1;i <= item.num; i++) {
        arr.push(item.id)
      }
    })
    let query = {
      type: this.data.type,
      time: this.data.time,
      date: this.data.date,
      tplids: arr.toString()
    }

    if(this.data.dietid != '') {
      query.dietid = this.data.dietid
    }

    api.movewell.editMyact(query).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack()
      }
    });
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
    this.init()
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