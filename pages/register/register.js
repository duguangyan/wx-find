const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        agree: true,
        smsText:'获取验证码'
    },
    // 手机账号
    mobile(e) {

        let account = e.detail.value;
        if (account.length > 0) {
            this.setData({
                isDel: true,
                account,
            })
        } else {
            this.setData({
                isDel: false,
                account,
            })
        }

        this.isBtnActive();
    },
    // 删除输入框
    delAccountNum() {

        this.setData({
            initialNum: '',
            account: '',
            isDel: false,
        })

        this.isBtnActive();
    },
    // 获取手机验证码
    getSMS() {

        let account = this.data.account;

        if (!account) {
            util.errorTips('请填写手机号码');
            return false;
        }

        const isMatch = util.vailPhone(account);

        if (isMatch) {
            this.setData({
                smsStatus: true,
            })

            api.memberExit({
                method: 'GET',
                data: {
                    user_name: account
                }
            }).then((res) => {
              if(res.code === 200){

                api.regSMS({
                  method: 'POST',
                  data: {
                    phone: account
                  }
                }).then((res)=>{
                  // 短信发送成功，限制按钮
                  util.successTips('短信发送成功');
                  this.setData({
                    smsID: res.data
                  })
                  // 倒计时60s
                  let second = 60;
                  const timer = setInterval(() => {
                    second--;
                    let smsText = `${second}s后重新发送`;
                    this.setData({
                      smsText
                    })
                    if (second == 1) {
                      this.setData({
                        smsStatus: false,
                        smsText: '重新发送'
                      })
                      clearInterval(timer)
                    }
                  }, 1000)
                })
                
              }else{
                util.errorTips(res.msg);
                  this.setData({
                    smsStatus: false,
                  })
              }
            }).catch((res) => {
               
              util.errorTips(res.msg);
              this.setData({
                smsStatus: false,
              })
                
            })
        } else {
            util.errorTips('请确认手机号码');
        }

    },

    // 验证码
    sms(e) {
        let sms = e.detail.value;

        this.setData({
            sms,
        })
        this.isBtnActive();
    },

    //密码
    password(e) {

        let password = e.detail.value;

        this.setData({
            password,
        })

        this.isBtnActive();

    },

    // 密码可见

    isVisible() {

        this.setData({
            visiblePWD: !this.data.visiblePWD,
        })

    },
    // 协议同意

    isAgree(e) {

        this.setData({
            agree: !this.data.agree
        })

        this.isBtnActive();
    },

    // 提交表单
    regSubmit() {
        console.log(this.data.account, this.data.password, this.data.sms, this.data.agree);
        let data = this.data,
            account = data.account || '',
            password = data.password || '',
            smsID = data.smsID,
            sms = data.sms || '',
            agree = data.agree;

        // 再次验证手机号
        const isMatch = util.vailPhone(account);

        if (!isMatch) {
            util.errorTips('请确认手机号码');
            return false;
        }

        if (sms.length !== 4) {
            util.errorTips('请确认验证码');
            return false;
        }

        if (password.length < 5) {
            util.errorTips('密码长度不符');
            return false
        }

        if (!agree){
            util.errorTips('请同意协议');
            return false
        }
        var open_id = wx.getStorageSync('open_id');
        api.register({
            method: 'POST',
            data: {
                user_name: account,
                password: password,
                code: sms,
                from:3,
                open_id: open_id
            }
        }).then((res) => {
            if(res.code===200){
              console.log(res);
              wx.setStorageSync('token', res.data.access_token);
              wx.setStorageSync('token_type', res.data.token_type);
              app.globalData.token = res.data.access_token;
              app.globalData.userInfo = res.data.user;
              wx.navigateBack({
                 delta: 2
              })
            }else{
              wx.showToast({
                title: res.user_name[0],
                icon: 'none',
                duration: 2000
              })
            }
            

        }).catch((res) => {

            util.errorTips(res.msg)
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
    isBtnActive() {

        if (this.data.account && this.data.password && this.data.sms && this.data.agree) {
            this.setData({
                BtnActive: true
            })
        } else {
            this.setData({
                BtnActive: false
            })
        }
    }
})