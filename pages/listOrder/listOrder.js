// pages/listOrder/listOrder.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    noDataText:'正在加载中...'
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
    this.getInviteCodeOrder();
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
      this.data.page++;
      this.getInviteCodeOrder();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取推广订单
   */
  getInviteCodeOrder(){
    api.inviteCodeOrder({
      data:{
        page:this.data.page
      }
    }).then((res)=>{
      if(res.code == 200 || res.code == 0){
        if(res.data.length>0){
          let list = this.data.list.concat(res.data);
          this.setData({
            list
          })
        }else{
          this.setData({
            noDataText:'没有更多信息了'
          })
        }
        
      }
    })
  }
})