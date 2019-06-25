//app.js
const api = require('./utils/api.js');
const util = require('./utils/util.js');
var aldstat = require('./utils/ald-stat.js');

App({
  onLaunch: function () {
    // 版本更新
    if (wx.getUpdateManager) {

      const updateManager = wx.getUpdateManager();
      console.log('updata version', updateManager);

      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      })
    }
    // wx.login({
    //   success: function (res) {
    //     console.log(res);
    //     if (res.code) {
    //       //发起网络请求
    //       let data = {
    //         code:res.code,
    //         from:3
    //       }
    //       api.getOpenId({
    //         data
    //       }).then((res)=>{
    //         // console.log('opnId');
    //         // console.log(res);
    //         if(res.code == 200 || res.code == 0){
    //           wx.setStorageSync('open_id', res.data.openid)
    //         }else{
    //           util.errorTips(res.msg)
    //         }
    //       }).catch((res)=>{
    //         util.errorTips(res.msg)
    //       })
    //     }
    //   }
    // });
  },
  globalData: {
    userInfo: null,
    addressIndex:0
  }
})