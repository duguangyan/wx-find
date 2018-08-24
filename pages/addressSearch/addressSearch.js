// pages/addressSearch/addressSearch.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [6, 0],
    addressInputValue:'请填写搜索内容',
    titleTips:'当前位置',
    serachAdressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    wx.showLoading({
      title: '数据加载中...',
    })

    // 设置腾讯地图app_key
    qqmapsdk = new QQMapWX({
      key: 'TREBZ-NE3KW-VZ5RD-OFP22-IUGZO-MEF7A'
    });
    let _this = this;

    if (wx.getStorageSync('multiIndex')) {
      let multiIndex = wx.getStorageSync('multiIndex');
      this.setData({
        multiIndex
      })
    }
    // 获取城市列表
    let addressList = wx.getStorageSync('addressList');
    console.log(addressList);
    if (addressList != '') {
      this.setData({
        multiArray: addressList
      })
      this.setData({
        province: this.data.multiIndex[0],
        city: this.data.multiIndex[1]
      })
      
      // 获取上一级传值
      if (options.addressValue) {
        let address1 = options.addressValue == "undefined" ? '' : options.addressValue ;
        // let address2 = options.addressValue == "undefined" ? '' : options.addressValue ;
        let address3 = options.addressTitle == "undefined" ? '请输入地址' : options.addressTitle;
        this.setData({
          optionsAddressValue: address1,
          addressInputValue: address1 ,
          addressTitle: address3
        })
        
        this.getSuggestion();
      }

    } else {
      // 获取城市信息
      api.getAddress({}).then((res) => {
        console.log(res);
        this.setData({
          multiArray: res.data
        })
        wx.setStorage({
          key: 'addressList',
          data: res.data,
        })
        // 设置默认地址选择
        this.setData({
          province: this.data.multiIndex[0],
          city: this.data.multiIndex[1]
        })
        // 获取上一级传值
        if (options.addressValue) {

          this.setData({
            optionsAddressValue: options.addressValue,
            addressInputValue: options.addressValue,
            addressTitle: options.addressTitle
          })
          this.getSuggestion();
        }


      });
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
  // 获取搜索内容
  getAddressSearchValue(e){
    
    if (e.detail.value==''){
      this.data.addressInputValue = this.data.optionsAddressValue;
    }else{
      this.data.addressInputValue = e.detail.value;
    }
    this.getSuggestion();
  },
  // 获取搜索地址信息
  getAddressSearchItem(e){
    let item = e.currentTarget.dataset.item;
    console.log(item);
    // 获取上一页
    let pages = getCurrentPages();
    let Page = pages[pages.length - 1];//当前页
    let prevPage = pages[pages.length - 2];  //上一个页面
    let addressInfo = prevPage.data.addressInfo;
    addressInfo.mapAddress = item;
    prevPage.setData({
      addressInfo
    })
    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取搜索地址列表
  getSuggestion(){
    let _this = this;
    let multiArray = this.data.multiArray;
    let multiIndex = this.data.multiIndex;
    console.log(multiArray[multiIndex[0]].children[multiIndex[1]].region_name);
    console.log(_this.data.addressInputValue);
    qqmapsdk.getSuggestion({
      keyword: _this.data.addressInputValue,
      region: multiArray[multiIndex[0]].children[multiIndex[1]].region_name,
      region_fix: 1,
      policy: 1,
      success: function (res) {
        console.log(res);
        let data = res.data;
        // let serachAdressList = [];
        // let region = multiArray[multiIndex[0]].region_name+'省' + 
        // multiArray[multiIndex[0]].children[multiIndex[1]].region_name + '市';
        
        // data.forEach((v,i)=>{
        //   if (v.address.indexOf(region) != -1){
        //     serachAdressList.push(v)
        //   }
        // })
        
        _this.setData({
          serachAdressList:data
        })
        wx.hideLoading();
      },
      fail: function (res) {
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
      }
    });
  },
  // 获取城市数据
  getCitys(){
    
  },
  //地区选择器
  bindMultiPickerChange: function (e) { 
    console.log('picker发送选择改变，地区', e, e.detail.value)
    let old_region_name = this.data.multiArray[this.data.multiIndex[0]].children[this.data.multiIndex[1]].region_name;
    this.setData({
      multiIndex: e.detail.value
    })
    const [one, two, three] = this.data.multiIndex;
    wx.setStorageSync('multiIndex', this.data.multiIndex);
    this.data.mapRegion = this.data.multiArray[one].children[two].region_name;
    this.setData({
      mapRegion: this.data.mapRegion
    })
    console.log(old_region_name)
    console.log(this.data.mapRegion)
    // 清空地图数据
    if (old_region_name != this.data.mapRegion) {
      // this.data.addressInfo.address = '';
      // this.data.addressInfo.longitude = '';
      // this.data.addressInfo.latitude = '';
      this.setData({
        addressInfo: this.data.addressInfo
      })
    }


    // 获取地址选择列表
    this.getSuggestion();

  },
  bindMultiPickerColumnChange: function (e) {
    console.log('bindMultiPickerColumnChange改变 ==', e, e.detail.value);
    const column = e.detail.column;
    const i = e.detail.value;

    switch (column) {
      case 0:
        this.setData({
          province: i
        });
        break;
      case 1:
        this.setData({
          city: i
        });
        break;
      default: ;
    }

  },
  

})