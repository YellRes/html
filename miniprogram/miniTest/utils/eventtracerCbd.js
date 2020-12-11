var util = require('util.js'),
    location = require('location.js'),
    eventUrl = "https://wx.17u.cn/wireless/monitor/wx/common/event",
    pageUrl = "https://wx.17u.cn/wireless/monitor/wx/common/pageview",
    eleventUrl = 'https://ub.elong.com/tj/t.gif',
    app = require('config.js'),
    config = {
        pagename: "", //一个完整视图的名称
        orgpagename: "", //当前页面的上级页面名称
        resourceid: "", //详情页资源id
        platcode: "", //平台码
        productcode: "", //产品码
        category: "",
        action: "",
        label: "",
        value: "",
        serialid: "",
        prepayid: '',
        unionid: '',
        memberid: '',
        innerRefid:'',
        expandfield:'',
        rpagename:'',//根页面名称
        pagestate:'',//页面状态
        pagedetail:'',//页面浏览详情
        eventid:0,//事件id
        stayTime:0,
        immediately:false,//是否立即上报
    },
    elconfig = {
        et:'',//事件类型
        pt:'',//页面名称
        cspot: '',//点击位名称，仅et为click事件才赋值
        tri: '',//info名称，用来区分不同的info事件，通常指定为触发info事件的click或show
        etinf: '',//自定义扩展字段，json格式
        if: '',//标识专题与活动
        of: '',//标识唤起APP的访问来源，或者跳转到H5的外部来源
        ch: '',//频道入口标识，由首页点击位赋值
        
        pturl: '',//页面url show事件需要记录
    },
    elSelfData = {
        bns: 3,//代码类型，区分H5、APP与pc的标识，小程序为3
        ct: 5,//容器（端），可以和bns使用区分小程序内嵌h5， 小程序5
        cid: '',//区分用户的唯一标识，openid
        orderfrom: 60001,//订单来源，继承老的业绩统计orderfrom字段
        snum: '',//unionid
        pid: '',//openid
        ecrd: '',//会员卡号
        dt: '',//1—Iphone，2—Ipad，3—Android，5—Winphone,7—PC，8—androidpad，9—windowspad，99—Unkown 设备类型
        chid: 'wxqbh5',//channelid 或者ref的值
        lat: '',//当前用户定位 纬度
        lng: '',//当前用户定位 经度
        cty: '北京',//用户所在城市
        ca: '',//浏览器UserAgent
        mvt: 'test',//实验分组信息
        st: '',//日志记录时间 时间戳，客户端时间，会校准
        hoff: '',//场景值
        net:'',//网络类型
        wxrefid:'',
    },
    selfData = {
        openid: "", //用户身份唯一标识
        userid: "",
        platcode: "10015",
        country: "", //国家
        province: "", //省份
        city: "", //城市
        county: "", //区县
        sessionid: "", //会话ID
        pagecount: "", //页面PV
        sessioncount: "", //页面UV
        appId: app.appId || "",
        appVersion: app.appVersion || "",
        unionid: '',
    },
    baseInfo = {
        appid: app.appId || "",
        appv: app.appVersion || "",
        // oid,
        // sid,
        plc:'10015',
        // uid,
        // ctry,
        // pv,
        // ct,
        // cty,
        // unionid,
        // wxappScene

    };
// 艺龙酒店埋点数据处理
function elSelfDataDeal() {
    if (!elSelfData.lat || !elSelfData.lng){
        let location = wx.getStorageSync('hotel-location-info') || {};
        elSelfData.cty = location.name || elSelfData.cty
        elSelfData.lat = location.lat || elSelfData.lat
        elSelfData.lng = location.lng || elSelfData.lng
    }
    elSelfData.st = new Date()*1;
    elSelfData.hoff = getApp().globalData.scene;
    elSelfData.wxrefid = getApp().globalData.wxrefid;
    if(!elSelfData.ecrd){
        // userInfo.getElongCardNo().then(res=>{
        //     elSelfData.ecrd = res.cardNo || ''
        // })
        elSelfData.ecrd = wx.getStorageSync('elong.elCardNo') || ''
    }
    if (!elSelfData.wallet){
        elSelfData.opens = ['', 'tcqb_xcx', 'elqb_xcx'][getApp().globalData.wallet] || '';
    }
    if (!elSelfData.cid || !elSelfData.snum){
        elSelfData.cid = elSelfData.pid = wx.getStorageSync('tongcheng.openid');
        elSelfData.snum = wx.getStorageSync('tongcheng.unionid');
    }
    // if (!elSelfData.snum){
    //     userInfo.getUnionidPromise().then(res=>{
    //         elSelfData.snum = res.unionid;
    //         elSelfData.cid = elSelfData.pid = res.openId;
    //     })
    // }
    if (!elSelfData.mvt){
        elSelfData.mvt = wx.getStorageSync('elong.mvt') || '';
    }
    if(!elSelfData.dt){
        let SystemInfo = wx.getSystemInfoSync();
        elSelfData.ca = SystemInfo;
        if (SystemInfo.system.indexOf('iOS')>=0){
            if (SystemInfo.model.indexOf('iPhone')>=0){
                elSelfData.dt = 1;
            }else{
                elSelfData.dt = 2;
            }
        } else if (SystemInfo.system.indexOf('Android') >= 0) {
            if (SystemInfo.model.indexOf('pad') >= 0) {
                elSelfData.dt = 8;
            } else {
                elSelfData.dt = 3;
            }
        }else{
            elSelfData.dt = 99;
        }
    }
    if (!elSelfData.net){
        wx.getNetworkType({
            success: function(res) {
                elSelfData.net = res.networkType || ''
            },
        })
    }
}


function isObject(obj) {
    return ({}).toString.call(obj) === "[object Object]";
}

function setLocation() {
    // if (selfData.city) return;
    let commonLocationCache = wx.getStorageSync('commonLocationCache')
    // if (selfData.city && ) return;
    if (commonLocationCache && commonLocationCache.data){
        let data = commonLocationCache.data || {};
        let detail = data.detail || {}
        let ad_info = detail.ad_info || {}
        if (ad_info.nation_code != 156) {//国外
            let address_component = detail.address_component || {}
            selfData.country = address_component.nation;
            selfData.province = address_component.ad_level_1;
            selfData.city = address_component.locality;
            selfData.county = address_component.ad_level_2 || '';
        } else {//国内
            selfData.country = ad_info.nation;
            selfData.province = ad_info.province;
            selfData.city = ad_info.city;
            selfData.county = ad_info.district || '';
        }
    }
}

// 设置网络类型
function setConnection(){
    
    if (selfData.Connection) return;
    wx.getNetworkType({
        success: function (res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            selfData.Connection = res.networkType
        }
    })
}
wx.onNetworkStatusChange && wx.onNetworkStatusChange(function (res) {
    selfData.Connection = res.networkType
})
setConnection()
function setSessionId(type) {//type=1是重新生成sessionid
    var sessionId = wx.getStorageSync('_tc_wx_session_id');
    var now = +new Date();
    if (type==1 || !sessionId || now - sessionId > 1800000) {
        wx.setStorageSync("_tc_wx_session_id", +new Date())
        resetPagePv(); //清除后重新计数
        setPageUv(); //UV开始计算
    }
}

// function setSessionId() {

//     var sessionId = wx.getStorageSync('_tc_wx_session_id');

//     if (sessionId) {
//         var now = +new Date();
//         if (now - sessionId > 1800000) {
//             wx.setStorageSync("_tc_wx_session_id", +new Date())
//             resetPagePv(); //清除后重新计数
//             setPagePv()
//             setPageUv(); //UV开始计算
//         } else {
//             setPagePv(); //开始从1计数
//         }
//     } else {
//         wx.setStorageSync("_tc_wx_session_id", +new Date())
//         setPagePv(); //开始从1计数
//         setPageUv(); //UV开始计算
//     }
// }

function getSessionId() {
    return wx.getStorageSync('_tc_wx_session_id');
}

function resetPagePv() {
    try {
        wx.setStorageSync("_tc_page_pv", "")
    }catch(e) { 
        wx.setStorageSync("_tc_page_pv", "")
    }
}
//页面访问次数
function setPagePv() {
    var pagePv = wx.getStorageSync('_tc_page_pv');

    try{
        if (pagePv) {
            wx.setStorageSync("_tc_page_pv", ++pagePv)
        } else {
            wx.setStorageSync("_tc_page_pv", 1)
        }
    }catch(e){
        if (pagePv) {
            wx.setStorageSync("_tc_page_pv", ++pagePv)
        } else {
            wx.setStorageSync("_tc_page_pv", 1)
        }  
    }
}

function getPageUv() {
    return wx.getStorageSync('_tc_page_uv');
}

function getPagePv() {
    return wx.getStorageSync('_tc_page_pv');
}


function setPageUv() {
    var pageUv = wx.getStorageSync('_tc_page_uv');
    if (pageUv) {
        wx.setStorageSync("_tc_page_uv", ++pageUv)
    } else {
        wx.setStorageSync("_tc_page_uv", 1)
    }
}

function eventParamsCheck(oEvent) {
    if (oEvent.settings.debug) {

        if (!selfData.appId) {
            throw new Error("appId不能为空！");
        }

        if (!oEvent.settings.pagename) {
            throw new Error("pagename不能为空！");
        }

        if (!selfData.platcode) {
            throw new Error("platcode不能为空！");
        }

        if (!oEvent.settings.productcode) {
            throw new Error("productcod不能为空！");
        }

        if (!oEvent.settings.category) {
            throw new Error("category不能为空！");
        }

        if (!oEvent.settings.action) {
            throw new Error("action不能为空！");
        }

        if (!oEvent.settings.label) {
            throw new Error("label不能为空！");
        }

        if (!oEvent.settings.value) {
            throw new Error("value不能为空！");
        }

        return true;
    } else {
        return !!oEvent.settings.pagename &&
            !!oEvent.settings.productcode &&
            !!oEvent.settings.category &&
            !!oEvent.settings.action &&
            !!oEvent.settings.label &&
            !!oEvent.settings.value
    }
}
function elEventParamsCheck(oElEvent) {

    return !!oElEvent.settings.et &&
        !!oElEvent.settings.pt &&
        !!elSelfData.cid &&
        !!elSelfData.pid
}

function pageParamsCheck(page) {
    if (page.settings.debug) {

        if (!selfData.appId) {
            throw new Error("appId不能为空！");
        }

        if (!page.settings.pagename) {
            throw new Error("pagename不能为空！");
        }

        if (!selfData.platcode) {
            throw new Error("platcode不能为空！");
        }

        if (!page.settings.productcode) {
            throw new Error("productcode不能为空！");
        }

        if (!getSessionId()) {
            throw new Error("sessionId不能为空！");
        }

        if (!getPagePv()) {
            throw new Error("pv不能为空！");
        }

        if (!getPageUv()) {
            throw new Error("uv不能为空！");
        }

        return true;
    } else {
        return !!page.settings.pagename &&
            !!selfData.platcode &&
            !!page.settings.productcode &&
            !!getSessionId() &&
            !!getPagePv() &&
            !!getPageUv() &&
            !!selfData.appId &&
            !!selfData.appVersion
    }

}
/*
function setOpenId(cb,that) {
    if (that){
        if (that.settings.label == 'login_fail' || that.settings.label == 'openid_fail' || that.settings.label == 'openid_none'){
            selfData.openid = wx.getStorageSync('tongcheng.openid')||'';
            baseInfo.oid = selfData.openid
            cb && cb();
        }else{
            userInfo.getOpenid(function (openId) {
                selfData.openid = openId;
                baseInfo.oid = selfData.openid
                cb && cb();
            }, function () {
                // selfData.openid = '';
                cb && cb();
            });
        }
    }else{
        userInfo.getOpenid(function (openId) {
            selfData.openid = openId;
            baseInfo.oid = openId
            cb && cb();
        }, function () {
            // selfData.openid = '';
            cb && cb();
        });
    }
}
*/


function Page(settings) {
    if (!(this instanceof Page)) return new Page(settings);
    this.init(settings)
}

function EV(settings) {
    if (!(this instanceof EV)) return new EV(settings);
    this.init(settings)
}
function elEV(settings) {
    if (!(this instanceof elEV)) return new elEV(settings);
    elSelfDataDeal();
    this.init(settings)
}
function setPageName(tracer) {
    isObject(tracer.settings.pagename) && (tracer.settings.pagename = tracer.settings.pagename["__route__"]);
}

var systemInfo = {}
// wx.removeStorageSync('_tc_wx_system_info')//清除手机系统信息历史记录
function getSystemInfo(cb) {
    if (systemInfo.brand) {
        cb && cb(systemInfo)
    } else {
        try{
            systemInfo = wx.getSystemInfoSync()
            cb && cb(systemInfo)
        }catch(e){
            wx.getSystemInfo({
                success: function (res) {
                    systemInfo = res
                    // wx.setStorageSync('_tc_wx_system_info', res);
                    cb && cb(res)
                }
            })
        }
        
        
    }
}

var isArray = Array.isArray ||
    function (object) {
        return object instanceof Array
    }
function getwxrefid(){
    let pages = getCurrentPages();
    let wxrefid = getApp().globalData.wxrefid || '319527329'
    if(pages.length){
        let currentPage = pages[pages.length - 1]
        wxrefid = (currentPage.options || {}).wxrefid || wxrefid
    }
    return wxrefid
}

function stay() {
    if (!(this instanceof stay)) return new stay();
    this.init()
}


stay.prototype = {
    constructor: stay,
    init: function() {
        this.startTime = 0;
        this.endTime = 0;
        this.costTime = 0;
    },
    start: function() {
        this.startTime = +new Date();
    },
    end: function() {
        this.endTime = +new Date();
    },
    cost: function() {
        this.end();
        this.costTime = this.endTime - this.startTime;
        return this.costTime;
    }
}


var EVArr = []
var evTimeout = ''
EV.prototype = {
    constructor: EV,
    init: function(settings) {
        this.settings = util.extend({}, config, settings);
        setPageName(this)
    },
    submit: function() {
        var that = this;
        setLocation();
        
        // setConnection();
        if (eventParamsCheck(that)) {
                // if (!selfData.openid) {
                //     throw new Error("openid不能为空！");
                // }
                getSystemInfo(function(res) {
                    var data = {};
                    // res.brand && (data.brand = res.brand);
                    // res.model && (data.model = res.model);
                    // res.pixelRatio && (data.pixelRatio = res.pixelRatio);
                    // res.screenWidth && (data.screenWidth = res.screenWidth);
                    // res.screenHeight && (data.screenHeight = res.screenHeight);
                    // res.windowWidth && (data.windowWidth = res.windowWidth);
                    // res.windowHeight && (data.windowHeight = res.windowHeight);
                    // res.language && (data.language = res.language);
                    // res.version && (data.version = res.version);
                    // res.system && (data.system = res.system);
                    // res.platform && (data.platform = res.platform);
                    // res.fontSizeSetting && (data.fontSizeSetting = res.fontSizeSetting);
                    // res.SDKVersion && (data.SDKVersion = res.SDKVersion);
                    // data.appid = selfData.appId;
                    // data.appv = selfData.appVersion;
                    // data.oid = selfData.openid;
                    data.sid = getSessionId();
                    data.pc = getPagePv();
                    data.sc = getPageUv();
                    data.pn = that.settings.pagename;
                    // data.plc = selfData.platcode;
                    data.pdc = that.settings.productcode;
                    data.ctg = that.settings.category;
                    data.ac = that.settings.action;
                    data.lb = that.settings.label;
                    data.vl = that.settings.value;
                    data.expandfield = that.settings.expandfield;
                    // data.uid = wx.getStorageSync('tongcheng.memberid1');
                    // data.ctry = selfData.country;
                    // data.pv = selfData.province;
                    // data.ct = selfData.city;
                    // data.cty = selfData.county;
                    // data.unionid = wx.getStorageSync('tongcheng.unionid');
                    data.wxappScene = getApp().globalData.scene;
                    data.wallet = getApp().globalData.wallet;
                    data.refid = getwxrefid();
                    data.rpagename = that.settings.rpagename;
                    data.pagestate = that.settings.pagestate;
                    data.pagedetail = that.settings.pagedetail;
                    data.innerRefId = that.settings.innerRefid;
                    data.mvt = encodeURIComponent(JSON.stringify(getApp().globalData.tjObj));
                    data.eventid = that.settings.eventid;
                    data.cliktime = Date.now();
                    data.entertime = that.settings.entertime;
                    data.leavetime = that.settings.leavetime;
                    data.orgpagename = that.settings.orgpagename;
                    // data.network = selfData.Connection
                    if (that.settings.immediately) {
                        setBaseInfo();
                        let obj = {
                            ...data,
                            ...baseInfo
                        }
                        wx.request({
                            url: 'https://wx.17u.cn/trendapi/event',
                            method: "POST",
                            timeout: 8000,
                            header:{
                                "Content-Type": "text/plain"
                            },
                            data: encodeURIComponent(JSON.stringify(obj))
                        })
                        return false;
                    }
                    EVArr.push(data)
                    if (EVArr.length >= 10) {
                        clearTimeout(evTimeout)
                        postEV()
                        // let newArr = EVArr.splice(0,10);
                        // util.requestData({
                        //     url: eventUrl,
                        //     method: "POST",
                        //     timeout: 8000,
                        //     data: encodeURIComponent(JSON.stringify(newArr))
                        // })
                    }
                    clearTimeout(evTimeout)
                    evTimeout = setTimeout(() => {
                        postEV()
                        // if (EVArr.length > 0) {
                        //     let newArr = EVArr.splice(0, EVArr.length);
                        //     util.requestData({
                        //         url: eventUrl,
                        //         method: "POST",
                        //         timeout: 8000,
                        //         data: encodeURIComponent(JSON.stringify(newArr))
                        //     })
                        // }
                    }, 5000)
                })
        }
    }
}
function setBaseInfo() {
    if (!baseInfo.brand) {
        baseInfo.brand = systemInfo.brand;
        baseInfo.model = systemInfo.model;
        baseInfo.pixelRatio = systemInfo.pixelRatio;
        baseInfo.screenWidth = systemInfo.screenWidth;
        baseInfo.screenHeight = systemInfo.screenHeight;
        baseInfo.windowWidth = systemInfo.windowWidth;
        baseInfo.windowHeight = systemInfo.windowHeight;
        baseInfo.language = systemInfo.language;
        baseInfo.version = systemInfo.version;
        baseInfo.system = systemInfo.system;
        baseInfo.platform = systemInfo.platform;
        baseInfo.fontSizeSetting = systemInfo.fontSizeSetting;
        baseInfo.SDKVersion = systemInfo.SDKVersion;
    }
    if (!baseInfo.oid) {
        baseInfo.oid = selfData.openid || ''
    }
    if (!baseInfo.uid) {
        baseInfo.uid = wx.getStorageSync('tongcheng.memberid1');
    }
    if (!baseInfo.unionid) {
        baseInfo.unionid = wx.getStorageSync('tongcheng.unionid');
    }
    if (!baseInfo.ctry) {
        baseInfo.ctry = selfData.country;
        baseInfo.pv = selfData.province;
        baseInfo.ct = selfData.city;
        baseInfo.cty = selfData.county;
    }
}
var abtest = {};
function getAbtest(){
    // userInfo.getAbTesting(['20181003_eventclickAB','20181003_pageviewAB'], res => {
    //     abtest = res || {};
    // })
}
getAbtest();
function postEV(){
    if (EVArr.length > 0) {
        setBaseInfo();
        let newArr = EVArr.splice(0, EVArr.length);
        let obj = {};
        // if (abtest['20181003_eventclickAB'] == 'A'){
            obj = {
                ...baseInfo,
                _list: newArr
            }
            eventUrl = 'https://wx.17u.cn/wireless/monitor/wx/common/compressevent'
        // }else{
        //     newArr.forEach((n,i)=>{
        //         newArr[i] = {
        //             ...n,
        //             ...baseInfo
        //         }
        //     })
        //     obj = newArr
        // }
        
        wx.request({
            url: eventUrl,
            method: "POST",
            timeout: 8000,
            data: encodeURIComponent(JSON.stringify(obj))
        })
    }
}
var PageArr = [];
var pageTimeout = ''
Page.prototype = {
    constructor: Page,
    init: function(settings) {
        this.settings = util.extend({}, config, settings);
        // setSessionId(); //设置sessionId
        setPagePv(); //设置PV
        setPageName(this);
    },
    submit: function() {
        var that = this;
        if (pageParamsCheck(that)) {
            setLocation();
          setConnection();
                // if (!selfData.openid) {
                //     throw new Error("openid不能为空！");
                // }
                getSystemInfo(function(res) {
                    var data = {};
                    // res.brand && (data.brand = res.brand);
                    // res.model && (data.model = res.model);
                    // res.pixelRatio && (data.pixelRatio = res.pixelRatio);
                    // res.screenWidth && (data.screenWidth = res.screenWidth);
                    // res.screenHeight && (data.screenHeight = res.screenHeight);
                    // res.windowWidth && (data.windowWidth = res.windowWidth);
                    // res.windowHeight && (data.windowHeight = res.windowHeight);
                    // res.language && (data.language = res.language);
                    // res.version && (data.version = res.version);
                    // res.system && (data.system = res.system);
                    // res.platform && (data.platform = res.platform);
                    // res.fontSizeSetting && (data.fontSizeSetting = res.fontSizeSetting);
                    // res.SDKVersion && (data.SDKVersion = res.SDKVersion);
                    // data.oid = selfData.openid;
                    data.pn = that.settings.pagename;
                    data.sid = getSessionId();
                    data.pc = getPagePv();
                    data.sc = getPageUv();
                    // data.plc = selfData.platcode;
                    that.settings.stayTime && (data.stayTime = that.settings.stayTime);
                    data.pdc = that.settings.productcode;
                    // data.uid = selfData.userid || wx.getStorageSync('tongcheng.memberid1');
                    data.orgpagename = that.settings.orgpagename;
                    data.rsid = that.settings.resourceid;
                    data.innerRefId = that.settings.innerRefid;
                    data.expandfield = that.settings.expandfield;
                    data.adaid = that.settings.adaid;
                    // data.ctry = selfData.country;
                    // data.pv = selfData.province;
                    // data.ct = selfData.city;
                    // data.cty = selfData.county;
                    // data.appid = selfData.appId;
                    // data.appv = selfData.appVersion;
                    data.serialid = that.settings.serialid;
                    data.prepayid = that.settings.prepayid;
                    // data.unionid = wx.getStorageSync('tongcheng.unionid');
                    data.wxappScene = getApp().globalData.scene;
                    data.wallet = getApp().globalData.wallet;
                    data.rpagename = that.settings.rpagename;
                    data.pagestate = that.settings.pagestate;
                    data.pagedetail = that.settings.pagedetail;
                    data.mvt = encodeURIComponent(JSON.stringify(getApp().globalData.tjObj));
                  data.network = selfData.Connection
                    // if (that.settings.debug) {
                        // console.log("page data:");
                        // console.log(data);
                    // }
                    if (that.settings.immediately){
                        setBaseInfo();
                        let obj = {
                            ...data,
                            ...baseInfo
                        }
                        wx.request({
                            url: 'https://wx.17u.cn/trendapi/pageview',
                            method: "POST",
                            timeout: 8000,
                            header: {
                                "Content-Type": "text/plain"
                            },
                            data: encodeURIComponent(JSON.stringify(obj))
                        })
                        return false;
                    }
                    // if (abtest['20181003_pageviewAB'] != 'A') {
                    //     setBaseInfo();
                    //     let obj = {
                    //         ...data,
                    //         ...baseInfo
                    //     }
                    //     util.requestData({
                    //         url: pageUrl,
                    //         method: "POST",
                    //         timeout:8000,
                    //         data: encodeURIComponent(JSON.stringify(obj)),
                    //         complete: function() {
                    //             delete that.settings.stayTime;
                    //         }
                    //     })
                    // }else{
                        PageArr.push(data)
                        if (PageArr.length >= 5) {
                            clearTimeout(pageTimeout)
                            postPage()
                        }
                        clearTimeout(pageTimeout)
                        pageTimeout = setTimeout(() => {
                            postPage()
                        }, 5000)
                    // }
                })
        }
    },
    pageStay: function() {

    }
}
function postPage() {
    if (PageArr.length > 0) {
        setBaseInfo();
        let newArr = PageArr.splice(0, PageArr.length);
        let obj = {};
        obj = {
            ...baseInfo,
            _list: newArr
        }
        pageUrl = 'https://wx.17u.cn/wireless/monitor/wx/common/compresspageview';

        wx.request({
            url: pageUrl,
            method: "POST",
            timeout: 8000,
            data: encodeURIComponent(JSON.stringify(obj))
        })
    }
}
elEV.prototype = {
    constructor: elEV,
    init: function (settings) {
        this.settings = util.extend({}, elconfig, settings, elSelfData);
    },
    submit: function () {
        var that = this;
        setTimeout(()=>{
            // if (elEventParamsCheck(that)) {
                wx.request({
                    url: eleventUrl,
                    method: "GET",
                    timeout: 8000,
                    data: that.settings,
                })
            // }
        },0)
        
    }
}

module.exports = {
    page: Page,
    event: EV,
    stay: stay,
    elevent: elEV,
    setSessionId: setSessionId,
    postEV: postEV,
    postPage: postPage
};