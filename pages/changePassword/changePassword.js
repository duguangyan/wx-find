// pages/changePassword/changePassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeNum:10, // 验证码60秒
    codeText:'获取验证码', // 验证码text
    isGetCode:false, // 判断是否获取验证码
    hasGetCodeNum:1,   // 1 获取验证码  2 重新发送60秒 3 重新发送
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
   * 用户修改密码提交
   */
  usernameSubmit(){

  },
  /**
   * 获取验证码
   */
  getVerificationCode(){ 
    if (!this.data.isGetCode){
      console.log(1);
      this.setData({
        isGetCode: true,
        codeText: '重新获取',
      })
      let timer = setInterval(()=>{
        if (this.data.codeNum>0){
          this.setData({
            codeNum: this.data.codeNum - 1
          })
        }else{
          clearInterval(timer);
          this.setData({
            isGetCode: false,
            codeNum:10
          })
        }        
      },1000)
      
    }
    
  }
})