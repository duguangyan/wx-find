//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        //console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            method:'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx95dd0020bb2c868f&secret=97ee21e62a24a7ef2d22cdb0958d98c1&js_code='+ res.code +'&grant_type=authorization_code',
            success:function(res){
               console.log('opnId');
               console.log(res);
              wx.setStorage({
                key: "open_id",
                data: res.data.openid
              })
            }
          })
        }
      }
    });
    
  },
  globalData: {
    userInfo: null,
    addressIndex:0
  }
})