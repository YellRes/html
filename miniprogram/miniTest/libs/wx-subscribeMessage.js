/**
 * 微信订阅通知方法
 */
import {getNotSubscribes, successSubscribes} from "../api/api";
import {compareVersion} from "../utils/util";

const app = getApp();

/**
 * @method
 * 请求用户未订阅内容
 * @param {Object} projectType 项目ID
 *
 */
function requestNotSubscribes({projectType = ""}) {
  return new Promise((resolve, reject) => {
    getNotSubscribes({
      projectType
    })
      .then(res => {
        const {notSubscribes = []} = res;
        resolve({notSubscribes});
      })
      .catch(err => {
        console.log("TCL: requestNotSubscribes -> err", err);
        reject(err);
      });
  });
}

/**
 * @method
 * 订阅授权
 * @param {Object} notSubscribes 获取到的未订阅模板ID对象数组;demo: "notSubscribes":[{"templateId":"111"},{"templateId":"222"}]
 * @param {Function} final(error) 不管失败成功最终都会执行
 *
 */
function wxSubscribeMessage({
  notSubscribes = {},
  final = () => {},
  report = true
}) {
  let notSubscribesArr = []; //未订阅模板ID数组
  //处理成数组
  if (Object.keys(notSubscribes).length > 0) {
    notSubscribes.map(ele => {
      const {templateId} = ele;
      notSubscribesArr.push(templateId);
    });
  } else {
    console.log("TCL: wxSubscribeMessage -> 没有订阅模板ID", notSubscribes);
    if (final && typeof final === "function") final({errMsg: "没有订阅模板ID"});
    return;
  }
  const isSubscribeMessageVersion = getIsSubMsgVer();
  console.log(
    "TCL: wxSubscribeMessage -> isSubscribeMessageVersion",
    isSubscribeMessageVersion
  );

  if (isSubscribeMessageVersion) {
    console.log(
      "TCL: wxSubscribeMessage -> 有未订阅的模板ID ，开始唤起微信方法 wx.requestSubscribeMessage||notSubscribesArr",
      notSubscribesArr
    );
    wx.requestSubscribeMessage({
      tmplIds: notSubscribesArr,
      success(res) {
        console.log("TCL: success -> notSubscribes", notSubscribes);
        console.log("success -> report", report);
        //上报
        if (notSubscribes.length > 0) {
          let acceptTemplateIdArr = []; //用户允许的模板ID
          notSubscribes.map(ele => {
            if (res[ele.templateId] == "accept") {
              acceptTemplateIdArr.push(ele);
            }
          });
          if (acceptTemplateIdArr.length > 0) {
            console.log(
              "TCL: success -> acceptTemplateIdArr",
              acceptTemplateIdArr
            );
            //上报接口

            if (report) {
              successSubscribes({
                templateList: acceptTemplateIdArr
              }).then(res1 => {
                console.log("TCL: success -> res1", res1);
              });
            }
          }
        }
      },
      fail(res) {
        console.log("TCL: fail -> res", res);
      },
      complete(res) {
        console.log("TCL: complete -> res", res);
        if (final && typeof final === "function") final(res);
      }
    });
  } else {
    console.log(
      "TCL: wxSubscribeMessage -> 版本太低 isSubscribeMessageVersion",
      isSubscribeMessageVersion
    );

    if (final && typeof final === "function") final({errMsg: "版本太低"});
  }
}

//判断是否是支持微信订阅版本
function getIsSubMsgVer() {
  const sys = app.globalData.systemInfo;
  const iosFlag =
    sys.platform == "ios" && compareVersion(sys.version, "7.0.6") >= 0;
  const androidFlag =
    sys.platform == "android" && compareVersion(sys.version, "7.0.7") >= 0;
  if (sys.platform == "devtools" || iosFlag || androidFlag) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  requestNotSubscribes,
  wxSubscribeMessage,
  getIsSubMsgVer
};
