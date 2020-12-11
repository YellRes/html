function isFn(fn) {
    return typeof fn === 'function';
}
//Modal封装
function alert(obj, title, showCancel, cancelText, confirmText, sucFn, cancelFn) {
    if (typeof obj === 'object'){
        var { content, title, showCancel, cancelText, confirmText, sucFn, cancelFn, cancelColor} = obj;
    }else{
        var content = obj;
    }
    if(typeof title == 'function'){
        sucFn = title;
        title = '';

    }
    if(typeof showCancel == 'function'){
        cancelFn = showCancel;
        showCancel = '';
    }

    wx.showModal({
        content: content || '',
        title: title || '温馨提示',
        showCancel: showCancel || false,
        cancelText: cancelText || '我知道了',
        confirmText: confirmText || '确定',
        confirmColor:"#5f9df1",
        cancelColor: cancelColor || '#000000' ,
        success: function (res) {
            if (res.confirm) {
                isFn(sucFn) && sucFn(res);
            } else {
                isFn(cancelFn) && cancelFn();
            }
        }
    });
}

// loading
// function loading(title) {
//     wx.showToast({
//         title: title || '加载中...',
//         icon: 'loading',
//         duration: 200000,
//         mask:true
//     });
// }

function showToast(title, icon, duration, success) {
    wx.showToast({
        title: title || '加载中...',
        icon: icon || 'loading',
        duration: duration || 20000,
        success: success || null,
        mask:true
    });
}

// loading
function showLoading(title, success) {
    wx.showLoading({
        title: title || '加载中...',
        success: success || null,
        mask: true
    })
}

function hideLoading() {
    wx.hideLoading();
}

function hideToast(){
    wx.hideToast({
        fail: () => {}
    });
}

module.exports= {
    alert,
    // loading,
    hideToast,
    showToast,
    showLoading,
    hideLoading
};