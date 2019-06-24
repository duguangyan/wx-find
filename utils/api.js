 const apiUrl = 'https://devv2.yidap.com';   // 测试
// const apiUrl = 'https://apiv2.yidap.com';     // 正式
const versionNumber = 'v3.1.2';  //版本号
import md5 from "./md5.min.js";
if (apiUrl == 'https://apiv2.yidap.com'){
  wx.setStorageSync('v', versionNumber+' 正式');
}else{
  wx.setStorageSync('v', versionNumber+' 测试');
}
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};
/*
 *  
 * @param {*} params 
 * @param {*} url String
 * @param {*} data Object
 * @param {*} success Function
 * @param {*} fail Function
 * @param {*} complete Function
 */
// id 类型或id   st 状态

// sign签名拼接方法
function MakeSign(url, Obj) {
  let newKey = Object.keys(Obj).sort()
  let newObj = {}
  for (let i = 0; i < newKey.length; i++) {
    newObj[newKey[i]] = Obj[newKey[i]]
  }
  let str = ''
  for (let key in newObj) {
    if (newObj[key] == null) {
      str += key + '=&'
    }else if (typeof newObj[key] == 'object' && newObj[key]!=null){
        str += key + '=[object Object]&'
    } else{
      str += key + '=' + newObj[key] + '&'
    }
  }
  let newUrl='';
  if (url.indexOf('https://devv2.yidap.com')>-1){
    newUrl = url.split('https://devv2.yidap.com')[1];
  }else{
    newUrl = url.split('https://apiv2.yidap.com')[1];
  } 
  let newStr = newUrl + '?' + str.substring(0, str.length - 1) + 'zhong_pi_lian'
  newStr = newStr.replace('sign=&', '')
  console.log('newStr:->' + newStr)
  
  return md5(newStr)
}
let showModel = '';
const myRequest = function (params = {}, url , id, st, page) {

    return new Promise((resolve, reject) => {
        let timestamp = Date.parse(new Date());
        let data = {};
            data = params.data || {};
            data.timestamp    = timestamp;
            data.sign         = MakeSign(url, data);
            data.deviceId     = "wx";
            data.platformType =  "2";
            data.versionCode  = '4.0';
      
        const token = wx.getStorageSync('token') || '';
        const token_type = wx.getStorageSync('token_type') || 'Bearer';
        // data.member_token = token;
        let header = {'Accept':'application/json', 'Authorization': token_type+ ' ' +token };
        let apiUrl = url;
        if (id!=undefined){
          apiUrl = url +'/'+id
        }
        if (st != undefined) {
          apiUrl = apiUrl + '/' + st
        }
        if (page != undefined) {
          apiUrl = apiUrl + '?page=' + page
        }
        wx.request({
            url: apiUrl,
            method: params.method || 'GET',
            data,
            header,
          success(res) {
                var res = res.data;
                if (200 == res.code || 0 == res.code) {
                    resolve(res);
                } else {
                    
                    if (401 == res.code) {  
                      
                      wx.hideLoading();
                      if (showModel != '') {
                        return false;
                      }
                      console.log('401统一处理');
                      let fromCenter =  wx.getStorageSync('fromCenter');
                      wx.setStorageSync('fromCenter', '0');
                      if (fromCenter!=1){
                        showModel = wx.showModal({
                          title: '您尚未登录',
                          content: '是否前往登录页面',
                          confirmText: '前往',
                          // confirmColor: '#c81a29',
                          success: (res) => {
                            if (res.confirm) {
                              wx.navigateTo({
                                url: '../login/login',
                              })
                              showModel = '';
                              return false;
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                              showModel='';
                            }
                          }
                        })
                      }
                    }
                  if (201 == res.code || -1 == res.code || 1 == res.code){
                    wx.showToast({
                      title: res.msg,
                      icon:'none',
                      duration: 2000
                    })
                  }
                  
                    reject(res);
                }
            },
            fail(err) {
                // 请求超时处理
                if (err.errMsg || err.errMsg === "request:fail timeout") {
                    wx.showToast({
                        title: '网络请求超时',
                        image: '../../public/images/icon/error.png',
                        duration: 3000
                    })
                    wx.hideLoading();
                }

                //reject(err);

            },
            complete(res) {
              
            }
        })
    })
};

// 微信登录
const wxLogin = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/wxbiz/sessionkey`)
}

// 微信授权信息解密
const wxDatacrypt = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/wxbiz/datacrypt`)
}

// 手机绑定
const associateAccount = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/weixin/bind`)
}



// 手机登录
const login = (params) => {
  return myRequest(params, `${apiUrl}/api/login`)
}

// 获取用户信息
const memberInfo = (params) => {
  return myRequest(params, `${apiUrl}/api/show`)
}

// 修改用户信息
const modifyMemberInfo = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/edit`)
}


// 判定会员是否存在
const memberExit = (params) => {
    return myRequest(params, `${apiUrl}/api/member/exist`)
}

// 用户注册短信发送
const regSMS = (params) => {
  return myRequest(params, `${apiUrl}/api/sms/send`)
}

// 注册接口
const register = (params) => {
  return myRequest(params, `${apiUrl}/api/register`)
}

// 重置密码
const restSMS = (params) => {
  return myRequest(params, `${apiUrl}/api/sms/send`)
}

// 修改密码
const restpwd = (params) => {
  return myRequest(params, `${apiUrl}/api/member/reset`)
}

// 添加到购物车
const addCart = (params) => {
    return myRequest(params, `${apiUrl}/ec/cart/add`)
}

// 获取购物车列表
const getCartList = (params) => {
    return myRequest(params, `${apiUrl}/ec/cart/list`)
}

// 修改购物车数量
const updateNumber = (params) => {
    return myRequest(params, `${apiUrl}/ec/cart/number/update`)
}

// 删除购物车
const deleteCart = (params) => {
    return myRequest(params, `${apiUrl}/ec/cart/delete`)
}

// 获取购物车数量
const cartNumber = (params) => {
    return myRequest(params, `${apiUrl}/ec/cart/count`)
}



// 订单收货地址列表
const listAddress = (params) => {
  return myRequest(params, `${apiUrl}/api/member/address`)
}
// 订单收货地址详情
const infoAddress = (params,id) => {
  return myRequest(params, `${apiUrl}/api/member/address/show`)
}

// 订单新增收货地址
const addAddress = (params) => {
  return myRequest(params, `${apiUrl}/api/member/address`)
}

// 订单编辑收货地址
const editAddress = (params) => {
    return myRequest(params, `${apiUrl}/api/member/address`)
}

// 获取订单默认收货地址资料
const defaultAddress = (params) => {
  return myRequest(params, `${apiUrl}/api/member/address/default`)
}

// 设置默认收货地址
const setDefaultAddress = (params,id) => {
  return myRequest(params, `${apiUrl}/api/member/address/edit-default`,id)
}

// 删除收货地址
const deleteAddress = (params,id) => {
  return myRequest(params, `${apiUrl}/api/member/address/delete`)
}

// 结算 添加订单
const addOrder = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/add`)
}

// 订单列表 id:1找料 2取料 订单状态st: 0所有状态4未支付5待收货6待评价
// const orderList = (params,id,st,page) => {
//   return myRequest(params, `${apiUrl}/api/order/type`, id, st, page)
// }
const orderList = (params) => {
  return myRequest(params, `${apiUrl}/api/order`)
}
// 订单详情
const orderDetail = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/info`)
}

// 取消订单
const cancelOrder = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/delete`)
}

// 任务中心去支付支付
const payment = (params) => {
  return myRequest(params, `${apiUrl}/api/order`)
}
// 重新支付
const repay = (params,id) => {
  return myRequest(params, `${apiUrl}/api/order/repay`,id)
}


// 订单微信支付
const wxPayByOrder = (params) => {
  return myRequest(params, `${apiUrl}/api/wechat/unify`)
}
const wxPay = (params) => {
  return myRequest(params, `${apiUrl}/api/recharge`)
}

// 确认收货
const confirmReceipt = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/confirm`)
}



// 搜索
const search = (params) => {
    return myRequest(params, `${apiUrl}/item/search`)
}


//获取分类列表
const getCategoryList = (params) => {
    return myRequest(params, `${apiUrl}/item/category/get`)
}

// 获取产品列表
const getGoodsList = (params) => {
    return myRequest(params, `${apiUrl}/item/product/get`)
}

// 获取产品详细信息
const getGoodsDetail = (params) => {
    return myRequest(params, `${apiUrl}/item/product/detail`)
}

// 收货地址地区
const getAddress = (params) => myRequest(params, `${apiUrl}/api/region/listTree`);


// 首页品牌展示
const brandShow = (params) => myRequest(params, `${apiUrl}/item/brand/get`);

// 获取服务人数
const serviceNum = (params) => myRequest(params, `${apiUrl}/api/material`);

/**
 * 
 * 
 * 
 */

// 小鹿快找接口
// 提交订单
const addDemand = (params) => myRequest(params, `${apiUrl}/demand/add`);

// 套餐费用
const demandPrice = (params) => myRequest(params, `${apiUrl}/demand/price`);

// 找料支付接口
const demandPay = (params) => myRequest(params, `${apiUrl}/demand/pay`);

// 找料订单详情
const demandInfo = (params) => myRequest(params, `${apiUrl}/demand/info`);

// 找料订单列表
const demandList = (params) => myRequest(params, `${apiUrl}/demand/list`);


/**
 * 2018-04-12 cpb
 * 套餐接口
 */


// 购买套餐列表
const packageList = (params) => myRequest(params, `${apiUrl}/package/getList`);

// 配送服务  
const packageService = (params) => myRequest(params, `${apiUrl}/distribution/getArea`);

// 充值订单提交
const addPackageOrder = (params) => myRequest(params, `${apiUrl}/package_order/store`);

// 去支付
const packageOrderPay = (params) => myRequest(params, `${apiUrl}/package_order/pay`);

// 余额支付
const payAsset = (params) => myRequest(params, `${apiUrl}/api/pay/asset`);


// 我的套餐列表
const myPackageOrderList = (params) => myRequest(params, `${apiUrl}/package_order/index`);



// 秒杀活动接口
const activity = (params) => myRequest(params, `${apiUrl}/ec/spike_activity/info`);
//const activity = (params) => myRequest(params, `http://localhost:3000/active`);

// 提交表单数据
const activitySubmit = (params) => myRequest(params, `${apiUrl}/ec/spike_activity/make`);

// 获取找料类型数据
const getCheckTypes = (params) => myRequest(params, `${apiUrl}/api/category`);

// 任务中心列表数据
const getTaskInit = (params,id) => myRequest(params, `${apiUrl}/api/task`,);

// 更新任务
const updateTaskInit = (params, id) => myRequest(params, `${apiUrl}/api/task/update`);

// 删除找料任务
const delTask = (params, id) => myRequest(params, `${apiUrl}/api/task/delete`);

// 任务中心结算
const saveTask = (params) => myRequest(params, `${apiUrl}/api/task`);

// 加入小鹿任务
const joinTask = (params) => myRequest(params, `${apiUrl}/api/task`);

// 充值列表
const getRechargeList = (params) => myRequest(params, `${apiUrl}/api/recharge`);

// 找料或取料单价
const getFindOrFetchPrice = (params,id) => myRequest(params, `${apiUrl}/api/taskfee`,id);

// 催单
const urgeOrder = (params, id) => myRequest(params, `${apiUrl}/api/order/prompt`, id);
// 取消订单
const delOrder = (params, id) => myRequest(params, `${apiUrl}/api/order/cancel`, id);

// 订单列表 订单支付
const orderListToPay = (params, id) => myRequest(params, `${apiUrl}/api/order/repay`, id);

// 订单列表 确认收货
const affirmOrder = (params, id) => myRequest(params, `${apiUrl}/api/order/confirm`);

// 订单评价
const toCommentOrder = (params, id) => myRequest(params, `${apiUrl}/api/order/comment`);

// 判断配送是否范围
const isFromScope = (params, id) => myRequest(params, `${apiUrl}/api/member/address_check`, id);

// 修改任务
const findEdit = (params, id) => myRequest(params, `${apiUrl}/api/task`, id);

// 找料订单详情
const getOrderDetail = (params, id) => myRequest(params, `${apiUrl}/api/order/show`);

// 获取公司地址
const getCompanyaddress = (params) => myRequest(params, `${apiUrl}/api/company/address`);

// 获取用户信息
const getUserInfo = (params) => myRequest(params, `${apiUrl}/api/show`);

// 获取单个任务价格
const getTaskFee = (params) => myRequest(params, `${apiUrl}/api/task/fee`);
// 获取openId
const getOpenId = (params) => myRequest(params, `${apiUrl}/api/member/openId`);

//个人中心统计
const centerStatistics = (params) => myRequest(params, `${apiUrl}/api/member/stastics`);

// get是否设置支付密码 put保存支付密码 post验证支付密码 
const doPayPassWord = (params) => myRequest(params, `${apiUrl}/api/member/paypwd`);
// 忘记支付密码
const resetpaypwd = (params) => myRequest(params, `${apiUrl}/api/member/resetpaypwd`);


// 忘记支付密码
const restPayPwd = (params) => myRequest(params, `${apiUrl}/api/member/resetpaypwd`);

// 总订单支付
const repayorder = (params) => myRequest(params, `${apiUrl}/api/repayorder`);

// 检查验证码
const smschk = (params) => myRequest(params, `${apiUrl}/api/member/smschk`);

// 获取fromId 
const getFormId = (params) => myRequest(params, `${apiUrl}/api/member/form_id`);

// 订单支付方式
const checkPayType = (params) => myRequest(params, `${apiUrl}/api/order/checkPayType`);

// 支付验证密码
const verifyPassword = (params) => myRequest(params, `${apiUrl}/api/member/paypwd`);

// 设置支付密码
const setPayPwd = (params) => myRequest(params, `${apiUrl}/api/member/resetpaypwd`);

// 修改昵称
const changeNickName = (params) => myRequest(params, `${apiUrl}/api/member/nick_name`);

// 订单删除
const orderDel = (params) => myRequest(params, `${apiUrl}/api/order/delete`);

// 须知
const needKnow = (params) => myRequest(params, `${apiUrl}/api/need_know`);

/**
 * 成长任务
 */
// 获取成长任务例表
const getGrowth = (params) => myRequest(params, `${apiUrl}/imall/grade`);
// 签到
const signIn = (params) => myRequest(params, `${apiUrl}/imall/sign`);
// 完善个人信息
const updateExt = (params) => myRequest(params, `${apiUrl}/api/member/updateExt`);
// 优惠券列表
// const coupon = (params, id, st, page) => myRequest(params, `${apiUrl}/api/coupon`, id, st, page);
const coupon = (params) => myRequest(params, `${apiUrl}/api/coupon`);
// 邀请新用户规则
const invite = (params) => myRequest(params, `${apiUrl}/imall/invite`);

// 退款
const refuse = (params) => myRequest(params, `${apiUrl}/api/order/refuse`);

// 公告
const mynotice = (params) => myRequest(params, `${apiUrl}/api/notice`);

// 根据用户ID获取用户信息
const getUserInfoformSocket = (params) => myRequest(params, `${apiUrl}/socket/getUserInfo`);


// 用户退出登录
const userLogout = (params) => myRequest(params, `${apiUrl}/api/logout`);

// 获取邀请码
const getInviteCode = (params) => myRequest(params, `${apiUrl}/api/member/invite_code`);

// 获取余额支付
const getUserAsset = (params) => myRequest(params, `${apiUrl}/api/member/asset`);

// 删除订单
const orderDelete = (params) => myRequest(params, `${apiUrl}/api/order/delete`);

// 催单
const orderPrompt = (params) => myRequest(params, `${apiUrl}/api/order/prompt`);

// 短信登录
const smsLogin = (params) => myRequest(params, `${apiUrl}/api/sms/login`);

// 短信登录
// const memberAvatarPath = (params) => myRequest(params, `${apiUrl}/api/member/avatar_path`);


// 小鹿人家累计客户
const inviteCodeUser = (params) => myRequest(params, `${apiUrl}/api/member/invite_code/user`);

// 小鹿人家累计客户
const inviteCodeOrder = (params) => myRequest(params, `${apiUrl}/api/member/invite_code/order`);

// 更新头像
const memberAvatarPath = (params) => myRequest(params, `${apiUrl}/api/member/avatar_path`);

// 购买鹿币
const apiVirtual = (params) => myRequest(params, `${apiUrl}/api/virtual`);

// 小鹿家人
const inviteCodeRecommend = (params) => myRequest(params, `${apiUrl}/api/member/invite_code/recommend`);



module.exports = {
  inviteCodeRecommend,
  apiVirtual,
  memberAvatarPath,
  inviteCodeOrder,
  inviteCodeUser,
  smsLogin,
  orderDelete,
  orderPrompt,
  payAsset,
  wxPayByOrder,
  updateTaskInit,
  getUserAsset,
  getInviteCode,
  userLogout,
  mynotice,
  refuse,
  invite,
  coupon,
  updateExt,
  signIn,
  getGrowth,
  needKnow,
  orderDel,
  changeNickName,
  setPayPwd,
  verifyPassword,
  checkPayType,
  getFormId,
  smschk,
  repayorder,
  restPayPwd,
  doPayPassWord,
  resetpaypwd,
  centerStatistics,
  getOpenId,
  getTaskFee,
  getUserInfo,
  repay,
  getCompanyaddress,
  getOrderDetail,
  findEdit,
  isFromScope,
  toCommentOrder,
  affirmOrder,
  orderListToPay,
  delOrder,
  urgeOrder,
  getFindOrFetchPrice,
  getRechargeList,
  wxPay,
  joinTask,
  saveTask,
  delTask,
  getTaskInit,
  getCheckTypes,
  apiUrl,
  wxLogin,
  wxDatacrypt,
  associateAccount,
  login,
  memberInfo,
  modifyMemberInfo,
  memberExit,
  regSMS,
  register,
  restSMS,
  restpwd,
  addCart,
  getCartList,
  updateNumber,
  deleteCart,
  cartNumber,
  listAddress,
  infoAddress,
  addAddress,
  editAddress,
  defaultAddress,
  setDefaultAddress,
  deleteAddress,
  addOrder,
  orderList,
  orderDetail,
  cancelOrder,
  payment,
  confirmReceipt,
  search,
  getCategoryList,
  getGoodsList,
  getGoodsDetail,
  getAddress,
  brandShow,
  serviceNum,
  demandPrice,
  addDemand,
  demandPay,
  demandInfo,
  demandList,
  packageList,
  packageService,
  addPackageOrder,
  packageOrderPay,
  myPackageOrderList,
  activity,
  activitySubmit,
  getUserInfoformSocket
}