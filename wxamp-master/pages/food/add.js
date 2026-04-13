// pages/food/add.js
import api from '../../request/index';

Page({
  data: {
    tabList: [
      { value: 0, label: '常用' },
      { value: 1, label: '自定义食物' }
    ],
    type: 0,
    value: '',
    active: 0,
    list: [],
    checklist: [],
    detail: {},
    show: false,
    typename: '早餐',
    date: '',
    time: '',
    showadd: false,
    dietid: '',
    minHour: 0,
    maxHour: 24,
    show2: false,

    fromCamp: 0,
    camp_id: '',
    camp_name: '',
    remark: ''
  },

  onLoad(options) {
    let name = '早餐'
    switch (options.type * 1) {
      case 1:
        name = '早餐'
        break
      case 2:
        name = '午餐'
        break
      case 3:
        name = '晚餐'
        break
      case 4:
        name = '加餐'
        break
    }

    this.setData({
      type: options.type,
      typename: name,
      date: options.date,
      time: options.time,
      dietid: options.dietid ? options.dietid : '',
      fromCamp: Number(options.fromCamp || 0),
      camp_id: options.camp_id || '',
      camp_name: decodeURIComponent(options.camp_name || ''),
      remark: options.remark || ''
    })
  },

  goCampDetail() {
    const { camp_id } = this.data
    if (!camp_id) {
      wx.navigateBack()
      return
    }

    wx.navigateTo({
      url: `/pages/user/campDetail/index?camp_id=${camp_id}`
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value || ''
    })
  },

  onClose2() {
    this.setData({
      show2: false
    })
  },

  showTime() {
    this.setData({
      show2: true
    })
  },

  onConfirm2(event) {
    this.setData({
      time: event.detail,
      show2: false
    })
  },

  onSearch(e) {
    let searchTerm = e.detail
    let list = this.data.list
    let newlist = list.filter(item => item.component.includes(searchTerm))

    if (searchTerm !== '') {
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
      show: false
    })
  },

  showtap() {
    let list = this.data.checklist
    if (list.length == 0) {
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

    if (num == 0) {
      list.splice(index, 1);
    } else {
      list[index]['num'] = e.detail
    }

    this.setData({
      checklist: list
    })

    if (list.length == 0) {
      this.setData({
        showadd: false
      })
    }

    this.selectList()
  },

  delFood(e) {
    let { index } = e.currentTarget.dataset
    let list = this.data.checklist
    list.splice(index, 1);
    this.setData({
      checklist: list
    })

    if (list.length == 0) {
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

    if (JSON.stringify(detail) != '{}' && detail.id === item.id) {
      this.setData({
        show: true
      })
      return
    }

    if (list.length > 0) {
      let citem = list.find(row => row.id === item.id)
      if (citem) {
        this.setData({
          show: true,
          detail: citem
        })
        return
      }
    }

    let data = Object.assign({}, item)
    data.num = 1
    this.setData({
      show: true,
      detail: data
    })
  },

  addFood() {
    let list = this.data.checklist
    let data = this.data.detail

    if (data.num > 0) {
      let i = list.findIndex(row => row.id === data.id)
      if (i === -1) {
        list.push(this.data.detail)
      } else {
        list.splice(i, 1, data);
      }
    } else {
      let i = list.findIndex(row => row.id === data.id)
      if (i !== -1) {
        list.splice(i, 1);
      }
    }

    this.setData({
      checklist: list,
      show: false
    })

    this.selectList()
  },

  change(e) {
    let { type } = e.currentTarget.dataset
    this.setData({
      active: type
    })

    this.init()
  },

  init() {
    let query = {
      type: this.data.active
    }

    api.movewell.diettpl(query).then(res => {
      if (res.code == 200) {
        let list = this.data.checklist
        let alllist = res.data || []

        alllist.forEach(item => {
          let citem = list.find(row => row.id === item.id)
          if (citem) {
            item.num = citem.num
          } else {
            item.num = 0
          }
          item.amount = Math.floor(item.amount * 1)
        })

        this.setData({
          list: alllist
        })
      }
    })
  },

  selectList() {
    let list = this.data.checklist
    let alllist = this.data.list

    alllist.forEach(item => {
      let citem = list.find(row => row.id === item.id)
      if (citem) {
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
    if (this.data.checklist.length == 0) {
      wx.showToast({
        title: '请选择食物',
        icon: 'error',
        duration: 2000
      })
      return
    }

    let arr = []
    this.data.checklist.forEach(item => {
      arr.push({
        tplid: item.id,
        total: item.num
      })
    })

    let query = {
      type: this.data.type,
      time: this.data.time,
      date: this.data.date,
      tpljson: JSON.stringify(arr)
    }

    if (this.data.dietid != '') {
      query.dietid = this.data.dietid
    }

    // 备注字段先前端保留，后端未支持时不强依赖
    if (this.data.remark) {
      query.remark = this.data.remark
    }

    api.movewell.addDietWithtpl(query).then(res => {
      if (res.code == 200) {
        const toastTitle = this.data.fromCamp
          ? '记录成功，活动饮食打卡已提交'
          : '提交成功'

        wx.showToast({
          title: toastTitle,
          icon: 'success',
          duration: 2000
        })

        if (this.data.fromCamp) {
          setTimeout(() => {
            wx.showModal({
              title: '打卡提示',
              content: '本次饮食记录已提交。若当日积分次数已达上限，本次记录仍会保留，但不额外加分。',
              showCancel: false,
              success: () => {
                wx.navigateBack()
              }
            })
          }, 600)
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 600)
        }
      }
    })
  },

  onReady() {},

  onShow() {
    this.init()
  },

  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {}
})