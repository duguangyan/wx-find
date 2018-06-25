// pages/setting/setting.js
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
    this.setData({
      isOldPayPasswordModel:false
    })
    wx.navigateTo({
      url: '../changePassword/changePassword',
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
      title: '请确认是否登录',
      content: '',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.removeStorageSync('token');
          wx.navigateTo({
            url: '../login/login',
          })
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
    this.setData({
      isOldPayPasswordModel:true
    })
    // wx.navigateTo({
    //   url: '../changePayPassword/changePayPassword',
    // })
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
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
})