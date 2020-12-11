var util = require('util.js'),
    location = require('location.js'),
    userInfo = require('userInfo.js'),
    configs = require('config.js'),
    eventUrl = configs.eventUrl,
    pageUrl = configs.pageUrl,

    config = {
        pagename: "",//一个完整视图的名称
        orgpagename: "",//当前页面的上级页面名称
        resourceid: "",//详情页资源id
        platcode: "",//平台码
        productcode: "",//产品码
        category: "",
        action: "",
        label: "",
        value: "",
        serialid:""
    },
    selfData = {
        openid: "",//用户身份唯一标识
        userid: "",
        platcode: "10015",
        country: "",//国家
        province: "",//省份
        city: "",//城市
        county: "",//区县
        sessionid: "",//会话ID
        pagecount: "",//页面PV
        sessioncount: "",//页面UV
        appId:configs.appId || "",
        appVersion:configs.appVersion || "",
    };
function isObject(obj) {
    return ({}).toString.call(obj) === "[object Object]";
}

function setLocation() {
    location.location({
        cache: true,
        callback: function (data) {
            if (!data.locationFail) {
                var cnNamePath = data.P_cnname_path;
                cnNamePath = cnNamePath.split(",");
                selfData.country = cnNamePath[1];
                selfData.province = cnNamePath[2];
                selfData.city = cnNamePath[3];
            }
        }
    });
}

// setLocation();

function setSessionId() {

    var sessionId = wx.getStorageSync('_tc_wx_session_id');

    if (sessionId) {
        var now = +new Date();
        if (now - sessionId > 1800000) {
            try {
                wx.setStorageSync("_tc_wx_session_id", +new Date());
            } catch (e) {    
            }
            resetPagePv();//清除后重新计数
            setPagePv();
            setPageUv();//UV开始计算
        }
        else {
            setPagePv();//开始从1计数
        }
    }
    else {
        try {
            wx.setStorageSync("_tc_wx_session_id", +new Date());
        
        } catch (e) {    
        }
        setPagePv();//开始从1计数
        setPageUv();//UV开始计算
    }
}

function getSessionId() {
    return wx.getStorageSync('_tc_wx_session_id');
}

function resetPagePv() {
    try {
        wx.setStorageSync("_tc_page_pv", "");
    
    } catch (e) {    
    }
}

//页面访问次数
function setPagePv() {
    var pagePv = wx.getStorageSync('_tc_page_pv');

    try {
        if (pagePv) {
            wx.setStorageSync("_tc_page_pv", ++pagePv);
        }
        else {
            wx.setStorageSync("_tc_page_pv", 1);
        }
    } catch (e) {    
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
    try {
        if (pageUv) {
            wx.setStorageSync("_tc_page_uv", ++pageUv);
        }
        else {
            wx.setStorageSync("_tc_page_uv", 1);
        }
    } catch (e) {    
    }
    
}

function eventParamsCheck(oEvent) {
    if (oEvent.settings.debug) {

        if (!selfData.appId) {
            throw new Error("appId不能为空！");
        }

        if (!selfData.appVersion) {
            throw new Error("appVersion不能为空！");
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
    }
    else {
        return !!oEvent.settings.pagename
            && !!selfData.platcode
            && !!oEvent.settings.productcode
            && !!oEvent.settings.category
            && !!oEvent.settings.action
            && !!oEvent.settings.label
            && !!oEvent.settings.value
            && !!selfData.appId
            && !!selfData.appVersion;
    }

}

function pageParamsCheck(page) {
    if (page.settings.debug) {
        if (!selfData.appId) {
            throw new Error("appId不能为空！");
        }

        if (!selfData.appVersion) {
            throw new Error("appVersion不能为空！");
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
    }
    else {
        return !!page.settings.pagename
            && !!selfData.platcode
            && !!page.settings.productcode
            && !!getSessionId()
            && !!getPagePv()
            && !!getPageUv()
            && !!selfData.appId
            && !!selfData.appVersion;
    }

}

function setOpenId(cb) {
    userInfo.getOpenid(function (openId) {
        selfData.openid = openId;
        cb && cb();
    });
}

function Page(settings) {
    if (!(this instanceof Page)) return new Page(settings);

    this.init(settings);
}

function EV(settings) {
    if (!(this instanceof EV)) return new EV(settings);

    this.init(settings);
}

function setPageName(tracer) {
    isObject(tracer.settings.pagename) && (tracer.settings.pagename = tracer.settings.pagename["__route__"]);
}

EV.prototype = {
    constructor: EV,
    init: function (settings) {
        this.settings = util.extend({}, config, settings);
        setPageName(this);
    },
    submit: function () {
        var that = this;
        if (eventParamsCheck(that)) {


            setOpenId(function () {
                if (!selfData.openid) {
                    throw new Error("openid不能为空！");
                }


                if (that.settings.debug) {
                    console.log("event data:");
                    console.log({
                        oid: selfData.openid,
                        pn: that.settings.pagename,
                        plc: selfData.platcode,
                        sid: getSessionId(),
                        pc: getPagePv(),
                        sc: getPageUv(),
                        pdc: that.settings.productcode,
                        ctg: that.settings.category,
                        ac: that.settings.action,
                        lb: that.settings.label,
                        vl: that.settings.value,
                        uid: selfData.userid,
                        ctry: selfData.country,
                        pv: selfData.province,
                        ct: selfData.city,
                        cty: selfData.county,
                        appid:selfData.appId,
                        appv:selfData.appVersion
                    });
                }
                wx.request({
                    url: eventUrl,
                    method: "POST",
                    data: encodeURIComponent(JSON.stringify({
                        appid:selfData.appId,
                        appv:selfData.appVersion,
                        oid: selfData.openid,
                        sid: getSessionId(),
                        pc: getPagePv(),
                        sc: getPageUv(),
                        pn: that.settings.pagename,
                        plc: selfData.platcode,
                        pdc: that.settings.productcode,
                        ctg: that.settings.category,
                        ac: that.settings.action,
                        lb: that.settings.label,
                        vl: that.settings.value,
                        uid: selfData.userid,
                        ctry: selfData.country,
                        pv: selfData.province,
                        ct: selfData.city,
                        cty: selfData.county
                    }))
                });
            });
        }
    }
};

Page.prototype = {
    constructor: Page,
    init: function (settings) {
        this.settings = util.extend({}, config, settings);
        setSessionId();//设置sessionId
        setPageName(this);
    },
    submit: function () {
        var that = this;
        if (pageParamsCheck(that)) {
            setOpenId(function () {
                if (!selfData.openid) {
                    throw new Error("openid不能为空！");
                }

                if (that.settings.debug) {
                    console.log("page data:");
                    console.log({
                        oid: selfData.openid,
                        pn: that.settings.pagename,
                        sid: getSessionId(),
                        pc: getPagePv(),
                        sc: getPageUv(),
                        plc: selfData.platcode,
                        pdc: that.settings.productcode,
                        uid: selfData.userid,
                        opn: that.settings.orgpagename,
                        rsid: that.settings.resourceid,
                        ctry: selfData.country,
                        pv: selfData.province,
                        ct: selfData.city,
                        cty: selfData.county,
                        appid:selfData.appId,
                        appv:selfData.appVersion,
                        serialid:that.settings.serialid
                    });
                }

                wx.request({
                    url: pageUrl,
                    method: "POST",
                    data: encodeURIComponent(JSON.stringify({
                        oid: selfData.openid,
                        pn: that.settings.pagename,
                        sid: getSessionId(),
                        pc: getPagePv(),
                        sc: getPageUv(),
                        plc: selfData.platcode,
                        pdc: that.settings.productcode,
                        uid: selfData.userid,
                        opn: that.settings.orgpagename,
                        rsid: that.settings.resourceid,
                        ctry: selfData.country,
                        pv: selfData.province,
                        ct: selfData.city,
                        cty: selfData.county,
                        appid:selfData.appId,
                        appv:selfData.appVersion,
                        serialid:that.settings.serialid
                    }))
                });


            });


        }

    }
};

module.exports = {
    page: Page,
    event: EV
};
