/**
 * 运行环境，production生产、test测试、dev开发
 */
import * as settings from './settings';
import * as util from '../utils/util';
var env = "dev";
var config = {};
var apiConfig = {};

// 生产环境
var api = "https://mobileapi2.hn96606.cn";

// 汽车票接口
var busApi = "https://testapi.hn96606.cn"
var wx = "https://wx.chebada.com";
var gg = "https://qg.chebada.com";

if (env == "dev") {
  api = "http://mobileapi2.qa.hn96606.cn";
  busApi = "https://testapi.hn96606.cn"
  wx = "https://wx.qa.chebada.com";
  gg = "https://qg.chebada.com";
}
apiConfig = {
  
}


config = util.extend({}, apiConfig, settings,{env});
module.exports = config;
