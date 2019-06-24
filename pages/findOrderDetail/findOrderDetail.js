const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const IMapi = require('../../utils/IMapi.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      status:1,
      nav:1,
      orderNav:1,
      isDelModel: true, // 取消订单模态框
      delMsg: '', // 取消订单原因数据
      isCommentModel: true, // 评价模态框 
      commentMsg: '', // 评价内容
      starArr: [0, 1, 2, 3, 4], // 评价星星
      starIndex_1: 4, // 星星评价选中
      starIndex_2: 4, // 星星评价选中
      isDisabled:false,
      payDates: {},
      isOldPayPasswordModel: false, // 旧支付密码弹窗
      Length: 6,        //输入框个数  
      isFocus: true,    //聚焦  
      Value: "",        //输入的内容  
      ispassword: true, //是否密文显示 true为密文， false为明文。
    },
  // 退款
  toReturn(e) {
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
              _this.data.itemObj.can_refuse= 0;
              _this.setData({
                itemObj: _this.data.itemObj
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.itemObj.desc_img || this.data.itemObj.front_img// 需要预览的图片http链接列表
    })
  },
// 去评价
  toComment (e) {
    console.log('去评价');
    let id = e.target.dataset.id;
    this.setData({
      commentMsg:'',
      orderId: id
    })
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
  // 提交获取数据
  commentConfirm(e) {
    
    let data = {
      star: this.data.starIndex_1 + 1,
      star_ship: this.data.starIndex_2 + 1,
      content: this.data.commentMsg
    }
    
    data.id = this.data.orderId;
    api.toCommentOrder({
      method: 'POST',
      data
    }, this.data.commentId).then((res) => {
      console.log(res);
      if (res.code == 200 || res.code == 0) {
        wx.showToast({
          title: '评价成功！',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isCommentModel: true,
          isStarShow: false,
          starIndex_1: 4, // 星星评价选中
          starIndex_2: 4, // 星星评价选中
        })
        console.log('commentMsg-->', this.data.commentMsg);
        this.getData();
        
      } else {
        wx.showToast({
          title: '评价失败！',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((res) => {
      wx.showToast({
        title: res.msg || res.message,
        icon: 'none',
        duration: 2000
      })
    })

  },
  // 设置找料满意度
  satisfact(e) {
    this.setData({
      starIndex_1: e.target.dataset.idx
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
    console.log(this.data.starIndex_1);
  },
  // 配送及时性
  timely(e) {
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
    // 取消订单
    delOrder(e) {
      let _this = this;
      let id = e.target.dataset.id;
      this.setData({
        delId: id
      })
      wx.showModal({
        title: '提示',
        content:"确认删除此订单？",
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            console.log('取消订单');
            api.orderDelete({
              method: 'POST',
              data:{
                id: _this.data.delId
              }
            }).then((res) => {
              console.log(res);
              if (res.code == 200 || res.code == 0) {
                wx.showToast({
                  title: '删除成功',  //标题  
                  icon: 'success',  //图标，支持"success"、"loading"  
                  success: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, //接口调用成功的回调函数  
                })

              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
            util.errorTips("你点击了取消");
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
      api.orderPrompt({
        method: 'POST',
        data
      }, this.data.delId).then((res) => {
        console.log(res);
        if (res.code == 200 || res.code == 0) {
          this.setData({
            isDelModel: true
          })
          wx.showToast({
            title: '删除成功',  //标题  
            icon: 'success',  //图标，支持"success"、"loading"  
            success: function () {
              wx.navigateBack({
                delta: 1
              })
             }, //接口调用成功的回调函数  
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
    doPay(e) { 
      let _this = this;
      console.log('去支付');
      this.data.order_id = e.currentTarget.dataset.id;
      let data;
      if (this.data.pay_pwd) {
        data = {
          pay_pwd: this.data.pay_pwd
        }
      } else {
        data = '';
      }
      api.repay({
        method: 'POST',
        data
      }, this.data.order_id).then((res) => {
        if (res.code == 200 && res.data.pay_status == 1) {
          this.setData({
            isOldPayPasswordModel: false
          })
          let pay_log = JSON.stringify(res.data.pay_log);
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 1500,
          })
          setTimeout(() => {
            wx.setStorageSync('method', _this.data.nav);
            wx.setStorageSync('status', 0);
            wx.navigateTo({
              url: '../taskPaySuccess/taskPaySuccess?pay_log=' + pay_log
            })
          }, 1500)
          return false;
        } else if (res.code == 200 && res.data.pay_status == 2) { // 缺少设置支付密码
          wx.showModal({
            title: '请先去设置支付密码',
            showCancel: false,
            content: '',
            confirmText: '好的',
            success: function (res) {
              if (res.confirm) {
                wx.setStorageSync('hasPayPwd', true);
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
            focusValue:'',
            Value:''
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
          if (res.code == 200 || res.code == 0) {
            let data = res.data.sdk;
            let pay_log = JSON.stringify(res.data.pay_log);
            data.success = function (res) {
              console.log('支付成功');
              console.log(res);
              wx.setStorageSync('method', _this.data.nav);
              wx.setStorageSync('status', 0);
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

      })

      this.data.pay_pwd = '';

    },
    // 催单
    call(e) {
      let mobile = e.currentTarget.dataset.mobile;
      wx.makePhoneCall({
        phoneNumber: mobile + "", //号码
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    closeUrgeOrderPopup() {
      this.setData({
        isUrgeOrder: false
      })
    },
    goChat(e){
      IMapi.getUserInfoformSocket({
        method: 'POST',
        data: {
          'userId': e.currentTarget.dataset.id
        }
      }).then(res => {
        if (res.code == 0) {
          let id = e.currentTarget.dataset.id;
          let fromUserPhoto = res.data.avatar_path;
          let userName = res.data.nick_name || res.data.user_name;
          wx.navigateTo({
            url: '../chat1/chat?id=' + id + '&fmUserName=' + userName + '&fromUserPhoto=' + fromUserPhoto,
          })
        }
      })
    },
    urgeOrder(e) {
      let id = e.currentTarget.dataset.id;

      console.log('催单');
      api.orderPrompt({
        method: 'POST',
        data:{
          id
        }
      }).then((res) => {
        console.log(res);
        if (res.code == 200 || res.code == 0) {
          // wx.showModal({
          //   title: "催单成功！",
          //   content: "请联系找料员(<text>" + mobile +"</text>)或在线客服（400-8088-156），咨询进度",
          //   showCancel: false,
          //   confirmText: "确定"
          // })
          this.setData({
            urgeOrderMobile: res.data.phone,
            isUrgeOrder: true
          })
        } else {
          wx.showToast({
            title: '催单失败！',
            icon: 'none',
            duration: 2000
          })
        }
        }).catch((res)=>{
          util.errorTips(res.msg);
        })


    },
    // 确认收货
    affirmOrder(e) {
      let id = e.target.dataset.id;
      let index = e.target.dataset.index;
      let _this = this;

      wx.showModal({
        title: '提示',
        content: '确认收货吗?',
        success: function (res) {
          if (res.confirm) {
            api.affirmOrder({
              method: 'POST',
              data: {
                id
              }
            }).then((res) => {
              console.log(res);
              if (res.code == 200 || res.code == 0) {
                _this.data.itemObj.can_confirm = 0;
                _this.setData({
                  itemObj: _this.data.itemObj
                })
                wx.showToast({
                  title: '收货成功！',
                  icon: 'none',
                  duration: 2000,
                  success(){
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
                
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else if (res.cancel) {
            util.errorTips("你点击了取消")
          }
        }
      })

      console.log('确认收货');
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
      this.data.commentId = options.id;
      this.data.id = options.id;
      this.data.nav = options.nav;
      this.data.status = options.status;
      this.setData({
        userType: wx.getStorageSync("userType"),
        nav:this.data.nav,
        status: this.data.status
      })
      

      // let nav = options.nav,
      //     itemObj = JSON.parse(options.item)
      // this.setData({
      //   nav,
      //   itemObj
      // })



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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.setData({
        orderNav: wx.getStorageSync('orderNav')
      })
      this.getData();
      this.getCompanyaddress();
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
    getData(){
      if (this.data.id) {
        api.getOrderDetail({
          data:{
            id: this.data.id
          }
        }).then((res) => {
          if (res.code == 200 || res.code == 0) {
            let itemObj = res.data;
            console.log("-------------------");
            console.log(itemObj.desc_img);
            // if (itemObj.type == 1) {
            //   wx.setNavigationBarTitle({
            //     title: '找料详情'
            //   })
            // } else {
            //   wx.setNavigationBarTitle({
            //     title: '取送详情'
            //   })
            // }
            if (itemObj.type == 1) {
              itemObj.type_name = '按图找料'
            } else if (itemObj.type == 2) {
              itemObj.type_name = '按样找料'
            } else if (itemObj.type == 3) {
              itemObj.type_name = '按描述找料'
            }
            if (typeof itemObj.front_img == 'string') {
              let newFrontImg = [];
              newFrontImg.push(itemObj.front_img);
              itemObj.front_img = newFrontImg;
            }

            this.setData({
              itemObj
            })

          }else{
            util.errorTips(res.msg);
          }

        }).catch((res) => {
          console.log(res.msg);
        })
      }
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
          currentTarget: {
            dataset: { id: that.data.order_id }
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
      this.setData({
        isOldPayPasswordModel: false,
        Value: '',
        isDisabled: false
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
        url: '../changePassword/changePassword?forgetPayPassWord=2',
      })
    },

})