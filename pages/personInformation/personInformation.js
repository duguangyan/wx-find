// pages/personInformation/personInformation.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo:'',
    address:''
  },
  /**
   * 编辑头像
   */
  editHeadImg(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        _this.uploadHeadImg(tempFilePaths);
      }
    })
  },
  /**
   * 上传头像
   */
  uploadHeadImg(file){
    let access_token = wx.getStorageSync("access_token");
    wx.uploadFile({
      url: `${api.apiUrl}/api/upload/simpleUpload`,
      filePath: file,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      formData: {
        'type': 'reward_img'
      },
      success: (res) => {
        console.log(res);
        var res = JSON.parse(res.data);
        if (200 === res.code) {
          this.data.memberInfo.avatar_path = res.data.full_url;
          this.setData({
            memberInfo : this.data.memberInfo
          })
        } else {
          util.errorTips('上传错误');
        }
      },
      fail(err) {
        util.errorTips('上传错误');
      }
    })
  },
  /**
   * 获取昵称
   */
  getNickName(e){
    this.data.memberInfo.nick_name = e.detail.value;
  },
  /**
   * 获取联系人
   */
  getPersonName(e){
    this.data.memberInfo.contact_name = e.detail.value;
  },
  /**
   * 获取联系手机
   */
  getPersonPhone(e){
    this.data.memberInfo.contact_phone = e.detail.value;
  },
  /**
   * 获取公司名称
   */
  getCompanyName(e){
    this.data.memberInfo.company_name = e.detail.value;
  },
  /**
   * 获取公司地址
   */
  getCompanyAddress(){
    wx.setStorageSync('personInformation', JSON.stringify(this.data.memberInfo));
    wx.navigateTo({
      url: '../consigneeAddress/consigneeAddress?from=personInformation',
    })
  },
  /**
   * 保存
   */
  save() {
    if (!this.data.memberInfo.avatar_path || this.data.memberInfo.avatar_path=="") {
      util.errorTips('请上传头像');
      return false;
    }
    if (!this.data.memberInfo.nick_name || this.data.memberInfo.nick_name==null){
      util.errorTips('请填写昵称');
      return false;
    }
    if (!this.data.memberInfo.contact_name || this.data.memberInfo.contact_name==null) {
      util.errorTips('请填写联系人');
      return false;
    }
    if (!this.data.memberInfo.contact_phone || this.data.memberInfo.contact_phone==null) {
      util.errorTips('请填写联系电话');
      
      return false;
    }

    if (!util.vailPhone(this.data.memberInfo.contact_phone)) {
      util.errorTips('请填写正确的联系电话');
      return false;
    }
    
    if (!this.data.memberInfo.company_name || this.data.memberInfo.company_name==null) {
      util.errorTips('请填写公司名称');
      return false;
    }
    if (!this.data.memberInfo.company_address || this.data.memberInfo.company_address == "" || this.data.memberInfo.company_address==null) {
      util.errorTips('请填写公司地址');
      return false;
    }
    /**
     * todo 保存信息并返回上一级
     */
    let data = {
      nick_name: this.data.memberInfo.nick_name,
      avatar_path: this.data.memberInfo.avatar_path,
      contact_name: this.data.memberInfo.contact_name,
      contact_phone: this.data.memberInfo.contact_phone,
      company_name: this.data.memberInfo.company_name,
      company_address: this.data.memberInfo.company_address
    }
    let method = 'POST';
    api.updateExt({
      method,
      data
    }).then((res)=>{
      wx.removeStorageSync('personInformation');
      if(res.code==200){
        wx.navigateBack({
          delta: 1
        })
      }else{
        util.errorTips(res.msg);
      }
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    
  },
  // 获取用户信息
  getUserInfo() {
    console.log('userInfo');
    // 用于注册返回更新用户状态
    api.memberInfo({

    }).then((res) => {
      console.log('用户信息 = ', res);
      if (res.code == 200) {
        this.setData({
          memberInfo: res.data
        })
      }

    }).catch((res) => {
      
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
    let personInformation = wx.getStorageSync('personInformation');
    if (personInformation){
      this.data.memberInfo = JSON.parse(personInformation);
      if (this.data.address){
        this.data.memberInfo.company_address = this.data.address;
      }
      this.setData({
        memberInfo: this.data.memberInfo
      })
    }else{
      this.getUserInfo();
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