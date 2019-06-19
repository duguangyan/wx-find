// pages/familyCenter/familyCenter.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar_path:'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png',
    topData:[
      { t: '累计客户', n: '0' },
      { t: '累计订单', n: '0' },
      { t: '累计收益(元)',n:'0'},
    ],
    profit: 2583868686.96
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
    this.getInviteCode();
    this.setData({
      avatar_path: wx.getStorageSync('avatar_path')
    })
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
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var onShareAppMessage = {
      title: "众皮联小鹿快找",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index?invite_code=' + this.data.familyInfo.code,
      // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: 'https://static.yidap.com/miniapp/o2o/imgs/ic_launcher.png',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: (res) => {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: () => {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: () => {
        // 转发结束之后的回调（转发成不成功都会执行）
      }

    }
    return onShareAppMessage;
  },
  /**
   * 拨打电话
   */
  call(){
    wx.makePhoneCall({
      phoneNumber: '400-8088-156'
    })
  },
  /**
   * 去 0：推广客户 1：推广订单
   */
  goNextPage(e){
    let index = e.currentTarget.dataset.index;
    if(index == 0){
      wx.navigateTo({
        url: '../listCustomer/listCustomer',
      })
    }else if(index == 1){
      wx.navigateTo({
        url: '../listOrder/listOrder',
      })
    }
  },
  /**
   * 去规则说明
   */
  goFamilyExplain(){
    wx.navigateTo({
      url: '../familyExplain/familyExplain?goBack=1&familyStatus=' + this.data.familyInfo.status
    })
  },
  /**
    * 获取小鹿家人状态
    */
  getInviteCode() {
    api.getInviteCode({}).then((res) => {
      if (res.code == 200 || res.code == 0) {
        let topData = this.data.topData;
        topData[0].n = res.data.total || 0;
        topData[1].n = res.data.total_order || 0;
        topData[2].n = res.data.total_amount || 0;
        
        this.setData({
          familyInfo:res.data,
          profit: res.data.now_amount,
          topData
        })
      }
    })
  }
})