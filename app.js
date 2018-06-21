//app.js
const api = require('./utils/api.js');
var aldstat = require('./utils/ald-stat.js');
App({
  onLaunch: function () {
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
            console.log('opnId');
            console.log(res);
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