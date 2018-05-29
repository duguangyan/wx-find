const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      isDelModel: true, // 取消订单模态框
      delMsg: '', // 取消订单原因数据
      isCommentModel: true, // 评价模态框 
      commentMsg: '', // 评价内容
      starArr: [0, 1, 2, 3, 4], // 评价星星
      starIndex_1: 0, // 星星评价选中
      starIndex_2: 0, // 星星评价选中
    },
// 去评价
  toComment () {
    console.log('去评价');
    this.setData({
      isCommentModel: false
    })
  },
  // 获取评价内容
  commentModelInput (e) {
    this.setData({
      commentMsg: e.detail.value
    })
  },
  // 取消评价模态框
  commentCancel () {
    this.setData({
      isCommentModel: true
    })
  },
  // 取消评价模态框并获取数据
  commentConfirm () {
    this.setData({
      isCommentModel: true
    })
  },
  // 设置找料满意度
  satisfact (e) {
    this.setData({
      starIndex_1: e.target.dataset.idx
    })
    console.log(this.data.starIndex_1);
  },
    // 取消订单
    delOrder(e) {
      let id = e.target.dataset.id;
      this.setData({
        delId: id
      })
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
      let data = {
        remark: this.data.delMsg
      }
      api.delOrder({
        method: 'POST',
        data
      }, this.data.delId).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.setData({
            isDelModel: true
          })
        }
      })

    },
    // 获取取消订单原因数据
    delModelInput(e) {
      this.setData({
        delMsg: e.detail.value
      })
    },
    // 去支付
    toPay(e) {
      console.log('去支付');

      let id = e.target.dataset.id;
      api.orderListToPay({
        method: 'POST'
      }, id).then((res) => {
        console.log(res);
        let id = e.target.dataset.id;
        let order_id = res.data.order_id;
        let order_type = res.data.order_type;
        let payInfo = {
          order_id,
          order_type,
          open_id: wx.getStorageSync('open_id')
        };
        if (res.code == 200) {
          api.wxPay({
            method: 'POST',
            data: payInfo
          }).then((res) => {
            console.log(res);
            if (res.code == 200) {
              let data = res.data.sdk;
              data.success = function (res) {
                console.log('支付成功');
                console.log(res);
                wx.navigateTo({
                  url: '../taskPaySuccess/taskPaySuccess'
                })
              }
              data.fail = function (res) {
                console.log('支付失败');
                console.log(res);
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              }
              wx.requestPayment(data);
            }
          })
        }
      })
    },
    // 催单
    urgeOrder(e) {
      let id = e.target.dataset.id;
      console.log('催单');
      api.urgeOrder({
        method: 'Post'
      }, id).then((res) => {
        console.log(res);
        if (res.code == 200) {
          wx.showModal({
            title: "催单成功！",
            content: "你页可以直接联系找料员、在线客服或致电（400-8088-156），咨询进度",
            showCancel: false,
            confirmText: "确定"
          })
        } else {
          wx.showToast({
            title: '催单失败！',
            icon: 'none',
            duration: 2000
          })
        }
      })


    },
    // 确认收货
    affirmOrder(e) {
      let id = e.target.dataset.id;
      let index = e.target.dataset.index;
      let _this = this;
      api.affirmOrder({
        method: 'POST'
      }, id).then((res) => {
        console.log(res);
        if (res.code == 200) {
          _this.data.findList[index].button_status.on_confirm = 0;
          _this.setData({
            findList: _this.data.findList
          })
          wx.showToast({
            title: '收货成功！',
            icon: 'none',
            duration: 2000
          })
        }
      })
      console.log('确认收货');
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let nav = options.nav,
          itemObj = JSON.parse(options.item)
      this.setData({
        nav,
        itemObj
      })

      console.log(JSON.parse(options.item));


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
    

})