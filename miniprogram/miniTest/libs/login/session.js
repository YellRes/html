var constants = require("./constants");

var SESSION_KEY = "weapp_session_" + constants.WX_SESSION_GUID_ID;

var Session = {
  get: function() {
    const sessionStorage = wx.getStorageSync(SESSION_KEY) || null;
    if (sessionStorage) {
      return sessionStorage;
    }
    const appInst = getApp();
    if (appInst && appInst.globalData && appInst.globalData.weappSession) {
      return appInst.globalData.weappSession;
    }
    return null;
  },

  set: function(session) {
    try {
      const appInst = getApp();
      const {openId = "", unionId = "", isbind,mobileNo=''} = session;
      const isBind = isbind == "1" ? true : false;
      // wx.setStorage({key: "", data: isBind});
      wx.setStorageSync("IS_BIND_USER", isBind);
      openId != "" && wx.setStorageSync("chebada.openid", openId);
      unionId != "" && wx.setStorageSync("chebada.unionid", unionId);
      mobileNo !== '' &&  wx.setStorageSync("chebada.memberMobileNo", mobileNo)
      if (appInst && appInst.globalData) {
        appInst.globalData.weappSession = session;
      }
      return wx.setStorageSync(SESSION_KEY, session);
    } catch (error) {
      console.log("TCL: error", error);
    }
  },

  clear: function() {
    const appInst = getApp();
    wx.removeStorageSync("IS_BIND_USER");
    if (appInst && appInst.globalData && appInst.globalData.weappSession) {
      appInst.globalData.weappSession = null;
    }
    return wx.removeStorageSync(SESSION_KEY);
  }
};

module.exports = Session;
