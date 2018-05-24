const oldApiUrl = 'https://api.yidap.com';
//const apiUrl = 'https://devapi.yidap.com';
const apiUrl = 'https://devv2.yidap.com';

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
const myRequest = function (params = {}, url , id) {

    return new Promise((resolve, reject) => {
        let data = params.data || {};
        const token = wx.getStorageSync('token') || '';
        const token_type = wx.getStorageSync('token_type') || '';
        // data.member_token = token;
        let header = {'Accept':'application/json', 'Authorization': token_type+ ' ' +token };
        let apiUrl = url;
        if (id!=undefined){
          apiUrl = url +'/'+id
        }
        
        wx.request({
            url: apiUrl,
            method: params.method || 'GET',
            data,
            header,
            success(res) {
                var res = res.data;
                if (200 === res.code || 0 === res.code) {
                    resolve(res);
                } else {
                    if (401 === res.code) {
                        console.log('401统一处理');
                        wx.showModal({
                            title: '您尚未登陆',
                            content: '是否前往登陆页面',
                            confirmText: '前往',
                            confirmColor: '#c81a29',
                            success: (res) => {
                                if (res.confirm) {
                                    wx.navigateTo({
                                      url: '../login/login',
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
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
                        image: '../../images/icons/error.png',
                        duration: 3000
                    })
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
    return myRequest(params, `${apiUrl}/auth/member/register/sms`)
}

// 注册接口
const register = (params) => {
  return myRequest(params, `${apiUrl}/api/register`)
}

// 重置密码
const restSMS = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/psw/findsms`)
}

// 修改密码
const restpwd = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/psw/update`)
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
  return myRequest(params, `${apiUrl}/find/api/address`)
}
// 订单收货地址详情
const infoAddress = (params) => {
  return myRequest(params, `${apiUrl}/find/api/address`)
}

// 订单新增收货地址
const addAddress = (params) => {
  return myRequest(params, `${apiUrl}/find/api/address`)
}

// 订单编辑收货地址
const editAddress = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/address/edit`)
}

// 获取订单默认收货地址资料
const defaultAddress = (params,id) => {
  return myRequest(params, `${apiUrl}/find/api/address/getdefault`,id)
}

// 设置默认收货地址
const setDefaultAddress = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/address/edit-default`)
}

// 删除收货地址
const deleteAddress = (params) => {
    return myRequest(params, `${apiUrl}/auth/member/address/delete`)
}

// 结算 添加订单
const addOrder = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/add`)
}

// 订单列表
const orderList = (params,id) => {
  return myRequest(params, `${apiUrl}/find/api/order/type`,id)
}

// 订单详情
const orderDetail = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/info`)
}

// 取消订单
const cancelOrder = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/delete`)
}

// 支付接口
const payment = (params) => {
    return myRequest(params, `${apiUrl}/ec/order/pay`)
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
const getAddress = (params) => myRequest(params, `${oldApiUrl}/lib/region/listTree`);


// 首页品牌展示
const brandShow = (params) => myRequest(params, `${apiUrl}/item/brand/get`);

// 获取服务人数
const serviceNum = (params) => myRequest(params, `${apiUrl}/find/api/material`);

/**
 * 
 * 
 * 
 */

// 小鹿快找接口
// 提交订单
const addDemand = (params) => myRequest(params, `${apiUrl}/find/demand/add`);

// 套餐费用
const demandPrice = (params) => myRequest(params, `${apiUrl}/find/demand/price`);

// 找料支付接口
const demandPay = (params) => myRequest(params, `${apiUrl}/find/demand/pay`);

// 找料订单详情
const demandInfo = (params) => myRequest(params, `${apiUrl}/find/demand/info`);

// 找料订单列表
const demandList = (params) => myRequest(params, `${apiUrl}/find/demand/list`);


/**
 * 2018-04-12 cpb
 * 套餐接口
 */


// 购买套餐列表
const packageList = (params) => myRequest(params, `${apiUrl}/find/package/getList`);

// 配送服务  
const packageService = (params) => myRequest(params, `${apiUrl}/find/distribution/getArea`);

// 充值订单提交
const addPackageOrder = (params) => myRequest(params, `${apiUrl}/find/package_order/store`);

// 去支付
const packageOrderPay = (params) => myRequest(params, `${apiUrl}/find/package_order/pay`);

// 我的套餐列表
const myPackageOrderList = (params) => myRequest(params, `${apiUrl}/find/package_order/index`);



// 秒杀活动接口
const activity = (params) => myRequest(params, `${apiUrl}/ec/spike_activity/info`);
//const activity = (params) => myRequest(params, `http://localhost:3000/active`);

// 提交表单数据
const activitySubmit = (params) => myRequest(params, `${apiUrl}/ec/spike_activity/make`);

// 获取找料类型数据
const getCheckTypes = (params) => myRequest(params, `${apiUrl}/find/api/category`);

// 任务中心列表数据
const getTaskInit = (params,id) => myRequest(params, `${apiUrl}/find/api/task/type`,id);

// 删除找料任务
const delTask = (params,id) => myRequest(params, `${apiUrl}/find/api/task`,id);

// 任务中心结算
const saveTask = (params) => myRequest(params, `${apiUrl}/find/api/task`);


module.exports = {
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
    activitySubmit
}