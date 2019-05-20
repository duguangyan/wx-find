// pages/newUserRegister/newUserRegister.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRuleModel:true
  },
  /**
   * 获取规则
   * 
   */
  getRule(){
    api.invite({}).then((res)=>{
      let rule = res.data.rule;
      let desc = res.data.desc;
      this.setData({
        rule,
        desc
      })
    })
  },
  showRuleModel(){
    this.data.isRuleModel = !this.data.isRuleModel;
    this.setData({
      isRuleModel: this.data.isRuleModel
    })
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
    this.getRule();
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
    let nick_name = wx.getStorageSync('nick_name') || wx.getStorageSync('user_name');
    return {
      title: nick_name +':邀请您注册',
      path: '/pages/register/register?invite_code=' + wx.getStorageSync('invite_code'),
      success: function (res) {
        // 转发成功
        util.errorTips('分享成功');
      },
      fail: function (res) {
        // 转发失败
        util.errorTips('分享失败');
      }
    }
  }
})