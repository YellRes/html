import Promise from '../libs/es6-promise/es6-promise';
import { post, get } from './request.js';
import tip from '../utils/tip';

/**
 * @request
 * @param {string} serviceURL 服务地址
 * @param {string} serviceName 服务名
 * @param {object} data 接口参数
 * @param {boolean} login 是否需要登录回话
 * @returns {object} Promise 返回promise对象
 */

export const request = (serviceURL, serviceName, data,login) => {
  var options = {
    header: {
      serviceName: serviceName,
      reqTime: new Date().getTime()
    },
    login:login || false,
    body: data || ''
  };
  return post(serviceURL, options);
};


// 统一处理接口返回数据
export const resHandler = (data, hideLoading) => {
  if (data.response) {
    data = data.response;
  }
  return new Promise((resolve, reject) => {
    if (data && data.header) {
      let { rspCode, rspDesc } = data.header;

      if (rspCode == '0') {
        resolve(data.body);
      } else {
        reject({
          type: rspCode,
          errMsg: rspDesc
        });
      }
    } else {
      reject({
        type: 1000,
        errMsg: '接口调用失败'
      });
    }
    if (!hideLoading) {
      tip.hideLoading();
    }

  });
};

