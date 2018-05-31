var app = getApp()
const api = require('../../utils/api.js');
Page({
  data: {
    finds:[],
    fetchs:[],
    startX: 0, //开始坐标
    startY: 0,
    findsCheckAll:true, //找料全选按钮
    fetchsCheckAll:true,
    isCheckAll:true
  },
  onLoad: function () {
    
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) { 
    let nav = e.currentTarget.dataset.nav;
    if(nav == 1){
      //开始触摸时 重置所有删除
      this.data.finds.forEach(function (v, i) {
        if (v.isTouchMove)//只操作为true的
          v.isTouchMove = false;
      })
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        finds: this.data.finds
      })
    }else{
      //开始触摸时 重置所有删除
      this.data.fetchs.forEach(function (v, i) {
        if (v.isTouchMove)//只操作为true的
          v.isTouchMove = false;
      })
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        fetchs: this.data.fetchs
      })
    }
    
  },
  //滑动事件处理
  touchmove: function (e) {
    let nav = e.currentTarget.dataset.nav;
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

      if(nav == 1){
        that.data.finds.forEach(function (v, i) {
          v.isTouchMove = false
          //滑动超过30度角 return
          if (Math.abs(angle) > 30) return;
          if (i == index) {
            if (touchMoveX > startX) //右滑
              v.isTouchMove = false
            else //左滑
              v.isTouchMove = true
          }
        })
        //更新数据
        that.setData({
          finds: that.data.finds
        })
      }else{
        that.data.fetchs.forEach(function (v, i) {
          v.isTouchMove = false
          //滑动超过30度角 return
          if (Math.abs(angle) > 30) return;
          if (i == index) {
            if (touchMoveX > startX) //右滑
              v.isTouchMove = false
            else //左滑
              v.isTouchMove = true
          }
        })
        //更新数据
        that.setData({
          fetchs: that.data.fetchs
        })
      }
    
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    let index = e.currentTarget.dataset.index,
        nav   = e.currentTarget.dataset.nav,
        id    = e.currentTarget.dataset.id,
        _this = this;

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
          if(nav == 1){
            _this.data.finds.splice(index, 1);
          }else{
            _this.data.fetchs.splice(index, 1);
          }
          
          _this.setData({
            finds: _this.data.finds,
            fetchs: _this.data.fetchs
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
  onShow: function () { 
    // 页面显示  
    this.init();
  },
  init() {
    this.setData({
      finds: [],
      fetchs: [],
      isData: true
    })
    wx.showLoading({
      title: '加载中',
    })
    api.getTaskInit({}, '0').then((res) => {
      if (res.code == 200) {
        console.log(res);
        let finds = res.data.find;
        let fetchs = res.data.fetch;
        finds.forEach(function (v, i) {
            v.isTouchMove    = false;
            finds[i].address = JSON.parse(finds[i].address);
            finds[i].check   = true;
        })
        fetchs.forEach(function (v, i) {
          v.isTouchMove     = false;
          fetchs[i].address = JSON.parse(fetchs[i].address); 
          fetchs[i].check    = true;
        })
        this.setData({
          finds,
          fetchs
        })

        // 计算价格
        this.doSumPrice();
      }
      wx.hideLoading();
    })
  },
  // 计算合计金额
  doSumPrice() {
    let finds = this.data.finds;
    let fetchs = this.data.fetchs;
    let findsSumPrice = 0;
    let fetchsSumPrice = 0;
    for (let i = 0; i < finds.length; i++) {
      if (finds[i].check) {
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
      findsSumPrice,
      fetchsSumPrice,
      sumPrice: this.data.sumPrice
    })
    console.log(this.data.sumPrice);
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
  // parent checkBox choose
  parentCheck(e){ 
    let nav = e.currentTarget.dataset.nav;
    // 1 is finds  2 is fetch
    if(nav == 1){
      if (this.data.findsCheckAll){
        this.data.findsCheckAll = false;
        this.dataForEach(this.data.finds,false);
      }else{
        this.data.findsCheckAll = true;
        this.dataForEach(this.data.finds, true);
      }
    }else{
      if (this.data.fetchsCheckAll) {
        this.data.fetchsCheckAll = false;
        this.dataForEach(this.data.fetchs, false);
      } else {
        this.data.fetchsCheckAll = true;
        this.dataForEach(this.data.fetchs, true);
      } 
    }
    this.setData({
      finds:this.data.finds,
      fetchs: this.data.fetchs,
      findsCheckAll: this.data.findsCheckAll,
      fetchsCheckAll: this.data.fetchsCheckAll
    })
    this.doSumPrice();
  },
  // traversal data
  dataForEach(obj,bool){ 
    obj.forEach((v,i)=>{
      v.check = bool
    })
  },
  // all checkbox choosed
  doCheckAll(){
    if (this.data.isCheckAll){
      this.data.isCheckAll     = false;
      this.data.findsCheckAll  = false;
      this.data.fetchsCheckAll = false;
      this.dataForEach(this.data.finds,false);
      this.dataForEach(this.data.fetchs, false);
    }else{
      this.data.isCheckAll = true;
      this.data.findsCheckAll = true;
      this.data.fetchsCheckAll = true;
      this.dataForEach(this.data.finds, true);
      this.dataForEach(this.data.fetchs, true);
    }
    this.verdictAllCheck();
    this.setData({
      isCheckAll: this.data.isCheckAll,
      findsCheckAll: this.data.findsCheckAll,
      fetchsCheckAll: this.data.fetchsCheckAll,
      finds: this.data.finds,
      fetchs: this.data.fetchs
    })
    this.doSumPrice();
  },
  // children check 
  childCheck(e){
    // get nav  and index
    let nav   = e.currentTarget.dataset.nav,
        index = e.currentTarget.dataset.index;
        // this is finds items
    if(nav == 1){
      if (this.data.finds[index].check){
        this.data.finds[index].check = false;
        this.data.findsCheckAll      = false;
        this.data.isCheckAll         = false;
      }else{
        this.data.finds[index].check = true;
        if (this.verdictItemsWasAllCheck(this.data.finds)){
          this.data.findsCheckAll = true
        }
      } 
    }else{  // this is fetchs items
      if (this.data.fetchs[index].check) {
        this.data.fetchs[index].check = false;
        this.data.fetchsCheckAll = false;
        this.data.isCheckAll = false;
      } else {
        this.data.fetchs[index].check = true;
        if (this.verdictItemsWasAllCheck(this.data.fetchs)) {
          this.data.fetchsCheckAll = true
        }
      } 
    }
    this.verdictAllCheck();
    // updata dates
    this.setData({
      finds: this.data.finds,
      fetchs:this.data.fetchs,
      findsCheckAll: this.data.findsCheckAll,
      fetchsCheckAll: this.data.fetchsCheckAll,
      isCheckAll: this.data.isCheckAll
    })
    this.doSumPrice();

  },
  // verdict  item was all check
  verdictItemsWasAllCheck(obj){ 
    let n = 0;
    for(let i=0;i<obj.length;i++){
      if(obj[i].check){
        n++
      }
    }
    if (n == obj.length) {
      return true
    } else {
      return false
    }
  },
  // verdict  all items was all check
  verdictAllCheck(){
    if (this.data.findsCheckAll && this.data.fetchsCheckAll){
      this.data.isCheckAll = true
    }else{
      this.data.isCheckAll = false
    }
  },
  // 点击结算
  saveTask() {
    let newFinds = [];
    let newFetchs = [];
    let task_ids = [];
    // 刷选选中的找料任务
    for (let i = 0; i < this.data.finds.length; i++) {
      if (this.data.finds[i].check) {
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
  },
  // 判断是否还有数据
  isHasData() {
    if (this.data.finds.length <= 0 && this.data.fetchs.length <= 0) {
      this.setData({
        isData: true,
      })
    }
  },
  // edit
  edit(e){

    let item = JSON.stringify(e.currentTarget.dataset.item),
       index = e.currentTarget.dataset.index,
       nav   = e.currentTarget.dataset.nav;
       if(nav == 1){
         wx.navigateTo({
           url: '../findEdit/findEdit?item=' + item + "&index=" + index
         })
       }else{
         wx.navigateTo({
           url: '../fecthEdit/fecthEdit?item=' + item + "&index=" + index
         })
       }
   

  }
})