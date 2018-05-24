// pages/task/task.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    taskDates:'',  // 任务中心所有数据
    fetchs:'',     // 找料任务列表
    finds:'',      // 取料任务
  },
  //初始话任务中心数据
  init () {
    api.getTaskInit({},'0').then((res)=>{
      if (res.code==200){
        this.setData({
          taskDates: res.data,
          fetchs: res.data.fetch,
          finds: res.data.find
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 初始化数据
      this.init();
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
  // 去支付页面
  goTaskPay () {
    wx.navigateTo({
      url: '../taskPay/taskPay'
    })
  }
})