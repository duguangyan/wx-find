const api = require('../../utils/api.js');
 const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let app = getApp();
 var qqmapsdk;
Page({
    /**
     * 页面的初始数据
     */
    data: {
      findNum:1,
      selcetTabNum:1,
      isPopup:false,
    },
    // 提交
    doSubmit () {  
      this.setData({
        isPopup: false
      })
      console.log('添加几页');
      console.log(this.data.findNum);
      wx.navigateTo({
        url: '../find/find?findNum=' + this.data.findNum + '&selcetTabNum=' + this.data.selcetTabNum,
      })
    },
    // 弹窗件数input失去焦点
    findNumBlur (e) {
      console.log(e.detail.value);
      let v = e.detail.value;
      let re = /^[1-9]+[0-9]*]*$/;
      console.log(re.test(v));
  
      if (!re.test(v)){
        this.setData({
          findNum: 1
        })
      }
    },
    // input 改变1-10
    findNumChange (e) {
      let n = e.detail.value;
      if(n<1 && n!=''){
        wx.showToast({
          title: '最少1个找料任务',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          findNum: 1
        })
        return false;
      }
      if (n > 10) {
        this.setData({
          findNum: 10
        })
        wx.showToast({
          title: '最多10个找料任务',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.setData({
        findNum: e.detail.value
      })
    },
    // 减法
    sub () {
      if (this.data.findNum<=1){
        wx.showToast({
          title: '最少1个找料单',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.data.findNum--;
      this.setData({
        findNum: this.data.findNum
      })
    },
    // 加法
    plu () {
      if (this.data.findNum >= 10) {
        wx.showToast({
          title: '最多10个找料单',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.data.findNum++;
      this.setData({
        findNum: this.data.findNum
      })
    },

    // 找料方式切换
    selcetTab (e){
      let id = e.currentTarget.dataset.id;
      this.setData({
        selcetTabNum: id
      })
    },
    //  联系我们电话
    contact() {
        wx.makePhoneCall({
            phoneNumber: '400-8088-156'
        })
    },
    // 点击背景关闭找料数量弹窗
    closePopup() {
      this.setData({
        isPopup: false
      })
    },
    // 去找料
    goFind(e) {
      
      let token = wx.getStorageSync('token'); 
      if (!token){
        // 跳转关联页面
        wx.navigateTo({
          url: '../login/login',
        })
        return false;
      }
      // this.setData({
      //   isPopup: true
      // })
      console.log('fromId');
      console.log(e.detail.formId);
      if (e.detail.formId != 'the formId is a mock one') {
        let data = {
          "form_id": e.detail.formId,
          "from": "3"
        }
        api.getFormId({
          method: 'POST',
          data
        }).then((res) => {
          console.log(res);
          console.log('获取formId');
        })
      }
      wx.navigateTo({
        url: '../find/find?findNum=' + 1 + '&selcetTabNum=' + 1,
      })
    },
    // 立刻取料  
    goMaterial(e) {
      let token = wx.getStorageSync('token');
      if (!token) {
        // 跳转关联页面
        wx.navigateTo({
          url: '../login/login',
        })
        return false;
      }
      console.log('fromId');
      console.log(e.detail.formId);
      if (e.detail.formId != 'the formId is a mock one') {
        let data = {
          "form_id": e.detail.formId,
          "from": "3"
        }
        api.getFormId({
          method: 'POST',
          data
        }).then((res) => {
          console.log(res);
          console.log('获取formId');
        })
      }
      // 跳转关联页面
      wx.navigateTo({
        url: '../material/material',
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 实例化API核心类
<<<<<<< HEAD
       qqmapsdk = new QQMapWX({
         key: 'TREBZ-NE3KW-VZ5RD-OFP22-IUGZO-MEF7A'
       });
=======
      // qqmapsdk = new QQMapWX({
      //   key: 'TREBZ-NE3KW-VZ5RD-OFP22-IUGZO-MEF7A'
      // });
      // 获取fromId
      // this.submitInfo();
>>>>>>> weixin2.2
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    

    },

    getDistance: function (lat1, lng1, lat2, lng2) { 

      lat1 = lat1 || 0;

      lng1 = lng1 || 0;

      lat2 = lat2 || 0;

      lng2 = lng2 || 0;

      var rad1 = lat1 * Math.PI / 180.0;

      var rad2 = lat2 * Math.PI / 180.0;

      var a = rad1 - rad2;

      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

      var r = 6378137;

      return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      
<<<<<<< HEAD
      // 调用接口
      // qqmapsdk.getSuggestion({
      //   keyword: '广州市云峰花园',
      //   success: function (res) {
      //     console.log(res);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function (res) {
      //     console.log(res);
      //   }
      // });
      // 调用接口
      // qqmapsdk.geocoder({
      //   address: '广州财富工业园',
      //   success: function (res) {
      //     console.log(res);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function (res) {
      //     console.log(res);
      //   }
      // });
      // let xx = this.getDistance(22.814449, 108.323738, 23.351101, 113.250949);
      // console.log(xx);
      // console.log('xxx:-----------------');
      // qqmapsdk.calculateDistance({
      //   to: [{
      //     latitude: 23.35089,
      //     longitude: 113.25097
      //   }, {
      //       latitude: 23.37865,
      //       longitude: 113.2458
      //   }],
      //   success: function (res) {
      //     console.log(res);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function (res) {
      //     console.log(res);
      //   }
      // });
      // 调用接口
      // qqmapsdk.getCityList({
      //   success: function (res) {
      //     console.log(res);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function (res) {
      //     console.log(res);
      //   }
      // });

=======
      
      // 测试
>>>>>>> weixin2.2
      // 调用接口
      // qqmapsdk.getSuggestion({
      //   keyword: '财富',
      //   region:'深圳市',
      //   success: function (res) {
      //     console.log(res);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function (res) {
      //     console.log(res);
      //   }
      // });
      
      // wx.getLocation({
      //   type: 'wgs84',
      //   success: function (res) {
      //     console.log('xxxxxxxxxxxx');
      //     console.log(res);
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //     var speed = res.speed
      //     var accuracy = res.accuracy

      //     // 调用接口
      //     qqmapsdk.reverseGeocoder({
      //       location: {
      //         latitude: latitude,
      //         longitude: longitude
      //       },
      //       success: function (res) {
      //         console.log(res);
      //       },
      //       fail: function (res) {
      //         console.log(res);
      //       },
      //       complete: function (res) {
      //         console.log(res);
      //       }
      //     });

      //   }
      // })
      // wx.getLocation({
      //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      //   success: function (res) {
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //     wx.openLocation({
      //       latitude: latitude,
      //       longitude: longitude,
      //       scale: 28
      //     })
      //   }
      // })
      this.setData({
        findNum:this.data.findNum
      })
      //设置服务人数
      api.serviceNum({}).then(res => {
        let serviceData = res.data;
        this.setData({
          serviceData
        })
      });
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
        // wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      //console.log(1);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取fromId
    submitInfo: function (e) {
      console.log('fromId:');
      console.log(e.detail.formId);
    }
})