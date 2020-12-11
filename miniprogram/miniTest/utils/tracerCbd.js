var EventTracer = require('eventtracerCbd.js')
var stay = EventTracer.stay();
var pageTracer = require('pageTracer.js')

function isFn(fn) {
    return typeof fn === 'function'
}
var app = getApp();

var pageNum = 0;
let adaid1 = '';
let refid = wx.getStorageSync('REFERID') || app.globalData['refid'] || "";
var trace = {
    page: function (pagename, productCode, orgpagename, resourceid, serialid, prepayid, unionid, innerRefid, expandfield, adaid, rpagename = '', pagestate = '', pagedetail = '', immediately=false) {
        adaid1 = adaid || adaid1;
        app = app || getApp();
        var wxrefid;
        var reg = new RegExp("(^|&)wxrefid=([^&]*)(&|$)", "i");
        if (app.globalData.wxrefid == null) {
            if (pagename.indexOf('wxrefid=') > 0) {
                 wxrefid = pagename.split('?')[1].match(reg)[2];
                if (wxrefid && wxrefid != 'undefined') {
                    // 针对汽车票线下渠道处理wxrefid
                    //   if (pagename.split('?')[0] == 'page/bus/webapp/list/list') {
                    //     wxrefid = wxrefid.slice(0, -2);
                    //   }
                    app.globalData.wxrefid = wxrefid;
                }
            }
        } else if (pagename.indexOf('wxrefid=') < 0) {
             wxrefid = pagename.indexOf('?') < 0 ? '?wxrefid=' : '&wxrefid='
            pagename = pagename + wxrefid + app.globalData.wxrefid;
        } else {
             wxrefid = pagename.split('?')[1].match(reg)[2];
            if (wxrefid && wxrefid == 'undefined') {
                pagename = pagename.replace(wxrefid, app.globalData.wxrefid);
            }
        }
        innerRefid = innerRefid || refid;
        app.globalData.refid = innerRefid

        if (immediately){
            EventTracer.page({
                pagename: pagename, //页面名称，一个完整的视图的路径
                orgpagename: orgpagename || "", //上一个页面的视图路径
                productcode: productCode, //产品码     "度假"(出境）;
                resourceid: resourceid || 0, //资源ID
                serialid: serialid || '',//
                prepayid: prepayid || '',  //支付ID
                unionid: unionid || '',    //用户unionid
                innerRefid: innerRefid || '',//小程序内页面间跳转传递refid
                expandfield: expandfield || '',//自定义数据（String）
                adaid: adaid1,//广告id
                rpagename,//根页面名称
                pagestate,//页面状态
                pagedetail,//页面浏览详情
                immediately,//是否立即上报
            }).submit()
            return;
        }
        wx.onAppRoute && pageTracer({
            pagename: pagename, //页面名称，一个完整的视图的路径
            orgpagename: orgpagename || "", //上一个页面的视图路径
            productcode: productCode, //产品码     "度假"(出境）;
            resourceid: resourceid || 0, //资源ID
            serialid: serialid || '',//
            prepayid: prepayid || '',  //支付ID
            unionid: unionid || '',    //用户unionid
            innerRefid: innerRefid || '',//小程序内页面间跳转传递refid
            expandfield: expandfield || '',//自定义数据（String）
            adaid: adaid1,//广告id
            rpagename,//根页面名称
            pagestate,//页面状态
            pagedetail,//页面浏览详情
            immediately,//是否立即上报
        })
        if (!wx.onAppRoute){
            EventTracer.page({
                pagename: pagename, //页面名称，一个完整的视图的路径
                orgpagename: orgpagename || "", //上一个页面的视图路径
                productcode: productCode, //产品码     "度假"(出境）;
                resourceid: resourceid || 0, //资源ID
                serialid: serialid || '',//
                prepayid: prepayid || '',  //支付ID
                unionid: unionid || '',    //用户unionid
                innerRefid: innerRefid || '',//小程序内页面间跳转传递refid
                expandfield: expandfield || '',//自定义数据（String）
                adaid: adaid1,//广告id
                rpagename,//根页面名称
                pagestate,//页面状态
                pagedetail,//页面浏览详情
                immediately,//是否立即上报
            }).submit()
        }
        
    },
    ev: function (pagename, productCode, label, value, category, action, expandfield, rpagename = '', pagestate = '', pagedetail = '', innerRefid, eventid, orgpagename, immediately = false) {
        app = app || getApp();
        innerRefid = innerRefid || refid;
        app.globalData.refid = innerRefid

        EventTracer.event({
            pagename: pagename, //页面名称，一个完整的视图的路径
            productcode: productCode, //公共    产品码
            category: category || 'category', //类型
            action: action || 'click', //动作
            label: label, //事件名称，静态值（如推送事件：opt_label：push）
            value: value || label, //事件的参数值，动态值（如同一事件包含多个维度的变量，用特殊符号分割，数据清洗时解析）
            expandfield,//项目自定义字段数据
            rpagename,//根页面名称
            pagestate,//页面状态
            pagedetail,//页面浏览详情
            innerRefid: innerRefid || '',//小程序内页面间跳转传递refid
            eventid,//事件id
            orgpagename,//上一页地址
            immediately,//是否立即上报
        }).submit()
    },
    /**
     *  eventInfo={
     *       pagename, 
     *       productCode, 
     *       label, 
     *       value, 
     *       category, action, expandfield, rpagename, pagestate, pagedetail, innerRefid, eventid, orgpagename
     *  }
     */
    newEv: function(eventInfo){
        let {
            pagename, productCode, label, value, category, action, expandfield, rpagename, pagestate, pagedetail, innerRefid, eventid, orgpagename, immediately
        } = eventInfo
        trace.ev(pagename, productCode, label, value, category, action, expandfield, rpagename, pagestate, pagedetail, innerRefid, eventid, orgpagename, immediately)
    },
    newPage: function(pageInfo){
        let {
            pagename, productCode, orgpagename, resourceid, serialid, prepayid, unionid, innerRefid, expandfield, adaid, rpagename, pagestate, pagedetail, immediately
        } = pageInfo
        
        trace.page(pagename, productCode, orgpagename, resourceid, serialid, prepayid, unionid, innerRefid, expandfield, adaid, rpagename, pagestate, pagedetail, immediately)
    },
    showStart: function () {
        setTimeout(function () {
            app = getApp();
            if (app.globalData.onShow) {
                app.globalData.onShow = 0;
            } else {
                stay.start();
            }
        }, 100)//这里的延迟执行，保证，页面的onShow和onHide在app的onShow和onHide后面执行
    },
    hideEnd: function (pagename, productCode, orgpagename, resourceid, serialid, prepayid, unionid, innerRefid, expandfield, adaid, rpagename = '', pagestate = '', pagedetail = '') {
        setTimeout(function () {
             app = getApp();
            if (app.globalData.onHide) {
                app.globalData.onHide = 0;
            } else {
                var stayTime = stay.cost();
                 app = getApp();
                innerRefid = innerRefid || refid;
                app.globalData.refid = innerRefid
                EventTracer.page({
                    pagename: pagename, //页面名称，一个完整的视图的路径
                    orgpagename: orgpagename || "", //上一个页面的视图路径
                    productcode: productCode, //产品码     "度假"(出境）;
                    resourceid: resourceid || 0, //资源ID
                    serialid: serialid || '',
                    prepayid: prepayid || '',  //支付ID
                    unionid: unionid || '',    //用户unionid
                    stayTime: stayTime,
                    innerRefid: innerRefid || '',
                    expandfield: expandfield || '',
                    adaid: adaid1,
                    rpagename,//根页面名称
                    pagestate,//页面状态
                    pagedetail,//页面浏览详情
                }).submit()
            }
        }, 100)//这里的延迟执行，保证，页面的onShow和onHide在app的onShow和onHide后面执行
    },
    elEV: function (pt, ifValue, ch, cspot, et, tri, etinf, of, pturl) {
        let hotelof = of || ((wx.getStorageSync('elong.Cookie') || {}).outerFrom || {}).value
        //   点击按钮值(cspot)
        EventTracer.elevent({
            pt: pt,//页面名称
            if: ifValue,//标识专题与活动
            ch: ch || 'wxhome',//频道入口标识，由首页点击位赋值
            cspot: cspot,//点击位名称，仅et为click事件才赋值
            et: et || 'click',//事件类型
            tri: tri,//info名称，用来区分不同的info事件，通常指定为触发info事件的click或show
            etinf: etinf,//自定义扩展字段，json格式
            of: hotelof || '1000000',//标识唤起APP的访问来源，或者跳转到H5的外部来源 从链接中获取of值
            pturl: pturl || null,//页面url show事件需要记录
        }).submit()
    },
    eventNew: function(options){
        app = app || getApp();
        app.globalData.refid = options.refid = options.refid || app.globalData.refid;

        // pagename: pagename, //页面名称，一个完整的视图的路径
            // productcode: productCode, //公共    产品码
            // category: category || 'category', //类型
            // action: action || 'click', //动作
            // label: label, //事件名称，静态值（如推送事件：opt_label：push）
            // value: value || label, //事件的参数值，动态值（如同一事件包含多个维度的变量，用特殊符号分割，数据清洗时解析）
            // expandfield,//项目自定义字段数据
            // rpagename,//根页面名称
            // pagestate,//页面状态
            // pagedetail,//页面浏览详情
            // innerRefid: innerRefid || '',//小程序内页面间跳转传递refid
        EventTracer.event(options).submit()
    }
}


//url中参数格式化
function formatOptions(options) {
    var urlOptions = '';
    for (var i in options) {
        urlOptions += i + "=" + options[i] + "&";
    }
    urlOptions = urlOptions.slice(0, urlOptions.length - 1);
    return urlOptions;
}



//倒计时转换
function changeTime(ms) {
    if (!ms) return;
    var time = new Date(ms);

    function c(a, b) {
        var x = Math.floor(ms / a % b);
        if (x < 10) {
            return '0' + x;
        }
        return '' + x;
    }

    var a = (c(3600000, 24) + c(60000, 60) + c(1000, 60)).split("");
    var day = "";
    var day2 = "";
    if (ms > 86400000 && ms < 360000000) {
        day = '' + Math.floor(ms / 86400000) * 24;
        day2 = day.split('');
        var a0 = (+a[0]) + (+day2[0]),
            a1 = (+a[1]) + (+day2[1]);
        if (a1 >= 10) {
            a0 = a0 + Math.floor(a1 / 10);
            a1 = Math.floor(a1 % 10);
        }
        return a0 + "" + a1 + ":" + a[2] + "" + a[3] + ":" + a[4] + "" + a[5]
    } else if (ms >= 360000000) {
        day = Math.floor(ms / 86400000) + "天";
        return day + "" + a[0] + "" + a[1] + ":" + a[2] + "" + a[3] + ":" + a[4] + "" + a[5]
    } else {
        return day + "" + a[0] + "" + a[1] + ":" + a[2] + "" + a[3] + ":" + a[4] + "" + a[5]
    }
}


//   提交表单记录form_id
function formSubmit(formId, path, options) {
    var opt = '';
    if (options && typeof options == 'object' && JSON.stringify(options) != '{}') {
        opt = "?" + formatOptions(options)
    }
    trace.page(path + opt, 2000, '', '', '', formId);
}

//保存formid（点击存在formid的表单时调用）  opneid,unionid,memberid,category,action,label,value,formid,createtime 
// var formidInfo = wx.getStorageSync('formidInfo') || {}
// var todayTimes = new Date().setHours(0, 0, 0, 0)
// var formidNum = 0;
// if (formidInfo[todayTimes + '']){
//     formidNum = formidInfo[todayTimes + '']
// }



function delayEventTrace(){
  this.startTime = 0;
  this.pageName = "";
  this.productCode = "";
  this.label = "";
  this.value = "";
  this.category = "";
  this.action = "";

  this.StartRecord = function(einfo){ 
    this.startTime = Date.now();
    einfo && this.setEInfo(einfo);
    return this;
  }

  this.setEInfo = function(einfo){   //过程中可不断补充
    for (var k in einfo) {
      if (einfo.hasOwnProperty(k) && ['pageName', 'productCode', 'category', 'action', 'label', 'value'].indexOf(k) >-1) {
        this[k] = einfo[k];
      }
    }
    return this;
  }

  this.setSiEinfo = function(k,genKey){
    typeof genKey === 'function' && (this.setEInfo({
      [k]: genKey(this[k], Date.now() - this.startTime)
    }))
  }

  this.endAndSetEvent = function(genValue){
    try{
      var val = typeof genValue == 'function' ? (genValue(this.value, Date.now() - this.startTime) || '') : this.value;
      this.value = val;
    //   console.log(this.pageName, this.productCode, this.label, this.value, this.category, this.action)
      trace.ev(this.pageName, this.productCode, this.label, this.value, this.category, this.action);
    }catch(e){
    //   console.log(e)
    }
   
  }
}

function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}
let openid = '';
module.exports = {
    page: trace.page,
    ev: trace.ev/*,
    newEv: trace.newEv,
    newPage: trace.newPage,
    postEV: EventTracer.postEV,
    postPage: EventTracer.postPage,
    elEv: trace.elEV,
    showStart: trace.showStart,
    hideEnd: trace.hideEnd,
    eventNew: trace.eventNew,
    formatOptions: formatOptions,
    changeTime: changeTime,
    formSubmit: formSubmit,
    eventTrack: (pageName, productCode, category, action) => (label, value, immediately) => {
        
        if (!openid) {
            openid = wx.getStorageSync('tongcheng.openid') || '';
        }
        value = '^' + value + '^openid:' + openid + '^';
        trace.newEv({ pagename:pageName, productCode:productCode, label:label, value:value, category:category, action:action, immediately:immediately })
    },
    delayEventTrace: delayEventTrace,
    compareVersion*/
}