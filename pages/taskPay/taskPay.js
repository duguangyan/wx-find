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
    couponListPrice: 0, // 优惠券金额
    couponId:'',
    payTypeList:[
      { icon: '../../public/images/icon/wx.png', title: '微信支付' },
      { icon: '../../public/images/icon/money.png', title: '鹿币' },
      { icon: '../../public/images/icon/icon-balance.png', title: '余额' },
    ],
    payTypeCheckIndex:0
  },
  payTypeCheck(e){
    this.setData({
      payTypeCheckIndex: e.currentTarget.dataset.index
    })
  },
  // 去地址选择页面
  goConsigneeAddress(e) { 
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?taskPayIndex=' +index,
    })
  },
  // 获取余额
  getUserAsset(){
    api.getUserAsset({}).then((res)=>{
      this.setData({
        balance_amount: res.data.balance,
        virtual_amount: res.data.virtual
      })
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
    // 获取公司地址
    this.getCompanyaddress();
    
    this.setData({
      userType: wx.getStorageSync("userType")
    })
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
    }).then((res) => {
      if (res.code == 200 || res.code == 0) {
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
  doPay(){
    // 信息判断
    this.setData({
      isDisabled: true
    })
    let _this = this;
    this.data.payDates.task_ids = this.data.task_ids;
    
    // 获取优惠券信息
    if (this.data.couponList) {
      
      this.data.couponListPrice = Math.ceil(this.data.couponList.value);
    } else {
      this.data.couponListPrice = 0;
    }
    // if (this.data.finds.length > 0) {
    //   if (!this.data.findsAddress) {
    //     wx.showToast({
    //       title: '请添加找料地址',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     this.setData({
    //       isDisabled: false
    //     })
    //     return false;
    //   }
    // }
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
    if (this.data.fetchsAddress) {
      // if (this.data.findsAddress) {
      //   this.data.payDates.shipping_address_find = this.data.findsAddress.id
      // }
      this.data.payDates.shipping_address_fetch = this.data.fetchsAddress.id
      
    } else {
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

    // 支付方式 0：微信 1：余额 2：鹿币
    if (this.data.payTypeCheckIndex == 0){
      console.log("微信支付");
      api.wxPayByOrder({
        method:'POST',
        data:{
          "type": "miniapp",
          'open_id': wx.getStorageSync('open_id'),
          "task_id": this.data.task_ids,
          "coupon_id": this.data.couponId,
          "address_id": this.data.fetchsAddress.id, // this.data.findsAddress.id
        }
      }).then((res)=>{
        util.errorTips(res);
        if (res.code == 200 || res.code == 0) {
              let data = res.data.data;
              let pay = res.data.pay;
              // let pay = {};
              //     pay.updated_at = util.getCurrentTime();
              //     pay.pay_amount = this.data.findsTotalPrice + this.data.fetchsTotalPrice - this.data.couponListPrice;

              // console.log('pay_log:->>>' + JSON.stringify(pay) );
              data.success = function (res) {
                console.log('支付成功');
                console.log(res);
                wx.redirectTo({
                  url: '../taskPaySuccess/taskPaySuccess?pay_log=' + JSON.stringify(pay) 
                })
              }
              data.fail = function (res) {
                console.log('支付失败');
                console.log(res);
                _this.setData({
                  isDisabled: false
                })
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
                // if (_this.data.finds.length > 0 && _this.data.fetchs.length > 0) {
                //   wx.setStorageSync('method', 1);   // 1  2 
                //   wx.setStorageSync('status', 4);   // 4
                //   wx.switchTab({
                //     url: '../order/order'
                //   })

                // }
                // if (_this.data.finds.length > 0) {
                //   wx.setStorageSync('method', 1);   // 1  2 
                //   wx.setStorageSync('status', 4);   // 4
                //   wx.switchTab({
                //     url: '../order/order'
                //   })

                // }
                // if (_this.data.fetchs.length > 0) {
                //   wx.setStorageSync('method', 2);   // 1  2 
                //   wx.setStorageSync('status', 4);   // 4
                //   wx.switchTab({
                //     url: '../order/order'
                //   })
                // }
              }
              wx.requestPayment(data);
            
          } else {
            wx.showToast({
              title: res.msg || '支付失败',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              isDisabled: false
            })
          }
          console.log(res);
        }).catch((e) => {
          wx.showToast({
            title: e.msg,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            isDisabled: false
          })
        })

    }else{
      console.log("余额支付");
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '确认支付吗?',
        success: function (res) {

          
          if (res.confirm) {
            let data = '';
            if (_this.data.payTypeCheckIndex == 2) {
              data = {
                "type": "miniapp",
                "asset_type": "balance",
                'open_id': wx.getStorageSync('open_id'),
                "task_id": _this.data.task_ids,
                "coupon_id": _this.data.couponId,
                "address_id": _this.data.fetchsAddress.id, // this.data.findsAddress.id
              }
            } else if (_this.data.payTypeCheckIndex == 1){
              data = {
                "type": "miniapp",
                "asset_type": "virtual",
                'open_id': wx.getStorageSync('open_id'),
                "task_id": _this.data.task_ids,
                "coupon_id": _this.data.couponId,
                "address_id": _this.data.fetchsAddress.id, // this.data.findsAddress.id
              }
            }
            
            api.payAsset({
              method: 'POST',
              data
            }).then((res) => {
              if (res.code == 200 || res.code == 0) {
                let pay = JSON.stringify(res.data.pay);
                wx.redirectTo({
                  url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay
                })
              } else {
                util.errorTips(res.msg);
                this.setData({
                  isDisabled: false
                })
              }
            }).catch((res)=>{
              util.errorTips(res.msg);
              _this.setData({
                isDisabled: false
              })
            })
          } else if (res.cancel) {
            util.errorTips("你点击了取消")
            _this.setData({
              isDisabled: false
            })
          }
        }
      })
      
    }
  },
  // 支付 废弃
  doPayByIndex() { 
    this.setData({
      isDisabled:true
    })
    let _this = this;
    this.data.payDates.task_ids = this.data.task_ids;
    // 获取优惠券信息
    if (this.data.couponList){
      this.data.couponListPrice = Math.ceil(this.data.couponList.coupon_data.value);
    }else{
      this.data.couponListPrice = 0;
    }
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
        total_amount: this.data.findsTotalPrice + this.data.fetchsTotalPrice - this.data.couponListPrice
      }
    }).then((res)=>{ 
      
      if (res.code == 200 || res.code == 0){
        if (res.data.pay_type == 3 || res.data.pay_type == 5){
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
          if (this.data.couponList){
            this.data.payDates.coupon_id = this.data.couponList.id;
          }
          api.payment({
            method:'POST',
            data: this.data.payDates
          }).then((res) => { 

            if (res.code == 200 || res.code == 0) { 
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
        } else if (res.data.pay_type == 4){
          this.data.payDates.coupon_id = this.data.couponList.id;
          api.payment({
            method: 'POST',
            data: this.data.payDates
          }).then((res) => {
            let pay_log = JSON.stringify(res.data.pay_log);
            wx.redirectTo({
              url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
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
    // this.getUserInfo();
    // 获取余额
    this.getUserAsset();
    // 获取Storage找料取料数据
    let taskPayList = wx.getStorageSync('taskPayList');
    let { finds, fetchs, task_ids } = taskPayList;
    // 计算合计金额
    let findsTotalPrice = 0;
    let fetchsTotalPrice = 0;
    finds.forEach((v) => {
      findsTotalPrice += parseFloat(v.fee);
    })
    fetchs.forEach((v) => {
      fetchsTotalPrice += parseFloat(v.fee);
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
          if (this.data.couponList) {
            this.data.payDates.coupon_id = this.data.couponList.id;
          }
          api.payment({
            method:'POST',
            data: this.data.payDates
          }).then((res) => { 
            if(res.code==200){
              let pay_log = JSON.stringify(res.data.pay_log);
              wx.redirectTo({
                url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
              })
            }else{ 
              util.errorTips(res.msg);
              _this.setData({
                Value: '',
                focusValue: '',
              })
            }
            
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
          if (this.data.couponList) {
            this.data.payDates.coupon_id = this.data.couponList.id;
          }
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
  // 去优惠券列表
  goCoupon(){
    let totalPrice = this.data.findsTotalPrice + this.data.fetchsTotalPrice;
    wx.navigateTo({
      url: '../giftCertificate/giftCertificate?from=giftCertificate&totalPrice='+totalPrice,
    })
  }

})