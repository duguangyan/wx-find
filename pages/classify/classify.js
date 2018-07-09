// pages/classify/classify.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 0, // nav选择 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // 获取物料品类数据
    this.getCheckTypes();
    // 获取上一级传值
    let fromType = options.from;   // 1找料订单 2去送订单
    if (fromType==1){
      this.setData({
        fromType,
        indexType: options.index
      })
    } else if (fromType == 2){
      this.setData({
        fromType
      })
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
  // 获取物料类型数据
  getCheckTypes() {
    if (wx.getStorageSync('classifyList')){
      let classifyList = wx.getStorageSync('classifyList');
      this.setData({
        classifyList,
        classifyListChild: classifyList[0].list
      })
    }else{
      api.getCheckTypes({}).then((res) => {
        console.log(res);
        if (res.code == 200) {
          let classifyList = res.data;
          this.setData({
            classifyList,
            classifyListChild: classifyList[0].list
          })
          wx.setStorageSync('classifyList', classifyList);
          console.log(res);
        }
      })
    }
    
  },
  // 导航切换
  _navClick(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      navIndex: index,
      id: e.currentTarget.dataset.id,
      idname: e.currentTarget.dataset.name,
      classifyListChild: this.data.classifyList[index].list
    })
    
    
  },
  // 分类详情点击
  _childClick(e) {  
    // 添加active
    this.setData({
      childIndex: e.currentTarget.dataset.index,
      parentIndexX: e.currentTarget.dataset.parentindex
    })
    console.log(this.data.childIndex)
    if (!this.data.id) {
      this.data.id = this.data.classifyList[0].id;
      this.data.idname = this.data.classifyList[0].name;
    }
    let obj = {
      id1name: this.data.idname,
      id2name: e.currentTarget.dataset.parentname,
      id3name: e.currentTarget.dataset.idname,
      id1: this.data.id,
      id2: e.currentTarget.dataset.parent,
      id3: e.currentTarget.dataset.id
    }
    let checkType = '';
    checkType += obj.id1name + ">";
    checkType += obj.id2name + ">";
    checkType += obj.id3name;
    // checkType.push(obj.id1name);
    // checkType.push(obj.id2name);
    // checkType.push(obj.id3name);
    let cid = obj.id1 + ',' + obj.id2 + ',' + obj.id3;
    
    // 获取上一页
    let pages = getCurrentPages();
    let Page = pages[pages.length - 1];//当前页
    let prevPage = pages[pages.length - 2];  //上一个页面
    if (this.data.fromType == 1) {
      //设置上一页数据
      let addFinds = prevPage.data.addFinds; //取上页data里的数据也可以修改
      let index = parseInt(this.data.indexType);
      addFinds[index].checkType = checkType;
      addFinds[index].cid = cid;
      prevPage.setData({
        addFinds
      })
    } else if (this.data.fromType == 2){ 
      prevPage.setData({
        checkType,
        checkTypes_cid: cid
      })
    }

    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
    
  },
  // 关闭弹窗
  _closed() {
    this.triggerEvent("closed");
  }
})