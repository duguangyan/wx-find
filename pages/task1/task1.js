
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
    findsCheckAll:true,
    fetchsCheckAll:true,
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
  // 统计价格
  doTotalPrice(){
    let finds = this.data.finds,
      fetchs = this.data.fetchs;
    this.data.totalFindsPrice = 0;
    this.data.totalFetchsPrice= 0;
    for (let i = 0; i < finds.length;i++){
      this.data.totalFindsPrice += finds[i].form_data.fee;
    }
    for (let i = 0; i < fetchs.length; i++) {
      this.data.totalFetchsPrice += fetchs[i].form_data.fee;
    }
    this.setData({
      totalFindsPrice  : this.data.totalFindsPrice,
      totalFetchsPrice : this.data.totalFetchsPrice
    })
  },
  // 返回首页
  goIndex(){
    console.log('index');
    wx.switchTab({
      url: '../index/index'
    })
  },
  //初始话任务中心数据
  init() { 
    this.setData({
      finds: [],
      fetchs: [],
      isData:true
    })
    wx.showLoading({
      title: '加载中',
    })
    api.getTaskInit({}, '0').then((res) => {  
    
      if (res.code == 200) {
        
        if (res.data.find.length <= 0 && res.data.fetch.length<=0 ){
          this.setData({
            isData: true,
          })
        }else{
          this.setData({
            isData: false,
          })
        }
        this.setData({
          taskDates: res.data,
        })
        let finds = res.data.find;
        let fetchs = res.data.fetch;
        if (res.data.find.length>0){
          finds = res.data.find;
          this.data.findsCheckAll = true;
          this.data.totalFindsPrice = 0;
          for (let i = 0; i < finds.length; i++) {
            // 获取总价格
            this.data.totalFindsPrice += finds[i].form_data.fee;
            finds[i].txtStyle = '';
            finds[i].check = true;
            // 判断地址是否为空
            if (finds[i].address==''){
              finds[i].address = finds[i].address;
            }else{
              finds[i].address = JSON.parse(finds[i].address);
            }
            
            if (finds[i].form_data.find_type == '1') {
              finds[i].form_data.find_type_name = '按图找料'
            } else if (finds[i].form_data.find_type == '2') {
              finds[i].form_data.find_type_name = '按样找料'
            } else if (finds[i].form_data.find_type == '3') {
              finds[i].form_data.find_type_name = '按描述找料'
            } else {
              finds[i].form_data.find_type_name = '暂无数据'
            }
          }
          this.setData({
            finds: finds,
            findsCheckAll: this.data.findsCheckAll,
            totalFindsPrice: this.data.totalFindsPrice
          })
        }
        if (res.data.fetch.length > 0){
          fetchs = res.data.fetch;
          this.data.fetchsCheckAll = true;
          this.data.totalFetchsPrice = 0;
          for (let i = 0; i < fetchs.length; i++) {
            // 获取总价格
            this.data.totalFetchsPrice += fetchs[i].form_data.fee;
            fetchs[i].txtStyle = '';
            fetchs[i].check = true;
            if (fetchs[i].address){
              fetchs[i].address = JSON.parse(fetchs[i].address);
            }
            
          }
          this.setData({
            fetchs: fetchs,
            fetchsCheckAll: this.data.fetchsCheckAll,
            totalFetchsPrice: this.data.totalFetchsPrice
          })
        }
        // 统计合计金额
        this.doSumPrice();
      }else{
        this.setData({
          isData: true,
        })
      }
      wx.hideLoading();
    })
  },
  // 点击找料修改
  findEdit(e) {
    
    let item = JSON.stringify(e.currentTarget.dataset.item);
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../findEdit/findEdit?item=' + item + "&index=" + index,
    })
    console.log(item);
  },
  // 点击取料修改
  fetchEdit(e){ 
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../fecthEdit/fecthEdit?item=' + item,
    })
    console.log(item);
  },
  onLoad: function (options) {
    // 初始化数据
    // this.init();
    // 页面初始化 options为页面跳转所带来的参数  
    this.initEleWidth();
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
    this.init();
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
      var nav = e.target.dataset.nav;
      if (index >= 0) {
        if (nav == 1) {
          this.data.finds[index].txtStyle = txtStyle;
          //更新列表的状态  
          this.setData({
            finds: this.data.finds
          });
        } else {
          this.data.fetchs[index].txtStyle = txtStyle;
          //更新列表的状态  
          this.setData({
            fetchs: this.data.fetchs
          });
        }
      }
      
      
    }
  },
 
  touchE: function (e) { 
    console.log(this.data.finds);
    console.log(this.data.fetchs);
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
      var nav = e.target.dataset.nav;
      if (index >= 0) {
        if (nav == 1) {
          this.data.finds[index].txtStyle = txtStyle;
          //更新列表的状态  
          this.setData({
            finds: this.data.finds
          });
        } else {
          this.data.fetchs[index].txtStyle = txtStyle;
          //更新列表的状态  
          this.setData({
            fetchs: this.data.fetchs
          });
        }
      }
     
      
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
          _this.doSumPrice();
          // 判断是否还有数据
          _this.isHasData();
          // 统计小计金额
          _this.doTotalPrice();
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
          _this.doSumPrice();
          // 判断是否还有数据
          _this.isHasData();
          // 统计小计金额
          _this.doTotalPrice();
        } else {
          initdataFetch(_this)
        }
      }
    })

  },

  // 判断是否还有数据
  isHasData(){
    if (this.data.finds.length <= 0 && this.data.fetchs.length <= 0) {
      this.setData({
        isData: true,
      })
    }
  },
  // 遍历 
  selectCheckForEarch (obj,bool) {
    for (let i = 0; i < obj.length; i++) {
      obj[i].check = bool
    }
  },
  // finds找料任务全选切换
  findCheckAll  (e)  {
    if (e.target.dataset.check=='1'){
      this.data.findsCheckAll = false;
      this.selectCheckForEarch(this.data.finds,false);
    } else if (e.target.dataset.check == '2'){
      this.data.findsCheckAll = true;
      this.selectCheckForEarch(this.data.finds, true);
    }
    this.setData({
      finds: this.data.finds,
      findsCheckAll: this.data.findsCheckAll
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
  }, 
  // 找料任务单个任务切换
  findCheck (e) {
    let num = 0;
    let index = e.target.dataset.index;
    if(this.data.finds[index].check){
      this.data.finds[index].check = false;
      this.data.findsCheckAll = false;
    }else{
      this.data.finds[index].check = true;
      
      for (let i = 0; i < this.data.finds.length; i++) {
        if (this.data.finds[i].check){
         num++;
        }
      }
      if (num == this.data.finds.length){
        this.data.findsCheckAll = true;
      }
    }
    this.setData({
      finds:this.data.finds,
      findsCheckAll: this.data.findsCheckAll
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
    console.log(index);
  },
// fetch找料任务全选切换
  fetchCheckAll  (e)  {
    if(e.target.dataset.check == "1") {
      this.data.fetchsCheckAll = false;
      this.selectCheckForEarch(this.data.fetchs, false);
    } else if (e.target.dataset.check == "2"){
      this.data.fetchsCheckAll = true;
      this.selectCheckForEarch(this.data.fetchs, true);
    }
    this.setData({
      fetchs: this.data.fetchs,
      fetchsCheckAll: this.data.fetchsCheckAll
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
  }, 
  // 取料任务单个任务切换
  fetchCheck(e) {
    let num = 0;
    let index = e.target.dataset.index;
    if (this.data.fetchs[index].check) {
      this.data.fetchs[index].check = false;
      this.data.fetchsCheckAll = false;
    } else {
      this.data.fetchs[index].check = true;

      for (let i = 0; i < this.data.fetchs.length; i++) {
        if (this.data.fetchs[i].check) {
          num++;
        }
      }
      if (num == this.data.fetchs.length) {
        this.data.fetchsCheckAll = true;
      }
    }
    this.setData({
      fetchs: this.data.fetchs,
      fetchsCheckAll: this.data.fetchsCheckAll
    })
    this.judgeIsAllCheck();
    // 统计合计金额
    this.doSumPrice();
    console.log(index);
  },

  //结算全选
  doCheckAll (e) {
    let check = e.target.dataset.check;
    if (check == '1'){
      this.data.isCheckAll = false;
      this.selectCheckForEarch(this.data.finds, false);
      this.data.findsCheckAll = false;
      this.selectCheckForEarch(this.data.fetchs, false);
      this.data.fetchsCheckAll = false;
      this.setData({
        isCheckAll: this.data.isCheckAll,
        finds: this.data.finds,
        fetchs: this.data.fetchs,
        findsCheckAll: this.data.findsCheckAll,
        fetchsCheckAll: this.data.fetchsCheckAll
      })
    } else if (check == '2'){
      this.data.isCheckAll = true;
      this.selectCheckForEarch(this.data.finds, true);
      this.data.findsCheckAll = true;
      this.selectCheckForEarch(this.data.fetchs, true);
      this.data.fetchsCheckAll = true;
      this.setData({
        isCheckAll: this.data.isCheckAll,
        finds: this.data.finds,
        fetchs: this.data.fetchs,
        findsCheckAll: this.data.findsCheckAll,
        fetchsCheckAll: this.data.fetchsCheckAll
      })
    }
    // 统计合计金额
    this.doSumPrice();
  },
  // 判断是否全部全选
  judgeIsAllCheck () {
    if (this.data.findsCheckAll && this.data.fetchsCheckAll){
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
    console.log(this.data.finds);
    console.log(this.data.fetchs);
    let newFinds = [];
    let newFetchs = [];
    let task_ids =[];
    // 刷选选中的找料任务
    for (let i = 0; i < this.data.finds.length;i++){
      if (this.data.finds[i].check){
        newFinds.push(this.data.finds[i]);
        task_ids.push(this.data.finds[i].id);
      }
    }
    // 刷选选中的取料任务
    for (let j = 0; j < this.data.fetchs.length; j++) {
      if (this.data.fetchs[j].check) {
        newFetchs.push(this.data.fetchs[j]);
        task_ids.push(this.data.fetchs[j].id);
      }
    }
    let taskPayList = { 
      task_ids: task_ids,
      finds: newFinds,
      fetchs: newFetchs
    }
    wx.setStorageSync('taskPayList', taskPayList);

    wx.navigateTo({
      url: '../taskPay/taskPay'
    })

    // api.saveTask({ method: 'POST',data }, id).then((res) => {
    //   console.log(res);
    //   if (res.code == 200) {
        
    //   }
    // })
  }
})  