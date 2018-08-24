const api = require('../../utils/api.js');
let firstIn = true;
let app = new getApp();
var pages = getCurrentPages();
var currPage = pages[pages.length - 1];   //当前页面
var prevPage = pages[pages.length - 2];  //上一个页面
Page({

    /**
     * 页面的初始数据
     */
    data: {
      checkIndex:-1
    },
    // 设为默认
    setDefault(e) {
        console.log(e)
        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;
        api.setDefaultAddress({
            method:'POST',
            data: {
                address_id: id
            }
        }).then((res) => { 
            console.log(res.data);
            // app.globalData.addressChecked = res.data;
            // // 默认地址
            // var pages = getCurrentPages();
            // var currPage = pages[pages.length - 1];   //当前页面
            // var prevPage = pages[pages.length - 2];  //上一个页面
            // this.data.addFinds[app.globalData.addressIndex].address = res.data;

            // prevPage.setData({
            //   defaultAddress: res.data,
            //   addFinds: this.data.addFinds
            // })
          
            let addressList = this.data.addressList;
            addressList.forEach((ele) => {
                if (ele.is_default == 1) {
                    ele.is_default = 0;
                }
            })
            addressList[index].is_default = 1;
            this.setData({
                addressList
            })

            wx.showToast({
                title: '已设为默认地址',
            })
        }).catch(() => {

        })
    },
    // 点击选中地址返回
     goBlack (e) { 
       this.setData({
         checkIndex: e.currentTarget.dataset.index
       })
       if (this.data.center){
         return false;
       }
       // 获取当前点击地址数据
       let item = e.currentTarget.dataset.item;
       wx.setStorageSync('addressCheckedId', item.id);
       this.navigateBack(item);
     },
     // 返回上一级
     navigateBack(item) {
       if (this.data.hasFormfetch) {
         wx.setStorageSync('fetchsAddress', item);
         // 更新上一页的地址数据  来自找料任务页面
         let pages = getCurrentPages();
         let currPage = pages[pages.length - 1];   //当前页面
         let prevPage = pages[pages.length - 2];  //上一个页面
         prevPage.setData({
           get_address:item.id,
           defaultAddress: item
         })
       } else if (this.data.hasFormFind) {
         wx.setStorageSync('findsAddress', item);
         // 更新上一页的地址数据  来自找料任务页面
         let pages = getCurrentPages();
         let currPage = pages[pages.length - 1];   //当前页面
         let prevPage = pages[pages.length - 2];   //上一个页面
         
         this.data.addFinds[app.globalData.addressIndex].address = item;
         this.data.addFinds[app.globalData.addressIndex].get_address = item.id;
         prevPage.setData({
           addFinds: this.data.addFinds,
           //defaultAddress:item
         })
       } else if (this.data.taskPayIndex) {
         // 更新上一页的地址数据  来自订单支付页面
         let pages = getCurrentPages();
         let currPage = pages[pages.length - 1];   //当前页面
         let prevPage = pages[pages.length - 2];  //上一个页面
         if (this.data.taskPayIndex == 1) {
           wx.setStorageSync('findsAddress', item);
           prevPage.setData({
             findsAddress: item
           })
         } else if (this.data.taskPayIndex == 2) {
           wx.setStorageSync('fetchsAddress', item);
           prevPage.setData({
             fetchsAddress: item
           })
         }
       }
       // 返回上一页
       wx.navigateBack({
         delta: 1
       })
     },
    // 编辑
    edit(e) {
        let id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: `../newAddress/newAddress?type=edit&id=${id}`,
        })
    },

    // 删除
    del(e) {
        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;

        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            confirmColor: '#C81A29',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定');
                    // 确定删除
                    api.deleteAddress({
                      method: 'DELETE'
                    },id).then((res) => {

                        wx.showToast({
                            title: '删除成功',
                        })
                        // 获取列表数据
                        this.getAddressListData();


                    }).catch(() => {

                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })




    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
      let taskId = options.id;
      this.setData({
        taskId
      })
      // 来自个人中心
      if (options.center){
        this.data.center = options.center;
      }
      // 来自取料
      if(options.fetchs){
        this.setData({
          hasFormfetch: true
        })
        console.log('获取上一级fetch数据');
        console.log(this.data.hasFormfetch);
      }
      // 来自找料
      if (options.addFinds){
        var addFinds = JSON.parse(options.addFinds);
        this.setData({
          addFinds,
          hasFormFind:true
        })
        console.log('获取上一级addFinds数据');
        console.log(this.data.addFinds);
      }
      // 来自支付中心
      if (options.taskPayIndex){ 
        this.setData({
          taskPayIndex: options.taskPayIndex
        })

      }
      
        // 获取列表数据
        if (firstIn) {
            this.getAddressListData();

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
      
      

        // 获取列表数据
        if (!firstIn) {
            this.getAddressListData();
        }
        firstIn = false;

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

    // 获取收货地址列表数据
    getAddressListData() {

  //      wx.showNavigationBarLoading();
        wx.showLoading({
          title: '加载中',
        })
        api.listAddress({

        }).then((res) => {

            console.log('地址执行'); 
            console.log(res);
            let addressList = res.data;

            let isEmpty = addressList.length == 0 ? true : false;

           
              for (let i = 0; i < addressList.length;i++){
                if (this.data.taskId == addressList[i].id){
                  this.data.checkIndex = i;
                }
              }
            


            this.setData({
                addressList,
                isEmpty,
                checkIndex: this.data.checkIndex
            })
          wx.hideLoading();
        }).catch((res) => {
          wx.hideLoading();
        }).finally(() => {
          wx.hideLoading();
          // wx.hideNavigationBarLoading()
        })

    }
})