var app = getApp();
var util = require('util.js');
var Nav = require('navigate')

/**
 * @method open
 * @param {Object}   options 相关的配置
 * @param {Number}   options.theme 0城市 1机场 必传
 * @param {String}   options.skin 皮肤 yzx
 * @param {Boolean}  options.isShowCurrent true显示 false不显示 默认显示 可选
 * @param {Boolean}  options.isStart 1出发 0到达 必传
 * @param {String}  options.projectId  必传,
 * @param {Function} options.source 数据源，函数返回promise对象 必传
 * @param {Function} options.callback 选择城市或机场后的回调 必传
 * @param {Function} options.goBack 选中后跳转前的钩子 非必传
 * @return void
 */

function open(options) {

  var baseURL = options.baseURL || '/'

  app.globalData.citySelectParam = util.extend({ isShowCurrent:true}, options, { callback: 'citySelectCallback' });

  app.globalData.citySelectCallback = function (data) {
    options.callback && options.callback(data);
  }
  if (options.goBack) {



    // app.globalData.citySelectParam.goBack = 'citygoBack';
    // app.globalData.citygoBack = function () {
    //   options.goBack();
    // }
  }
  
  if(options.source){
    app.globalData.citySelectSource = options.source;
  }
  const { skin='' } = options
  Nav.showPage(baseURL +'pages/common/citySelect/citySelect',{
    theme:options.theme,
    skin,
    projectId:options.projectId,
    isStart:options.isStart,
    isShowCurrent: options.isShowCurrent,
    //source:options.source
  });



}




module.exports = {
  open: open
} 