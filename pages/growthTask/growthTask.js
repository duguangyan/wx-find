// pages/growthTask/growthTask.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[
        // { img: '../../public/images/growth-task/1.png', title: '签到', content: '+2成长值' },
        // { img: '../../public/images/growth-task/2.png', title: '发布订单评论', content: '+5成长值' },
        // { img: '../../public/images/growth-task/3.png', title: '发布取送消息', content: '+5成长值' },
        // { img: '../../public/images/growth-task/4.png', title: '发布找料消息', content: '+10成长值' },
        // { img: '../../public/images/growth-task/5.png', title: '用户注册', content: '+50成长值' },
        // { img: '../../public/images/growth-task/6.png', title: '完善个人信息', content: '+100成长值' },
        // { img: '../../public/images/growth-task/7.png', title: '邀请新用户', content: '+100成长值' },
        // { img: '../../public/images/growth-task/8.png', title: '充值回馈', content: '成长值视金额而定' }
      ],
    grade:'',
    rule:'',
    isCommentModel:true,
    nodes:'<div>测试</div>'
  },
  checkGrade(){
    this.setData({
      isCommentModel: false
    })
  },
  commentConfirm(){
    this.setData({
      isCommentModel:true
    })
  },
  goGrowth(e) {
     let id = e.target.dataset.id;
     console.log(id);
    //  if(id == 1){
    //    wx.switchTab({
    //      url: '../center/center',
    //    })
    //  }else if(){

    //  }

    switch (id) {
      case 1:
        wx.navigateBack({
          delta: 1
        })
        
        break;
      case 2:
        wx.setStorageSync('method', 1);
        wx.setStorageSync('status', 6);
        wx.switchTab({
          url: '../order/order',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        }) 
        break;
      case 3:
        wx.navigateTo({
          url: '../material/material',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../find/find',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '../personInformation/personInformation',
        })
        break;
      case 7:
        wx.navigateTo({
          url: '../newUserRegister/newUserRegister',
        })
        break;
      case 8:
        wx.navigateTo({
          url: '../recharge/recharge',
        })
        break;
      default:
        // util.errorTips('此功能暂未开放');
    }
  },
  goNewUserRegister(){
    wx.navigateTo({
      url: '../newUserRegister/newUserRegister',
    })
  },
  getGrowth(){
    api.getGrowth({}).then((res)=>{
        console.log(res);
        if(res.code==200){
          let lists = res.data.task;
          let grade = res.data.member_grade;
          let rule = res.data.level_rule;
          this.setData({
            lists,
            grade,
            rule
          })
        }else{
          util.errorTips(res.msg)
        }
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
    this.getGrowth();
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