const rate  =   2;
export default class Poster {
    palette(bcode) {
        return ({
            width: '950rpx',
            height: '1050rpx',
            background:'#ffffff',
            views: [
                {
                    type: 'image',
                    url: bcode,
                    css: {
                        top: '40rpx',
                        left: '60rpx',
                        width: '830rpx',
                        height: '830rpx',
                        borderWidth:'1rpx',
                        borderColor:'#FFFFFF'
                    },
                },
                {
                    type: 'text',
                    text: '扫一扫绑定专属医生',
                    css: [{
                        top: '900rpx',
                        left: '80rpx',
                        fontSize: '86rpx',
                        color: '#333',
                        textAlign: 'center',

                    }]
                },
                
                // {
                //     type: 'rect',
                //     css: {
                //         top: 298*rate+'rpx',
                //         left: 17*rate+'rpx',
                //         width: 656*rate+'rpx',
                //         height: 668*rate+'rpx',
                //         color: '#FFFFFF',
                //     },
                // },
                // {
                //     type: 'text',
                //     text: info.title,
                //     css: [{
                //         top:335*rate+'rpx',
                //         left:30*rate+'rpx',
                //         fontSize:35*rate+"rpx",
                //         fontWeight:"bold",
                //         width: 646*rate+'rpx',
                //         maxLines:2,
                //         textAlign:"left"
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: '报名时间:',
                //     css: [{
                //         fontSize:24*rate+"rpx",
                //         color:"#999999",
                //         left:71*rate+'rpx',
                //         top:495*rate+"rpx",
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: '举办地点:',
                //     css: [{
                //         top:561*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#999999",
                //         left:71*rate+'rpx',
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: '举办时间:',
                //     css: [{
                //         top:627*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#999999",
                //         left:71*rate+'rpx',
                //     }],
                // },


                // {
                //     type: 'text',
                //     text: info.regstarttime+"至"+info.regendtime,
                //     css: [{
                //         fontSize:24*rate+"rpx",
                //         color:"#000",
                //         right:79*rate+'rpx',
                //         top:495*rate+"rpx",
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: info.address,
                //     css: [{
                //         width:415*rate+"rpx",
                //         top:561*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#000",
                //         left:200*rate+'rpx',
                //         maxLines:2,
                //         textAlign:"right"
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: info.starttime+"至"+info.endtime,
                //     css: [{
                //         top:627*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#000",
                //         right:79*rate+'rpx',
                //     }],
                // },
                // {
                //     type: 'rect',
                //     css: {
                //         bottom: 279*rate+'rpx',
                //         left: 23*rate+'rpx',
                //         width: 644*rate+'rpx',
                //         height: '1rpx',
                //         color: '#D8D8D8',
                //     },
                // },
                // {
                //     type: 'rect',
                //     css: {
                //         bottom: 279*rate+'rpx',
                //         left: 74*rate+'rpx',
                //         width: 540*rate+'rpx',
                //         height: '1rpx',
                //         color: '#D8D8D8',
                //     },
                // },
                // {
                //     type: 'image',
                //     url: userinfo.avatarurl,
                //     css: {
                //         borderRadius:40*rate+"rpx",
                //         bottom: 140*rate+'rpx',
                //         left: 82*rate+'rpx',
                //         width: 80*rate+'rpx',
                //         height: 80*rate+'rpx'
                //     },
                // },
                // {
                //     type: 'text',
                //     text: userinfo.nickname,
                //     css: [{
                //         bottom:185*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#000",
                //         left:180*rate+'rpx',
                //     }],
                // },
                // {
                //     type: 'text',
                //     text: '分享给您',
                //     css: [{
                //         bottom:145*rate+"rpx",
                //         fontSize:24*rate+"rpx",
                //         color:"#999999",
                //         left:180*rate+'rpx',
                //     }],
                // },
                // {
                //     type: 'image',
                //     url: '/images/matchdetail/shareposter.png',
                //     css: {
                //         bottom: 75*rate+'rpx',
                //         left: 74*rate+'rpx',
                //         width: 295*rate+'rpx',
                //         height: 40*rate+'rpx'
                //     },
                // },
                // {
                //     type: 'image',
                //     url: info.qrcode,
                //     css: {
                //         bottom: 81*rate+'rpx',
                //         right: 79*rate+'rpx',
                //         width: 169*rate+'rpx',
                //         height: 169*rate+'rpx'
                //     },
                // },
            ],
        });
    }
}
