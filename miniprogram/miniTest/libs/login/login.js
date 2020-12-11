var constants = require('./constants');
var Session = require('./session');
var utils = require('../../utils/util');
var config = require('../../api/config');



/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.errMsg = message;
  }
  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;
  return LoginError;
})();



/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function (loginResult) {
      callback(null, {
        code: loginResult.code
      });
    },

    fail: function (loginError) {
      var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};


var noop = function noop() { };

var defaultOptions = {
  method: 'POST',
  success: noop,
  fail: noop,
  withCredentials: true,
  lang: 'zh_CN',
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  options = utils.extend({}, defaultOptions, options);

  return new Promise((resolve, reject) => {

  
  var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }

    var code = wxLoginResult.code;

    // 请求服务器登录地址，获得会话信息
    wx.request({
      url: `${config.apiDomain}Member/WxLogin`,
      method: options.method,
      data: {
        platId: config.platId,
        refId: config.referId,
        code: code
      },
      success: function (result) {
        const {statusCode} = result;
        var data = result.data || {};
        // 成功地响应会话信息
        var noSessionError
        const { body={} } = data.response || {}
        if (body && body.sessionCode) {
          if (body.sessionCode) {
            const {
              sessionCode = "",
              isBind,
              mobileNo = "",
              bindTime = "",
            } = body;

            let expireTime = Date.now() + 1000 * 60 * 210;
            let res = {
              skey: sessionCode,
              isbind: isBind == 1 ? true : false,
              mobileNo,
              bindTime,
              expireTime
            };
            Session.set(res);
            options.success(res);
            resolve(res)
          } else {
            var errorMessage = '登录失败(' + body.code + ')：' + (body.description || '未知错误');
            noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
            options.fail(noSessionError);
            reject(noSessionError);
          }

          // 没有正确响应会话信息
        } else {
          const {description='登录失败,登录接口响应异常'} = body;
          noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, `${description};statusCode:${statusCode}`);
          options.fail(noSessionError);
        }
      },
      // 响应错误
      fail: function (loginResponseError) {
        var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
        reject(error);
      },
    });

  })

  var session = Session.get();
  if (session) {
    if (Date.now() + 10 < session.expireTime) {
      wx.checkSession({
        success: function () {
          options.success(session);
          resolve(session);
        },
        fail: function () {
          Session.clear();
          doLogin();
          reject("");
        },
      });
    } else {
      doLogin();
    }
  } else {
    doLogin();
  }
  })
}



/* @method
 * 服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "POST"
 * @param {Function} options.success() 登录成功后的回调函数
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var requestLogin = function requestLogin(options) {

  options = utils.extend({}, defaultOptions, options);
  // 请求服务器登录地址，获得会话信息
  wx.request({
    url: `${config.apiDomain}Member/WxLogin`,
    method: options.method,
    data: options.data,
    success: function (result) {
      var data = result.data;
      var noSessionError
      // 成功地响应会话信息
      if (data && data.code === 0 && data.data.skey) {
        var res = data.data
        if (res.userinfo) {
          // 可直接存res.skey，存res是为了兼容login方法。
          Session.set(res);
          options.success();
        } else {
          var errorMessage = '登录失败(' + data.error + ')：' + (data.message || '未知错误');
          noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage);
          options.fail(noSessionError);
        }
        // 没有正确响应会话信息
      } else {
        noSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
        options.fail(noSessionError);
      }
    },

    // 响应错误
    fail: function (loginResponseError) {
      var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
      options.fail(error);
    },
  });
}


module.exports = {
  login: login,
  requestLogin: requestLogin,
  LoginError: LoginError
}