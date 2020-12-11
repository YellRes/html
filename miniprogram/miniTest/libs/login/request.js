import { platId, referId } from '../../api/config';

var Promise = require('../es6-promise/es6-promise');
var constants = require('./constants')
var loginLib = require('./login')
var Session = require('./session')
var utils = require('./utils')


/**
 * 请求过程发生异常
 */
var RequestError=(function(){
  function RequestError(type, message){
    Error.call(this, message);
    this.type = type;
    this.errMsg = message;
  }
  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;
  return RequestError;
})();

function callFail(err){
  console.log(err)
}


function request(url,options={}){
  // 是否重试过
  var hasRetried = false;

  //公共请求参数——渠道id和平台id
  let reqParams = {
    platId: platId,
    refid: referId,
  }
  options = utils.extend({}, { login: false}, options)

  return new Promise((resolve, reject) => {

    if (options.login) {
      doRequestWithLogin();
    } else {
      doRequest();
    }
    // 登录后再请求
    function doRequestWithLogin() {
      loginLib.login({
        success: doRequest, fail: function (err) {
          reject(err)
        }
      })
    }

    // 发送真实请求
    function doRequest(res) {
      if (options.hasOwnProperty('login')) {
        if (options.login){
          reqParams['sessionCode'] = (res !== undefined) ? res.skey: Session.get() && Session.get().skey
        }
      }
      var data = utils.extend({}, options);
      reqParams['refid'] = wx.getStorageSync('REFERID') || referId;

      if (data && data.body) {
        data.body = utils.extend({}, reqParams, data.body)
      } else {
        data = utils.extend({}, reqParams, data)
      }

      if (data.hasOwnProperty('login')) {
        delete data.login
      }
      
      wx.request({
        url,
        data,
        method: 'POST',
        dataType: 'json',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          var response = data.response || data;
          var message, error;
          //兼容专题返回结构无header 通过code -1判断
          if (response && response.header && response.header.rspCode == -1 || (response.code && response.code == -1) || (response.Code && response.Code == -1)) {
            let errType = (response.header && response.header.rspCode) || response.code || response.Code;
            Session.clear();
            // 登录态无效且未重试过，重新登录刷新sessionKey重新请求
            if (!hasRetried) {
              hasRetried = true;
              doRequestWithLogin();
              return;
            }
            message = '登录态已过期';
            error = new RequestError(errType, message)
            reject(error)
          } else {
            resolve(data)
          }
        },
        fail: function (err) {
          reject(err)
        }
      });
    }
  })
}

module.exports = {
  request: request,
  RequestError: RequestError,
}