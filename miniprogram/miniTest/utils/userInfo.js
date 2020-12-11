/**
 * 获取openid
 *
 * @param {function} fn 回调
 */

var app = getApp();

// var authDomain = require('../api/config').authDomain;

import {authDomain,accoutId } from '../api/config';
import {getAuthorizationOpenId,getAuthorizationUnionId} from '../api/api'
import{alert} from '../utils/tip';

function getOpenid(fn) {
        wx.login({
            success: function (res2) {
                //用code换openid，解密key在服务端
                var params = accoutId ? {accoutId:accoutId,code: res2.code} : { code: res2.code}
                getAuthorizationOpenId(params).then((res)=>{
                    try {
                        wx.setStorageSync('chebada.openid', res.openId);
                    } catch (e) {    
                        console.log(e)
                    }
                    typeof fn === 'function' && fn(res.openId);

                }).catch((err)=>{
                    typeof fn === 'function' && fn('');
                })
            }
        });
}

/**
 * 获取unionid
 *
 * @param {function} fn 回调
 */
function getUnionid(fn) {
    var unionid = wx.getStorageSync('chebada.unionid');
    wx.checkSession({
        fail: function () {
            //如果登录态失效,清除unionId重新获取
            wx.removeStorageSync('chebada.unionid');
            wx.removeStorageSync('chebada.openid');
            unionid = '';
        },
        complete:function () {
            if (unionid) {
                typeof fn === 'function' && fn(unionid);
            } else {
                getOpenid(function (openId) {
                    if (openId == '') {
                        typeof fn === 'function' && fn('');
                    } else {
                        wx.getUserInfo({
                            success: function (res) {
                                getApp().globalData.userInfo = res.userInfo;
                                //openid和密文给后端，后端拿openid取key，解密得unionid
                                var params = {
                                    accoutId:accoutId,
                                    rawData: res.rawData,
                                    openId: openId,
                                    signature: res.signature,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv
                                };
                                getAuthorizationUnionId(params).then((_res)=>{
                                    try {
                                        wx.setStorageSync('chebada.unionid', _res.unionId);
                                    } catch (e) {    
                                        console.log(e)
                                    }
                                    typeof fn === 'function' && fn(_res.unionId);
                                }).catch((err)=>{
                                    typeof fn === 'function' && fn('');
                                })
                            },
                            fail:function (_err) {
                                typeof fn === 'function' && fn('');
                            }
                        });
                    }
                });
            }
        }
    });
}




function openSetting (fn) {
    var that = this;
    if (wx.openSetting) {
        wx.openSetting({
            success: function (res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                    scope : 'scope.userInfo',
                    success() {
                        wx.getUserInfo();
                    }
                });
                }
                fn && fn();
            }
        });
    } else {
        alert({
            title: '授权提示',
            content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
        })
    }
}


// function openSetting(){

// }

module.exports = {
    getOpenid: getOpenid,
    getUnionid: getUnionid,
    openSetting:openSetting,
    // openSettingAndCheckBind:openSettingAndCheckBind
};