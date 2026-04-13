var app = new getApp();
var util = require('../../utils/util.js');

Component({
    properties: {
        bannerList: {
            type: Array,
            value: []
        },
        type: {
            type: Number,
            value: 1
        },
        indicatorDots:{
            type:Boolean,
            value:true
        }
    },
    data: {},
    methods: {
        jump: function (e) {
            var data = e.currentTarget.dataset;
            var {type, value, url} = data;

            //跳转类型：1，内部跳转；2，外部url跳转
            switch (type * 1) {
                case 1:
                    wx.navigateTo({
                        url: url,
                        fail: function () {
                            wx.switchTab({
                                url: url
                            });
                        }
                    });
                    break;
                case 2:
                    //参数带上 用户信息
                    // if(data.url)
                    var jumpurl = data.url;
                    util.jumpurl(jumpurl);
                    break;
                case 3:
                    wx.navigateToMiniProgram({
                        appId: value,
                        path: url,
                        fail: function (e) {
                            console.log(e);
                        }
                    });
                    break;
            }
        }
    }
});