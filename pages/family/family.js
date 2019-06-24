// pages/family/family.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isExamine:false,
    isCheck:false,
    imgBg1:'https://static.yidap.com/miniapp/o2o_find/index/img_bg.png',
    imgBg2: 'https://static.yidap.com/miniapp/o2o_find/index/img_bg.png',
    name:'',
    phone:'',
    address:'',
    number:'',
    status_label:'',
    remark:'',
    id:'',
    isSubmit:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getInviteCode();
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.setData({
      phone: wx.getStorageSync('user_name')
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
  /**
   * 获取姓名
   */
  getName(e){
    this.data.name = e.detail.value; 
  },
  /**
   * 获取电话
   */
  getPhone(e){
    this.data.phone = e.detail.value; 
  },
  /**
   * 获取地址
   */
  getAddress(e){
    this.data.address = e.detail.value; 
  },
  /**
   * 获取身份证
   */
  getNumber(e){
    this.data.number = e.detail.value; 
  },
  /**
   * 获取图片
   */
  uploadImg(e){
    let _this = this;
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const access_token = wx.getStorageSync('token') || '';
        let data = {};
        data.file = '[object Object]';
        data.type = 'big';
        let timestamp = Date.parse(new Date());
        data.timestamp = timestamp;
        data.sign = util.MakeSign(api.apiUrl + '/api/upload', data);
        data.deviceId = "wx";
        data.platformType = "2";
        data.versionCode = '4.0';
        // 上传图片，返回链接地址跟id,返回进度对象
        let uploadTask = wx.uploadFile({
          url: `${api.apiUrl}/api/upload`,
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
          formData: data,
          success: (res) => {
            var ress = JSON.parse(res.data);
            if (200 === ress.code || 0 === ress.code) {
              console.log('imgBg1->',_this.data.imgBg1);
              
              if (index == 1){
                _this.setData({
                  imgBg1: ress.data,
                })
              } else if (index == 2){
                _this.setData({
                  imgBg2: ress.data,
                })
              }
              
            } else {
              util.errorTips('上传错误');
            }
          },
          fail(err) {
            util.errorTips('上传错误');
          }
        })


      }
    })

    
 
  },

  /**
   * 提交
   */
  submit(){
    this.setData({
      isSubmit:false
    })
    let name = this.data.name;
    let phone = this.data.phone;
    let address = this.data.address;
    let number = this.data.number;
    let imgBg1 = this.data.imgBg1;
    let imgBg2 = this.data.imgBg2;
    if(name==''){
      util.errorTips('请填写姓名');
      return false;
    }
    if (phone == '') {
      util.errorTips('请填写联系电话');
      return false;
    }
    if (address == '') {
      util.errorTips('请填写联系地址');
      return false;
    }
    if (number == '') {
      util.errorTips('请填写身份证号码');
      return false;
    }
    if (imgBg1 == 'https://static.yidap.com/miniapp/o2o_find/index/img_bg.png') {
      util.errorTips('请上传身份证正面照');
      return false;
    }
    if (imgBg2 == 'https://static.yidap.com/miniapp/o2o_find/index/img_bg.png') {
      util.errorTips('请上传身份证背面照');
      return false;
    }
    let data = {
      consignee: name,
      mobile: phone,
      address,
      id_card_no: number,
      id_card_front: imgBg1,
      id_card_back: imgBg2
    }
    if(this.data.id != ''){
      data.id = this.data.id
    }
    api.getInviteCode({
      method:'POST',
      data
    }).then((res)=>{
      this.setData({
        isSubmit: true
      })
      if(res.code == 200 || res.code == 0){
        util.successTips('提交成功');
        
        this.setData({
          isExamine: true,
          status_label: res.data.status_label,
          remark: res.data.remark
        })
      }
    }).catch((res)=>{
      this.setData({
        isSubmit: true
      })
    })
    

  },
  /**
   * 获取小鹿家人状态
   */
  getInviteCode() {
    api.getInviteCode({}).then((res) => {
      if (res.code == 200 || res.code == 0) {
        if (res.data.status >0){
          this.setData({
            isExamine: true,
            id:res.data.id,
            name: res.data.consignee,
            phone: res.data.mobile,
            address: res.data.address,
            number: res.data.id_card_no,
            imgBg1: res.data.id_card_front,
            imgBg2: res.data.id_card_back,
            status_label: res.data.status_label,
            remark: res.data.remark
          })
          if (res.data.status == 3){
            this.setData({
              isExamine:false
            })
          }
        }
      }
    })
  },
})