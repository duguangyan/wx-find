// component/classify/classify.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classifyList: {
      type: null,
      value: true
    },
    classifyListChild: {
      type: null,
      value: true
    },
    isCheckTypeModel:{
      type: null,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navIndex:0, // nav选择 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 导航切换
      _navClick(e){
        this.setData({
          navIndex: e.currentTarget.dataset.index,
          id: e.currentTarget.dataset.id,
          idname: e.currentTarget.dataset.name
        })
        let obj = {
          index: this.data.navIndex
        }
        this.triggerEvent("navClick", obj);
      },
    // 分类详情点击
      _childClick(e){ 
        if(!this.data.id){
          this.data.id = this.properties.classifyList[0].id
          this.data.idname = this.properties.classifyList[0].name
        }
        let obj = {
          id1name: this.data.idname,
          id2name: e.currentTarget.dataset.parentname,
          id3name: e.currentTarget.dataset.idname,
          id1 : this.data.id,
          id2: e.currentTarget.dataset.parent,
          id3 : e.currentTarget.dataset.id
        }
        this.triggerEvent("childClick", obj);
      },
      // 关闭弹窗
      _closed(){
        this.triggerEvent("closed");
      }
  }
})
