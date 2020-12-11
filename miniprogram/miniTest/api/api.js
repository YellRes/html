import Promise from '../libs/es6-promise/es6-promise';
import config from './config.js';
import { post } from './request.js';
import { request, resHandler } from './http';

var tip = require('../utils/tip');

const authorizationUrl = config.authDomain;    

const publicURL = config.publichandler;

const memberSubscribeUrl =  config.apiDomain + '/Member/MemberSubscribe'; //订阅接口

const handleAbnormalAccountUrl = config.apiDomain + '/Member/HandleAbnormalAccount';      //处理异常账号的接口
/*
 常旅模块
 */
const GetLinkerURL = config.apiDomain + 'Linker/QueryLinker'; // 查询常旅
const AddLinkerURL = config.apiDomain + 'Linker/AddLinker'; // 增加常旅
const UpdateLinkerURL = config.apiDomain + 'Linker/UpdateLinker'; // 更新常旅
const QuerySingleLinkerURL = config.apiDomain + 'Linker/QuerySingleLinker'; //获取本人身份信息

const GetRealNameInfoURL = config.apiDomain + '/Member/GetRealNameInfo'; //获取本人身份信息

/*
用户
 */
const bindStatusURL = config.apiDomain + 'Member/GetBindStatus'; // 获取用户绑定状态
const bindMobileURL = config.apiDomain + 'Member/BindMobile'; // 绑定手机
const modificationMobileURL = config.apiDomain + 'Member/ChangeMobile'; // 修改手机
const bindMobileByWeixinURL = config.apiDomain + 'Member/BindMobileByWeixin'; // 修改手机

const unbindMobileURL = config.apiDomain + 'Member/UnbindMobile'; // 解绑手机号


/*
 出行保障模块
 */
const PackageListURL = config.apiDomain + 'Common/GetPackageList';
const BusGetOnePackageURL = config.apiDomain + 'Common/GetOnePackage'; // 汽车票一元保险


//订单操作类
const CreateOrderURL = config.apiDomain + 'Order/CreateOrder'; // 下单
const CancelOrderURL = config.apiDomain + 'Order/CancelOrder'; // 汽车票取消订单
const RefundOrderURL = config.apiDomain + 'Order/RefundOrder'; // 申请退票
const OrderDetailURL = config.apiDomain + 'order/GetOrderDetail'; // 订单详情
const DeleteOrderURL = config.apiDomain + 'Order/DeleteOrder'; // 删除订单


//订单展示类
const orderListURL = config.apiDomain + 'Order/GetOrderList'; // 全项目的订单列表


/**
 * 
 * 立减
 */
const GetConfigByLineURL = config.apiDomain + 'order/GetConfigByLine';//立减


/*
首页
 */
const BusDeparturesURL = config.apiDomain + 'Home/GetBusDepartures'; // 出发地
const BusCityDeparturesURL = config.apiDomain + 'Home/GetBusCityDepartures'; // 出发地 针对城市服务限制江苏的城市接口
const BusDestinationsURL = config.apiDomain + 'Home/GetBusDestinations'; // 到达地

const PAGEANNOUCEURL = config.apiDomain + 'Home/GetAnnounceList'; //公告
const PAGEADIMGURL = config.apiDomain + 'Home/GetAdvpicture'; //广告图
const PAGEADIMGIDURL = config.commonHandler; //广告图


/*
汽车票
 */
const BusSchedulesURL = config.apiDomain + 'Schedule/GetBusSchedulesV392'; //车次列表
const BusSaleDayURL = config.apiDomain + 'Home/GetBusSaleDay'; // 可售日期
const BusRefoundProgressURL = config.apiDomain + 'Order/BusRefoundProgress'; // 汽车票退票进度
const BusScheduleDataConfirmURL = config.apiDomain + 'Schedule/ScheduleDataConfirm'; //验证接口是否已经停售
const GetProductRecommendURL = config.apiDomain + 'common/GetProductRecommend'; //推荐线路查询


/*
公共支付
 */
const MobileGateway = config.apiDomain + 'Pay/MobileGateway'; // 公共支付接口

const GetHolidaysURL = config.apiDomain + 'Common/GetHolidays';// 节假日接口


/**
 * 验证码
 *
 */
const SendValidateSmsURL = config.apiDomain + 'Member/SendValidateSms'; // 获取验证码接口


/*
一元免单
 */
const GetFreeOrderList = config.apiDomain + 'FreeOrder/GetFreeOrderList';//获取一元免单中奖列表
const GetUserOrderList = config.apiDomain + 'FreeOrder/GetUserOrderList';//获取用户一元免单订单

// 邀请ma
const addinvitationcodeURL = config.apiDomain + 'member/addinvitationcode';


// 统一处理接口返回数据

//注销
const ValidCancelURL = config.apiDomain + 'Member/validCancel'; // 验证是否可注销
const GetCancelSmsURL = config.apiDomain + 'Member/getCancelSms'; // 获取注销验证码接口
const LogoutAccountURL = config.apiDomain + 'Member/logoutAccount'; // 注销接口


function uinifyRequest(res) {

    var data = res.response;
    return new Promise((resolve, reject) => {

        if (data && data.header) {
            let { rspCode, rspDesc } = data.header;

            if (rspCode == '0') {
                resolve(data.body);
                wx.hideToast();

            } else {
                reject({
                    type: rspCode,
                    errMsg: rspDesc
                });
                wx.hideToast();
            }
        } else {
            reject({
                type: 1000,
                errMsg: '接口调用失败'
            });
            wx.hideToast();
        }

        // wx.hideToast()
    });
}


function formatResponse(res, callback) {

    var data = res.response;
    return new Promise((resolve, reject) => {

        if (data && data.header) {
            let { rspCode, rspDesc } = data.header;
            if (rspCode == '0') {
                resolve(data.body);
                callback && callback();
            } else {
                reject({
                    type: rspCode,
                    errMsg: rspDesc
                });
                callback && callback();
            }
        } else {
            reject({
                type: 1000,
                errMsg: '接口调用失败'
            });
            callback && callback();
        }

        // wx.hideToast()
    });

}

// 获取出发城市列表 城市服务出发城市
function getBusCityDepartures(params) {
    tip.loading();
    return post(BusCityDeparturesURL, params).then(function (res) {
        wx.hideToast();
        return new Promise((resolve, reject) => {
            resolve(res);
        }
        );
    });
}

// 获取出发城市列表 
function getBusDepartures(params) {
    tip.loading();
    return post(BusDeparturesURL, params).then(function (res) {
        wx.hideToast();
        return new Promise((resolve, reject) => {
            resolve(res);
        }
        );
    });
}

// 根据出发城市获取到达城市列表
function getBusDestinations(params) {
    tip.loading();
    return post(BusDestinationsURL, params).then(function (res) {
        wx.hideToast();
        return new Promise((resolve, reject) => {
            resolve(res);
        });
    });
}

function getAnnouceList(params) {
    return post(PAGEANNOUCEURL, params).then(function (res) {
        return formatResponse(res);
    });

}

function getAdImgList(params) {
    return post(PAGEADIMGURL, params).then(function (res) {
        return formatResponse(res);
    });

}

// 可订日历

function getBusSaleDay(data) {

    return post(BusSaleDayURL, data);
}

/**
 * @param "body" : {
		    "pageIndex" : "1",
		    "destination" : "xx",
		    "pageSize" : "20",
		    "categoryList" : [
		    ],
		    "departure" : "常州",
		    "orderType" : "1",
		    "dptDate" : "2016-12-02"
		  }
 *
 */

// 车次列表
function getSchedule(params) {

    // tip.loading();
    return post(BusSchedulesURL, params).then(function (res) {
        return formatResponse(res);
    });
}

//推荐线路
function getProductRecommend(params){
    return post(GetProductRecommendURL, params).then(function (res) {
        return formatResponse(res);
    });
}

//汽车票置顶推荐
const getOtherProductRecommend = params => {
    return request(PAGEADIMGIDURL, "getproductrecommend", params, true).then(
        function(res) {
        return resHandler(res);
        }
    );
};

// 订单列表

function getOrderList(data) {
    tip.loading();
    return post(orderListURL, data,true).then(function (res) {
        return uinifyRequest(res);
    });
}

// 获取用户绑定状态

function getBindStatus(data) {
    return post(bindStatusURL, data,true).then(function (res) {
        return uinifyRequest(res);
    });
}




// 绑定手机

function bindMobile(data) {
    return post(bindMobileURL, data,true).then(function (res) {
        return uinifyRequest(res);
    });
}

// 修改手机

function modificationMobile(data) {
    return post(modificationMobileURL, data, true).then(function (res) {
        return uinifyRequest(res);
    });
}
/* 
    微信授权 
*/
function bindMobileByWeixin(data) {
    return post(bindMobileByWeixinURL, data,true).then(function (res) {
        return uinifyRequest(res);
    });
}

/* 
    微信授权  member/addinvitationcode
*/
function addinvitationcode(data) {
    return post(addinvitationcodeURL, data,true).then(function (res) {
        return uinifyRequest(res);
    });
}

/* 
    微信解绑
*/
function unbindMobile(){
    return post(unbindMobileURL, {},true).then(function (res) {
        return uinifyRequest(res);
    });
    
}


/*
 获取保险
 */
function postPackageList(params) {
    if (params.showToast) {
        tip.loading();
    }
    return post(PackageListURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}


/*
 获取汽车票订单详情
 */
function postOrderDetail(params) {

    tip.loading();
    return post(OrderDetailURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}

/*
 获取常旅列表
 */
function postLinkerList(params) {
    tip.loading();
    return post(GetLinkerURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}


/*
 添加常旅
 */
function postAddLinker(params) {
    tip.loading();
    return post(AddLinkerURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}


/*
 修改常旅
 */
function postUpdateLinker(params) {
    tip.loading();
    return post(UpdateLinkerURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}


/*
 删除常旅
 */
function deleteLinker(params) {
    return post(`${config.apiDomain}Linker/DeleteLinker`, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}



/*
 修改常旅
 */
function getRealNameInfo(params) {
    tip.loading();
    return post(GetRealNameInfoURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}

/*
 汽车票创建订单
 */
function postCreateOrder(params) {

    return post(CreateOrderURL, params,true).then(function (res) {
        return formatResponse(res);

    });
}

/* 
* 获取立减
*/
function postGetConfigByLine(params) {
    tip.loading();
    return post(GetConfigByLineURL, params,true).then(function (res) {
        return formatResponse(res);

    });
}

/*
 公共支付
 */
function postMobileGateway(params) {

    return post(MobileGateway, params).then(function (res) {
        return formatResponse(res);

    });
}

/*
 汽车票申请退票
 */
function postRefundOrder(params) {
    tip.loading();
    return post(RefundOrderURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}
/*
 汽车票取消订单
 */
function postCancelOrder(params) {
    tip.loading();
    return post(CancelOrderURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}

/**
 * 汽车票删除订单 
 *
 */
function deleteOrderById(params) {
    return post(DeleteOrderURL, params,true).then(function (res) {
        return uinifyRequest(res);
    });
}

/**
 * 获取验证码 SendValidateSmsURL
 * 
 */

function sendValidateSms(params) {
    return post(SendValidateSmsURL, params,true);
}



/*
 汽车票退票进度
 */
function postBusRefoundProgress(params) {
    tip.loading();
    return post(BusRefoundProgressURL, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}
/*
 获取一元免单中奖列表
 */
function postGetFreeOrderList(params) {
    tip.loading();
    return post(GetFreeOrderList, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}
/*
 获取用户一元免单订单
 */
function postGetUserOrderList(params) {
    tip.loading();
    return post(GetUserOrderList, params,true).then(function (res) {
        return uinifyRequest(res);

    });
}

/*
 获取节日
 */
function getHolidaysByDate(params) {
    return post(GetHolidaysURL, params).then(function (res) {
        return uinifyRequest(res);
    });
}

//订阅消息
function postSubscribe(params) {
    return post(memberSubscribeUrl, params,true).then((res) => {
        return uinifyRequest(res);
    });
}

//获取一元保险
function getOnePackage(params) {
    return post(BusGetOnePackageURL, params,true).then(function (res) {
        return formatResponse(res);
    });
}


//异常账号处理接口
function handleAbnormalAccount(params) {
    return post(handleAbnormalAccountUrl, params,true).then(function (res) {
        return formatResponse(res);
    });
}

//验证汽车票接口是否已经停售
function getScheduleDataConfirm(params) {
    return post(BusScheduleDataConfirmURL, params,true).then(function (res) {
        return formatResponse(res);
    });
}

const getAdvPicturePublic = (params) => {
    return request(publicURL,'getadvpicture', params).then(function (res) {
        return resHandler(res);
    });
}

//身份证识别
const getIdcardanalyze = (params) => {
    return request(publicURL,'idcardanalyze', params,true).then(function (res) {
        return resHandler(res);
    });
}

const getwxgzbindState = (params) => {
    return request(publicURL,'getwxgzbind', params,true).then(function (res) {
        return resHandler(res);
    });
}

/**
 * 注销相关
 * 
 */
// 获取注销验证码 
function getCancelSms(params) {
    return post(GetCancelSmsURL, params,true);
}

//验证是否可注销
function validCancel(params) {
    return post(ValidCancelURL, params,true);
}

//注销
function logoutAccount(params) {
    return post(LogoutAccountURL, params,true);
}


//获取用户授权信息 openid 
function getAuthorizationOpenId(params) {
    return post(authorizationUrl + '?t=getopenidbycode', params).then((res)=>{
        return resHandler(res);
      });
}
//获取用户授权信息 unionid 
function getAuthorizationUnionId(params) {
    return post(authorizationUrl + '?t=getunionid', params).then((res)=>{
        return resHandler(res);
      });
}

//获取极速出票政策
const getBuspolicyList = (params) => {
    return post(`${config.apiDomain}Common/GetPolicyList`, params,true).then(function (res) {
        return formatResponse(res);
    });
}


//获取极速出票政策X详情 Common/GetPolicyOrderDetail
const getPolicyOrderDetail = (params) => {
    return post(`${config.apiDomain}Common/GetPolicyOrderDetail`, params,true).then(function (res) {
        return formatResponse(res);
    });
}

/* 
    电子发票
*/

//获取申请发票信息接口
const getApplyInvoiceInfo = params => {
    return post(`${config.apiDomain}Invoice/GetApplyInvoiceInfo`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

//提交发票信息
const applyInvoice = params =>{
    return post(`${config.apiDomain}Invoice/ApplyInvoice`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

//获取发票申请进度和信息
const getInvoiceSchedule = params =>{
    return post(`${config.apiDomain}Invoice/GetInvoiceSchedule`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

//发送电子发票和行程单
const sendInvoice = params =>{
    return post(`${config.apiDomain}Invoice/SendInvoice`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}


//免密支付
const weChatSecretFreeSign = params =>{
    return post(`${config.apiDomain}pay/WeChatSecretFreeSign`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

//保存实名
const saveMemberRealnameAuth = params =>{
    return post(`${config.apiDomain}Member/MemberRealnameAuth`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}


/* 
    电子发票 end
*/
//查询单个常旅信息
const querySingleLinker = params =>{
    return post(QuerySingleLinkerURL, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

//atm支付接口
const getAtmPay = params =>{
    return post(`${config.apiDomain}atm/GetAtmPay`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}
const getAtmOrderInfo = params =>{
    return post(`${config.apiDomain}atm/GetAtmOrderInfo`, params,true).then(function (res) {
        return formatResponse(res);
    }); 
}

function getMerchantAdByPost(params) {
    return post(`${config.apiDomain}Common/GetMerchantAd`, params).then(res => {
      return formatResponse(res);
    });
  }

//查询微信服务通知是否已绑定手机
const getSubscribeBindStatus=params=>{
    return request(
      `${config.memberHandler}`,
      "getbindstatus",
      params,
      true
    ).then(function(res) {
      return resHandler(res);
    });
  }

//领取返程红包
const sendRecommendCoupon = params => {
    return request(
      `${config.redPackHandler}`,
      "sendrecommendcoupon",
      params,
      true
    ).then(function(res) {
      return resHandler(res);
    });
};

//获取用户未订阅内容_getnotsubscribes
const getNotSubscribes = params => {
    return request(publicURL, "getnotsubscribes", params, true).then(function(
        res
    ) {
        return resHandler(res);
    });
};

//订阅结果回调
const successSubscribes = params => {
    return request(publicURL, "successsubscribes", params, true).then(function(
        res
    ) {
        return resHandler(res);
    });
};

//获取立减活动详情_reduceactivitydetail
const getReduceActivityDetail = params => {
    return request(
      `${config.publichandler}`,
      "reduceactivitydetail",
      params,
      true
    ).then(function(res) {
      return resHandler(res);
    });
  };

const getMerChantad = params => {
    return request(PAGEADIMGIDURL, "getmerchantad", params).then(function(
        res
    ) {
        return resHandler(res);
    });
};

module.exports = {
    postCreateOrder: postCreateOrder,
    postOrderDetail: postOrderDetail,
    getBusDepartures: getBusDepartures,
    getBusDestinations: getBusDestinations,
    getAnnouceList: getAnnouceList,
    getAdImgList: getAdImgList,
    getSchedule: getSchedule,
    postPackageList: postPackageList,
    getBusSaleDay: getBusSaleDay,
    getOrderList: getOrderList,
    postLinkerList: postLinkerList,
    postAddLinker: postAddLinker,
    postUpdateLinker: postUpdateLinker,
    deleteLinker,
    getBindStatus: getBindStatus,
    bindMobile: bindMobile,
    modificationMobile: modificationMobile,
    postRefundOrder: postRefundOrder,
    postCancelOrder: postCancelOrder,
    postBusRefoundProgress: postBusRefoundProgress,
    postMobileGateway: postMobileGateway,
    deleteOrderById: deleteOrderById,
    sendValidateSms: sendValidateSms,
    postGetFreeOrderList: postGetFreeOrderList,
    postGetUserOrderList: postGetUserOrderList,
    getHolidaysByDate: getHolidaysByDate,
    getRealNameInfo,
    postGetConfigByLine,
    bindMobileByWeixin,
    postSubscribe,
    getBusCityDepartures,
    getOnePackage,
    handleAbnormalAccount,
    getScheduleDataConfirm,
    addinvitationcode,
    getAdvPicturePublic,
    getIdcardanalyze,
    getwxgzbindState,
    getCancelSms,
    validCancel,
    logoutAccount,
    unbindMobile,
    getProductRecommend,
    getAuthorizationOpenId,
    getAuthorizationUnionId,
    getBuspolicyList,
    getPolicyOrderDetail,
    getApplyInvoiceInfo,
    applyInvoice,
    getInvoiceSchedule,
    sendInvoice,
    weChatSecretFreeSign,
    saveMemberRealnameAuth,
    querySingleLinker,
    getAtmPay,
    getAtmOrderInfo,
    getMerchantAdByPost,
    getSubscribeBindStatus,
    sendRecommendCoupon,
    getOtherProductRecommend,
    getNotSubscribes,
    successSubscribes,
    getReduceActivityDetail,
    getMerChantad
};
