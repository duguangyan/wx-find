// pages/family/family.js
const api  = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: false,
    isFamily:false,
    nodes:'',
    goBack:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
    if (options.familyStatus == 1){
      this.setData({
        isFamily: true,
        isCheck: true
      })
      if (options.goBack == 1){
        this.data.goBack  =  1
      }
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
    this.getInviteCode();
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
   * 是否同意
   */
  doCheck(){
    this.setData({
      isCheck: !this.data.isCheck
    })
    // util.successTips('正在开发中...');
  },
  /**
   * 注册或分享
   */
  register(){
    // console.log('注册');
    if (this.data.isFamily){
      if (this.data.goBack == 1){
        wx.navigateBack({
          delta: 1  
        })
      }else{
        wx.navigateTo({
          url: '../familyCenter/familyCenter',
        })
      }
     
    }else{
      if (this.data.isCheck) {
        wx.navigateTo({
          url: '../family/family',
        })
      } else {
        util.successTips('请阅读同意说明');
      }
    }
    
  },
  /**
  * 获取用户小路人家信息
  */
  getInviteCode() {
    api.getInviteCode({}).then((res) => {
      if(res.code == 200 || res.code == 0){
        this.setData({
          nodes: res.data.text
        })
      }
    })
  },
})