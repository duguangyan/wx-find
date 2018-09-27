// pages/material/material.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isResNotes:false,
    isNotes:true, // 取料须知
    isSelect:false,
    checkTypes: '',
    checkType:'',
    checkTypes_cid:'',
    findNum:1  , // 物料数量
    describeValue:'',
    fecthPrice:0, // 配送费用
    isPopup: false, // 弹窗控制   
    payNum:10, // 倒计时               
  },
  checkIsResNotes() {
    this.setData({
      isResNotes: !this.data.isResNotes
    })
    if (this.data.isResNotes) {
      wx.setStorageSync('isFetchNotes', true);
    }else{
      wx.removeStorageSync('isFetchNotes');
    }

  },
  // 获取单个任务价格
  getTaskFee(){
    api.getTaskFee({},2).then((res)=>{
      if(res.code==200){
        this.data.fecthPrice = res.data.fee;
        this.data.totalFecthPrice = res.data.fee;
        wx.setStorageSync('fecthPrice', res.data.fee);
        this.setData({
          fecthPrice: this.data.fecthPrice,
          totalFecthPrice: this.data.totalFecthPrice
        })
      }else{
        wx.showToast({
          title: '获取单价失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 显示照料须知
  showNotes() {
    this.setData({
      isNotes: true
    })
  },
  // 隐藏找料须知
  hiddenNotes() {
    this.setData({
      isNotes: false
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
    // for (let i = 0; i < this.data.checkTypes.length;i++){
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

    //2.2.1
    wx.navigateTo({
      url: '../classify/classify?from=2'
    })
  },
  // 弹窗件数input失去焦点
  findNumBlur(e) {
    let v = e.detail.value;
    let re = /^[1-9]+[0-9]*]*$/; 
    console.log(re.test(v));
    if (!re.test(v)){
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
    if (n <= 0 && n != '') {
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

    let totalFecthPrice = this.data.fecthPrice * this.data.findNum;
    this.setData({
      findNum: e.detail.value,
      totalFecthPrice
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
          checkTypes_cid:res.data[0].id,
          checkType: res.data[0].name
        })
      }

      // 继续请求
      // 获取找料单价
      this.getFindOrFetchPrice();
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
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?fetchs=1&id='+id,
    })
  },
  // 去支付
  goPay() {
    clearInterval(this.data.interval);
    wx.switchTab({
      url: '../task3/task3',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  // 返回上一层，继续找料
  goBack() {
    clearInterval(this.data.interval);
    // wx.navigateBack({
    //   delta: 1
    // })
    
    // this.data.checkTypes_cid = this.data.checkTypes[0].id;
    this.data.desc = '';
    this.data.findNum = 1;
    // this.data.checkType = this.data.checkTypes[0].name;
    this.setData({
      isPopup: false,
      checkTypes_cid: this.data.checkTypes_cid,
      desc: this.data.desc,
      findNum: this.data.findNum,
      checkType: this.data.checkType
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
  fethchSubmit(e) {
    
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

    // 获取上传图片
    let uploadC = this.selectComponent('#upload');
    let uploadImgs = [];
    // 判定是否在已是完成状态
    // let isUploading = uploadC.data.files.every((ele, i) => {
    //   return (ele.pct && (ele.pct === 'finish' || ele.pct === 'fail'))
    // })
    // if (!isUploading) {
    //   util.errorTips('图片正在上传')
    //   return false
    // }
    // 添加数据
    uploadC.data.files.forEach((ele, i) => { 
      if (ele.full_url) {
        uploadImgs.push(ele.full_url)
      }
    })
    console.log(uploadImgs);
    let _this = this;
    if (!this.data.checkTypes_cid) {
      wx.showToast({
        title: '请填写物料品类',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    if (!this.data.desc){
      wx.showToast({
        title: '请填写描述',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    
    if (!this.data.defaultAddress.id) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1500
      })
      return false
    }
    let data ={
      task_type:2,
      form_data:[{
        cid:this.data.checkTypes_cid,
        desc: this.data.desc,
        fetch_num: this.data.findNum,
        get_address: this.data.defaultAddress.id,
        desc_img: uploadImgs
      }]
    }
    api.joinTask({
      method:'POST',
      data
    }).then((res)=>{  
      console.log(res);
      if (res.code == 200) {
        this.setData({
          isPopup: true
        })
        _this.data.interval = setInterval(function () {
          console.log(_this.data.payNum);
          _this.data.payNum--;
          _this.setData({
            payNum: _this.data.payNum
          })
          if (_this.data.payNum == 0) {
            _this.setData({
              isPopup: false
            })
            _this.goPay();
          }
        }, 1000)
      }else{
        util.successTips(res.msg);
      }
    }).catch((res)=>{
      util.successTips(res.msg);
    })
  },
  // 获取找料单价
  getFindOrFetchPrice () {
    api.getFindOrFetchPrice({},2).then((res)=>{
      console.log('取料单价');
      console.log(res);
      if(res.code == 200){
        this.setData({
          fecthPrice:res.data.fee
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 动态获取须知
    api.needKnow({}).then((res) => {
      console.log(res);
      this.setData({
        deliveryNeedKnow: res.data.delivery.value
      })
    })

    // 获取单价
    this.getTaskFee();
    app.globalData.isFromScope = true;
    // 获取物料类型
    //this.getCheckTypes();
    // 获取默认地址
    this.getDefaultAddress();
    
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
    if (wx.getStorageSync('isFetchNotes')){
      this.setData({
        isNotes: false
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})