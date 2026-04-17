// pages/food/add.js
import api from '../../request/index';

Page({
  data: {
    tabList: [
      {
        value: 0,
        label: '主食'
      }
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
    show2: false
  },

  onLoad(options) {
    let name = '早餐';
    switch (Number(options.type)) {
      case 1:
        name = '早餐';
        break;
      case 2:
        name = '午餐';
        break;
      case 3:
        name = '晚餐';
        break;
      case 4:
        name = '加餐';
        break;
      default:
        name = '早餐';
        break;
    }

    this.setData({
      type: options.type || 1,
      typename: name,
      date: options.date || '',
      time: options.time || '',
      dietid: options.dietid ? options.dietid : ''
    });
  },

  onShow() {
    this.init();
  },

  onClose2() {
    this.setData({
      show2: false
    });
  },

  showTime() {
    this.setData({
      show2: true
    });
  },

  onConfirm2(event) {
    this.setData({
      time: event.detail,
      show2: false
    });
  },

  onSearch(e) {
    const searchTerm = e.detail || '';
    if (searchTerm) {
      this.searchdietlist(searchTerm);
    } else {
      this.init();
    }
    this.setData({
      value: searchTerm
    });
  },

  onCancel() {
    this.setData({
      value: ''
    });
    this.init();
  },

  changenum(e) {
    this.setData({
      'detail.num': Number(e.detail || 0)
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  showtap() {
    const checklist = this.data.checklist || [];
    if (!checklist.length) {
      this.setData({
        showadd: false
      });
      return;
    }
    this.setData({
      showadd: !this.data.showadd
    });
  },

  onCloseA() {
    this.setData({
      showadd: false
    });
  },

  setconfig() {
    wx.navigateTo({
      url: './config'
    });
  },

  changecheck(e) {
    const { index } = e.currentTarget.dataset;
    const num = Number(e.detail || 0);
    const checklist = this.data.checklist || [];

    if (num === 0) {
      checklist.splice(index, 1);
    } else if (checklist[index]) {
      checklist[index].num = num;
    }

    this.setData({
      checklist
    });

    if (!checklist.length) {
      this.setData({
        showadd: false
      });
    }

    this.syncChecklistToList();
  },

  delFood(e) {
    const { index } = e.currentTarget.dataset;
    const checklist = this.data.checklist || [];
    checklist.splice(index, 1);

    this.setData({
      checklist
    });

    if (!checklist.length) {
      this.setData({
        showadd: false
      });
    }

    this.syncChecklistToList();
  },

  add(e) {
    const { item } = e.currentTarget.dataset;
    const detail = this.data.detail || {};
    const checklist = this.data.checklist || [];

    if (detail.id && detail.id === item.id) {
      this.setData({
        show: true
      });
      return;
    }

    const selected = checklist.find(row => row.id === item.id);
    if (selected) {
      this.setData({
        show: true,
        detail: { ...selected }
      });
      return;
    }

    this.setData({
      show: true,
      detail: {
        ...item,
        num: item.num > 0 ? item.num : 1
      }
    });
  },

  addFood() {
    const checklist = this.data.checklist || [];
    const data = { ...this.data.detail };

    if (Number(data.num) > 0) {
      const i = checklist.findIndex(row => row.id === data.id);
      if (i === -1) {
        checklist.push(data);
      } else {
        checklist.splice(i, 1, data);
      }
    } else {
      const i = checklist.findIndex(row => row.id === data.id);
      if (i !== -1) {
        checklist.splice(i, 1);
      }
    }

    this.setData({
      checklist,
      show: false
    });

    this.syncChecklistToList();
  },

  change(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      active: Number(type)
    });
  },

  normalizeFoodItem(item = {}) {
    return {
      ...item,
      id: item.id || item.tplid || item.food_id || item.diettplid || '',
      component: item.component || item.name || '',
      imgurl: item.imgurl || item.image || item.cover_url || '',
      unit: item.unit || '',
      energy: Number(item.energy || item.kcal || 0),
      amount: Math.floor(Number(item.amount || item.weight || 0)),
      num: Number(item.num || 0),
      type: item.type !== undefined ? item.type : '1'
    };
  },

  normalizeGroupedList(raw) {
    const checklist = this.data.checklist || [];
    const safeRaw = Array.isArray(raw) ? raw : [];

    if (!safeRaw.length) return [];

    // 情况1：已经是标准分组结构
    if (safeRaw[0] && (Array.isArray(safeRaw[0].list) || Array.isArray(safeRaw[0].foods) || Array.isArray(safeRaw[0].items))) {
      return safeRaw.map((group, index) => {
        const sourceList = Array.isArray(group.list)
          ? group.list
          : Array.isArray(group.foods)
            ? group.foods
            : Array.isArray(group.items)
              ? group.items
              : [];

        return {
          category: group.category || group.name || group.label || `分类${index + 1}`,
          list: sourceList.map(item => {
            const normalized = this.normalizeFoodItem(item);
            const selected = checklist.find(row => row.id === normalized.id);
            return {
              ...normalized,
              num: selected ? selected.num : 0
            };
          })
        };
      });
    }

    // 情况2：接口直接返回扁平食物数组
    if (safeRaw[0] && (safeRaw[0].component || safeRaw[0].name || safeRaw[0].id || safeRaw[0].tplid)) {
      return [
        {
          category: '主食',
          list: safeRaw.map(item => {
            const normalized = this.normalizeFoodItem(item);
            const selected = checklist.find(row => row.id === normalized.id);
            return {
              ...normalized,
              num: selected ? selected.num : 0
            };
          })
        }
      ];
    }

    return [];
  },

  buildTabList(groupedList) {
    return groupedList.map((group, index) => ({
      value: index,
      label: group.category || `分类${index + 1}`
    }));
  },

  init() {
    api.movewell.diettpl().then(res => {
      console.log('diettpl res =', res);

      if (res.code === 200) {
        const groupedList = this.normalizeGroupedList(res.data);
        const tabList = this.buildTabList(groupedList);

        let active = Number(this.data.active || 0);
        if (active >= groupedList.length) {
          active = 0;
        }

        this.setData({
          list: groupedList,
          tabList: tabList.length ? tabList : [{ value: 0, label: '主食' }],
          active
        });

        console.log('normalized groupedList =', groupedList);
      } else {
        this.setData({
          list: [],
          tabList: [{ value: 0, label: '主食' }],
          active: 0
        });
      }
    }).catch(err => {
      console.error('diettpl error =', err);
      this.setData({
        list: [],
        tabList: [{ value: 0, label: '主食' }],
        active: 0
      });
    });
  },

  searchdietlist(keyword) {
    api.user.searchdiettpl({ keyword }).then(res => {
      console.log('searchdiettpl res =', res);

      if (res.code === 200) {
        const active = Number(this.data.active || 0);
        const currentList = [...(this.data.list || [])];
        const checklist = this.data.checklist || [];

        const mylist = (res.data.mylist || []).map(item => ({
          ...this.normalizeFoodItem(item),
          type: '0'
        }));

        const syslist = (res.data.syslist || []).map(item => ({
          ...this.normalizeFoodItem(item),
          type: '1'
        }));

        const merged = [...mylist, ...syslist].map(item => {
          const selected = checklist.find(row => row.id === item.id);
          return {
            ...item,
            num: selected ? selected.num : 0
          };
        });

        if (!currentList[active]) {
          currentList[active] = {
            category: this.data.tabList[active] ? this.data.tabList[active].label : '主食',
            list: []
          };
        }

        currentList[active].list = merged;

        this.setData({
          list: currentList
        });
      }
    });
  },

  syncChecklistToList() {
    const checklist = this.data.checklist || [];
    const list = this.data.list || [];

    const newList = list.map(group => ({
      ...group,
      list: (group.list || []).map(item => {
        const selected = checklist.find(row => row.id === item.id);
        return {
          ...item,
          num: selected ? selected.num : 0
        };
      })
    }));

    this.setData({
      list: newList
    });
  },

  submit() {
    if (!this.data.checklist.length) {
      wx.showToast({
        title: '请选择食物',
        icon: 'error',
        duration: 2000
      });
      return;
    }

    const arr = this.data.checklist.map(item => ({
      tplid: item.id,
      total: item.num,
      type: item.type
    }));

    const query = {
      type: this.data.type,
      time: this.data.time,
      date: this.data.date,
      tpljson: JSON.stringify(arr)
    };

    if (this.data.dietid) {
      query.dietid = this.data.dietid;
    }

    api.movewell.addDietWithtpl(query).then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack();
      }
    });
  },

  onReady() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {}
});