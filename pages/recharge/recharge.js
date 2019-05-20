// pages/recharge/recharge.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex:0,
    navArrText: ['充值VIP',"包月VIP"]
  },
  //  联系我们电话
  contact() {
    wx.makePhoneCall({
      phoneNumber: '400-8088-156'
    })
  },
  navCheck(e){
    let inx = e.currentTarget.dataset.inx;
    this.setData({
      navIndex:inx
    })
  },
  // 去支付
  doPay (e) { 
    
    let id = e.currentTarget.dataset.id;
    let value = e.currentTarget.dataset.value;
    let payInfo = {
      order_id: id,
      order_type:3,
      open_id : wx.getStorageSync('open_id')
    };
    
    api.wxPay({
      method: 'POST',
      data: payInfo
    }).then((res) => {
      console.log(res);
      if (res.code == 200) {
        let data = res.data.sdk;
        data.success = function (res) { 
          console.log('支付成功');
          if(this.navIndex == 0){
            wx:wx.setStorageSync("userType", 1);
          } else if (this.navIndex == 1){
            wx: wx.setStorageSync("userType", 2);
          }
          console.log(res);
          wx.navigateTo({
            url: '../rechargeSuccess/rechargeSuccess?value=' + value
          })
        }
        data.fail = function (res) { 
          console.log('支付失败');
          console.log(res);
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000
          })
        }
        wx.requestPayment(data);
      }
    })
  },
  // 获取充值列表
  getRechargeList () {
    api.getRechargeList({}).then((res)=>{
      console.log(res);
      if(res.code == 200){
        let rechargeList = res.data.balance;
        let times = res.data.times;
        this.setData({
          rechargeList,
          times
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 获取充值列表
    this.getRechargeList();
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