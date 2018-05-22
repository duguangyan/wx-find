// pages/taskPay/taskPay.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取默认地址
    this.getSelectedAddress(() => {
      console.log('--------');
      console.log(options.findNum);
      console.log(this.data.defaultAddress);
      // 获取上一级页面传过来的数据
      this.setData({
        findNum: options.findNum,
        selcetTabNum: options.selcetTabNum
      })
    });
  },
  // 收货地址
  getSelectedAddress() {
    // 获取默认地址
    api.defaultAddress({
    }).then((res) => {
      let defaultAddress = res.data;
      // 可能位空数组
      if (Array.isArray(defaultAddress)) {
        this.setData({
          defaultAddress: false,
          addressId: ''
        })
      } else {
        this.data.addFinds[app.globalData.addressIndex].address = res.data;
        this.setData({
          defaultAddress,
          addressId: defaultAddress.id,
          addFinds: this.data.addFinds
        })
      }
     
    }).catch((res) => {

    })
  },

  // 支付
  doPay () {

    wx.navigateTo({
      url: '../taskPaySuccess/taskPaySuccess'
    })
    // wx.requestPayment({
    //   'timeStamp': '',
    //   'nonceStr': '',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success': function (res) {
    //   },
    //   'fail': function (res) {
    //   }
    // })
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
})