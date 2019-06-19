const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
 const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let app = getApp();
 var qqmapsdk;
Page({
    /**
     * 页面的初始数据
     */
    data: {
      familyStatus:0,
      status_label:'',
      findNum:0,
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 500,
      bannerImgs: ['https://static.yidap.com/miniapp/o2o_find/index/index_banner_1.png','https://static.yidap.com/miniapp/o2o_find/index/index_banner_3.png', 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png'],
      title: "小鹿快找",
      isArrow: false,
      navArr: [
        {
          img: "https://static.yidap.com/miniapp/o2o_find/index/index_nav_1.png",
          text: "数百名资深专业皮革辅料买手"
        },
        {
          img: "https://static.yidap.com/miniapp/o2o_find/index/index_nav_2.png",
          text: "3分钟响应、3小时反馈、8小时内找到"
        }
      ],
      contentArr: [
        {
          img: "https://static.yidap.com/miniapp/o2o_find/index/index_icon_1.png",
          text: ""
        },
        {
          img: "https://static.yidap.com/miniapp/o2o_find/index/index_icon_2.png",
          text: ""
        },
      ],
      serviceData: "", // 服务人数 次数
      nodes: "", //公告
      isNodes: false, // 是否显示公告
    },
    // 进入小鹿家人
  goIn(){
    // util.successTips('正在开发中...')
    // wx.navigateTo({
    //   url: '../family/family',
    // })

    let token = wx.getStorageSync('token');
    let isTrue = token ? false : true;
    if (isTrue) {
      wx.showModal({
        title: '您尚未登录',
        content: '是否前往登录页面',
        confirmText: '前往',
        // confirmColor: '#c81a29',
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
    api.getInviteCode({}).then((res) => {
      if (res.code == 200 || res.code == 0) {
        if (res.data.status == 0) {
          wx.navigateTo({
            url: '../familyExplain/familyExplain?familyStatus=' + res.data.status,
          })
        } else if (res.data.status == 1) {
          wx.navigateTo({
            url: '../familyCenter/familyCenter',
          })
        } else {
          wx.navigateTo({
            url: '../family/family',
          })
        }

      }
    })
    
  },
 
  // 获取公告
    mynotice(){
      api.mynotice({}).then((res) => {
        console.log(res);
        this.setData({
          nodes: res.data.content.replace(/\<img/gi, '<img class="rich-img" '),
          dialogTitle: res.data.title
        })

        this.indexDialog = this.selectComponent('#indexDialog');
        this.indexDialog.showDialog();
      })
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
    goPageForIndex(e){
      let index = e.currentTarget.dataset.index;

      let token = wx.getStorageSync('token');
      if (!token) {
        // 跳转关联页面
        wx.navigateTo({
          url: '../login/login',
        })
        return false;
      }
      console.log(e);
      if(index == 0 ){
        wx.navigateTo({
          url: '../find/find?findNum=' + 1 + '&selcetTabNum=' + 1,
        })
      }else{
        // 跳转关联页面
        wx.navigateTo({
          url: '../material/material',
        })
      }
      
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
    chat(){
      wx.navigateTo({
        url: '../chat/chat',
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            //发起网络请求
            let data = {
              code: res.code,
              from: 3
            }
            api.getOpenId({
              data
            }).then((res) => {
              if (res.code == 200 || res.code == 0) {
                wx.setStorageSync('open_id', res.data.openid)
              } else {
                util.errorTips(res.msg)
              }
            }).catch((res) => {
              util.errorTips(res.msg)
            })
          }
        }
      });

      if (options.fromUserId){
        util.successTips(options.fromUserId);
      }
      if (options.invite_code){
        wx.setStorage({
          key: 'invite_code',
          data: options.invite_code
        })
      }
      
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      

    },
    confirmEvent(){
      this.indexDialog.hideDialog();
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
     * 获取小鹿家人状态
     */
  getInviteCode() {
    api.getInviteCode({}).then((res) => {
      if (res.code == 200 || res.code == 0) {
        this.mynotice();
        if (res.data.status>0){
          this.setData({
            familyStatus: res.data.status,
            status_label: res.data.status_label
          })
        }else{
          this.setData({
            familyStatus: res.data.status
          })
        }
       
      }
    })
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
      if (wx.getStorageSync('token') != null 
      && wx.getStorageSync('token') != undefined 
      && wx.getStorageSync('token') != ''){
       
        this.getInviteCode();
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