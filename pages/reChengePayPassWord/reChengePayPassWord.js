// pages/changePayPassword/changePayPassword.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.inputValue) this.data.reInputValue = options.inputValue;
    if (options.code) {
      this.data.code = options.code;
    }else{
      this.data.code = '';
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
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;

    that.setData({
      Value: inputValue,
    })
    if (inputValue.length == 6) {  
      if (this.data.reInputValue == inputValue){  
        let hasPayPwd = wx.getStorageSync('hasPayPwd');
        if (!hasPayPwd){

          let data = {
            pay_pwd: inputValue,
            code:this.data.code,
            phone: wx.getStorageSync('user_name')
          }
          api.resetpaypwd({
            method: 'POST',
            data
          }).then((res)=>{
              if(res.code==200){
                util.passWordSuccessTips('设置成功');
                setTimeout(() => {
                  if (wx.getStorageSync('forgetPayPassWord')==1){
                    wx.navigateBack({
                      delta: 4
                    })
                  }else{
                    wx.navigateBack({
                      delta: 4
                    })
                  }
                  
                }, 1000)
              }else{
                util.errorTips(res.msg);
                that.setData({
                  focusValue: '',
                  Value: ''
                })
              }
            }).catch((res) => {
              util.errorTips(res.msg);
              that.setData({
                focusValue: '',
                Value: ''
              })
            })

        }else{
          let data = {
            pay_pwd: inputValue
          }
          api.setPayPwd({
            method: 'POST',
            data
          }).then((res) => {
            if (res.code == 200) {
              util.passWordSuccessTips('设置成功');
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            } else {
              util.errorTips(res.msg);
              that.setData({
                focusValue: '',
                Value: ''
              })
            }
          }).catch((res) => {
            util.errorTips(res.msg);
            that.setData({
              focusValue: '',
              Value: ''
            })
          })
        }
        

      }else{
        util.successTips('两次输入的密码不一致');
        that.setData({
          focusValue: '',
          Value: ''
        })
      }
    }
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
    // util.successTips('设置成功');
    // wx.navigateBack({
    //   delta: 2
    // })
  },
})