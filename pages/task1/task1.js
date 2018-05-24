
const api = require('../../utils/api.js');
var initdata = function (that) {
  var finds = that.data.finds;
  for (var i = 0; i < finds.length; i++) {
    finds[i].txtStyle = "";
  }
  that.setData({ finds: finds })
}
var initdataFetch = function (that) {
  var fetchs = that.data.fetchs;
  for (var i = 0; i < fetchs.length; i++) {
    fetchs[i].txtStyle = "";
  }
  that.setData({ fetchs: fetchs })
}

Page({
  data: {
    sumPrice:'',
    isCheckAll:true, // 结算全选
    delBtnWidth: 180,//删除按钮宽度单位（rpx）  
    taskDates: '',  // 任务中心所有数据
    fetchs: '',     // 找料任务列表
    finds: '',      // 取料任务
    list: [
      {
        txtStyle: "",
        icon: "/images/qcm.png",
        txt: "指尖快递"
      },
      {
        txtStyle: "",
        icon: "/images/qcm.png",
        txt: "指尖快递"
      }

    ]
  },
  //初始话任务中心数据
  init() {
    api.getTaskInit({}, '0').then((res) => {
      if (res.code == 200) {
        let finds = res.data.find;
        finds[0].checkAll = true;
        let fetchs = res.data.fetch;
        fetchs[0].checkAll = true;
        for(let i=0;i<finds.length;i++){
          finds[i].txtStyle = '';
          finds[i].check = true;
          if (finds[i].form_data.find_type=='1'){
            finds[i].form_data.find_type_name = '按图找料'
          } else if (finds[i].form_data.find_type == '2'){
            finds[i].form_data.find_type_name = '按样找料'
          } else if (finds[i].form_data.find_type == '3'){
            finds[i].form_data.find_type_name = '按描述找料'
          }else{
            finds[i].form_data.find_type_name = '暂无数据'
          }
        }
        for (let i = 0; i < fetchs.length; i++) {
          fetchs[i].txtStyle = '';
          fetchs[i].check = true;
        }
        this.setData({
          taskDates: res.data,
          fetchs: fetchs,
          finds: finds
        })
        // 统计合计金额
        this.doSumPrice();
      }
    })
  },
  onLoad: function (options) {
    // 初始化数据
    this.init();
    // 页面初始化 options为页面跳转所带来的参数  
    this.initEleWidth();
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var finds = this.data.finds;
      finds[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        finds: finds
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var finds = this.data.finds;
      finds[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        finds: finds
      });
    }
  },

  //fetch

  touchSfetch: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchMfetch: function (e) {
    var that = this
    initdataFetch(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var fetchs = this.data.fetchs;
      fetchs[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        fetchs: fetchs
      });
    }
  },

  touchEfetch: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var fetchs = this.data.fetchs;
      fetchs[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        fetchs: fetchs
      });
    }
  },

  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件  
  delItemFind: function (e) {
    let _this = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          api.delTask({ method: 'DELETE' }, id).then((res)=>{
            console.log(res);
            if(res.code==200){
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })
            }
          })
          //更新列表的状态  
          _this.data.finds.splice(index,1);
          _this.setData({
            finds: _this.data.finds
          });
          // 统计合计金额
          this.doSumPrice();
        } else {
          initdata(_this)
        }
      }
    })

  },
  //fetchs点击删除按钮事件
  delItemFetch: function (e) {
    let _this = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          api.delTask({ method: 'DELETE' }, id).then((res) => {
            console.log(res);
            if (res.code == 200) {
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })
            }
          })
          //更新列表的状态  
          _this.data.fetchs.splice(index,1);
          _this.setData({
            fetchs: _this.data.fetchs
          });
          // 统计合计金额
          this.doSumPrice();
        } else {
          initdataFetch(_this)
        }
      }
    })

  },
  // 遍历 
  selectCheckForEarch (obj,bool) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].check = bool
    }
  },
  // finds找料任务全选切换
  findCheckAll  (e)  {
    if (e.target.dataset.check == "true"){
      this.data.finds[0].checkAll = false;
      this.selectCheckForEarch(this.data.finds,false);
    }else{
      this.data.finds[0].checkAll = true;
      this.selectCheckForEarch(this.data.finds, true);
    }
    this.setData({
      finds: this.data.finds
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
  }, 
  // 找料任务单个任务切换
  findCheck (e) {
    let index = e.target.dataset.index;
    if(this.data.finds[index].check){
      this.data.finds[index].check = false;
      this.data.finds[0].checkAll = false;
    }else{
      this.data.finds[index].check = true;
      let num = 0;
      for (let i = 0; i < this.data.finds.length; i++) {
        if (this.data.finds[i].check){
         num++;
        }
      }
      if (num == this.data.finds.length){
        this.data.finds[0].checkAll = true;
      }
    }
    this.setData({
      finds:this.data.finds
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
    console.log(index);
  },
// fetch找料任务全选切换
  fetchCheckAll  (e)  {
    if(e.target.dataset.check == "true") {
      this.data.fetchs[0].checkAll = false;
      this.selectCheckForEarch(this.data.fetchs, false);
    }else{
      this.data.fetchs[0].checkAll = true;
      this.selectCheckForEarch(this.data.fetchs, true);
    }
    this.setData({
      fetchs: this.data.fetchs
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
  }, 
  // 取料任务单个任务切换
  fetchCheck(e) {
    let index = e.target.dataset.index;
    if (this.data.fetchs[index].check) {
      this.data.fetchs[index].check = false;
      this.data.fetchs[0].checkAll = false;
    } else {
      this.data.fetchs[index].check = true;
      let num = 0;
      for (let i = 0; i < this.data.fetchs.length; i++) {
        if (this.data.fetchs[i].check) {
          num++;
        }
      }
      if (num == this.data.fetchs.length) {
        this.data.fetchs[0].checkAll = true;
      }
    }
    this.setData({
      fetchs: this.data.fetchs
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
    console.log(index);
  },

  //结算全选
  checkAll (e) {
    let check = e.target.dataset.check;
    if (check == 'true'){
      this.data.isCheckAll = false;
      this.selectCheckForEarch(this.data.finds, false);
      this.data.finds[0].checkAll = false;
      this.selectCheckForEarch(this.data.fetchs, false);
      this.data.fetchs[0].checkAll = false;
      this.setData({
        isCheckAll: this.data.isCheckAll,
        finds: this.data.finds,
        fetchs: this.data.fetchs
      })
    }else{
      this.data.isCheckAll = true;
      this.selectCheckForEarch(this.data.finds, true);
      this.data.finds[0].checkAll = true;
      this.selectCheckForEarch(this.data.fetchs, true);
      this.data.fetchs[0].checkAll = true;
      this.setData({
        isCheckAll: this.data.isCheckAll,
        finds: this.data.finds,
        fetchs: this.data.fetchs
      })
    }
    // 统计合计金额
    this.doSumPrice();
  },
  // 判断是否全部全选
  judgeIsAllCheck () {
    let finds = this.data.finds;
    let fetchs = this.data.fetchs;
    if (finds[0].checkAll && fetchs[0].checkAll){
      this.data.isCheckAll = true
    }else{
      this.data.isCheckAll = false
    }
    this.setData({
      isCheckAll: this.data.isCheckAll
    })
  },
  // 计算合计金额
  doSumPrice () {
    let finds = this.data.finds;
    let fetchs = this.data.fetchs;
    let findsSumPrice = 0;
    let fetchsSumPrice = 0;
    for (let i = 0; i < finds.length; i++){
      if(finds[i].check){
        findsSumPrice += parseInt(finds[i].form_data.fee)
      }
    }
    for (let i = 0; i < fetchs.length; i++) {
      if (fetchs[i].check) {
        fetchsSumPrice += parseInt(fetchs[i].form_data.fee)
      }
    }
    this.data.sumPrice = findsSumPrice + fetchsSumPrice;
    this.setData({
      sumPrice: this.data.sumPrice
    })
    console.log(this.data.sumPrice);
  },
  // 点击结算
  saveTask () {
    let data = {};
    console.log(this.data.finds);
    console.log(this.data.fetchs);
    // api.saveTask({ method: 'POST',data }, id).then((res) => {
    //   console.log(res);
    //   if (res.code == 200) {
        
    //   }
    // })
  }
})  