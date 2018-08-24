// pages/changePassword1/changePassword1.js
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
    let user_name = options.user_name;
    this.setData({
      user_name
    })
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
    // 获取验证码
    //this.getVerificationCode();
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
  /**
  * 获取验证码
  */
  getVerificationCode() {
    api.restSMS({
      method: 'POST',
      data: {
        phone: this.data.user_name
      }
    }).then((res) => {
      console.log(res);
      if (res.code == 200) {
        util.successTips('验证码发送成功');
        if (!this.data.isGetCode) {
          console.log(1);
          this.setData({
            isGetCode: true,
            codeText: '重新获取',
          })
          this.data.timer = setInterval(() => {
            if (this.data.codeNum > 0) {
              this.setData({
                codeNum: this.data.codeNum - 1
              })
            } else {
              clearInterval(this.data.timer);
              this.setData({
                isGetCode: false,
                codeNum: 90
              })
            }
          }, 1000)

        }
      } else {
        util.errorTips('短信发送失败');
      }
    }).catch((res) => {
      util.errorTips(res.msg);
    })
  },
  // 验证码输入
  getCode(e) {
    this.data.code = e.detail.value;
    if (this.data.code) {
      this.setData({
        hasCode: true
      })
    } else {
      this.setData({
        hasCode: false
      })
    }
  },
  // 去下一步修改密码
  codeNext() {
    let data = {
      phone: wx.getStorageSync('user_name'),
      code:this.data.code
    }
    api.smschk({
      method:'POST',
      data
    }).then((res)=>{
      if(res.code==200){
        if (wx.getStorageSync('forgetPayPassWord')){
          wx.navigateTo({
            url: '../changePayPassword/changePayPassword?code=' + this.data.code,
          })
        }else{
          wx.navigateTo({
            url: '../changePassword2/changePassword2?code=' + this.data.code,
          })
        }
        
      }else{
        util.errorTips(res.msg);
      }
    }).catch((res)=>{
      util.errorTips(res.msg);
    })
    
  },
})