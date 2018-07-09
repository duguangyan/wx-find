// pages/taskPaySuccess/taskPaySuccess.js

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 返回首页
   */
  goIndex () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 去订单详情
  goFindOrderDetail () {
    // wx.navigateTo({
    //   url: '../order/order?id=' + this.data.pay_log.order_id
    // })
    wx.switchTab({
      url: '../order/order',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pay_log = JSON.parse(options.pay_log);

    this.data.time = util.getNowFormatDate();
    this.setData({
      time: this.data.time,
      pay_log
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
  
  }
})