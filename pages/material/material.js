// pages/material/material.js
const api = require('../../utils/api.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect:false,
    checkTypes: '',
    checkType:'',
    checkTypes_cid:'',
    findNum:1  , // 物料数量
    describeValue:''                  
  },
  // 切换类型
  checkType(e) {
    this.data.isSelect = true;
    this.setData({
      isSelect: this.data.isSelect
    })
    let index = e.currentTarget.dataset.index;
    console.log(index);
    let _this = this;
    let itemList = [];
    for (let i = 0; i < this.data.checkTypes.length;i++){
      itemList.push(this.data.checkTypes[i].name);
    }
    
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        console.log(res);
        _this.data.isSelect = false;
        _this.setData({
          checkType: _this.data.checkTypes[res.tapIndex].name,
          checkTypes_cid: _this.data.checkTypes[res.tapIndex].id,
          isSelect: _this.data.isSelect
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
        _this.data.isSelect = false;
        _this.setData({
          isSelect: _this.data.isSelect
        })
      }
    })
  },
  // 弹窗件数input失去焦点
  findNumBlur(e) {
    let v = e.detail.value;
    if (v) {
      this.setData({
        findNum: 1
      })
    }
  },
  // input 改变1-10
  findNumChange(e) {
    let n = e.detail.value;
    if (n <= 1 && n != '') {
      this.setData({
        findNum: 1
      })
      wx.showToast({
        title: '最少1个找料任务',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (n >= 10) {
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
  sub() {
    if (this.data.findNum <= 1) {
      wx.showToast({
        title: '最少1个取料单',
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
  plu() {
    if (this.data.findNum >= 10) {
      wx.showToast({
        title: '最多10个取料单',
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
  // 获取物料类型数据
  getCheckTypes() {
    api.getCheckTypes({}).then((res) => { 
      console.log(res);
      if (res.code == 200) {
        this.setData({
          checkTypes: res.data,
          checkTypes_cid:res.data[0].id,
          checkType: res.data[0].name
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 获取物料类型
    this.getCheckTypes();
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