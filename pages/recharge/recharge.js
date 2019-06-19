// pages/recharge/recharge.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:'',
    navIndex:0,
    index:1,
    navArrText: ['充值VIP',"包月VIP"],
    navArrCheck:[
      { img: '', name: '微信支付' },
      { img: '', name: '支付宝' }
    ]
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
  doInput(e){
    let price = e.detail.value;
    this.setData({
      price
    })
  },
  // 去支付
  doPay (e) { 
    if (!util.verificationAmount(this.data.price)) {
      util.errorTips("请输入正确的金额");
      return false;
    }
    console.log(this.data.price);
    let value = this.data.price;
    let payInfo = {
      open_id : wx.getStorageSync('open_id'),
      pay_type:'wx',
      type:'miniapp',
      total_fee: this.data.price,
      package_id:0
    };
    if(this.data.index == 1){
      api.wxPay({
        method: 'POST',
        data: payInfo
      }).then((res) => {
        console.log(res);
        if (res.code == 200 || res.code == 0) {
          let data = res.data;
          data.success = function (res) {
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
    }else{
      api.apiVirtual({
        method: 'POST',
        data: payInfo
      }).then((res) => {
        console.log(res);
        if (res.code == 200 || res.code == 0) {
          let data = res.data;
          data.success = function (res) {
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
    }
    
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
    this.setData({
      index: options.index
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