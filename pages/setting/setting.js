// pages/setting/setting.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOldPayPasswordModel: false, // 旧支付密码弹窗
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
    dialogTitle:'绑定小鹿家人',  
    inputValue:'',
    showModel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
      this.setData({
        Value:''
      })
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
   * 修改登录密码
   */
  gotoChangePassword(){
    wx.setStorageSync('passwordIndex', 0);
    this.setData({
      isOldPayPasswordModel:false
    })
    wx.navigateTo({
      url: '../changePassword/changePassword',
    })
  },
  /**
   * 修改支付密码
   */
  forgetPayPassWord(){
    this.setData({
      isOldPayPasswordModel: false,
      Value: ''
    })
    wx.setStorageSync('hasPayPwd',false);
    wx.navigateTo({
      url: '../changePassword/changePassword?forgetPayPassWord=2',
    })
  },
  /**
   * 退出登录
   */
  loginOut(){
    this.setData({
      isOldPayPasswordModel: false
    })
    wx.showModal({
      title: '请确认是否退出登录',
      content: '',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          


          // 清理缓存
          try {
            let open_id = wx.getStorageSync('open_id');
            wx.clearStorageSync();
            wx.setStorageSync('open_id', open_id);
            
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

                wx.reLaunch({
                  url: '../center/center',
                })
                // api.userLogout({}).then((res)=>{
                  
                // })
                
                // api.getOpenId({
                //   data
                // }).then((res) => {
                //   wx.setStorageSync('open_id', res.data.openid);
                //   setTimeout(() => {
                //     wx.navigateTo({
                //       url: '../login/login?chengePassWord=1',
                //     })
                //   }, 1000)
                // })
              }
            }
          });




        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 修改支付密码
   */
  gotoChangePayPassword(){
    wx.setStorageSync('passwordIndex', 1);
    api.doPayPassWord({}).then((res)=>{
      if (res.code == 200 || res.code == 0){
        wx.setStorageSync('hasPayPwd', !res.data.hasPayPwd);
        if (res.data.hasPayPwd){
          this.setData({
            isOldPayPasswordModel: true
          })
        } else{
          wx.navigateTo({
            url: '../changePassword/changePassword',
          })
        }
      }
    }).catch((e)=>{
      wx.navigateTo({
        url: '../changePassword/changePassword',
      })
    })
    
    
  },
  Focus(e) { 
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    if (inputValue.length==6){
      let data = {
        pay_pwd: inputValue
      }
      api.doPayPassWord({
        method: 'POST',
        data
      }).then((res)=>{
        if(res.code==200){
          this.setData({
            isOldPayPasswordModel: false,
            Value: ''
          })
          wx.setStorageSync('hasPayPwd', true);
          wx.navigateTo({
            url: '../changePayPassword/changePayPassword',
          })
        }else{
          util.errorTips(res.msg);
          this.setData({
            focusValue:'',
            Value:''
          })
        }
      }).catch((res)=>{
        util.errorTips(res.msg);
        this.setData({
          focusValue: '',
          Value: ''
        })
      })
     
     
    }
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) { 
    console.log(e.detail.value.password);
    this.setData({
      isOldPayPasswordModel:false
    })
    wx.navigateTo({
      url: '../changePayPassword/changePayPassword',
    })
  }, 
  // 关闭弹窗
  closeModel(){
    this.setData({
      isOldPayPasswordModel: false,
      Value: ''
    })
  },
  // 绑定小鹿家人
  doFamily(){
    let _this = this;
    api.inviteCodeRecommend({}).then((res)=>{
      if(res.code == 0 || res.code == 200){
        if(res.data.status == 0){
          util.errorTips(res.data.msg);
        } else if (res.data.status == 1){
          util.errorTips(res.data.data.mobile +' ：绑定成功！');
        }
        
      } else if (res.code == 1){
        this.indexDialog = this.selectComponent('#indexDialog');
        this.indexDialog.showDialog();
      }
    }).catch((res)=>{
      this.indexDialog = this.selectComponent('#indexDialog');
      this.indexDialog.showDialog();
    })
    
    
  },
  confirmEvent(){
    api.inviteCodeRecommend({
      method:'POST',
      data:{
        mobile: this.data.inputValue
      }
    }).then((res)=>{
      if(res.code==0 || res.code == 200){
        if (res.data.status == 0) {
          util.errorTips(res.data.msg);
        } else if (res.data.status == 1) {
          util.errorTips(res.data.data.mobile + ' ：绑定成功！');
        }
        this.indexDialog.hideDialog();
      }
    })
  },
  getInputValue(e){
    this.data.inputValue = e.detail.value;
  }
})