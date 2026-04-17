// pages/user/bind/detail.js
import api from '../../../request/index';
import util from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    form: {
      name: '',
      bcode: '',
      idtype: 1,
      idcard: '',
      birth: '',
      gender: '',
      phone: ''
    },
    minDate: new Date(1949, 0, 1).getTime(),
    currentDate: new Date(1990, 0, 1).getTime(),
    show: false,
    type: '',
    dvalue: '',
    disabled: false,
  },

  goplan(e){
    const sign = e.currentTarget.dataset.sign;
    wx.navigateTo({
      url: `/pages/lead/first/index?sign=${sign}`
    })
  },
  Mycyclelist() {
    api.movewell.mycyclelist({valid:1}).then(res=>{
      if(res.code == 200) {
        res.data.forEach(item => {
          item.start = item.weight[item.weight.length-1].weight
        });
        this.setData({
          mycyclelist: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.bcode) {
      this.setData({
        'form.bcode': options.bcode
      })
    }
    this.setData({
      disabled: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  onRadioChange(event) {
    this.setData({
      'form.gender': event.detail*1,
    });
  },

  onChange(e) {
    console.log(e,'e')
    let name = e.currentTarget.dataset.name;
    this.data.form[name] = e.detail;

    // if(this.data.form.idtype == 1 && name ==  'idcard' && e.detail != '' && e.detail.length == 18) {
    //   let { birth,gender } = util.formatidcard(e.detail)
    //   this.setData({
    //     'form.birth': birth,
    //     'form.gender': gender
    //   })
    // }
  },

  showDialog(e){
    console.log('e.currentTarget.dataset.label', this.data)
    this.setData({
      show: true,
      type: e.currentTarget.dataset.label
    })
  },

  onChangeT(e){
    this.setData({
      dvalue: e.detail,
    });
    
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      dvalue: name
    });
  },

  changeDate(event) {
    console.log('event', event.detail.getColumnValue(0))
    this.setData({
      dvalue:`${event.detail.getColumnValue(0)}-${event.detail.getColumnValue(1)}-${event.detail.getColumnValue(2)}`
    })
  },

  handleSubmit() {
    let type = this.data.type
    switch(type) {
      case 'birth':
        this.setData({
          show: false,
          'form.birth': this.data.dvalue
        })
        break
      case 'idtype':
        if(this.data.dvalue == 1 && this.data.form.idcard != '') {
          let { birth,gender } = util.formatidcard(this.data.form.idcard)
          this.setData({
            'form.birth': birth,
            'form.gender': gender
          })
        }
        this.setData({
          show: false,
          'form.idtype': this.data.dvalue*1
        })
        break
    }
    
  },

  onClose(){
    this.setData({
      show: false,
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
      this.Mycyclelist();
      this.getUserInfo()
    } else {
      // 全局方法还未执行完毕，等待
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          // 全局方法执行完毕后，执行页面的方法
          this.Mycyclelist();
          this.getUserInfo()
        } else {
          // 继续等待
          setTimeout(checkGlobalInitialized, 100);
        }
      };
      checkGlobalInitialized();
    }
    
  },

  getUserInfo: function () {
    let form = this.data.form
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        form.name = res.data.name?res.data.name : ''
        form.idtype = res.data.id_type?res.data.id_type*1 : 1
        form.idcard = res.data.id_number?res.data.id_number : ''
        form.phone = res.data.phone
        // if(res.data.id_type == 1 && res.data.id_number) {
        //   let { birth,gender } = util.formatidcard(res.data.id_number)
        //   form.birth = birth
        //   form.gender = gender
        // }
        form.birth = res.data.birthday
        form.gender = res.data.gender*1
        this.setData({
          userInfo: res.data,
          form: form
        });
        if(res.data.bdinfo.binding == 1 && res.data.bdinfo.bdstate == 1) {
          console.log('跳转个人中心')
          wx.switchTab({
            url: '/pages/user/index'
          })
        } else if(res.data.bdinfo.binding == 1 && res.data.bdinfo.bdstate == 2) {
          console.log('跳转绑定')
          wx.navigateTo({
            url: '/pages/user/bind/index'
          })
        } else if(res.data.bdinfo.binding == 1 && res.data.bdinfo.bdstate == 3) {
          console.log('跳转绑定')
          wx.navigateTo({
            url: '/pages/user/bind/index'
          })
        }
      }
    });
  },

  submit() {
    if(!this.data.disabled){
      console.log('提交')
      return
    }
    console.log(this.data.form)
    if(this.data.form.name == '' || this.data.form.idtype == '' || 
      this.data.form.idcard == '' || this.data.form.phone == '' ||
      this.data.form.gender == '' || this.data.form.birth == '' ||
      this.data.form.bcode == ''
    ) {
      wx.showToast({
        title: '内容有误',
        icon: 'error',
        duration: 2000
      })
      return      
    }
    this.setData({
      disabled: true
    })
    api.user.bindAdmin(this.data.form).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else{
        this.setData({
          disabled: false
        })
      }
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

  }
})