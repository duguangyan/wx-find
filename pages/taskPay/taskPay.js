// pages/taskPay/taskPay.js
let app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskPayList: '', //  找料取料
  },

  // 去地址选择页面
  goConsigneeAddress(e) {
    
    let index = e.currentTarget.dataset.index;
    if(index == 1){
      app.globalData.isFromScope = false;
    }else{
      app.globalData.isFromScope = true;
    }
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?taskPayIndex=' +index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取Storage找料取料数据
    let taskPayList = wx.getStorageSync('taskPayList');
    let { finds, fetchs, task_ids } = taskPayList; 
    // 计算合计金额
    let findsTotalPrice = 0;
    let fetchsTotalPrice = 0;
    finds.forEach((v)=>{
      findsTotalPrice += JSON.parse(v.form_data.fee); 
    })
    fetchs.forEach((v) => {
      fetchsTotalPrice += JSON.parse(v.form_data.fee);
    })
    this.setData({
      taskPayList,
      finds,
      fetchs,
      task_ids,
      findsTotalPrice,
      fetchsTotalPrice
    })
    console.log('获取Storage数据');
    console.log(this.data.finds);
    console.log(this.data.fetchs);
    // 获取默认地址
    // this.getSelectedAddress();
  },
  // 收货地址
  getSelectedAddress() {
    // 获取默认地址
    let defaultAddress = wx.getStorageSync('defaultAddress');
    if (defaultAddress){
      this.setData({
        defaultAddress,
        findsAddress: defaultAddress,
        fetchsAddress: defaultAddress
      })
      return false;
    }
    api.defaultAddress({
    }).then((res) => { 
      let defaultAddress = res.data;
      if(res.code ==200){
        let defaultAddress = res.data;
        this.setData({
          defaultAddress,
          findsAddress: defaultAddress,
          fetchsAddress:defaultAddress
        })
      }
      console.log('获取默认地址');
      console.log(this.data.defaultAddress)
    }).catch((res) => {

    })
  },

  // 支付
  doPay () { 
    let payDates = {};
    payDates.task_ids = this.data.task_ids;
    
    if (this.data.findsAddress || this.data.fetchsAddress){
      if (this.data.findsAddress) {
        payDates.shipping_address_find = this.data.findsAddress.id
      }
      if (this.data.fetchsAddress) {
        payDates.shipping_address_fetch = this.data.fetchsAddress.id
      }
    }else{
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 2000
      })
    }
    
    api.payment({
      method:'POST',
      data: payDates
    }).then((res)=>{
      if (res.code == 200) {
        let payInfo = res.data;
        payInfo.open_id = wx.getStorageSync('open_id'); 
        api.wxPay({
          method:'POST',
          data: payInfo
        }).then((res) => {
            console.log(res); 
            if(res.code==200){  
              let data = res.data.sdk;
              let pay_log = JSON.stringify(res.data.pay_log);
              data.success = function (res){
                console.log('支付成功');
                console.log(res);
                wx.navigateTo({
                  url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
                })
              }
              data.fail = function(res){
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
      console.log(res);
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
  
  },
})