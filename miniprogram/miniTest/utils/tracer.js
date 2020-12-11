var EventTracer = require('eventtracer.js')

function isFn(fn) {
    return typeof fn === 'function'
}

var tracer = {
    page: function (pagename, productCode, orgpagename, resourceid, serialid) {
        EventTracer.page({
            pagename: pagename, //页面名称，一个完整的视图的路径
            orgpagename: orgpagename || "", //上一个页面的视图路径
            productcode: productCode, //产品码     "度假"(出境）; 2028
            resourceid: resourceid || 0, //资源ID
            serialid: serialid || ''
        }).submit()
    },
    ev: function (pagename, productCode, label, value, category, action) {
        EventTracer.event({
            pagename: pagename, //页面名称，一个完整的视图的路径
            productcode: productCode, //公共    产品码 2028
            category: category || 'category', //类型
            action: action || 'click', //动作
            label: label, //事件名称，静态值（如推送事件：opt_label：push）
            value: value || label //事件的参数值，动态值（如同一事件包含多个维度的变量，用特殊符号分割，数据清洗时解析）
        }).submit()
    }
}


module.exports = tracer;