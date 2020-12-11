const app = getApp();
const util = require('util.js');
const navigate = require('navigate')


/**
 * @param  {function} [callback]     选中回调
 * @param  {String}   [storageKey]     历史选择存储key
 * @param  {function} [getData]     异步获取数据             必传
 * @param  {array}    [data]           列表数据                 必传
 * */
function CityList({ callback, getData, data, storageKey = '' } = {}) {
    this.getData = getData;
    this.data = data;
    this.callback = callback;
    this.storageKey = storageKey;
}

/**
 * 打开城市城市列表
 * @param  {String}   [type]         1出发 0到达              必传
 * @param  {String}   [dptCity]      出发城市            必传
 * @param  {String}   [projectType]  项目类型 0城市 1机场     必传
 * @param  {String}  [showLocate]    显示当前位置, 1显示 0不显示 默认1
 * @param  {String}  [goBack]        选中城市否是否回退, 1回退 0不会退 默认1
 * */
CityList.prototype.open = function ({ type, showPrefixList, showLocate = '1',dptCity='', goBack = '1' }) {
    const baseURL = '/';
    navigate.showPage(baseURL + 'pages/common/cityList/cityList', {
        type,
        dptCity,
        showPrefixList,
        showLocate,
        goBack
    });
};
CityList.prototype.getHistoryData = function () {
    return wx.getStorageSync(this.storageKey) || [];
};

CityList.prototype.setHistoryData = function (data) {
    let list = wx.getStorageSync(this.storageKey) || [],
        storageKey = this.storageKey;
    list = list.filter(item => item.name !== data.name);
    list.unshift(data);
    list = list.slice(0, 6);
    try {
        wx.setStorageSync(storageKey, list)
    } catch (error) {
        wx.setStorageSync(storageKey, list)
    }
};


let singleton = (function () {
    let _instance = null;
    return {
        getInstance: function (params) {
            if (!_instance) {
                _instance = new CityList(params)
            }
            return _instance
        },
        destroy: function () {
            _instance = null;
        }
    }
})();

module.exports = singleton;
