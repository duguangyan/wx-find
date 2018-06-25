const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const bmap = require('../../libs/bmap-wx.min.js');
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
 var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    addressInfo: {
      isSugShow:false,
      consignee: '',
      mobile: '',
      address: '',
      mapInputValue:'',
      mapAddress:''
    },
    // 是否默认
    is_default: 0,
    multiIndex: [6, 0, 0]

  },
  // 获取用户当前地址
  getUserMapAddress(){
    var that = this
    var that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '开发密钥（key）' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            
          }
        })
      }
    })
  },
  // 获取地图地址
  getMapAddress(){

  },
  // 清空mapInput
  cleanInput(){
    this.setData({
      searchValue:""
    })
  },
  editStall (e) {
    let stall = e.detail.value;
    this.data.addressInfo.stall = stall
  },
  // 收货人修改
  editConsignee(e) {
    let consignee = e.detail.value;
    this.data.addressInfo.consignee = consignee
  },
  // 手机号修改
  editMobile(e) {
    let mobile = e.detail.value;
    this.data.addressInfo.mobile = mobile
  },
  // 详细地址修改
  editDetailAddress(e) {
    let address = e.detail.value;
    this.data.addressInfo.address = address;
  },
  // 详细地址修改该
  editDetailRemark (e) {
    let remark = e.detail.value;
    this.data.addressInfo.remark = remark;
  },
  //地区选择器
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，地区', e, e.detail.value)
    let old_region_name = this.data.multiArray[this.data.multiIndex[0]].children[this.data.multiIndex[1]].region_name;
    this.setData({
      multiIndex: e.detail.value
    })
    const [one, two, three] = this.data.multiIndex;
    this.data.mapRegion = this.data.multiArray[one].children[two].region_name;
    this.setData({
      mapRegion: this.data.mapRegion
    })
    console.log(old_region_name)
    console.log(this.data.mapRegion)
    // 清空地图数据
    if (old_region_name != this.data.mapRegion){
      // this.data.addressInfo.address = '';
      // this.data.addressInfo.longitude = '';
      // this.data.addressInfo.latitude = '';
      this.setData({
        addressInfo: this.data.addressInfo
      })
    }
   
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
  // 地址设为默认
  setDefault(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value);
    let is_defautl = e.detail.value;



    this.setData({
      is_default: is_defautl ? 1 : 0
    })

  },
  // 保存提交
  saveSubmit() {

    let addressInfo = this.data.addressInfo,
      type = this.data.type;

    // 地址为空
    if (addressInfo.consignee.length === 0) {
      util.errorTips('请确认收货人');
      return false;
    }

    // 判断手机验证
    if (!util.vailPhone(addressInfo.mobile)) {
      util.errorTips('请确认手机号');
      return false;
    }

    // 判断地区,获取id

    const [one, two, three] = this.data.multiIndex;
    let multiArray = this.data.multiArray,
      province = multiArray[one].id,
      city = multiArray[one].children[two].id,
      district = multiArray[one].children[two].children[three].id;

    console.log(province, city, district);


    // 判断地址

    if (!addressInfo.address) {
      util.errorTips('请确认详细地址');
      return false;
    }

    let is_default = this.data.is_default;
    console.log(this, is_default)

    if (type === 'new') {
      api.addAddress({
        method:"POST",
        data: {
          consignee: addressInfo.consignee,
          province,
          city,
          district,
          address: addressInfo.address,
          mobile: addressInfo.mobile,
          is_default,
          search_address: addressInfo.search_address,
          stall: addressInfo.stall,
          // longitude: addressInfo.longitude || '',
          // latitude: addressInfo.latitude || '',
          remark: addressInfo.remark
        }
      }).then((res) => {

        // 修改上一个页面栈数据
        wx.showToast({
          title: '新增成功',
        })
        wx.navigateBack();
      })


    } else if (type === 'edit') {

      // 编辑提交
      api.editAddress({
        method:'PUT',
        data: {
          consignee: addressInfo.consignee,
          province,
          city,
          district,
          address: addressInfo.address,
          mobile: addressInfo.mobile,
          is_default,
          search_address: addressInfo.search_address,
          stall: addressInfo.stall,
          // longitude: addressInfo.longitude || '',
          // latitude: addressInfo.latitude || '',
          remark: addressInfo.remark
        }
      }, this.data.id).then((res) => {

        // 修改上一个页面栈数据

        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack();

      }).catch((res) => {

        util.errorTips(res.msg);

      }).finally(() => {

      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    qqmapsdk = new QQMapWX({
      key: 'TREBZ-NE3KW-VZ5RD-OFP22-IUGZO-MEF7A'
    });



    let type = options.type,
      id = options.id;
    console.log('test', options);

    wx.showNavigationBarLoading();
    // wx.showLoading({
    //   title: '数据加载中',
    // })
    // 设置标题
    if (type === 'edit') {
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    }
    // 设置id
    this.data.id = id;
    this.data.type = type;

    

    // 缓存地址信息
    let addressList = wx.getStorageSync('addressList');

    if (!!addressList) {
      
      this.setData({
        multiArray: addressList
      })
      if (type === 'edit') {
      
        // 获取编辑用户地址信息
        this.getInfo(id);
      } else if (type === 'new') {

        // 设置默认地址选择
        this.setData({
          province: this.data.multiIndex[0],
          city: this.data.multiIndex[1]
        })
        
        

      }
      // wx.hideLoading();
      // 关闭加载
      wx.hideNavigationBarLoading();
      return false;
    }


    api.getAddress(

    ).then((res) => {
      console.log(res);

      this.setData({
        multiArray: res.data
      })

      wx.setStorage({
        key: 'addressList',
        data: res.data,
      })


      if (type === 'edit') {

        // 获取编辑用户地址信息
        this.getInfo(id)

      } else if (type === 'new') {
        // 设置默认地址选择
        this.setData({
          province: this.data.multiIndex[0],
          city: this.data.multiIndex[1]
        })
      
      }
      wx.hideLoading();
      }).finally(() => wx.hideNavigationBarLoading());


  },
  // 获取地图地址数据
  mapKeyInput: function (e) {
    
    this.data.isSugShow = true;
    this.data.addressInfo.address = e.detail.value;
    this.data.addressInfo.longitude = '';
    this.data.addressInfo.latitude = '';

    this.setData({
      isSugShow: this.data.isSugShow,
      //addressInfo: this.data.addressInfo
    })
    let that = this;
    if (e.detail.value === '') {
      that.setData({
        sugData: ''
      });
      return;
    }
    let BMap = new bmap.BMapWX({
      ak: '3jSXyNSuxGsuVGHK0zGHr4K4doVSxg9c'
    });
    let fail = function (data) { 
      console.log(data)
    };
    let success = function (data) {
      let sugData = data.result;
      console.log(data.result);
      // for (var i = 0; i < data.result.length; i++) {
      //   sugData = sugData + data.result[i].name + '\n';
      //   console.log(data);
      // }
      that.setData({
        sugData: sugData
      });

    }
    BMap.suggestion({
      query: e.detail.value,
      region: this.data.mapRegion, // '深圳'
      city_limit: true,
      fail: fail,
      success: success
    });
  },
  // 地图选中
  mapCheck(e) {
    let index = e.target.dataset.index;
    this.data.addressInfo.address = this.data.sugData[index].name;
    this.data.addressInfo.search_address = this.data.sugData[index].name;
    this.data.addressInfo.longitude = this.data.sugData[index].location.lat;
    this.data.addressInfo.latitude = this.data.sugData[index].location.lng;
    this.data.mapInputValue = this.data.sugData[index].name;
    this.data.isSugShow = false;
    this.setData({
      addressInfo: this.data.addressInfo,
      mapInputValue: this.data.mapInputValue,
      isSugShow: this.data.isSugShow
    })
    this.setData({
      searchValue:''
    })
    console.log(index);
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
    wx.hideLoading();
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

  // 请求输出编辑信息
  getInfo(id) {
    api.infoAddress({},id).then((res) => {

      let addressInfo = res.data,
        { province, city, district, is_default } = addressInfo,
        multiIndex = [];
      // 查找对应索引值
      this.data.multiArray.forEach((ele, i) => {
        if (ele.id == province) {
          multiIndex.push(i)
          ele.children.forEach((val, j) => {
            if (val.id == city) {
              multiIndex.push(j)
              val.children.forEach((v, k) => {
                if (v.id == district) {
                  multiIndex.push(k)
                }
              })
            }
          })
        }
      })
      console.log(multiIndex)

      //  设置默认按钮状态


      this.setData({
        addressInfo,
        multiIndex,
        province: multiIndex[0],
        city: multiIndex[1],
        is_default
      })

    }).catch(() => {

    }).finally(() => wx.hideNavigationBarLoading())
  },

  // 查找对应索引值（没用了）

  seacrchIndex() {

    let multiIndex = [];
    // 查找对应索引值
    this.data.multiArray.forEach((ele, i) => {
      if (ele.id === province) {
        multiIndex.push(i)
        ele.children.forEach((val, j) => {
          if (val.id == city) {
            multiIndex.push(j)
            val.children.forEach((v, k) => {
              if (v.id == district) {
                multiIndex.push(k)
              }
            })
          }
        })
      }
    })
    console.log(multiIndex)

    this.setData({
      multiIndex,
      province: multiIndex[0],
      city: multiIndex[1]
    })
  }

})