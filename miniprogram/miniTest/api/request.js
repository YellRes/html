// import Promise from '../libs/es6-promise/es6-promise';
import * as util from '../utils/util'
import {platId,referId} from '../api/config'

import lib  from '../libs/index.js'


 //新增公共请求参数——渠道id和平台id

// let reqParams = {
//   platId:platId,
//   refid: referId
// }

export const request = (method = 'GET') => (url, data,login) => {
  data = data || {};
  if(login != undefined){
    data['login']= login;
  }


  return lib.request(url,data)



  //读取配置refid
  // reqParams['refid'] = wx.getStorageSync('REFERID') || referId;
  // if(data && data.body){
  //   data.body = util.extend({},reqParams, data.body)
  // }else{
  //   data = util.extend({},reqParams, data)
  // }
  // return new Promise((resolve, reject) => {
  //   wx.request({
  //     url,
  //     data,
  //     method,
  //     header: {
  //       'Content-Type': 'application/json'
  //     },
  //     success: function(res) {
  //       resolve(res.data)
  //     },
  //     fail: function(err) {
  //       reject(err)
  //     }
  //   });
  // })
}


export const get = request('GET');
export const post = request('POST');
// export const XHR = request('POST'); //酒店订单相关
export const put = request('PUT');
export const del = request('DELETE');