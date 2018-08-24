// pages/taskPay/taskPay.js
let app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payDates:{}, // 支付数据
    taskPayList: '', //  找料取料
    isDisabled:false,
    isOldPayPasswordModel: false, // 旧支付密码弹窗
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
  },

  // 去地址选择页面
  goConsigneeAddress(e) { 
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?taskPayIndex=' +index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let payMethed = options.payMethed;

    wx.setStorageSync('method', payMethed);
    wx.setStorageSync('status', 0);
    // 获取默认地址
    this.getSelectedAddress();
  },
  // 收货地址
  getSelectedAddress() {
    let _this = this;
    // if (wx.getStorageSync('defaultAddress')){
    //   let defaultAddress = wx.getStorageSync('defaultAddress');
    //   let findsAddress = defaultAddress;
    //   let fetchsAddress = defaultAddress;
    //   _this.setData({
    //     findsAddress,
    //     fetchsAddress
    //   })
    //   return false;
    // }
    // 获取默认地址
    api.defaultAddress({
    }, 1).then((res) => {
      if (res.code == 200) {
        let defaultAddress = res.data;
        wx.setStorageSync('defaultAddress', res.data)
        // 可能位空数组
        if (Array.isArray(defaultAddress)) {
          _this.setData({
            findsAddress:false,
            fetchsAddress:false
          })
        } else {
          // findsAddress fetchsAddress
          // 获取默认地址
          let findsAddress = defaultAddress;
          let fetchsAddress = defaultAddress;
          _this.setData({
            findsAddress,
            fetchsAddress
          })
        }
      }
    }).catch((res) => {

    }) 
  },

  // 支付
  doPay() { 
    this.setData({
      isDisabled:true
    })
    let _this = this;
    this.data.payDates.task_ids = this.data.task_ids;
    
    if (this.data.finds.length>0){
      if (!this.data.findsAddress){
        wx.showToast({
          title: '请添加找料地址',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isDisabled: false
        })
        return false;
      }
    }
    if (this.data.fetchs.length > 0) {
      if (!this.data.fetchsAddress) {
        wx.showToast({
          title: '请添加取料地址',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isDisabled: false
        })
        return false;
      }
    }
    if (this.data.findsAddress || this.data.fetchsAddress){
      if (this.data.findsAddress) {
        this.data.payDates.shipping_address_find = this.data.findsAddress.id
      }
      if (this.data.fetchsAddress) {
        this.data.payDates.shipping_address_fetch = this.data.fetchsAddress.id
      }
    }else{
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        isDisabled: false
      })
      return false;
    }
    api.checkPayType({
      method: 'POST',
      data: {
        total_amount : this.data.findsTotalPrice + this.data.fetchsTotalPrice
      }
    }).then((res)=>{
      
      if(res.code==200){
        if (res.data.pay_type == 3){
          let is_set_pay_pass = res.data.is_set_pay_pass;
          if (res.data.is_set_pay_pass){
            _this.setData({
              isOldPayPasswordModel: true
            })
          }else{
            wx.showModal({
              title: '请先去设置支付密码',
              showCancel: false,
              content: '',
              confirmText: '好的',
              success: function (res) {
                if (res.confirm) {
                  wx.setStorageSync('hasPayPwd', !is_set_pay_pass);
                  wx.navigateTo({
                    url: '../changePayPassword/changePayPassword',
                  })
                }
              }
            })
            
            
            this.setData({
              isDisabled: false
            })
          }
          
        } else if (res.data.pay_type==2){ 

          api.payment({
            method:'POST',
            data: this.data.payDates
          }).then((res) => { 

            if (res.code == 200) { 
              let payInfo = res.data;
              payInfo.open_id = wx.getStorageSync('open_id'); 
              api.wxPay({
                method:'POST',
                data: payInfo
              }).then((res) => {
                  console.log(res); 
                  if(res.code==200){  
                    let data = res.data.sdk;
                    let pay_log = JSON.stringify(res.data.pay_log);
                    data.success = function (res){
                      console.log('支付成功');
                      console.log(res);
                      wx.redirectTo({
                        url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
                      })
                    }
                    data.fail = function(res){ 
                      console.log('支付失败');
                      console.log(res);
                      wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 2000
                      })
                      if (_this.data.finds.length > 0 && _this.data.fetchs.length > 0){
                        wx.setStorageSync('method', 1);   // 1  2 
                        wx.setStorageSync('status', 4);   // 4
                        wx.switchTab({
                          url: '../order/order'
                        })

                      }
                      if (_this.data.finds.length > 0) {
                        wx.setStorageSync('method', 1);   // 1  2 
                        wx.setStorageSync('status', 4);   // 4
                        wx.switchTab({
                          url: '../order/order'
                        })

                      }
                      if (_this.data.fetchs.length > 0) {
                        wx.setStorageSync('method', 2);   // 1  2 
                        wx.setStorageSync('status', 4);   // 4
                        wx.switchTab({
                          url: '../order/order'
                        })
                      }
                    }
                    wx.requestPayment(data);
                  }
              })
            }else{
              wx.showToast({
                title: res.msg || '支付失败',
                icon: 'none',
                duration: 2000
              })
            }
            console.log(res);
            }).catch((e)=>{
              wx.showToast({
                title: e.msg,
                icon: 'none',
                duration: 2000
              })
            })
        }
       
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((res)=>{
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      })
    })

  
    // api.payment({
    //   method:'POST',
    //   data: this.data.payDates
    // }).then((res) => { 
      
    //   if (res.code == 200) { 
    //     if (res.code==200&&res.data.pay_status ==1){ // 正常状态

    //       // wx.switchTab({
    //       //   url: '../order/order',
    //       //   success: function (e) {
    //       //     var page = getCurrentPages().pop();
    //       //     if (page == undefined || page == null) return;
    //       //     page.onLoad();
    //       //   }
    //       // }) 
    //       let pay_log = JSON.stringify(res.data.pay_log);
   
    //       wx.redirectTo({
    //         url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
    //       })
    //       return false;
    //     } else if (res.code == 200 && res.data.pay_status == 2){ // 缺少设置支付密码
          
    //       wx.navigateTo({
    //         url: '../changePayPassword/changePayPassword',
    //       })
    //       this.setData({
    //         isDisabled: false
    //       })

    //       return false;
    //     } else if (res.code == 200 && res.data.pay_status == 3){ // 未输入支付密码
    //       _this.setData({
    //         isOldPayPasswordModel:true,
    //         totalOrderId: res.data.order_id
    //       })
    //       return false;
    //     } else if (res.code == 200 && res.data.pay_status == 4){ // 支付密码错误
    //       wx.showToast({
    //         title: '支付密码错误',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       _this.setData({
    //         Value:'',
    //         focusValue:''
    //       })
    //       return false;
    //     }

    //     let payInfo = res.data;
    //     payInfo.open_id = wx.getStorageSync('open_id'); 
    //     api.wxPay({
    //       method:'POST',
    //       data: payInfo
    //     }).then((res) => {
    //         console.log(res); 
    //         if(res.code==200){  
    //           let data = res.data.sdk;
    //           let pay_log = JSON.stringify(res.data.pay_log);
    //           data.success = function (res){
    //             console.log('支付成功');
    //             console.log(res);
    //             wx.redirectTo({
    //               url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
    //             })
    //           }
    //           data.fail = function(res){ 
    //             console.log('支付失败');
    //             console.log(res);
    //             wx.showToast({
    //               title: '支付失败',
    //               icon: 'none',
    //               duration: 2000
    //             })
    //             if (_this.data.finds.length > 0 && _this.data.fetchs.length > 0){
    //               wx.setStorageSync('method', 1);   // 1  2 
    //               wx.setStorageSync('status', 4);   // 4
    //               wx.switchTab({
    //                 url: '../order/order'
    //               })
                 
    //             }
    //             if (_this.data.finds.length > 0) {
    //               wx.setStorageSync('method', 1);   // 1  2 
    //               wx.setStorageSync('status', 4);   // 4
    //               wx.switchTab({
    //                 url: '../order/order'
    //               })
                 
    //             }
    //             if (_this.data.fetchs.length > 0) {
    //               wx.setStorageSync('method', 2);   // 1  2 
    //               wx.setStorageSync('status', 4);   // 4
    //               wx.switchTab({
    //                 url: '../order/order'
    //               })
                 
    //             }

    //           }
    //           wx.requestPayment(data);
    //         }
    //     })
    //   }else{
    //     wx.showToast({
    //       title: res.msg || '支付失败',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    //   console.log(res);
    //   }).catch((e)=>{
    //     wx.showToast({
    //       title: e.msg,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   })

   
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
    
    // 获取用户信息 余额
    this.getUserInfo();
    // 获取Storage找料取料数据
    let taskPayList = wx.getStorageSync('taskPayList');
    let { finds, fetchs, task_ids } = taskPayList;
    // 计算合计金额
    let findsTotalPrice = 0;
    let fetchsTotalPrice = 0;
    finds.forEach((v) => {
      findsTotalPrice += JSON.parse(v.form_data.fee);
    })
    fetchs.forEach((v) => {
      fetchsTotalPrice += JSON.parse(v.form_data.fee);
    })
    this.setData({
      taskPayList,
      finds,
      fetchs,
      task_ids,
      findsTotalPrice,
      fetchsTotalPrice
    })
    console.log('获取Storage数据');
    console.log(this.data.finds);
    console.log(this.data.fetchs);
    
  },
  // 获取用户信息
  getUserInfo(){
    api.memberInfo({}).then((res)=>{
      console.log(res);
      if(res.code==200){
        this.data.balance_amount = res.data.asset.balance_amount;
        this.setData({
          balance_amount: this.data.balance_amount
        })
      }
    })
  },
  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
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
  
  },

  Focus(e) {
    let _this = this;
    console.log(e.detail.value);
    let inputValue = e.detail.value;
    _this.setData({
      Value: inputValue,
    })
    if (inputValue.length == 6) {
      let data = {
        pay_pwd: inputValue
      }
      api.verifyPassword({
        method:'POST',
        data
      }).then((res)=>{
        this.data.payDates.pay_pwd = inputValue;
        this.data.payDates.only_order = false;
        if(res.code==200){
          api.payment({
            method:'POST',
            data: this.data.payDates
          }).then((res) => {  
            let pay_log = JSON.stringify(res.data.pay_log);
            wx.redirectTo({
              url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
            })
          })
        }else{
          util.errorTips(res.msg);
          _this.setData({
            Value: '',
            focusValue: '',
          })
        }
      }).catch((res)=>{
        util.errorTips(res.msg);
        _this.setData({
          Value: '',
          focusValue: '',
        })
      })
      
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
    let _this = this;
    wx.showModal({
      title: '你确定放弃支付吗？',
      content: '',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          this.data.payDates.pay_pwd = null;
          this.data.payDates.only_order = true;
          api.payment({
            method: 'POST',
            data: this.data.payDates
          }).then((res) => {
            _this.setData({
              Value: '',
              focusValue: '',
              isDisabled: false,
            })
            let pay_log = JSON.stringify(res.data.pay_log);
            wx.switchTab({
              url: '../order/order',
            })
          })
          
          return false;
        } else if (res.cancel) {
          _this.setData({
            isOldPayPasswordModel: true,
            Value: '',
            focusValue: '',
            isDisabled: false,
          })
        }
      }
    })
    
  },
  forgetPayPassWord() {
    if (this.data.payDates) {
      this.data.payDates.pay_pwd = null
    }
    this.setData({
      isOldPayPasswordModel: false,
      Value: '',
      isDisabled:false
    })
    wx.setStorageSync('hasPayPwd',false);
    wx.navigateTo({
      url: '../changePassword/changePassword?forgetPayPassWord=1',
    })
  },

})