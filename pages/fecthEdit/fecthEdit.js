// pages/material/material.js
const api = require('../../utils/api.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: false,
    checkTypes: '',
    checkType: '',
    checkTypes_cid: '',
    findNum: 1, // 物料数量
    describeValue: '',
    fecthPrice: 0, // 配送费用
    isPopup: false, // 弹窗控制   
    payNum: 10, // 倒计时               
  },
  // 获取单个任务价格
  getTaskFee() { 
    let fecthPrice = wx.getStorageSync('fecthPrice');
    if (fecthPrice){
        this.setData({
          fecthPrice
        })
        return false;
    }
    api.getTaskFee({}, 2).then((res) => {
      if (res.code == 200) {
        this.data.fecthPrice = res.data.fee;
        this.setData({
          fecthPrice: this.data.fecthPrice,
        })
      } else {
        wx.showToast({
          title: '获取单价失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 切换类型
  checkType(e) {
    // this.data.isSelect = true;
    // this.setData({
    //   isSelect: this.data.isSelect
    // })
    // let index = e.currentTarget.dataset.index;
    // console.log(index);
    // let _this = this;
    // let itemList = [];
    // for (let i = 0; i < this.data.checkTypes.length; i++) {
    //   itemList.push(this.data.checkTypes[i].name);
    // }

    // wx.showActionSheet({
    //   itemList: itemList,
    //   success: function (res) {
    //     console.log(res);
    //     _this.data.isSelect = false;
    //     _this.setData({
    //       checkType: _this.data.checkTypes[res.tapIndex].name,
    //       checkTypes_cid: _this.data.checkTypes[res.tapIndex].id,
    //       isSelect: _this.data.isSelect
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //     _this.data.isSelect = false;
    //     _this.setData({
    //       isSelect: _this.data.isSelect
    //     })
    //   }
    // })
    wx.navigateTo({
      url: '../classify/classify?from=2'
    })
  },
  // 弹窗件数input失去焦点
  findNumBlur(e) {
    let v = e.detail.value;
    let re = /^[1-9]+[0-9]*]*$/;
    console.log(re.test(v));
    if (!re.test(v)) {
      this.setData({
        findNum: 1
      })
    }
    let totalFecthPrice = this.data.fecthPrice * this.data.findNum;
    this.setData({
      totalFecthPrice
    })
  },
  // input 改变1-10
  findNumChange(e) { 
    let n = e.detail.value;
    if (n < 1 && n != '') {
      this.setData({
        findNum: 1
      })
      wx.showToast({
        title: '最少1个找料任务',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (n >= 10) {
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
    this.data.totalFecthPrice = this.data.fecthPrice * e.detail.value;
    this.setData({
      findNum: e.detail.value,
      totalFecthPrice: this.data.totalFecthPrice
    })

  },
  // 减法
  sub() {
    if (this.data.findNum <= 1) {
      wx.showToast({
        title: '最少1个取料单',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.data.fecthPrice = 10;
    this.data.findNum--;
    let totalFecthPrice = this.data.fecthPrice * this.data.findNum;
    this.setData({
      findNum: this.data.findNum,
      totalFecthPrice
    })
  },
  // 加法
  plu() {
    if (this.data.findNum >= 10) {
      wx.showToast({
        title: '最多10个取料单',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.data.fecthPrice = 10;
    this.data.findNum++;
    let totalFecthPrice = this.data.fecthPrice * this.data.findNum;
    this.setData({
      findNum: this.data.findNum,
      totalFecthPrice
    })
  },
  // 获取物料类型数据
  getCheckTypes() {
    api.getCheckTypes({}).then((res) => {
      console.log(res);
      if (res.code == 200) {
        this.setData({
          checkTypes: res.data,
          checkTypes_cid: res.data[0].id,
          checkType: res.data[0].name
        })
      }
    })
  },
  // 获取默认地址
  getDefaultAddress() {
    api.defaultAddress({
    }, 1).then((res) => {
      let defaultAddress = res.data;
      console.log(defaultAddress);
      // 可能位空数组
      if (Array.isArray(defaultAddress)) {
        this.setData({
          defaultAddress: false,
          addressId: ''
        })
      } else {
        this.setData({
          defaultAddress,
          addressId: defaultAddress.id,
        })
      }
    })

  },
  // 去地址选择页面
  goConsigneeAddress(e) {
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?fetchs=true',
    })
  },
  // 去支付
  goPay() {
    clearInterval(this.data.interval);
    wx.switchTab({
      url: '../task1/task1',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  // 返回上一层，继续找料
  goBack() {
    clearInterval(interval);
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取描述
  getDesc(e) {
    let desc = e.detail.value;
    this.setData({
      desc
    })

  },
  // 取料任务提交
  fethchSubmit() {
    let _this = this;
    if (!this.data.desc) {
      wx.showToast({
        title: '请填写描述',
        icon: 'none',
        duration: 1500
      })
      return false
    }

    if (!this.data.defaultAddress) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1500
      })
      return false
    }

    let data ={
      form_data:{
        fetch_num: this.data.findNum,
        get_address: this.data.get_address,
        desc: this.data.desc,
        cid: this.data.checkTypes_cid != '' ? this.data.checkTypes_cid: this.data.cid
      },
      id: this.data.id
    }


    api.findEdit({
      method:'POST',
      data
    },this.data.id).then((res)=>{
        console.log(res);
        if(res.code==200){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          })
        }
    })
   
  },
  // 获取找料单价
  getFindOrFetchPrice() {
    api.getFindOrFetchPrice({}, 2).then((res) => {
      console.log('取料单价');
      console.log(res);
      if (res.code == 200) {
        this.setData({
          fecthPrice: res.data.fee
        })
      }
    })
  },

  // 获取公司地址
  getCompanyaddress() {
    api.getCompanyaddress({}).then((res) => {
      if (res.code == 200) {
        let companyaddress = res.data;
        this.setData({
          companyaddress
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    app.globalData.isFromScope = true;
    let item = JSON.parse(options.item);
    console.log(item);
    this.data.checkType = item.cname;
    this.data.cid = item.cid;
    this.data.findNum = item.form_data.fetch_num;
    this.data.desc = item.form_data.desc;
    this.data.defaultAddress = item.address;
    this.data.totalFecthPrice = item.form_data.fee;
    this.data.get_address = item.form_data.get_address;
    this.data.id = item.id;
    this.setData({
      checkType: this.data.checkType,
      findNum:this.data.findNum,
      desc: this.data.desc,
      defaultAddress: this.data.defaultAddress,
      totalFecthPrice: this.data.totalFecthPrice,
      id: this.data.id
    })
    // 获取物料类型
    //this.getCheckTypes();
    // 获取公司地址
    this.getCompanyaddress();
    // 获取默认地址
    //this.getDefaultAddress();
    // 获取找料单价
    // this.getFindOrFetchPrice();

    // 获取单价
    this.getTaskFee()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})