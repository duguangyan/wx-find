// pages/giftCertificate/giftCertificate.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    lists:[],
    hasDate:true
  },
  goFind(e){
    let msg = e.currentTarget.dataset.msg;
    if (msg == '已使用'){
      util.errorTips('已使用')
    }
    if (msg == '已失效') {
      util.errorTips('已失效')
    }
    if (msg =='去使用'){
      if (!this.data.from){
        // util.errorTips('可以使用');
        wx.switchTab({
          url: '../index/index',
        })
        return false;
      }
      let list = e.currentTarget.dataset.list;
      if (Math.ceil(list.value) > this.data.totalPrice) {
        util.errorTips('支付金额小于优惠券金额');
        return false;
      }
      if (Math.ceil(list.full_sub) > this.data.totalPrice) {
        util.errorTips('满￥' + list.full_sub+'使用');
        return false;
      }
      // 更新上一页的地址数据  来自找料任务页面
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];   //当前页面
      let prevPage = pages[pages.length - 2];   //上一个页面
      prevPage.setData({
        couponList: list,
        couponListPrice: list.value,
        couponId:list.id
      })
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    }
    
  },
  goGet(e){
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '../material/material?giftCertificateId=' + id,
    })
  },
  /**
   * 获取代金券列表
   */
  getCoupon(){
    api.coupon({}).then((res)=>{
      if (res.code == 200 || res.code == 0){
        //this.data.totalPages = res.data.total;
        //this.data.lists = this.data.lists.concat(res.data.data);
        this.data.lists = res.data;
        this.data.lists.forEach((o,i)=>{
          this.data.lists[i].msg = '去使用'
          // if (o.is_used == 2){
          //   if (o.is_valid){
          //     this.data.lists[i].msg = '去使用'
          //   }else{
          //     this.data.lists[i].msg = '已失效'
          //   }
          // }else{
          //   this.data.lists[i].msg = '已使用'
          // }
        })
        
        this.setData({
          lists:this.data.lists
        })
        if (this.data.lists.length <=0){
          this.setData({
            hasDate:false
          })
        }
      }else{
        util.errorTips(res.msg);
      }
    })
  },
  upper: function (e) {
    console.log('上拉')
    console.log( this.data.page);
    this.data.page = this.data.page + 1;
    if (this.data.lists.length < this.data.totalPages) {
      this.getCoupon(undefined, undefined, this.data.page);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.from == 'giftCertificate'){
      this.data.from = options.from;
      this.data.totalPrice = options.totalPrice;
    }
    this.getCoupon();
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
    this.upper();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})