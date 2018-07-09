let app = getApp();
const api = require('../../utils/api.js');
let onfire = require('../../utils/onfire.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {

        orderTab1: [{
            id: 4,
            imgId:1,
            name: '待付款'
        }, {
            id: 5,
            imgId: 2,
            name: '待收货'
        }, {
            id: 6,
            imgId: 3,
            name: '待评价'
        }],
        orderTab2: [{
          id: 4,
          imgId: 1,
          name: '待付款'
        }, {
          id: 5,
          imgId: 2,
          name: '待收货'
        }, {
          id: 6,
          imgId: 3,
          name: '待评价'
        }],


    },
    // 去设置页面
    gotoSettinngPage(){
      wx.navigateTo({
        url: '../setting/setting',
      })
    },
    // 去登录页面
    toLogin(){
      wx.navigateTo({
        url: '../login/login',
      })
    },
    // 获取个人中心数据状态
    centerStatistics (){
      api.centerStatistics({}).then((res)=>{
        console.log(res);
        if(res.code==200){
          this.data.orderTab1[0].num = res.data.find.unpay;
          this.data.orderTab1[1].num = res.data.find.unfinish;
          this.data.orderTab1[2].num = res.data.find.uncmt;
          this.data.orderTab2[0].num = res.data.fetch.unpay;
          this.data.orderTab2[1].num = res.data.fetch.unfinish;
          this.data.orderTab2[2].num = res.data.fetch.uncmt;
          this.setData({
            orderTab1: this.data.orderTab1,
            orderTab2: this.data.orderTab2
          })
        }
      })
    },
    goAddress(){
      // let token = app.globalData.token;
      // if (token){
        
      // }else{
      //   wx.showModal({
      //     title: '您尚未登陆',
      //     content: '是否前往登陆页面',
      //     confirmText: '前往',
      //     confirmColor: '#c81a29',
      //     success: (res) => {
      //       if (res.confirm) {
      //         wx.navigateTo({
      //           url: '../login/login',
      //         })
      //       } else if (res.cancel) {
      //         console.log('用户点击取消')
      //       }
      //     }
      //   })
      // }
      wx.setStorageSync('fromCenter', '0');
      let token = wx.getStorageSync('token');
      let isTrue = token ? false : true;
      if (isTrue) {
        wx.showModal({
          title: '您尚未登录',
          content: '是否前往登录页面',
          confirmText: '前往',
          confirmColor: '#c81a29',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: '../login/login',
              })
              return false;
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

        return false;
      }
      wx.navigateTo({
        url: '../consigneeAddress/consigneeAddress?center=1',
      })
      
    },
    // 修改个人资料
    modifyInfo() {

        wx.navigateTo({
            url: '../personalDetails/personalDetails',
        })

    },
    // 找料订单跳转 
    toMyOrder(e) { 
        wx.setStorageSync('fromCenter', '0');
        let token = wx.getStorageSync('token');
        let isTrue = token?false:true;
        if (isTrue){
          wx.showModal({
            title: '您尚未登录',
            content: '是否前往登录页面',
            confirmText: '前往',
            confirmColor: '#c81a29',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login',
                })
                return false;
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          
          return false;
        }
        console.log(e.currentTarget.dataset.id);
        let status = e.currentTarget.dataset.id;
        let method = e.currentTarget.dataset.method;
       


        wx.setStorageSync('method', method);
        wx.setStorageSync('status', status);
        wx.switchTab({
          url: '../order/order',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        }) 

        console.log(token);

        // if (token) {
        //     // wx.navigateTo({
        //     //   url: `../myFindOrder/myFindOrder?status=${statusID}`,
        //     // })
        //   wx.setStorageSync('method', method);
        //   wx.setStorageSync('status', status);
        //   wx.switchTab({
        //     url: '../order/order',
        //     success: function (e) {
        //       var page = getCurrentPages().pop();
        //       if (page == undefined || page == null) return;
        //       page.onLoad();
        //     }
        //   }) 
          
        // } else {
        //     wx.showModal({
        //         title: '您尚未登陆',
        //         content: '是否前往登陆页面',
        //         confirmText: '前往',
        //         confirmColor: '#c81a29',
        //         success: (res) => {
        //             if (res.confirm) {
        //                 wx.navigateTo({
        //                   url: '../login/login',
        //                 })
        //             } else if (res.cancel) {
        //                 console.log('用户点击取消')
        //             }
        //         }
        //     })
        // }
    },


  
    // 增票资质 自我增加

    collatingTickets() {
        
        wx.getSetting({
            success: res => {
                console.log(res);
                if (res.authSetting['scope.invoiceTitle'] === false) {

                    wx.showModal({
                        title: '温馨提示',
                        content: '为了更好的服务，需要请开启您授权发票抬头信息权限',
                        showCancel: false,
                        success: () => {

                            wx.openSetting({
                                success: (res) => {
                                    console.log(res)
                                    if (res.authSetting["scope.userInfo"]) {
                                        //这里是授权成功之后 填写你重新获取数据的js,调用解密信息接口
                                        wx.showToast({
                                            title: '设置成功',
                                        })

                                    }
                                }
                            })

                        }
                    })
                }
            }
        })

        wx.chooseInvoiceTitle({ });

    },

    // 索样开发中展示
    developing() {

        wx.showToast({
            title: '功能开发中',
            image: '../../images/icons/error.png',
            duration: 1500
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {  
      // let userInfo = app.globalData.userInfo;
      // console.log(userInfo);
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
      wx.setStorageSync('fromCenter','1');
      this.data.orderTab1[0].num = 0;
      this.data.orderTab1[1].num = 0;
      this.data.orderTab1[2].num = 0;
      this.data.orderTab2[0].num = 0;
      this.data.orderTab2[1].num = 0;
      this.data.orderTab2[2].num = 0;
      this.setData({
        memberInfo: false,
        orderTab1: this.data.orderTab1,
        orderTab2: this.data.orderTab2
      })
      // 更新用户信息
      this.getUserInfo(); 
    },

    // 获取用户信息
    getUserInfo () {
      console.log('userInfo');
      // 用于注册返回更新用户状态
      api.memberInfo({

      }).then((res) => {
        console.log('用户信息 = ', res);
        if(res.code==200){
          app.globalData.memberInfo = res.data;
          this.setData({
            memberInfo: res.data
          })
          // 获取用户订单数量
          this.centerStatistics();
        }
        
      }).catch((res) => {

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

    }
})