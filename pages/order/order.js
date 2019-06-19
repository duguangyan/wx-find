// pages/order/order.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStarShow:false, // 初始化评价评语
    isUrgeOrder:false, // 催单弹窗
    isData:true, // 没有订单数据
    shopLoading:true,
    modalShow:true,
    orderNavNum:1, // nav一级切换
    orderChildNavNum: 0, //  nav二级切换
    isDelModel:true, // 取消订单模态框
    delMsg:'', // 取消订单原因数据
    isCommentModel:true, // 评价模态框 
    commentMsg:'', // 评价内容
    starArr: [0, 1, 2, 3, 4], // 评价星星
    starIndex_1:4, // 星星评价选中
    starIndex_2:4, // 星星评价选中
    findList:'', // 找料列表数据
    fecthList:'', // 取料列表数据
    totalPages:0, // 总页数
    current_page:1, // 当前页 
    isDisabled:false,

    payDates:{},
    isOldPayPasswordModel: false, // 旧支付密码弹窗
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
    companyaddress:''
  },
  // 获取公司地址
  getCompanyaddress() {
    api.getCompanyaddress({}).then((res) => {
      if (res.code == 200 || res.code == 0) {
        console.log('公司地址');
        console.log(res.data.address);
        let companyaddress = res.data;
        this.setData({
          companyaddress
        })
      }
    })
  },
  // 退款
  toReturn(e){ 
    let data = {
      id: e.target.dataset.id
    }
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          api.refuse({
            method: 'POST',
            data
          }).then((res) => {
            if (res.code = 200) {
              for (let i = 0; i < _this.data.findList.length; i++) {
                if (_this.data.findList[i].id == e.target.dataset.id) {
                  _this.data.findList[i].can_refuse = 0;
                }
              }
              _this.setData({
                findList: _this.data.findList
              })
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 1500
              })
            } else {
              wx.showToast({
                title: res.msg,
                duration: 1500
              })
            }
          }).catch((res) => {
            wx.showToast({
              title: res.msg,
              duration: 1500
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

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
      this.getList(this.data.orderNavNum, this.data.orderChildNavNum); 
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
      scrollTop: 0,
      findList:[]
    })
    if (wx.pageScrollTo) {//判断这个方法是否可用
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync('orderNav', index);
    this.setData({
      orderNavNum: index,
      orderChildNavNum:0,
      current_page: 1
    })
    this.getList(this.data.orderNavNum,0);
  },
  // nav 二级切换
  checkChildNav(e) {
    this.setData({
      scrollTop: 0,
      findList:[]
    })
    if (wx.pageScrollTo) {//判断这个方法是否可用
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
          title: '取消成功',  //标题  
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
  doPay (e) { 
      let _this = this;
      console.log('去支付');
      this.data.order_id = e.currentTarget.dataset.id;
      this.data.order_index = e.currentTarget.dataset.index;
      this.data.findList[this.data.order_index].isDisabled = true;
      this.setData({
        findList: this.data.findList
      })
      let data;
      if (this.data.pay_pwd){ 
         data = {
          pay_pwd: this.data.pay_pwd
        }
      }else{ 
         data = '';
      } 
      api.repay({
        method:'POST',
        data
      }, this.data.order_id).then((res)=>{ 
         if (res.code==200 && res.data.pay_status ==1){
           this.setData({
             isOldPayPasswordModel:false
           })
           let pay_log = JSON.stringify(res.data.pay_log);
           wx.showToast({
             title: '支付成功',
             icon: 'none',
             duration: 1500,
           })
           setTimeout(()=>{
          
             wx.setStorageSync('method', _this.data.orderNavNum);
             wx.setStorageSync('status', 0);
             this.setData({
               Value: '',
               focusValue: ''
             })
             wx.navigateTo({
               url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
             })
           },1000)
           return false;
        } else if (res.code == 200 && res.data.pay_status == 2) { // 缺少设置支付密码
           wx.showModal({
             title: '请先去设置支付密码',
             showCancel: false,
             content: '',
             confirmText: '好的',
             success: function (res) {
               if (res.confirm) {
                 wx.setStorageSync('hasPayPwd',true);
                 wx.navigateTo({
                   url: '../changePayPassword/changePayPassword',
                 })
               }
             }
           })
          this.setData({
            isDisabled: false
          })

          return false;
        } else if (res.code == 200 && res.data.pay_status == 3) { // 未输入支付密码
          this.setData({
            isOldPayPasswordModel: true
          })
          return false;
        } else if (res.code == 200 && res.data.pay_status == 4) { // 支付密码错误
          wx.showToast({
            title: '支付密码错误',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            Value:'',
            focusValue:'',
            sOldPayPasswordModel: true
          })
          
          return false;
        }

           let order_type = 4;
           let payInfo = {
             order_id: _this.data.order_id,
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
                 wx.setStorageSync('method', _this.data.orderNavNum);
                 wx.setStorageSync('status', 0);
                 wx.navigateTo({
                   url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
                 })
               }
               data.fail = function (res) {
                 _this.data.findList[_this.data.order_index].isDisabled = false;
                 _this.setData({
                   findList: _this.data.findList
                 })
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
        
      })

    this.data.pay_pwd = '';
      
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
    if (this.data.isUrgeOrderRes){
      this.setData({
        isUrgeOrder: true,
      })
      return false;
    }
    let id = e.currentTarget.dataset.id;
    
    console.log('催单');
    api.urgeOrder({
      method:'POST',
      data:{id}
    }).then((res)=>{
      console.log(res);
      if (res.code == 200 || res.code == 0){
        // wx.showModal({
        //   title: "催单成功！",
        //   content: "请联系找料员(<text>" + mobile +"</text>)或在线客服（400-8088-156），咨询进度",
        //   showCancel: false,
        //   confirmText: "确定"
        // })
        this.setData({
          urgeOrderMobile: res.data.phone,
          isUrgeOrder:true,
          isUrgeOrderRes : true
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
    


    wx.showModal({
      title: '提示',
      content: '确认收货吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          api.affirmOrder({
            method: 'POST',
            data:{id}
          }).then((res) => {
            console.log(res);
            if (res.code == 200 || res.code == 0) {
              _this.data.findList[index].can_confirm = 0;
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

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
      url: '../findOrderDetail/findOrderDetail?id=' + id + '&nav=' + this.data.orderNavNum + '&status=' + this.data.orderChildNavNum
    })
  },
  // 去找料详情
  goFetchDetail() {
    console.log('去详情页');
    wx.navigateTo({
      url: '../fetchOrderDetail/fetchOrderDetail'
    })
  },
  // 删除订单
  toDel(e){
    let data = {
      id: e.target.dataset.id
    }
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          api.orderDel({
            method: 'POST',
            data
          }).then((res) => {
            if (res.code = 200) {
              for (let i = 0; i < _this.data.findList.length; i++) {
                if (_this.data.findList[i].id == e.target.dataset.id) {
                  _this.data.findList.splice(i, 1);
                }
              }
              _this.setData({
                findList: _this.data.findList
              })

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '网络慢,请稍后再试',
                duration: 1500
              })
            }
          }).catch((res) => {
            wx.showToast({
              title: '网络慢,请稍后再试',
              duration: 1500
            })
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    
  }, 
  // 去评价
  toComment (e) {
    let commentId = e.target.dataset.id;
    console.log('去评价');
    this.setData({
      commentMsg: '',
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
      id: this.data.commentId,
      star:this.data.starIndex_1+1,
      star_ship: this.data.starIndex_2 + 1,
      content: this.data.commentMsg
    }
    api.toCommentOrder({
      method:'POST',
      data
    }).then((res)=>{ 
          console.log(res);
      if (res.code == 200 || res.code == 0){
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
              isCommentModel: true,
              isStarShow:false,
              starIndex_1: 4, // 星星评价选中
              starIndex_2: 4, // 星星评价选中
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
    if (this.data.starIndex_1 < 3 || this.data.starIndex_2 < 3){
      this.setData({
        isStarShow:true
      })
    }else{
      this.setData({
        isStarShow: false
      })
    }
    console.log(this.data.starIndex_1);
  },
  // 配送及时性
  timely (e) {
    this.setData({
      starIndex_2: e.target.dataset.idx
    })
    if (this.data.starIndex_1 < 3 || this.data.starIndex_2 < 3) {
      this.setData({
        isStarShow: true
      })
    } else {
      this.setData({
        isStarShow: false
      })
    }
    console.log(this.data.starIndex_2);
  },

  // 获取订单列表
  getList(index, status){  
    wx.showLoading({
      title: '加载中',
    }) 
    api.orderList({
      data:{
        type:index,
        status
      }
    }).then((res)=>{
      if (res.code == 200 || res.code == 0){
        this.data.findList = res.data;
        if (this.data.findList.length<=0){
          this.setData({
            isData:true
          })
        }else{
          this.setData({
            isData: false
          })
        }
        if (res.total){
          this.data.totalPages = res.total;
        }
        
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
          // 图片处理
          if (typeof this.data.findList[i].front_img == 'string'){
            let newFrontImg = [];
            newFrontImg.push(this.data.findList[i].front_img);
            this.data.findList[i].front_img = newFrontImg;
          }
           
        }

        this.data.findList.forEach((v, i) => {
          v.isDisabled = false
        })
        
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
      console.log(this.data.findList);
      console.log('--------------------');
    }).catch((res)=>{
      wx.hideLoading();
      // wx.showToast({
      //   title: res.msg,  //标题  
      //   icon: 'none',  //图标，支持"success"、"loading"  
      // }) 
      
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.orderId){
      console.log('options.orderId');
      //console.log(options.orderId);
      wx.navigateTo({
        url: '../findOrderDetail/findOrderDetail?id=' + options.orderId + '&nav=' + options.nav
      })
    }
    this.setData({
      userType: wx.getStorageSync("userType")
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
    this.getCompanyaddress();
    let method = wx.getStorageSync('method');

    if (method) {
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
    // 初始化获取找料列表
    this.getList(this.data.orderNavNum, this.data.orderChildNavNum);
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");


    // 判断用户类型包月还是充值或普通
    api.memberInfo({}).then((res) => {
      if (res.code == 200) {
        wx.setStorageSync('userType', res.data.asset.type);
        this.setData({
          userType: res.data.asset.type
        })
      }
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
  },
  Focus(e) { 
    let that = this;
    console.log(e.detail.value);
    let inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    if (inputValue.length == 6) {
      this.data.payDates.pay_pwd = inputValue;
      let e = {
        currentTarget:{
          dataset: { id: that.data.order_id, index: that.data.order_index }
        }
      }
      this.data.pay_pwd = inputValue;
      that.doPay(e);
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
    this.setData({
      isOldPayPasswordModel: false
    })
    wx.navigateTo({
      url: '../changePayPassword/changePayPassword',
    })
  },
  // 关闭弹窗
  closeModel() {
    if (this.data.payDates) {
      this.data.payDates.pay_pwd = null
    }
    this.data.findList[this.data.order_index].isDisabled = false;
    this.setData({
      isOldPayPasswordModel: false,
      Value: '',
      findList: this.data.findList
    })
  },
  forgetPayPassWord() {
    if (this.data.payDates) {
      this.data.payDates.pay_pwd = null
    }
    this.setData({
      isOldPayPasswordModel: false,
      Value: '',
      isDisabled: false
    })
    wx.navigateTo({
      url: '../changePassword/changePassword?forgetPayPassWord=1',
    })
  },
  goChat(){
    wx.navigateTo({
      url: '../chatList/chatList',
    })
  }
})