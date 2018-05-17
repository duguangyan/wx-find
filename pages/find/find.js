const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressIndex:'',
        descValue: '',
        files: [{}, {}, {}],
        selcetTabNum: '1',
        checkTypes: ['面料', '五金', '辅料', '其他'],
        checkType: '面料',
        isSelect: false, // 下拉显示按描述找料
        selcetSecondTabNum: '1',
        addFinds: [{ index: 0, checkType: '面料', selcetTabNum: '1', selcetSecondTabNum: '1', isSelect: false, description: '', files: [{}, {}, {}]}]
    },
    // 获取描述
    getDescription(e) {
      let value = e.detail.value;
      let index = e.currentTarget.dataset.index;
      console.log(value); 
      this.data.addFinds[index].description = value;
      this.setData({
        addFinds: this.data.addFinds
      })
      console.log(this.data.addFinds);
    },
    /**
     * 切换物料类型
     */
    checkType(e) {
      let index = e.currentTarget.dataset.index;
      console.log(index);
      let _this = this;
      wx.showActionSheet({
        itemList: this.data.checkTypes,
        success: function (res) {
          console.log(res);
          _this.data.addFinds[index].checkType = _this.data.checkTypes[res.tapIndex];
          _this.setData({
            addFinds: _this.data.addFinds
          })
          console.log(_this.data.addFinds);
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    // 点击添加找料
    addFind () {
      let newAddFinds = this.data.addFinds.concat([{ index: this.data.addFinds.length, checkType: '面料', selcetTabNum: '1', selcetSecondTabNum: '1', isSelect: false, description: '', addressId: '', files: [{}, {}, {}]}]) ;
      this.setData({
        addFinds: newAddFinds
      });
      console.log(this.data.addFinds);
    },
    // 删除找料单个信息
    closed(e) {
      if (this.data.addFinds.length<=1){
        wx.showToast({
          title: '至少保留一个找料单',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      let index = e.currentTarget.dataset.index;
      console.log(index);
      this.data.addFinds.splice(index, 1);
      let newAddFinds = this.data.addFinds;
      this.setData({
        addFinds: newAddFinds
      });
      console.log(this.data.addFinds);
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
      this.data.addFinds[index].selcetSecondTabNum = id;
      console.log(id);
      this.setData({
        addFinds: this.data.addFinds
      })
      console.log(this.data.addFinds)
    },
    // 选择找料方式
    selcetTab(e) {
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.id;
        this.data.addFinds[index].selcetTabNum = id;
        console.log(id);
        this.setData({
          addFinds: this.data.addFinds
        })
        console.log(this.data.addFinds)
    },
    //   选择上传图片
    chooseImage: function (e) {
        let index = e.currentTarget.dataset.index;
        let i = e.currentTarget.dataset.id;

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
                // 上传图片，返回链接地址跟id,返回进度对象
                let uploadTask = wx.uploadFile({
                    url: `${api.apiUrl}/find/image/upload`,
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    formData: {
                        'member_token': token
                    },
                    success: (res) => {
                        console.log(res);
                        var res = JSON.parse(res.data);

                        if (0 === res.code) {
                            files[i].images_id = res.data.image_id;
                            files[i].image_url = res.data.image_url;
                            this.data.addFinds[index].files = files;
                            console.log(files);
                            console.log('--------');
                            console.log(this.data.addFinds);
                            this.setData({
                              addFinds: this.data.addFinds
                            })

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

                    // if (res.progress == 100){
                    //     files[i].pct = '上传成功'
                    // }
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
      this.setData({
        addFinds: this.data.addFinds
      });
    },

    // 提交表单

    formSubmit(e) {

        console.log(e.detail.value);

        let formData = e.detail.value,
            descStrL = formData.field_desc.trim().length;

        console.log(descStrL);
        // 描述没有输入文字判定
        if (descStrL === 0) {
            util.errorTips('请输入描述');
            return false;
        }

        // 判断图片上传完整性
        if (formData.sampling_type == 1
            && formData.img1.length === 0
            && formData.img2.length === 0
            && formData.img3.length === 0) {
            util.errorTips('请上传图片');
            return false;
        }

        // 判断地址
        if (formData.address_id.length === 0) {
            util.errorTips('请确认收货地址');
            return false;
        }

        if (formData.sampling_type == 1) {

            let files = this.data.files;
            // 获取上传图片信息
            let arr = [];
            files.map((ele) => {

                if (ele.image_url) {
                    arr.push(ele.image_url)
                }

            })

            app.globalData.orderArr = arr;
        }
        app.globalData.orderData = formData;

        console.log('formData',formData, JSON.stringify(formData));
        let formDataStr = JSON.stringify(formData);

        wx.navigateTo({
            url: `../firmOrder/firmOrder?type=${formData.sampling_type}&desc=${formData.field_desc}&range=${formData.price_range}&cname=${formData.cname}&data=${formDataStr}`,
        })


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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取默认地址
        this.getSelectedAddress();
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
    // 收货地址
    getSelectedAddress() {
        // 获取默认地址
        api.defaultAddress({

        }).then((res) => {

            let defaultAddress = res.data;

            // 可能位空数组
            if (Array.isArray(defaultAddress)) {

                this.setData({
                    defaultAddress: false,
                    addressId: ''
                })

            } else {

                this.setData({
                    defaultAddress,
                    addressId: defaultAddress.id
                })

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
    }
})