// pages/changePassword2/changePassword2.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeNum: 90, // 验证码60秒
    codeText: '获取验证码', // 验证码text
    isGetCode: false, // 判断是否获取验证码
    hasGetCodeNum: 1,   // 1 获取验证码  2 重新发送60秒 3 重新发送
    maxlength: 100,
    hasUserName: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取code
    this.data.code = options.code;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('forgetPayPassWord')) {
      wx.setNavigationBarTitle({
        title: '修改支付密码'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取新密码 
  getNewPassword(e) { 
    let index = e.currentTarget.dataset.index;
    
    let length = parseInt(e.detail.value.length);

    if (length < 6 ) {
      util.errorTips('输入至少6位字符');
      return false;
    } else if (length > 20) {
      util.errorTips('密码最多20位字符');
      return false;
    }
    if (index == 1) {
      this.data.passwordValue1 = e.detail.value
    } else {
      this.data.passwordValue2 = e.detail.value
    }
    if (this.data.passwordValue1 == this.data.passwordValue2) {
      this.setData({
        hasPassWord: true
      })
    } else {
      this.setData({
        hasPassWord: false
      })
    }
  },
  // 完成密码修改
  changePassWordSumbit() {
    if (this.data.hasPassWord) {

      
      // if (this.data.passwordValue1.length < 6) {
      //   util.errorTips('密码长度不符');
      //   return false
      // }
     
        let user_name = wx.getStorageSync('user_name');
        api.restpwd({
          method: 'POST',
          data: {
            user_name,
            password: this.data.passwordValue1,
            code: this.data.code
          }
        }).then((res) => {
          if (res.code == 200) {
            console.log(res);
            util.passWordSuccessTips('修改成功');
            // 清理缓存
            try {
              wx.clearStorageSync()
            } catch (e) {
              // Do something when catch error
            }
            wx.login({
              success: function (res) {
                //console.log(res);
                if (res.code) {
                  //发起网络请求
                  let data = {
                    code: res.code,
                    from: 3
                  }
                  api.getOpenId({
                    data
                  }).then((res) => {
                    wx.setStorageSync('open_id', res.data.openid);
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../login/login?chengePassWord=1',
                      })
                    }, 1000)
                  })
                }
              }
            });


          } else {
            util.errorTips(res.msg)
          }
        }).catch((res) => {
          util.errorTips(res.msg)
        })
      

    }
  }
})