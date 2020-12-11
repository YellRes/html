/**
 * Created by gxz09940 on 2016/12/5.
 */
import {getEnableRedPackageList} from "../api/apiRedPack";
import navigate from "./navigate";

var app = getApp();

var util = require("./util.js");

function openInsurance(param) {
  app.globalData.insuranceParam = util.extend({}, param, {
    callback: "insuranceCallback"
  });

  app.globalData.insuranceCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.insuranceParam.goBack = "insuranceGoBack";
    app.globalData.insuranceGoBack = function() {
      param.goBack();
    };
  }
  wx.navigateTo({
    url:
      "../../common/insurance/insurance?cityName=" +
      param.cityName +
      "&projectType=" +
      param.projectType +
      "&ticketAmount=" +
      param.ticketAmount +
      "&selectedInsuranceId=" +
      param.selectedInsuranceId
  });
}

/**
 * 火车票儿童
 * */
function trainPickChild(param) {
  app.globalData.trainChildParam = util.extend({}, param, {
    callback: "trainChildCallback"
  });

  app.globalData.trainChildCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.trainChildParam.goBack = "childGoBack";
    app.globalData.trainChildGoBack = function() {
      param.goBack();
    };
  }
  wx.navigateTo({
    url: "../chooseChild/chooseChild"
  });
}
/**
 * 汽车票携童
 * */
function busPickChild(param) {
  app.globalData.busChildParam = util.extend({}, param, {
    callback: "busChildCallback"
  });

  app.globalData.busChildCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.busChildParam.goBack = "childGoBack";
    app.globalData.busChildGoBack = function() {
      param.goBack();
    };
  }
  wx.navigateTo({
    url: "/pages/common/subPackages/add-child/add-child?passengerTotal="+param.passengerTotal+"&freeChildCount="+param.freeChildCount
  });
}

function pickContact(param) {
  app.globalData.pickContactParam = util.extend({}, param, {
    callback: "pickContactCallback"
  });

  app.globalData.pickContactCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.pickContactParam.goBack = "pickContactGoBack";
    app.globalData.pickContactGoBack = function() {
      param.goBack();
    };
  }
  console.log(param);
  let {
    maxLength = 30,
    contactInfo,
    actionType = "",
    hasIdCard='',
    isMultCertType = 0,
    showChildType = true,
    isOfficalType = 0,
    isnew = 0,
    isRealName = 0,
    projectType = "",
    isChild = 0,
    isStudent = 0,
    supportedCertTypes = "",
    isSupportChild = 0, //快车儿童票
    needVerify=false,
    isCommon = 0        //是否是常旅管理页进入
  } = param;
  navigate.showPage("../../common/pickContact/pickContact", {
    maxLength,
    contactInfo: JSON.stringify(contactInfo),
    actionType,
    isMultCertType,
    showChildType,
    isOfficalType,
    isnew,
    isRealName,
    projectType,
    isChild,
    isStudent,
    supportedCertTypes,
    isSupportChild,
    needVerify,
    hasIdCard,
    isCommon
  });
  /*   wx.navigateTo({
        url: '../../common/pickContact/pickContact?contactInfo='+JSON.stringify(contactInfo)+'&actionType='+actionType+'&isMultCertType='+isMultCertType + '&isOfficalType=' + param.isOfficalType + '&isnew=' + param.isnew +'&isRealName=' + param.isRealName + '&projectType=' +param.projectType + '&isChild=' + param.isChild + '&isStudent=' + param.isStudent
    }); */
}

function openMailAddress(param) {
  app.globalData.mailAddressParam = util.extend({}, param, {
    callback: "mailAddressCallback"
  });

  app.globalData.mailAddressCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.mailAddressParam.goBack = "mailAddressGoBack";
    app.globalData.mailAddressGoBack = function() {
      param.goBack();
    };
  }
  let baseMailAddressUrl = param.baseMailAddressUrl || "../../"; //跳转路径可配置，根据层级关系自行配置，默认../../
  console.log(param);
  wx.navigateTo({
    url:
      baseMailAddressUrl +
      "common/mailAddress/mailAddress?addrInfo=" +
      JSON.stringify(param.addrInfo) +
      "&actionType=" +
      param.actionType
  });
}

function openInvoice(param) {
  app.globalData.invoiceParam = util.extend({}, param, {
    callback: "invoiceCallback"
  });

  app.globalData.invoiceCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.invoiceParam.goBack = "invoiceCallback";
    app.globalData.invoiceGoBack = function() {
      param.goBack();
    };
  }
  const {invoiceInfo = {}, actionType = "add", showMore = "0"} = param;
  const urlParam = {
    invoiceInfo: JSON.stringify(invoiceInfo),
    actionType,
    showMore
  };
  navigate.showPage("../../common/invoice/invoice", urlParam);
}

function openSearchBDaddr(param) {
  app.globalData.searchBDaddrParams = util.extend({}, param, {
    callback: "searchBDaddrCallback"
  });

  app.globalData.searchBDaddrCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.searchBDaddrParams.goBack = "searchBDaddrCallback";
    app.globalData.searchBDaddrGoBack = function() {
      param.goBack();
    };
  }
  console.log(param);
  wx.navigateTo({
    url:
      "../../chartered/searchAddress/searchAddress?searchBDaddrInfo=" +
      JSON.stringify(param.searchBDaddrInfo)
  });
}

function openOtherTrainList(param) {
  app.globalData.otherTrainListParams = util.extend({}, param, {
    callback: "otherTrainListCallback"
  });

  app.globalData.otherTrainListCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.otherTrainListParams.goBack = "otherTrainListCallback";
    app.globalData.otherTrainListGoBack = function() {
      param.goBack();
    };
  }
  console.log(param);
  wx.navigateTo({
    url:
      "../../train/subPackages/otherTrainList/otherTrainList?selectedTrainNo=" +
      param.selectedTrainNo +
      "&trainsParams=" +
      JSON.stringify(param.trainsParams)
  });
}

function pickRedPackage(param) {
  app.globalData.pickRedPackageParam = util.extend({}, param, {
    callback: "pickRedPackageCallback"
  });

  app.globalData.pickRedPackageCallback = function(data) {
    param.callback && param.callback(data);
  };
  if (param.goBack) {
    app.globalData.pickRedPackageParam.goBack = "pickRedPackageGoBack";
    app.globalData.pickRedPackageGoBack = function() {
      param.goBack();
    };
  }
  console.log(param);
  /* wx.navigateTo({
        url: '../../common/redPackage/redPackage?contactInfo='+JSON.stringify(param.contactInfo)+'&actionType='+param.actionType + '&projectType=' +param.projectType
    }); */
  let baseRedPackageUrl =
    (param.pickRedParams && param.pickRedParams.baseRedPackageUrl) || "../../"; //跳转路径可配置，根据层级关系自行配置，默认../../
  wx.navigateTo({
    url: baseRedPackageUrl + "common/redPackage/redPackage"
  });
}

function checkRedPacket(param) {
  //检查是否有红包可用
  return getEnableRedPackageList(param)
    .then(res => {
      let returnParams = {
        isHaveRed: false, //是否有红包
        haveRedPackets: "0", //有红包 2不使用,1有红包可用，0无可用
        defaultRedPacket: {} //默认选中的红包详情
      };
      if (res && res.memberCouponList && res.memberCouponList.length > 0) {
        //有数据
        if (res.memberCouponList[0].isConfirmRule == "1") {
          //有符合规则的红包
          //新增APP红包使用限制
          let isOnlyApp = res.memberCouponList[0].onlyApp;
          returnParams = {
            isHaveRed: true,
            haveRedPackets: isOnlyApp == "1" ? "0" : "1",
            defaultRedPacket:
              isOnlyApp == "1" ? {} : res.memberCouponList[0] || {}
          };
        } else {
          //红包均不符合，不适用，全部置灰
          returnParams.isHaveRed = true;
        }
      }
      return returnParams;
    })
    .catch(() => {
      //异常默认为没有红包
      let returnParams = {
        isHaveRed: false,
        haveRedPackets: "0",
        defaultRedPacket: {}
      };
      return returnParams;
    });
}

function openServiceArea(param) {
  app.globalData.serviceAreaPrarms = util.extend({}, param, {
    callback: "serviceAreaCallback"
  });
  wx.navigateTo({
    url: "../../common/subPackages/mapServiceArea/mapServiceArea"
  });
}

function openAddressSearch(param) {
  app.globalData.addressSearchParams = util.extend({}, param, {
    callback: "addressSearchCallback"
  });

  app.globalData.addressSearchCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };

  wx.navigateTo({
    url: "../../common/subPackages/searchAddress/searchAddress"
  });
}
function openExpressAddressSearch(param) {
  app.globalData.addrSearchParams = util.extend({}, param, {
    callback: "addrSearchCallback"
  });

  app.globalData.addrSearchCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };

  navigate.showPage("/pages/express/searchAddress/index");
}
// 上下车点地图
function openAddressPointPage(param) {
  app.globalData.addressPointParams = util.extend({}, param, {
    callback: "addressPointCallback"
  });

  app.globalData.addressPointCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };

  navigate.showPage("/pages/express/addressPoint/addressPoint");
}
//自定义站点地图
function openServiceAreaMap(param) {
  app.globalData.serviceAreaMapPrarms = util.extend({}, param, {
    callback: "serviceAreaMapCallback"
  });
  app.globalData.serviceAreaMapCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };
  const {isStart,pointId,lineId,depDate} = param;
  navigate.showPage("/pages/express/addrmap/index", {
    isStart,pointId,lineId,depDate
  });
}
//身份证识别
function openCamera(param) {
  app.globalData.cameraParams = util.extend({}, param, {
    callback: "openCameraCallback"
  });

  app.globalData.openCameraCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };

  wx.navigateTo({
    url: "../../common/subPackages/camera/camera"
  });
}

//网约车搜索地址
function openCarhailingAddrSearch(param) {
  app.globalData.carhailingAddrSearchParams = util.extend({}, param, {
    callback: "carhailingAddrSearchCallback"
  });

  console.log(app.globalData.carhailingAddrSearchParams);
  app.globalData.carhailingAddrSearchCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };

  wx.navigateTo({
    url: "../../carhailing/searchAddress/searchAddress"
  });
}

function openPassenger(param) {
  app.globalData.passengerParams = util.extend({}, param, {
    callback: "passengerCallback"
  });

  app.globalData.passengerCallback = function(data) {
    console.log(data);
    param.callback && param.callback(data);
  };
  wx.navigateTo({
    url: "../../common/passenger/passenger"
  });
}

function openStudentChoose(param) {
  app.globalData.studentSearchParams = util.extend({}, param, {
    callback: "studentCallback"
  });

  app.globalData.studentCallback = function(data) {
    param.callback && param.callback(data);
  };
  let {action} = param;
  navigate.showPage("../../common/studentCitySchool/studentCitySchool", {
    action
  });
}

function openCountryChoose(param) {
  app.globalData.countrySearchParams = util.extend({}, param, {
    callback: "countryCallback"
  });

  app.globalData.countryCallback = function(data) {
    param.callback && param.callback(data);
  };
  navigate.showPage("../../common/country/country");
}
module.exports = {
  openInsurance,
  pickContact,
  trainPickChild,
  busPickChild,
  openMailAddress,
  openInvoice,
  openSearchBDaddr,
  openOtherTrainList,
  pickRedPackage,
  openServiceArea,
  openAddressSearch,
  checkRedPacket,
  openCamera,
  openCarhailingAddrSearch,
  openPassenger,
  openStudentChoose,
  openCountryChoose,
  openServiceAreaMap,
  openExpressAddressSearch,
  openAddressPointPage
};
