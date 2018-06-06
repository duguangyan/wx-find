// pages/order/order.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUrgeOrder:false, // 催单弹窗
    isData:false, // 没有订单数据
    shopLoading:true,
    modalShow:true,
    orderNavNum:1, // nav一级切换
    orderChildNavNum: 0, //  nav二级切换
    isDelModel:true, // 取消订单模态框
    delMsg:'', // 取消订单原因数据
    isCommentModel:true, // 评价模态框 
    commentMsg:'', // 评价内容
    starArr: [0, 1, 2, 3, 4], // 评价星星
    starIndex_1:0, // 星星评价选中
    starIndex_2:0, // 星星评价选中
    findList:'', // 找料列表数据
    fecthList:'', // 取料列表数据
    totalPages:0, // 总页数
    current_page:1 // 当前页 
  },
  // 去下单
  doOrder(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  upper: function (e) {
    console.log('上拉')
    console.log(typeof this.data.current_page);
    this.data.current_page = this.data.current_page+1;
    if (this.data.findList.length < this.data.totalPages) {
      this.getList(this.data.orderNavNum, this.data.orderChildNavNum, this.data.current_page); 
    }
  },
 
  lower: function (e) {
    console.log('下拉')
    

  },
  scroll: function (e) {
    console.log(e)
  },
  // nav 一级切换
  checkNav (e) {
    this.setData({
      scrollTop: 0
    })
    let index = e.currentTarget.dataset.index;
    this.setData({
      orderNavNum: index,
      orderChildNavNum:0,
      current_page: 1
    })
    this.getList(this.data.orderNavNum, this.data.orderChildNavNum);
  },
  // nav 二级切换
  checkChildNav(e) {
    this.setData({
      scrollTop: 0
    })
    let index = e.currentTarget.dataset.index;
    this.setData({
      orderChildNavNum: index,
      current_page: 1
    })
    this.getList(this.data.orderNavNum, this.data.orderChildNavNum);
  },
  // 取消订单
  delOrder (e) {
    let id = e.target.dataset.id; 
    this.setData({
      delId:id
    })
    
    wx.showModal({
      title:'确认取消此订单？',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          console.log('取消订单');
          this.setData({
            isDelModel:false
          }) 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 隐藏模态框
  delCancel () {
    this.setData({
      isDelModel: true
    })
  },
  // 隐藏取消订单模态框
  delConfirm () { 
    console.log(this.data.delMsg)
    let data = {
      remark: this.data.delMsg
    }
    api.delOrder({
      method:'POST',
      data
    }, this.data.delId).then((res) => {
      console.log(res);
      if(res.code==200){
        for(let i=0;i<this.data.findList.length;i++){
          if (this.data.findList[i].id == this.data.delId){
            this.data.findList[i].button_status.on_cancel = 0;
            this.data.findList[i].button_status.on_pay = 0;
          }
        }
        this.setData({
          isDelModel: true,
          findList: this.data.findList
        })
        wx.showToast({
          title: '删除成功',  //标题  
          icon: 'success',  //图标，支持"success"、"loading"  
        }) 
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: res.msg || res.message,
        icon: 'none',
        duration: 2000
      })
    })
    
  },
  // 获取取消订单原因数据
  delModelInput (e) {
    this.setData({
      delMsg: e.detail.value
    })
  },
  // 去支付
  toPay (e) {
    let _this = this;
    console.log('去支付');
      let order_id = e.target.dataset.id;
      api.repay({
        method:'POST'
      }, order_id).then((res)=>{
         if (res.code==200 && res.data.pay_status ==1){
           wx.showToast({
             title: '支付成功',
             icon: 'none',
             duration: 2000,
           })
           setTimeout(()=>{
             _this.getList(_this.data.orderNavNum, _this.data.orderChildNavNum);
           },2000)
           
        }else{
           let order_type = 4;
           let payInfo = {
             order_id,
             order_type,
             open_id: wx.getStorageSync('open_id')
           };
           api.wxPay({
             method: 'POST',
             data: payInfo
           }).then((res) => {
             console.log(res);
             if (res.code == 200) {
               let data = res.data.sdk;
               let pay_log = JSON.stringify(res.data.pay_log);
               data.success = function (res) {
                 console.log('支付成功');
                 console.log(res);
                 wx.navigateTo({
                   url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
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
  call(e){ 
    let mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile +"", //号码
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    }) 
  },
  closeUrgeOrderPopup(){
    this.setData({
      isUrgeOrder: false
    })
  },
  urgeOrder (e) {
    let id = e.currentTarget.dataset.id;
    
    console.log('催单');
    api.urgeOrder({
      method:'Post'
    }, id).then((res)=>{
      console.log(res);
      if(res.code==200){
        // wx.showModal({
        //   title: "催单成功！",
        //   content: "请联系找料员(<text>" + mobile +"</text>)或在线客服（400-8088-156），咨询进度",
        //   showCancel: false,
        //   confirmText: "确定"
        // })
        this.setData({
          urgeOrderMobile: res.data.phone,
          isUrgeOrder:true
        })
      }else{
        wx.showToast({
          title: '催单失败！',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
    
  },
  // 确认收货
  affirmOrder (e) {
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let _this = this;
    api.affirmOrder({
      method:'POST'
    },id).then((res)=>{
      console.log(res);
      if(res.code==200){
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
  // 去找料详情
  goFindDetail (e) {
    console.log('去详情页');
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    console.log(index);
    let item = JSON.stringify(this.data.findList[index]);
    console.log(item);
    wx.navigateTo({
      url: '../findOrderDetail/findOrderDetail?id=' + id + '&nav=' + this.data.orderNavNum
    })
  },
  // 去找料详情
  goFetchDetail() {
    console.log('去详情页');
    wx.navigateTo({
      url: '../fetchOrderDetail/fetchOrderDetail'
    })
  },
  // 去评价
  toComment (e) {
    let commentId = e.target.dataset.id;
    console.log('去评价');
    this.setData({
      isCommentModel: false,
      commentId
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
  commentConfirm (e) { 

    let data  = {
      star:this.data.starIndex_1+1,
      star_ship: this.data.starIndex_2 + 1,
      content: this.data.commentMsg
    }
    api.toCommentOrder({
      method:'POST',
      data
    }, this.data.commentId).then((res)=>{ 
          console.log(res);
          if(res.code==200){
            wx.showToast({
              title: '评价成功！',
              icon: 'none',
              duration: 2000
            })
            this.data.findList.forEach((v,i)=>{
              if (v.id == this.data.commentId){
                this.data.findList.splice(i,1);
              }
            })
            if (this.data.findList.length<=0){
              this.data.isData = true;
            }
            this.setData({
              findList: this.data.findList,
              isData: this.data.isData
            })

            this.setData({
              isCommentModel: true
            })

          }else{
            wx.showToast({
              title: '评价失败！',
              icon: 'none',
              duration: 2000
            })
          }
    }).catch((res)=>{
      wx.showToast({
        title: res.msg || res.message,
        icon: 'none',
        duration: 2000
      })
    })
    
  },
  // 设置找料满意度
  satisfact (e) {
    this.setData({
      starIndex_1: e.target.dataset.idx
    })
    console.log(this.data.starIndex_1);
  },
  // 配送及时性
  timely (e) {
    this.setData({
      starIndex_2: e.target.dataset.idx
    })
    console.log(this.data.starIndex_2);
  },

  // 获取订单列表
  getList(index,status,page){  
    wx.showLoading({
      title: '加载中',
    }) 
    api.orderList({}, index, status, page).then((res)=>{
      if(res.code==200){
        if(page){
          this.data.findList = this.data.findList.concat(res.data);
        }else{
          this.data.findList = res.data;
        }
        if (this.data.findList.length<=0){
          this.setData({
            isData:true
          })
        }else{
          this.setData({
            isData: false
          })
        }
        this.data.totalPages = res.total;
        for (let i = 0; i < this.data.findList.length;i++){
          // 1按图找,2按样找3按描述
          if (this.data.findList[i].type == 1){
            this.data.findList[i].type_name = '按图找料'; 
          } else if (this.data.findList[i].type == 2){
            this.data.findList[i].type_name = '按样找料';
          } else if (this.data.findList[i].type == 3){
            this.data.findList[i].type_name = '按描述找料';
          }
          // 找料状态 1 待接单 2找料中 3 无法找到 4已找到料 
        }
        
        // 判断是否加载更多
        if (this.data.findList.length >= this.data.totalPages){
          this.data.shopLoading = false;
        }else{
          this.data.shopLoading = true;
        }
        this.setData({
          findList: this.data.findList,
          totalPages: this.data.totalPages,
          shopLoading: this.data.shopLoading
        })

      }else{
        this.setData({
          isData: true
        })
      }
      wx.hideLoading();
      console.log(res.data);
    }).catch((res)=>{
      wx.hideLoading();
      wx.showToast({
        title: '请求次数过于频繁',  //标题  
        icon: 'none',  //图标，支持"success"、"loading"  
      }) 
      
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从个人中心过来
    let method = wx.getStorageSync('method');
    if (method){
      let status = wx.getStorageSync('status');
      this.setData({
        method,
        orderNavNum: method,
        orderChildNavNum: status
      })
    }
    try {
      wx.removeStorageSync('method');
      wx.removeStorageSync('status');
    } catch (e) {
      // Do something when catch error
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
    // 初始化获取找料列表
    this.getList(this.data.orderNavNum, this.data.orderChildNavNum);
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
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
    console.log('触底');
    this.upper();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //图片点击事件
  imgYu:function(event) {
         var src = event.currentTarget.dataset.src;//获取data-src
         //图片预览
        wx.previewImage({
             current: src, // 当前显示图片的http链接
             urls: [src] // 需要预览的图片http链接列表
      })
  }
})