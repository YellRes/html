import wcache from "./wcache";
/**
 * 日期处理
 * date {string/Date} //要处理的时间 ''
 * @return {Date}
 * */
function processDate(date) {
  if (typeof date === "string") {
    date = new Date(
      date
        .replace(/\..*$/, "")
        .replace(/-/g, "/")
        .replace(/\+/g, " ")
    );
  }
  return new Date(date);
}

function isNotEmptyString(str) {
  return typeof str === "string" && str !== "";
}

var slice = [].slice,
  class2type = {},
  toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error"
  .split(" ")
  .forEach(function(name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

function type(obj) {
  return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
}

/*
function isFunction(value) {
    return type(value) == "function";
}
*/

function isObject(obj) {
  return type(obj) == "object";
}

function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}
var isArray =
  Array.isArray ||
  function(object) {
    return object instanceof Array;
  };

function extend(target) {
  var deep,
    args = slice.call(arguments, 1);
  if (typeof target == "boolean") {
    deep = target;
    target = args.shift();
  }
  args.forEach(function(arg) {
    extended(target, arg, deep);
  });
  return target;
}

function extended(target, source, deep) {
  for (var key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {};
      if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
      extend(target[key], source[key], deep);
    } else if (source[key] !== undefined) target[key] = source[key];
}

//数字小数点处理取整
function numPrice(value) {
  //小数点处理
  if (!(value.toString().indexOf(".") == -1)) {
    if (parseInt(value.split(".")[1]) >= 10) {
      if (value.split(".")[1].substr(1, 1) == "0") {
        let num = value.split(".")[0] + "." + value.split(".")[1].substr(0, 1);
        value = num;
      }
    } else if (value.split(".")[1] == "00") {
      let num = parseInt(value);
      value = num;
    }
  }
  return value;
}

/**
 * 格式化时间
 * @param date Date 时间
 * @param format 格式化 "yyyy-MM-dd hh:mm:ss www"
 * @returns {string} 格式化后字符串
 */
function format(date, format) {
  if (!format) {
    format = date || "yyyy-MM-dd";
    date = new Date();
  }
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };

  var w = [
    ["日", "一", "二", "三", "四", "五", "六"],
    ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  ];

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }

  if (/(w+)/.test(format)) {
    format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()]);
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
}

function parseDate(date) {
  return new Date(Date.parse(date.replace(/-/g, "/")));
}

function addDay(n, date, formatStr) {
  var d = date || new Date();
  formatStr = formatStr || "yyyy-MM-dd";
  if (typeof d === "string" || typeof d === "number") {
    // d = new Date(date);
    d = parseDate(date);
  }
  var day = 1000 * 60 * 60 * 24 * n;
  var newDay = new Date(d.getTime() + day);
  return {
    date: newDay,
    day: format(newDay, formatStr)
  };
}

function dateDiff(newDate = "", lastDate, hasWeek) {
  //lastDate和newDate是yyyy-MM-dd格式 ,lastDate 不传默认与当前日期比较

  hasWeek = hasWeek == undefined ? true : hasWeek;

  if (newDate == "") {
    return "";
  }
  var aDate, oDate1, oDate2, iDays, str;
  aDate = newDate.split("-");
  oDate1 = new Date(aDate[0], aDate[1] - 1, aDate[2]);

  if (arguments.length == 2) {
    if (typeof lastDate == "boolean") {
      hasWeek = lastDate;
    } else {
      let date = new Date();
      lastDate = date.format("yyyy-MM-dd");
    }
  }

  if (arguments.length == 1) {
    let date = new Date();
    lastDate = date.format("yyyy-MM-dd");
  }

  aDate = lastDate.split("-");
  oDate2 = new Date(aDate[0], aDate[1] - 1, aDate[2]);

  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  if (oDate1 - oDate2 >= 0) {
    if (iDays === 0) {
      str = "今天";
    } else if (iDays === 1) {
      str = "明天";
    } else if (iDays === 2) {
      str = "后天";
    } else {
      if (!hasWeek) {
        str = "";
      } else {
        str = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ][oDate1.getDay()];
      }
    }
    /*else{
       str = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][oDate1.getDay()];
    }*/
  } else {
    str = "";
  }
  return str;
}

//数组去重
function unique(arr) {
  var result = [],
    hash = {};
  for (var i = arr.length - 1, elem; (elem = arr[i]) != null; i--) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}
//批量清除本地缓存
function clearStorage(list) {
  Array.isArray(list) &&
    list.map(function(item) {
      wx.removeStorageSync(item);
    });
}

function getWeek(e) {
  var aWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return aWeek[e];
}

function sortNumber(a, b) {
  return a - b;
}

/**
 ***获取两个日期间的所有日期
 ***默认start<end
 **/
function getDiffDate(start = new Date(), end) {
  var startTime = processDate(start);
  var endTime = processDate(end);
  var dateArr = [];
  console.log(startTime, endTime);
  while (endTime.getTime() - startTime.getTime() >= 0) {
    var mStr = startTime.getMonth() + 1,
      dStr = startTime.getDate();
    var year = startTime.getFullYear();
    var month = mStr < 10 ? `0${mStr}` : mStr + "";
    var day = dStr < 10 ? `0${dStr}` : dStr + "";
    dateArr.push(year + "-" + month + "-" + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateArr;
}

function savePicToAlbum(tempFilePath) {
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        wx.authorize({
          scope: "scope.writePhotosAlbum",
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success() {
                wx.showToast({
                  title: "保存成功"
                });
              },
              fail(res) {
                console.log(res);
              }
            });
          },
          fail() {
            // 用户拒绝授权,打开设置页面
            wx.openSetting({
              success: function() {
                console.log("openSetting: success");
              },
              fail: function() {
                console.log("openSetting: fail");
              }
            });
          }
        });
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success() {
            wx.showToast({
              title: "保存成功"
            });
          },
          fail(res) {
            console.log(res);
          }
        });
      }
    },
    fail(res) {
      console.log(res);
    }
  });
}

/*
兼容方式 - 版本比较
微信客户端和小程序基础库的版本号风格为 Major.Minor.Patch（主版本号.次版本号.修订号）
*/

function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

/* 
  手机号中间四位数加星号
*/
function getPrivacyMobile(mobile) {
  let fmtMobile = "";
  if (mobile) {
    fmtMobile = mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  }
  return fmtMobile;
}

/* 
  手机号344格式处理
*/
function formatMobile344(val) {
  let mobile = "";
  if (val && val != "") {
    mobile =
      val.replace(/\s+/g, "").length >= 11
        ? val.replace(/\s+/g, "").replace(/(^\d{3}|\d{4}\B)/g, "$1 ")
        : val;
  }
  return mobile;
}

//链接参数转换
function urlToObj(url) {
  var search = url.replace(/^\s+|\s+$/, "").match(/([^?#]*)(#.*)?$/);
  if (!search) {
    return {};
  }
  var searchHash = search[1].split("&");
  var obj = {};
  for (var i = 0, len = searchHash.length; i < len; i++) {
    var pair = searchHash[i].split("=");
    if (pair[0]) {
      var key = decodeURIComponent(pair[0]);
      var value = pair[1];
      if (pair[2]) {
        value = `${pair[1]}=${pair[2]}`;
      }
      if (value != undefined) {
        value = decodeURIComponent(value);
      }
      //这里判断转化后的obj里面有没有重复的属性
      if (key in obj) {
        if (obj[key] != Array) {
          //把属性值变为数组，将另外的属性值也存放到数组中去
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    }
  }
  return obj;
}

function json2UrlParam(params) {
  let urlParam = "";
  for (var key in params) {
    var value = params[key];
    if (typeof value == "object") {
      value = JSON.stringify(value);
    }
    urlParam += "&" + key + "=" + value;
  }
  return urlParam;
}

//线下物料（二维码）已展示无法更换的情况，后期的关键词更换后可在此配置重置（kwConfigList）
function replaceKeyword(keyword) {
  if (!keyword) return;
  let newKeyword = "";
  let keywordConfigList = [
    {
      oldVal: "扬泰机场",
      newVal: "扬州泰州机场"
    }
  ];

  let oldKeyword = keyword.replace(/^\s+|\s+$/g, "");
  let filterConfig = keywordConfigList.filter(item => {
    return item.oldVal == oldKeyword;
  })[0];
  newKeyword = filterConfig ? filterConfig.newVal : keyword;
  return newKeyword;
}
/**
 * @method
 * 设置缓存营销ID，用于交叉链接里（拼车，快车）
 * @param {String} markid 营销ID
 * @param {String} cacheKey 营销ID缓存KEY
 * @param {Number} deadTime 设置的过期时间（1=1s） 默认24h
 * @param {Number} maxLength 最多存几组 默认3
 */
function setMarketingIdToStorage({
  marketingId = "",
  cacheKey = "",
  deadTime = 60 * 60 * 24,
  maxLength = 3
} = {}) {
  if (marketingId == "" || cacheKey == "") return;

  //wcache.get获取缓存key时会验证是否已过期
  let cacheArr = wcache.get(cacheKey) ? wcache.get(cacheKey) : [];

  //删除相同的ID
  cacheArr.length > 0 &&
    cacheArr.map((ele, index) => {
      ele == marketingId && cacheArr.splice(index, 1);
    });
  //向后插入ID
  cacheArr.push(marketingId);
  //大于3组从前面删除一个
  if (cacheArr.length > maxLength) {
    cacheArr = cacheArr.slice(1);
  }
  wcache.put(cacheKey, cacheArr, deadTime);
}

//计算身份证年龄 不合法返回0
function getInfoByIdNo(identityCard) {
  var len = (identityCard + "").length;
  let msg = {
    age: 0,
    birthday: ""
  };
  if (len == 0) {
    return msg;
  } else {
    if (len != 15 && len != 18) {
      //身份证号码只能为15位或18位其它不合法
      return msg;
    }
  }
  var strBirthday = "";
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday =
      identityCard.substr(6, 4) +
      "-" +
      identityCard.substr(10, 2) +
      "-" +
      identityCard.substr(12, 2);
  }
  if (len == 15) {
    strBirthday =
      "19" +
      identityCard.substr(6, 2) +
      "-" +
      identityCard.substr(8, 2) +
      "-" +
      identityCard.substr(10, 2);
  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday);
  var nowDateTime = new Date();
  var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() &&
      nowDateTime.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  msg.age = age;
  msg.birthday = strBirthday;
  return msg;
}

//获取出生日期
function getBirthdatByIdNo(iIdNo) {
  var tmpStr = "";
  // var strReturn = "";

  if (iIdNo.length == 15) {
    tmpStr = iIdNo.substring(6, 12);
    tmpStr = "19" + tmpStr;
    tmpStr =
      tmpStr.substring(0, 4) +
      "-" +
      tmpStr.substring(4, 6) +
      "-" +
      tmpStr.substring(6);
    return tmpStr;
  } else {
    tmpStr = iIdNo.substring(6, 14);
    tmpStr =
      tmpStr.substring(0, 4) +
      "-" +
      tmpStr.substring(4, 6) +
      "-" +
      tmpStr.substring(6);
    return tmpStr;
  }
}

function enciphermentIdCard(identityCard = "") {
  var len = (identityCard + "").length;
  if (len == 0) {
    return "";
  } else {
    if (len != 15 && len != 18) {
      //身份证号码只能为15位或18位其它不合法
      return "";
    }
  }
  if (len == 15) {
    return identityCard.replace(/(\d{3})\d{9}(\d{3})/, "$1*********$2");
  }
  if (len == 18) {
    return identityCard.replace(/(\d{3})\d{12}(\d{3})/, "$1************$2");
  }
}

//价格计算 exp: calc(1,2,3,0.1)
function calc() {
  let sum = 0;
  let args = [...arguments];
  for (var i = 0; i < args.length; i++) {
    sum = parseFloat(sum) + parseFloat(args[i]);
  }
  sum = parseFloat(sum.toFixed(2));
  return sum;
}

/**
 * @method
 * 获取节点信息
 * @param {String} selector selector类似于 CSS 的选择器，但仅支持下列语法。
      ID选择器：#the-id
      class选择器（可以连续指定多个）：.a-class.another-class
      子元素选择器：.the-parent > .the-child
      后代选择器：.the-ancestor .the-descendant
      跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
      多选择器的并集：#a-node, .some-other-nodes
      
 */

function queryNodeRef(selector) {
  return new Promise(resolve => {
    const query = wx.createSelectorQuery();
    let totalHeight = 0;
    query
      .selectAll(selector)
      .boundingClientRect(rects => {
        console.log(rects);
        rects.map(ele => {
          const {height = 0} = ele;
          totalHeight = totalHeight + parseFloat(height);
        });
        resolve({totalHeight, rects: rects});
      })
      .exec();
  });
}

function clone(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  let cloneObj = {};
  switch (obj.constructor) {
    case Array:
      cloneObj = [];
    case Object:
      for (var property in obj) {
        cloneObj[property] =
          typeof obj[property] === "object"
            ? this.clone(obj[property])
            : obj[property];
      }
      break;
    case Map:
      cloneObj = new Map();
      obj.forEach((value, key) => {
        cloneObj.set(
          key,
          typeof value === "object" ? this.clone(value) : value
        );
      });
      break;
    case Set:
      cloneObj = new Set();
      obj.forEach(value => {
        cloneObj.add(typeof value === "object" ? this.clone(value) : value);
      });
      break;
  }
  return cloneObj;
}

// 计算用户订阅消息详情
function getUserSubScribe(arr, pid) {
  return new Promise((resolve, reject) => {
    let newArr = arr;
    let oldArr = wx.getStorageSync(pid + "sub");
    if (!oldArr) oldArr = [];
    if (pid && pid != "") {
      newArr = [];
      arr.forEach(item => {
        if (oldArr.indexOf(item) < 0) newArr.push(item);
      });
      if (newArr.length == 0) reject("没有需要授权订阅的消息");
    }
    wx.requestSubscribeMessage({
      tmplIds: newArr,
      success(res) {
        if (res.errMsg == "requestSubscribeMessage:ok" && pid && pid != "") {
          newArr.forEach(item => {
            if (res[item] == "accept") {
              oldArr.push(item);
            }
          });
          try {
            wx.setStorageSync(pid + "sub", oldArr);
          } catch (e) {}
        }
        resolve(res);
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

//订阅引导样图--resolve
function subscribeUtil(subArr) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res);
        if (res.subscriptionsSetting && res.subscriptionsSetting.mainSwitch) {
          if (res.subscriptionsSetting.itemSettings) {
            for (let value of subArr) {
              if (res.subscriptionsSetting.itemSettings[value]) {
                reject();
                return;
              }
            }
          }
          resolve();
        } else {
          reject();
        }
      },
      fail() {
        reject();
      }
    });
  });
}

//广告图跳转
function adNavTo(link=''){
  if(link=='')return;
  //直播链接跳转
  if(link.indexOf('live-player-plugin') != -1){
    ///pages/live-player-plugin?room_id=1&custom_params
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370${link}`
    })
    return
  }
  //小程序链接
  if(link.indexOf('pages/') != -1){
     if (!/^\//.test(link)) {
      //防止小程序链接配置漏加斜杠
        link = `/${link}`;
    }
    wx.navigateTo({
      url:link
    })
    return
  }
   //h5链接
  if(link.indexOf("https") != -1){
    const encodeLink = encodeURIComponent(link)
    wx.navigateTo({
      url:`/pages/web/web?url=${encodeLink}`
    })
    return
  }

  //外部小程序跳转
  if (link.indexOf("@appId") != -1) {
    const [urlSource] = link.split("@");
    link = link.replace("@", "&");
    const { appId='' } = urlToObj(link) || {};
    wx.navigateToMiniProgram({
      appId,
      path: urlSource
    });
  }
}
//时间转化为分秒
function toMinuteSecond(seconds) {
  if (typeof seconds !== 'number') {
      return '';
  }
  if (seconds < 60) {
      return (seconds % 60) + '秒';
  } else if (seconds === 60) {
      return '1分';
  } else {
      return Math.floor(seconds / 60) + '分' + (seconds % 60) + '秒';
  }
};



//客服跳转
function openLivechat(param) {
  let defaultParam = {
    p:14,
    sourcetype:1,
    pageid:14009,
    pageType:'',
    orderId:'',     //纯数字的订单号
    orderType:'',
    FPage:'',       //传入编码后的当前页面固定部分链接
    OrderState:'',  //编码后的可视化订单状态
    OrderSerialId:''//非纯数字的订单流水号
  }
  const urlParams = Object.assign({},defaultParam,param)
  const url = urlEncode('https://livechat.chebada.com/chat/out/robotservice/touch',urlParams)
  wx.navigateTo({
    url: `/pages/web/web?url=${encodeURIComponent(url)}`
  });
}


function remDub(arr, key = "name") {
  var hash = {};
  arr = arr.reduce(function(item, next) {
    const compareKey = next[key];
    hash[compareKey] ? "" : (hash[compareKey] = true && item.push(next));
    return item;
  }, []);
  return arr;
}
/**
 * @function 设置历史记录 去重
 * @param {String} key  wx.setStorage 的key值 如：'SIMPLE_PASSENGERlIST'
 * @param {Array<Object>} data 设置的数据
 * @param {Number} max 设置的最大个数
 * @param {String} compareKey 做对比的key
 * @param {Function} callback 回调
 */

function setHistory({key, data = [], max = 5, compareKey, callback}) {
  var logAddr = wx.getStorageSync(key) || [];
  const remdubData = remDub(data.concat(logAddr), compareKey).slice(0, max);
  wx.setStorage({
    key: key,
    data: remdubData,
    complete() {
      callback();
    }
  });
}


module.exports = {
  // formatTime: formatTime,
  // formatDate:formatDate,
  calc,
  clearStorage: clearStorage,
  formatDate: format,
  processDate: processDate,
  parseDate: parseDate,
  addDay: addDay,
  getWeek: getWeek,
  dateDiff: dateDiff,
  sortNumber: sortNumber,
  extend: extend,
  isNotEmptyString: isNotEmptyString,
  numPrice: numPrice,
  unique: unique,
  router: require("./router.js"),
  isEmpty: require("./isempty.js"),
  savePicToAlbum: savePicToAlbum,
  compareVersion,
  getPrivacyMobile,
  formatMobile344,
  urlToObj,
  replaceKeyword,
  getInfoByIdNo,
  enciphermentIdCard,
  wcache,
  setMarketingIdToStorage,
  getDiffDate,
  clone,
  queryNodeRef,
  getUserSubScribe,
  getBirthdatByIdNo,
  subscribeUtil,
  adNavTo,
  toMinuteSecond,
  openLivechat,
  setHistory,
  json2UrlParam
};
