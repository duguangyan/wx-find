const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
let interval = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkTypeIndex:0,// 第几个
        isCheckTypeModel:false, // 分类model
        classifyList:'', // 分类列表
        isResNotes:false, // 是否还要显示
        isNotes:true, // 找料须知弹窗
        isAddShow:'true',
        interval:'',
        payNum:10, // 支付倒计时
        isPopup:false, // 弹窗控制
        addressIndex:'', // 地址索引
        descValue: '', // 描述
        files: [{}, {}, {}], // 图片
        selcetTabNum: 1, // 找料方式切换 
        checkTypes:[], // 物料类型数据
        checkTypes_cid: [], // 物料类型数据 cid
        checkType: '', 
        isSelect: false, // 下拉显示按描述找料
        selcetSecondTabNum: '1', //  上门  寄送地址切换
        get_type:'1', //寄送地址切换
        addFinds: [{ index: 0, checkType: '', selcetTabNum: 1, find_type: '1', selcetSecondTabNum: '1', isSelect: false, desc: '', cid:'', files: [{}, {}, {}],address:{}}]
    },

    //  联系我们电话
    contact() {
      wx.makePhoneCall({
        phoneNumber: '400-8088-156'
      })
    },
    //须知弹窗是否继续显示 
    checkIsResNotes(){
      this.setData({
        isResNotes: !this.data.isResNotes
      })
      if (this.data.isResNotes){
        wx.setStorageSync('isFindNotes',true);
      }else{
        wx.removeStorageSync('isFindNotes');
      }

    },
    // 收货地址
    getSelectedAddress() {
      let _this = this;
      // if (wx.getStorageSync('defaultAddress')){
      //   let defaultAddress = wx.getStorageSync('defaultAddress');
      //   let findsAddress = defaultAddress;
      //   let fetchsAddress = defaultAddress;
      //   _this.setData({
      //     findsAddress,
      //     fetchsAddress
      //   })
      //   return false;
      // }
      // 获取默认地址
      api.defaultAddress({
      }, 1).then((res) => {
        if (res.code == 200) {
          let defaultAddress = res.data;
          wx.setStorageSync('defaultAddress', res.data)
          // 可能位空数组
          if (Array.isArray(defaultAddress)) {
            _this.setData({
              findsAddress: false,
              fetchsAddress: false
            })
          } else {
            // findsAddress fetchsAddress
            // 获取默认地址
            let findsAddress = defaultAddress;
            let fetchsAddress = defaultAddress;
            _this.setData({
              findsAddress,
              fetchsAddress
            })
          }
        }
      }).catch((res) => {

      })
    },
    // 显示照料须知
    showNotes(){
      this.setData({
        isNotes:true
      })
    },
    // 隐藏找料须知
    hiddenNotes(){
      this.setData({
        isNotes: false
      })
     
    },
    // 获取描述
    getDescription(e) {
      let value = e.detail.value;
      let index = e.currentTarget.dataset.index;
      console.log(value); 
      this.data.addFinds[index].desc = value;
      this.setData({
        addFinds: this.data.addFinds
      })
      console.log(this.data.addFinds);
    },
    // 获取物料类型数据
    getCheckTypes(){
      // api.getCheckTypes({}).then((res)=>{
      //   console.log(res);
      //   if(res.code == 200){
      //     // this.data.addFinds.forEach((v,i)=>{
      //     //   v.checkType = res.data[0].name;
      //     //   v.cid = res.data[0].id
      //     // })
      //     // // this.data.addFinds[0].checkType = res.data[0].name;
      //     // // this.data.addFinds[0].cid = res.data[0].id;
      //     // for(let i=0 ;i<res.data.length;i++){
      //     //   this.data.checkTypes.push(res.data[i].name);
      //     //   this.data.checkTypes_cid.push(res.data[i].id);
      //     // }
      //     // this.setData({
      //     //   checkTypes: this.data.checkTypes,
      //     //   addFinds: this.data.addFinds
      //     // })

      //     // 2.2.1分类改版
         
      //     let classifyList = res.data;
          
      //     this.setData({
      //       classifyList,
      //       classifyListChild: classifyList[0].list
      //     })
      //     wx.setStorageSync('classifyList', classifyList);
      //     console.log(res);
      //   }
      // })
    },
    /**
     * 切换物料类型
     */
    checkType(e) {
      this.setData({
        checkTypeIndex: e.currentTarget.dataset.index
      })
    
      // console.log(index);
      // let _this = this;
      // wx.showActionSheet({
      //   itemList: this.data.checkTypes,
      //   success: function (res) {
      //     console.log(res);
      //     _this.data.addFinds[index].checkType = _this.data.checkTypes[res.tapIndex];
      //     _this.data.addFinds[index].cid = _this.data.checkTypes_cid[res.tapIndex];
      //     _this.setData({
      //       addFinds: _this.data.addFinds
      //     })
      //     console.log(_this.data.addFinds);
      //   },
      //   fail: function (res) {
      //     console.log(res.errMsg)
      //   }
      // })

      //2.2改版
      wx.navigateTo({
        url: '../classify/classify?from=1&index=' + this.data.checkTypeIndex
      })
    },
    // 点击添加找料
    addFind () {
      if (this.data.addFinds.length >= 10){
        wx.showToast({
          title: '最多10个找料任务',
          icon: 'none',
          duration: 1500
        })
        this.data.isAddShow = false;
        this.setData({
          isAddShow: this.data.isAddShow
        })
        return false;
      }
      
      let defaultAddressId = this.data.defaultAddress?this.data.defaultAddress.id:'';
      let defaultAddress   = this.data.defaultAddress ? this.data.defaultAddress : false;
      let newAddFinds = this.data.addFinds.concat([{ find_type: '1', index: this.data.addFinds.length, cid: this.data.checkTypes_cid[0], checkType: '', selcetTabNum: '1', selcetSecondTabNum: '1', isSelect: false, desc: '', cid:'', files: [{}, {}, {}], get_address: defaultAddress.id, address: defaultAddress}]) ;
      this.setData({
        addFinds: newAddFinds
      });
      console.log(this.data.addFinds);
    },
    // 删除找料单个信息
    closed(e) {
      let _this = this;
      let index = e.currentTarget.dataset.index;
      if (this.data.addFinds.length<=1){
        wx.showToast({
          title: '至少保留一个找料单',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
    
      wx.showModal({
        title: '提示',
        content: '确认删除吗？',
        confirmText: '确认',
        confirmColor: '#c81a29',
        success: (res) => {
          if (res.confirm) {
            _this.data.isAddShow = true;
            _this.setData({
              isAddShow: _this.data.isAddShow
            })
            console.log(index);
            _this.data.addFinds.splice(index, 1);
            let newAddFinds = _this.data.addFinds;
            _this.setData({
              addFinds: newAddFinds
            });
            console.log(_this.data.addFinds);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 显示按描述找料
    showSelect (e) {
      const index = e.currentTarget.dataset.index;
      this.data.addFinds[index].isSelect = !this.data.addFinds[index].isSelect;
      this.setData({
        addFinds: this.data.addFinds
      })
    },
    // 按样找料切换方式
    selcetSecondTab (e) {  
      
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;

      // 判断是否在配送范围
      if (id == 1){
        // app.globalData.isFromScope = true;
      }
      this.data.addFinds[index].selcetSecondTabNum = id;
      this.data.addFinds[index].get_type = id;
      console.log(id);
      
      this.setData({
        addFinds: this.data.addFinds
      })
    },
    // 选择找料方式
    selcetTab(e) {
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.id;
        this.data.addFinds[index].selcetTabNum = id;
        this.data.addFinds[index].find_type = id;
        if(id == 2){
          this.data.addFinds[index].get_type = 1;
        }
        this.setData({
          addFinds: this.data.addFinds
        })
        console.log(this.data.addFinds)
    },
    //   选择上传图片
    chooseImage: function (e) {
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.id;
        let imgIndex = e.currentTarget.dataset.id;
        console.log(i);
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

              
              let files =  this.data.addFinds[index].files;
                files[i].url = res.tempFilePaths[0];
                files[i].pct = 'wait';
                this.setData({
                  addFinds: this.data.addFinds
                });
                console.log(files);
                const token = wx.getStorageSync('token') || '';
                const token_type = wx.getStorageSync('token_type') || '';
                // 上传图片，返回链接地址跟id,返回进度对象
                let uploadTask = wx.uploadFile({
                    url: `${api.apiUrl}/api/upload/simpleUpload`,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        'content-type': 'multipart/form-data',
                        'Authorization': token_type + ' ' + token
                    },
                    formData: {
                        type:'find_img',
                    },
                    success: (res) => {
                        console.log('图片上传');
                        console.log(res);
                        var res = JSON.parse(res.data);
                        if (200 === res.code) {
                          files[i].image_url = res.data.full_url;
                            this.data.addFinds[index].files = files;
                            if (imgIndex==0){
                              this.data.addFinds[index].front_img = res.data.full_url;
                            } else if (imgIndex==1){
                              this.data.addFinds[index].side_img = res.data.full_url;
                            }else{
                              this.data.addFinds[index].back_img = res.data.full_url;
                            }
                            
                            this.setData({
                              addFinds: this.data.addFinds
                            })
                            console.log(this.data.addFinds);
                        } else {
                            util.errorTips('上传错误');
                        }

                    },
                    fail(err) {
                        console.log(err)
                    },
                    complete() {

                    }
                })

                uploadTask.onProgressUpdate((res) => {
                    console.log('上传进度', res.progress);
                    files[i].pct = res.progress + '%';

                     if (res.progress == 100){
                         files[i].pct = ' '
                     }
                    this.setData({
                        files
                    })
                    // console.log('已经上传的数据长度', res.totalBytesSent)
                    // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                })

            }
        })
    },
    // 删除上传
    deleteItem(e) {
      let index = e.currentTarget.dataset.index;
      let i = e.currentTarget.dataset.id;
      let files = this.data.addFinds[index].files;
      files[i] = {};
      this.data.addFinds[index].files = files;
      console.log(this.data.addFinds[index].files);
      if (i == 0) {
        this.data.addFinds[index].front_img = '';
      } else if (i == 1) {
        this.data.addFinds[index].side_img = '';
      } else {
        this.data.addFinds[index].back_img = '';
      }
      this.setData({
        addFinds: this.data.addFinds
      });
      console.log(this.data.addFinds);
    },

    // 提交表单

    findSubmit(e) {
      console.log('fromId');
      console.log(e.detail.formId);
      if (e.detail.formId != 'the formId is a mock one') {
        let data = {
          "form_id": e.detail.formId,
          "from": "3"
        }
        api.getFormId({
          method: 'POST',
          data
        }).then((res) => {
          console.log(res);
          console.log('获取formId');
        })
      }
      let _this = this;
      console.log(this.data.addFinds); 
      for (let i = 0; i < this.data.addFinds.length;i++){ 
        // 物料类型必填 判断是否填写
        if (this.data.addFinds[i].cid == '') {
          wx.showToast({
            title: '第' + (i + 1) + '个任务，请填写物料类型',
            icon: 'none',
            duration: 1500
          })
          return false
        }
        // 描述必填 判断是否填写
        if (this.data.addFinds[i].desc == '') {
          wx.showToast({
            title: '第' + (i + 1) + '个任务，请填写描述',
            icon: 'none',
            duration: 1500
          })
          return false
        }
        // 图片找料判断
        if (this.data.addFinds[i].selcetTabNum == '1'){

          
          // 获取上传图片
          let uploadC = this.selectComponent('#upload'+i);
          let uploadImgs = [];
          // 判定是否在已是完成状态
          // let isUploading = uploadC.data.files.every((ele, i) => {
          //   return (ele.pct && (ele.pct === 'finish' || ele.pct === 'fail'))
          // })
          // if (!isUploading) {
          //   util.errorTips('图片正在上传')
          //   return false
          // }
          // 添加数据
          uploadC.data.files.forEach((ele, i) => {
            if (ele.full_url) {
              uploadImgs.push(ele.full_url)
            }
          })
          console.log(uploadImgs);
          
          if (uploadImgs == 0) {
            wx.showToast({
              title: '第' + (i + 1) + '个任务，至少上传一张图片',
              icon: 'none',
              duration: 1500
            })
            return false;
          }else{
            this.data.addFinds[i].front_img = uploadImgs;
          }
          
          // 是否至少上传一张图片
          // for (let j = 0; j < this.data.addFinds[i].files.length;j++){ 
          //   if (!this.data.addFinds[i].files[j].url){
          //     filesNum++;
          //   }
          //   if (filesNum>=3){
          //     wx.showToast({
          //       title: '第' + (i + 1) + '个任务，至少上传一张图片',
          //       icon: 'none',
          //       duration: 1500
          //     })
          //     return false;
          //   }
          // }
  
        } else if (this.data.addFinds[i].selcetTabNum == '2') {   // 按样找料判断
          // 按样找料地址是否存在
          if (this.data.addFinds[i].selcetSecondTabNum == 1){
            if (this.data.addFinds[i].address.id == '' || !this.data.addFinds[i].address.id) {
              wx.showToast({
                title: '第' + (i + 1) + '个任务，请添加地址',
                icon: 'none',
                duration: 1500
              })
              return false;
            }
          }
          

        } else if (this.data.addFinds[i].selcetTabNum == '3') { // 按描述找料判断
          // 只有描述 此方法头部已经判断
        }
      }
      let findDates = {
        task_type:'1',
        form_data: this.data.addFinds
      }
      // 发起请求
      api.joinTask({
        method:'POST',
        data: findDates
      }).then((res)=>{
          console.log(res);
          if(res.code==200){
             this.setData({
               isPopup:true
             })
             _this.data.interval = setInterval(function () {
               console.log(_this.data.payNum);
               _this.data.payNum--;
               _this.setData({
                 payNum: _this.data.payNum
               })
               if (_this.data.payNum == 0) {
                 _this.setData({
                   isPopup: false
                 })
                 clearInterval(_this.data.interval);
                 _this.goPay();
               }
             }, 1000)
          }
      })
    },
    // 获取公司地址
    getCompanyaddress(){ 
      api.getCompanyaddress({}).then((res)=>{
        if(res.code == 200){
          console.log('公司地址');
          console.log(res.data.address);
          let companyaddress = res.data;
          this.setData({
            companyaddress
          })


          

        }
      })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {  
    
      // 动态获取须知
      api.needKnow({}).then((res) => {
        console.log(res);
        this.setData({
          findNeedKnow: res.data.find.value
        })
      })

      this.getSelectedAddress();

      
     // app.globalData.isFromScope = true;
      // 获取公司地址
      this.getCompanyaddress();
      // 继续请求

      // 获取找料类型数据
      this.getCheckTypes();
      // 获取默认地址
      if (wx.getStorageSync('defaultAddress')){
        // 获取上一级页面传过来的数据
        this.setData({
          findNum: 1,
          selcetTabNum: 1
        })
        // 根据上一级findNum创建找料单数
        let newAddFinds = [];
        let findNum = 1;
        for (let i = 0; i < parseInt(findNum); i++) {
          newAddFinds.push(
            { index: i, cid: this.data.addFinds[0].cid, checkType: this.data.addFinds[0].checkType, find_type: options.selcetTabNum || 1, selcetTabNum: options.selcetTabNum || 1, get_type: '1', selcetSecondTabNum: '1', isSelect: false, desc: '', files: [{}, {}, {}], get_address: wx.getStorageSync('defaultAddress').id, address: wx.getStorageSync('defaultAddress') }
          )
          // 设置数据
          this.setData({
            addFinds: newAddFinds
          });
        }
        // 设置数据
        this.setData({
          addFinds: newAddFinds
        });
        console.log(this.data.addFinds);
        return false
      }
      this.getSelectedAddress(() => {
        // 获取上一级页面传过来的数据
        this.setData({
          findNum: 1,
          selcetTabNum: 1
        })
        // 根据上一级findNum创建找料单数
        let newAddFinds = []; 
        let findNum = 1;
        for (let i = 0; i < parseInt(findNum); i++) {
          newAddFinds.push(
            { index: i, cid: this.data.addFinds[0].cid, checkType: this.data.addFinds[0].checkType, find_type: selcetTabNum, selcetTabNum: selcetTabNum, get_type: '1', selcetSecondTabNum: '1', isSelect: false, desc: '', files: [{}, {}, {}], get_address: this.data.defaultAddressId, address: this.data.defaultAddress }
          )
          // 设置数据
          this.setData({
            addFinds: newAddFinds
          });
        }
        // 设置数据
        this.setData({
          addFinds: newAddFinds
        });
        console.log(this.data.addFinds);
      });
      
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
      if (wx.getStorageSync('isFindNotes')){
        this.setData({
          isNotes: false
        })
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

    },


  xxx() {
    console.log('xxxxxxxxxxxxxxxxxxxx');
  },
    // 收货地址
    getSelectedAddress() { 
      // 获取默认地址
      api.defaultAddress({
      }, 1).then((res) => {
        if (res.code == 200) {
          let defaultAddress = res.data;
          wx.setStorageSync('defaultAddress', res.data)
          // 可能位空数组
          if (Array.isArray(defaultAddress)) {
            this.data.addFinds[app.globalData.addressIndex].address = false;
            this.setData({
              defaultAddress: false,
              addressId: '',
              addFinds: this.data.addFinds
            })
          } else {
            this.data.addFinds[app.globalData.addressIndex].address = res.data;
            this.data.addFinds[app.globalData.addressIndex].get_address = res.data.id;
            this.setData({
              // 设置为空
              defaultAddress: res.data,
              addressId: res.data.id,
              addFinds: this.data.addFinds
            })
          }
          
        }

      }).catch((res) => {

      })
    },

    // 图片上传
    uploadimg: function (data) {
        var that = this,
            i = data.i ? data.i : 0,//当前上传的哪张图片
            success = data.success ? data.success : 0,//上传成功的个数
            fail = data.fail ? data.fail : 0;//上传失败的个数

        const token = wx.getStorageSync('token') || '';

        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            name: 'image',//这里根据自己的实际情况改
            formData: {
                member_token: token
            },//这里是上传图片时一起上传的数据
            success: (resp) => {
                success++;//图片上传成功，图片上传成功的变量+1
                console.log(resp)
                console.log(i);
                //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
            },
            fail: (res) => {
                fail++;//图片上传失败，图片上传失败的变量+1
                console.log('fail:' + i + "fail:" + fail);
            },
            complete: () => {
                console.log(i);
                i++;//这个图片执行完上传后，开始上传下一张
                if (i == data.path.length) {   //当图片传完时，停止调用          
                    console.log('执行完毕');
                    console.log('成功：' + success + " 失败：" + fail);
                } else {//若图片还没有传完，则继续调用函数
                    console.log(i);
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadimg(data);
                }

            }
        });
    },
    // 去地址选择页面
    goConsigneeAddress (e) { 
      // app.globalData.isFromScope = true;
      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      app.globalData.addressIndex = index;
      wx.navigateTo({
        url: '../consigneeAddress/consigneeAddress?addFinds='+ JSON.stringify(this.data.addFinds) +'&id='+id
      })
    },
    // 返回上一层，继续找料
    goBack () {
      clearInterval(this.data.interval);
      
      let newAddFinds = { index: 0, cid: this.data.addFinds[0].cid, checkType: this.data.addFinds[0].checkType, find_type: this.data.addFinds[0].selcetTabNum, selcetTabNum: this.data.addFinds[0].selcetTabNum, get_type: '1', selcetSecondTabNum: '1', isSelect: false, desc: '', files: [{}, {}, {}], get_address: this.data.defaultAddress.id, address: this.data.defaultAddress }
      this.data.addFinds = [];
      this.data.addFinds[0] = newAddFinds;
      this.setData({
        isPopup:false,
        findNum: this.data.findNum,
        addFinds: this.data.addFinds
      })
      // let pages = getCurrentPages();
      // let currPage = pages[pages.length - 1];   //当前页面
      // let prevPage = pages[pages.length - 2];  //上一个页面
      // prevPage.setData({
      //   isPopup: true,
        
      // })
      // wx.switchTab({
      //   url: '../index/index'
      // })
    },
    // 去支付
    goPay () {
      clearInterval(this.data.interval);
      wx.switchTab({
        url: '../task3/task3',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        } 
      })
    }
})