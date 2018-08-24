// pages/changePassword/changePassword.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeNum:90, // 验证码60秒
    codeText:'获取验证码', // 验证码text
    isGetCode:false, // 判断是否获取验证码
    hasGetCodeNum:1,   // 1 获取验证码  2 重新发送60秒 3 重新发送
    maxlength:100,
    hasUserName:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.getStorageUserName = wx.getStorageSync('user_name');
    
    if (options.forgetPayPassWord) {
      wx.setStorageSync('forgetPayPassWord', options.forgetPayPassWord)
      this.setData({
        forgetPayPassWord: options.forgetPayPassWord,
        maxlength: 6
      })
      wx.setNavigationBarTitle({
        title: '修改支付密码'
      })
    }else{
      wx.removeStorageSync('forgetPayPassWord');
    }
    
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
   * 用户修改密码提交
   */
  userNameSubmit(){
    if (this.data.hasUserName){
      wx.navigateTo({
        url: '../changePassword1/changePassword1?user_name=' + this.data.user_name,
      })
    }
  },
  // 获取账户
  getUserName(e){
    let _this = this;
    console.log(e.detail.value );
    let user_name = e.detail.value;
    this.setData({
      user_name
    })
    console.log(this.data.getStorageUserName);
    console.log(this.data.user_name)
    if (user_name.length==11){
      if (this.data.getStorageUserName != this.data.user_name){
        util.successTips('请输入自己的账号');
      }
    }
    if (this.data.getStorageUserName == this.data.user_name){
        _this.setData({
          hasUserName: true
        })
    }else{
      _this.setData({
        hasUserName: false
      })
    }
    // let data = {
    //   user_name
    // }
    // api.memberExit({
    //   data
    // }).then((res)=>{
    //   if(res.code!=201){
    //     _this.setData({
    //       hasUserName: false
    //     })
    //   }
    // }).catch((res)=>{
    //   if(res.code==201){
    //     if (_this.data.user_name){
    //       _this.setData({
    //         hasUserName: true
    //       })
    //     }else{
    //       _this.setData({
    //         hasUserName: false
    //       })
    //     }
    //   }
    // })
  },
  /**
   * 获取验证码
   */
  getVerificationCode(){ 
    api.restSMS({
      method: 'POST',
      data: {
        phone: this.data.user_name
      }
    }).then((res) => {
      console.log(res);
      if(res.code==200){
        util.successTips('验证码发送成功');
        if (!this.data.isGetCode) {
          console.log(1);
          this.setData({
            isGetCode: true,
            codeText: '重新获取',
          })
          let timer = setInterval(() => {
            if (this.data.codeNum > 0) {
              this.setData({
                codeNum: this.data.codeNum - 1
              })
            } else {
              clearInterval(timer);
              this.setData({
                isGetCode: false,
                codeNum: 90
              })
            }
          }, 1000)

        }
      }else{
        util.errorTips('短信发送失败');
      }
    }).catch((res)=>{
      util.errorTips(res.msg);
    }) 
  },
  // 验证码输入
  getCode(e){
    this.data.code = e.detail.value;
    if(this.data.code){
      this.setData({
        hasCode:true
      })
    }else{
      this.setData({
        hasCode: false
      })
    }
  },
  // 去下一步修改密码
  codeNext(){
    if (this.data.hasCode){
      this.setData({
        isView: 3
      })
    }
  },
  // 获取新密码 
  getNewPassword(e){
   let index = e.currentTarget.dataset.index;
   if(index == 1){
     this.data.passwordValue1 = e.detail.value
   }else{
     this.data.passwordValue2 = e.detail.value
   }
   if (this.data.passwordValue1 == this.data.passwordValue2){
     this.setData({
       hasPassWord:true
     })
   }else{
     this.setData({
       hasPassWord: false
     })
   }
  },
  // 完成密码修改
  changePassWordSumbit(){
    if (this.data.hasPassWord){
      if (this.data.passwordValue1.length < 6) {
        util.errorTips('密码长度不符');
        return false
      }
      if (this.data.forgetPayPassWord){
        api.restPayPwd({
          method: 'POST',
          data: {
            phone: this.data.user_name,
            pay_pwd: this.data.passwordValue1,
            code: this.data.code
          }
        }).then((res) => {
          if (res.code == 200) {
            console.log(res);
            util.passWordSuccessTips('修改成功');
            setTimeout(() => {
              if (this.data.forgetPayPassWord==1){
                wx.navigateBack({
                  delta: 1
                })
              }else{
                wx.navigateBack({
                  delta: 2
                })
              }
              
            }, 1000)

          } else {
            util.errorTips(res.msg)
          }
        }).catch((res) => {
          util.errorTips(res.msg)
        })
      }else{
        api.restpwd({
          method: 'POST',
          data: {
            user_name: this.data.user_name,
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
  }
})