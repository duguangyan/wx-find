/* 聊天窗口
 * 其中54px为回复框高度，css同
 * mode true为文本，false为语音
 * cancel true为取消录音，false为正常录音完毕并发送
 * 上拉超过50px为取消发送语音
 * status 0为normal，1为pressed，2为cancel
 * hud的尺寸是150*150
 */
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({
  data: {
    baseUrl:'https://webapi.yidap.com',
    message_list: [
    ],
    scroll_height: wx.getSystemInfoSync().windowHeight,
    page_index: 0,
    mode: true,
    cancel: false,
    status: 0,
    tips: ['按住 说话', '松开 结束', '取消 发送'],
    state: {
      'normal': 0,
      'pressed': 1,
      'cancel': 2
    },
    toView: '',
    userId:'',
    to_avatar_path:'https://static.yidap.com/miniapp/o2o/imgs/collection@2x.png'
  },
  onLoad(){

  },
  onShow(){
    this.data.userId = wx.getStorageSync("userId");
    this.getUserInfoformSocket();
    this.getMessageBySocket();
   
    wx.connectSocket({
      url: 'wss://cloud.rngay.cn/notice/socket?userId=' + 2
    });
    let _this = this;
    wx.onSocketOpen(function(res){
      console.log("连接上了");
      console.log(res);
      wx.onSocketMessage(function(res){
        console.log("接收消息");
        console.log(res);
        let message_list = _this.data.message_list;
        message_list.push(JSON.parse(res.data));
        message_list.head_img_url = this.data.to_avatar_path;
        _this.setData({
          message_list: message_list
        })
      })
    })

  },
  getMessageBySocket(){
    let data = {
      timestamp: 1558344699566,
      sign: '910505a278c685de6973c24c17c6bb7e',
      deviceId: 'v2.0.0 正式',
      platformType: 1,
      versionCode: 'v2.0.0 正式'
    }
    data.userId = wx.getStorageSync("userId");
    wx.request({
      url: this.data.baseUrl + '/socket/getMessage',
      data,
      success(res) {
        var res = res.data;
      },
      fail(err) {
        util.errorTips(err);
      }
    })
  },
  getUserInfoformSocket(){
    let data = {
      timestamp: 1558344699566,
      sign: '910505a278c685de6973c24c17c6bb7e',
      deviceId: 'v2.0.0 正式',
      platformType: 1,
      versionCode: 'v2.0.0 正式'
    }
    data.userId = wx.getStorageSync("userId");
    wx.request({
      url: this.data.baseUrl + '/socket/getUserInfo',
      data,
      success(res) {
        this.dataset({
          to_avatar_path: res.user.avatar_path
        })
      },
      fail(err) {
        util.errorTips(err);
      }
    })
  },
  audioPlay(e) {
    let id = e.currentTarget.dataset.id;
    this.audioCtx = wx.createAudioContext(id);
    this.audioCtx.play()
  },

  reply: function (e) {
    var content = e.detail.value;
    if (content == '') {
      wx.showToast({
        title: '总要写点什么吧'
      });
      return;
    }
    var message_list = this.data.message_list;
    // var message = {
    //   myself: 1,
    //   head_img_url: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSucF9v6bKPfUPSTuQjpqmr8jAZEOgsFjFCHc73UIlUAgnI2nz6aFdnkRWAxxy1uZGfC82Yp7fMg/0',
    //   'msg_type': 'text',
    //   'content': content,
    //   create_time: '2018-07-31 21:04:31'
    // }
    
    // 发送消息
  
    let time = util.getNowFormatDate(new Date());
    let avatar_path = wx.getStorageSync("avatar_path");
    const message = { to: 1, fm: 2, fmTo: "12", text: content, time: time, smsType: 0};
    message_list.push(message);
    console.log("发送消息");
    console.log(message);
    wx.sendSocketMessage({ data: JSON.stringify(message)})
    message.head_img_url = avatar_path;
    this.setData({
      message_list: message_list,
      content: '' // 清空输入框文本
    })
    this.scrollToBottom();
  },
  chooseImage: function () {
    // 选择图片供上传
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:  res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        // 遍历多图
        tempFilePaths.forEach( (tempFilePath) => {
          this.upload(tempFilePath, 'image');
        });
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;
    // 遍历出使用images
    var images = [];
    this.data.message_list.forEach(function (messasge) {
      if (messasge != null && messasge.msg_type == 'image') {
        images.push(messasge.content);
      }
    });
    // 预览图片
    wx.previewImage({
      urls: images,
      current: src
    });
  },
  switchMode: function () {
    // 切换语音与文本模式
    this.setData({
      mode: !this.data.mode
    });
  },
  record: function () {
    // 录音事件
    console.log("------------------");
    console.log(this.data.cancel);
    let _this = this;
    wx.startRecord({
      success: function (res) {
        console.log("------------------");
        console.log(_this.data.cancel)
        if (!_this.data.cancel) {
          _this.upload(res.tempFilePath, 'voice');
        }
      },
      fail: function (res) {
        console.log(res);
        //录音失败
      },
      complete: function (res) {
        console.log(res);

      }
    })
   
  },
  stop: function () {
    wx.stopRecord();
  },
  touchStart: function (e) {
    // 触摸开始
    var startY = e.touches[0].clientY;
    // 记录初始Y值
    this.setData({
      startY: startY,
      status: this.data.state.pressed
    });
  },
  touchMove: function (e) {
    // 触摸移动
    var movedY = e.touches[0].clientY;
    var distance = this.data.startY - movedY;
    // console.log(distance);
    // 距离超过50，取消发送
    this.setData({
      status: distance > 50 ? this.data.state.cancel : this.data.state.pressed
    });
  },
  touchEnd: function (e) {
    // 触摸结束
    var endY = e.changedTouches[0].clientY;
    var distance = this.data.startY - endY;
    // console.log(distance);
    // 距离超过50，取消发送
    this.setData({
      cancel: distance > 50 ? true : false,
      status: this.data.state.normal
    });
    // 不论如何，都结束录音
    this.stop();
  },
  upload: function (tempFilePath, type) {
    let _this = this;
    // 开始上传
    wx.showLoading({
      title: '发送中'
    });
    // 语音与图片通用上传方法
    // var formData = {
    //   third_session: wx.getStorageSync('third_session'),
    //   mpid: this.data.mpid,
    //   fans_id: this.data.to_uid,
    //   msg_type: type,
    // };
    // // console.log(tempFilePath);
    // var message_list = this.data.message_list;
    // var message = {
    //   myself: 1,
    //   head_img_url: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSucF9v6bKPfUPSTuQjpqmr8jAZEOgsFjFCHc73UIlUAgnI2nz6aFdnkRWAxxy1uZGfC82Yp7fMg/0',
    //   'msg_type': type,
    //   'content': tempFilePath,
    //   create_time: '2018-07-31 17:20:39'
    // };

    // 上传图片，返回链接地址跟id,返回进度对象
    let message = '';
    if (type == 'image'){
      const access_token = wx.getStorageSync('access_token') || '';
      let uploadTask = wx.uploadFile({
        url: `${api.apiUrl}/api/upload/simpleUpload`,
        filePath: tempFilePath,
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
            let time = util.getNowFormatDate(new Date());
            message = { to: 1, fm: 2, fmTo: "12", text: res.data.full_url, time: time, smsType: 1 };
            var message_list = _this.data.message_list;
            
            wx.sendSocketMessage({ data: JSON.stringify(message) })
            let avatar_path = wx.getStorageSync("avatar_path");
            message.head_img_url = avatar_path;
            message_list.push(message);
            
            this.setData({
              message_list: message_list
            })
            
          } else {
            util.errorTips('上传错误');
          }
        },
        fail(err) {
          console.log(err)
        },
        complete: () => {
          wx.hideLoading();
        }
      })
    }
    
    
    this.scrollToBottom()
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },
  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.message_list.length - 1)
    });
  }
})