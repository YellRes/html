var app = getApp();
var util = require('util.js');
var Nav = require('navigate')

/**
 * @method open
 * @param {Object}   options 相关的配置
 * @param {Number}   options.action 0专题页面(九宫格抽奖) 必传 
 * @param {Number}  options.hasInvoice 是否需要发票选项 非必传 默认需要
 * @param {Number}  options.hasMail 是否需要邮寄选项 非必传 默认需要
 * @param {String}  options.voteId  奖品ID（专题必传）,
 * @param {String}  options.batchCode  奖品批次（专题必传）,
 * @param {Function} options.callback 选择后的回调  非必传
 * @param {Function} options.goBack 选中后跳转前的钩子 非必传
 * @return void
 */

function openMailAndInvoice(options) {

  var baseURL = options.baseURL || '/'

  app.globalData.supMailAndInvoiceParam = util.extend({},options, { callback: 'supMailAndInvoiceCallback' });

  app.globalData.supMailAndInvoiceCallback = function (data) {
    options.callback && options.callback(data);
  }
  if (options.goBack) {



    // app.globalData.supMailAndInvoiceParam.goBack = 'supMailAndInvoiceGoBack';
    // app.globalData.supMailAndInvoiceGoBack = function () {
    //   options.goBack();
    // }
  }

  var {action,hasInvoice,hasMail,voteId,batchCode,batchKey,rateRecordId,prizeRecordId} = options;
  var urlParams = {
    action,
    hasInvoice,
    hasMail,
    voteId,
    batchCode,
    batchKey
  }
  if(rateRecordId){
    urlParams.rateRecordId = rateRecordId;
  }
  if(prizeRecordId){
    urlParams.prizeRecordId = prizeRecordId;
  }
  Nav.showPage(baseURL +'pages/common/supplementInvoice/supplementInvoice',urlParams);
}




module.exports = {
  openMailAndInvoice
} 