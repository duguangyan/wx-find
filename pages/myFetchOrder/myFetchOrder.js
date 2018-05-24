// pages/myFindOrder/myFindOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNavNum: 1, // nav一级切换
    isDelModel: true, // 取消订单模态框
    delMsg: '', // 取消订单原因数据
    isCommentModel: true, // 评价模态框 
    commentMsg: '', // 评价内容
    starArr: [0, 1, 2, 3, 4], // 评价星星
    starIndex_1: 0, // 星星评价选中
    starIndex_2: 0 // 星星评价选中
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  // nav 一级切换
  checkNav(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      orderNavNum: index
    })
  },
  // 取消订单
  delOrder() {
    wx.showModal({
      title: '确认取消此订单？',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          console.log('取消订单');
          this.setData({
            isDelModel: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 隐藏模态框
  delCancel() {
    this.setData({
      isDelModel: true
    })
  },
  // 隐藏取消订单模态框
  delConfirm() {
    console.log(this.data.delMsg)
    this.setData({
      isDelModel: true
    })
  },
  // 获取取消订单原因数据
  delModelInput(e) {
    this.setData({
      delMsg: e.detail.value
    })
  },
  // 去支付
  toPay() {
    console.log('去支付');
  },
  // 催单
  urgeOrder() {
    console.log('催单');
    wx.showModal({
      title: "催单成功！",
      content: "你页可以直接联系找料员、在线客服或致电（400-8088-156），咨询进度",
      showCancel: false,
      confirmText: "确定"
    })

  },
  // 确认收货
  affirmOrder() {
    console.log('确认收货');
  },
  // 去详情
  goOrderDetail() {
    console.log('去详情页');
    wx.navigateTo({
      url: '../findOrderDetail/findOrderDetail'
    })
  },
  // 去评价
  toComment() {
    console.log('去评价');
    this.setData({
      isCommentModel: false
    })
  },
  // 获取评价内容
  commentModelInput(e) {
    this.setData({
      commentMsg: e.detail.value
    })
  },
  // 取消评价模态框
  commentCancel() {
    this.setData({
      isCommentModel: true
    })
  },
  // 取消评价模态框并获取数据
  commentConfirm() {
    this.setData({
      isCommentModel: true
    })
  },
  // 设置找料满意度
  satisfact(e) {
    this.setData({
      starIndex_1: e.target.dataset.idx
    })
    console.log(this.data.starIndex_1);
  },
  // 配送及时性
  timely(e) {
    this.setData({
      starIndex_2: e.target.dataset.idx
    })
    console.log(this.data.starIndex_2);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.status);

    this.setData({
      orderNavNum: parseInt(options.status) + 1
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

  }
})