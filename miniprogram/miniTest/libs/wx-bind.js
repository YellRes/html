var baseDir = '../';
var api = require(baseDir + 'api/api.js');
var tip = require(baseDir + 'utils/tip.js');
var libs = require('./index');
var app = getApp();

//微信手机号授权解析接口
var wxPhoneNumberLogin = (ev,isRefreshLogin=true) => {
    return new Promise((resolve, reject) => {
        if (ev.detail.errMsg == "getPhoneNumber:ok") { //授权成功
            api.bindMobileByWeixin({
                "refid": wx.getStorageSync('REFERID') || app.globalData['refid'] || "",
                "iv": ev.detail.iv,
                "encryptedData": ev.detail.encryptedData
            }).then((res) => {
                //刷新登录数据
                if(isRefreshLogin){
                    refreshLogin((res1)=>{
                        resolve(res1)
                    })
                }else{
                    resolve(res)
                }
                wx.showToast({title: "绑定成功", icon: "success"});
     
            }).catch((err) => {
                if (err.errMsg) {
                    tip.showToast(err.errMsg, 'none', 1500)
                }
                reject('authRequest=fail')
            });
        } else { //授权失败
            reject('auth:fail')
        }
    })
}



//微信实名授权解析接口
var wxAuthLogin = (ev={},isRefreshLogin=true,fromAction=1) => {
    let {auth_token} = ev.detail;
    return new Promise((resolve,reject)=>{
        if(auth_token){ //授权成功 
            api.getRealNameInfo({
                Authtoken:auth_token,
                fromAction:fromAction        //传1自动绑定
            }).then(res=>{
                //抛出实名信息
                resolve(res);
                //刷新登录数据
                isRefreshLogin && refreshLogin()
            }).catch(err=>{
                reject(err)
            })
        }else{  //授权失败 
            reject('auth:fail')
        }
     
    })
}

function refreshLogin(success,fail){
    //刷新登录数据
    libs.Session.clear();
    libs.login({
        success(res) {
            app && app.setGlobal(res); //刷新globalData绑定数据
            if(success && typeof success === 'function')success(res)
        },
        fail(err) {
            if(fail && typeof fail === 'function')fail(err)
            if (err.errMsg) {
                tip.showToast(err.errMsg, 'none', 1500)
            }
        }
    })
 }

 module.exports = {
    wxPhoneNumberLogin,
    wxAuthLogin
 }
