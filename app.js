//app.js
const api = require('./utils/api.js');
const util = require('./utils/util.js');
var aldstat = require('./utils/ald-stat.js');

App({
  onLaunch: function () {

    // wx.connectSocket({
    //   url: 'wss://cloud.rngay.cn/notice/socket?userId=9',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
    // wx.onSocketOpen(function (res) {
    //   // callback
     

    //   // setTimeout(() => {
    //   //     wx.sendSocketMessage({
    //   //       data: 'Hello,World:' + Math.round(Math.random() * 0xFFFFFF).toString(),
    //   //     })
           
    //   //   }, 1000);

    //   console.log("WebSocket连接已打开！"); // 打开WebSocket连接，在进行通信之前必须先打开一个连接
    // })
    // wx.onSocketError(function (res) {  // WebSocket错误监听
    //   console.log('WebSocket连接打开失败，请检查！')
    //   console.log(res)
    // })
    //   wx.onSocketMessage(function (msg) { // WebSocket数据接收监听
    //     // CallBack
    //     console.log(msg);
    //   })
    
      // wx.onSocketClose(function () { // WebSocket关闭监听
      //   // callback
      //   console.log('WebSocket服务器已经关闭！');
      // }),
      // wx.sendSocketMessage({ // 向服务器发送数据，注意这个方法之必须在调用wx.connectSocket和wx.onSocketOpen回调之后
      //   data: "string" // 官方文档里data可以是string或者ArrayBuffer，但是注意这个ArrayBuffer并不是Array
      // });


    // if (wx.getSystemInfoSync().environment){

    //   // console.log(wx.getSystemInfoSync().environment);
    //   // util.successTips('成功');
    //   // 微信企业号
      
    // }else{
    //   //console.log(wx.getSystemInfoSync().environment);
    //   //util.successTips('失败');
    //   // 微信
    // }
    wx.login({
      success: function (res) {
        //console.log(res);
        if (res.code) {
          //发起网络请求
          let data = {
            code:res.code,
            from:3
          }
          api.getOpenId({
            data
          }).then((res)=>{
            // console.log('opnId');
            // console.log(res);
            wx.setStorageSync('open_id', res.data.openid)
          })
          // wx.request({
          //   method:'GET',
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx95dd0020bb2c868f&secret=97ee21e62a24a7ef2d22cdb0958d98c1&js_code='+ res.code +'&grant_type=authorization_code',
          //   success:function(res){
                 
          //     //  wx.setStorageSync({
          //     //    key: "open_id",
          //     //    data: res.data.openid
          //     //  })

               
          //   }
          // })
        }
      }
    });
    
  },
  globalData: {
    userInfo: null,
    addressIndex:0
  }
})