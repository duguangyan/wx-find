const api = require('../../utils/api.js');
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
      findNum:1,
      selcetTabNum:1,
      isPopup:false,
    },
    // 提交
    doSubmit () {  
      this.setData({
        isPopup: false
      })
      console.log('添加几页');
      console.log(this.data.findNum);
      wx.navigateTo({
        url: '../find/find?findNum=' + this.data.findNum + '&selcetTabNum=' + this.data.selcetTabNum,
      })
    },
    // 弹窗件数input失去焦点
    findNumBlur (e) {
      console.log(e.detail.value);
      let v = e.detail.value;
      let re = /^[1-9]+[0-9]*]*$/;
      console.log(re.test(v));
  
      if (!re.test(v)){
        this.setData({
          findNum: 1
        })
      }
    },
    // input 改变1-10
    findNumChange (e) {
      let n = e.detail.value;
      if(n<1 && n!=''){
        wx.showToast({
          title: '最少1个找料任务',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          findNum: 1
        })
        return false;
      }
      if (n > 10) {
        this.setData({
          findNum: 10
        })
        wx.showToast({
          title: '最多10个找料任务',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.setData({
        findNum: e.detail.value
      })
    },
    // 减法
    sub () {
      if (this.data.findNum<=1){
        wx.showToast({
          title: '最少1个找料单',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.data.findNum--;
      this.setData({
        findNum: this.data.findNum
      })
    },
    // 加法
    plu () {
      if (this.data.findNum >= 10) {
        wx.showToast({
          title: '最多10个找料单',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.data.findNum++;
      this.setData({
        findNum: this.data.findNum
      })
    },

    // 找料方式切换
    selcetTab (e){
      let id = e.currentTarget.dataset.id;
      this.setData({
        selcetTabNum: id
      })
    },
    //  联系我们电话
    contact() {
        wx.makePhoneCall({
            phoneNumber: '400-8088-156'
        })
    },
    // 点击背景关闭找料数量弹窗
    closePopup() {
      this.setData({
        isPopup: false
      })
    },
    // 去找料
    goFind() {
      let token = wx.getStorageSync('token'); 
      if (!token){
        // 跳转关联页面
        wx.navigateTo({
          url: '../login/login',
        })
        return false;
      }
      // this.setData({
      //   isPopup: true
      // })

      wx.navigateTo({
        url: '../find/find?findNum=' + 1 + '&selcetTabNum=' + 1,
      })
    },
    // 立刻取料  
    goMaterial() {
      let token = wx.getStorageSync('token');
      if (!token) {
        // 跳转关联页面
        wx.navigateTo({
          url: '../login/login',
        })
        return false;
      }
      // 跳转关联页面
      wx.navigateTo({
        url: '../material/material',
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
      this.setData({
        findNum:this.data.findNum
      })
      //设置服务人数
      api.serviceNum({}).then(res => {
        let serviceData = res.data;
        this.setData({
          serviceData
        })
      });
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
        // wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      //console.log(1);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})