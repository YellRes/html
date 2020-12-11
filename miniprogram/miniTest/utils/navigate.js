
var fn={

  /**
   * 显示新页面
   * @param url  新页面相对路径
   * @param params json参数
   */
  showPage: function (url, params) {
    if(typeof url === 'string'){
      wx.navigateTo({
        url: this.buildUrl(url, params)
      });
      return
    }
    if(typeof url === 'object'){
      const { url:appUrl,params:appParams } = url
      url.url = this.buildUrl(appUrl, appParams)
      url.hasOwnProperty('params') && delete url.params
      wx.navigateTo({
        ...url
      });
    }
  },

  /**
   * 替换页面
   * @param url 新页面相对路径
   * @param params json参数
   */
  replacePage: function (url, params) {
    wx.redirectTo({
      url: this.buildUrl(url, params)
    });
  },


  /**
   * 构建url
   * @param url 跳转url地址
   * @param params json参数
   * @returns {*} 完整url地址
   */
  buildUrl: function (url, params) {
    if (params) {
      if (url.indexOf('?') == -1) {
        url += "?_=" + Math.random()
      }

      for (var key in params) {
        var value = params[key];
        if (typeof value == 'object') {
          value = JSON.stringify(value);
        }
        url += "&" + key + "=" + value;
      }
    }
    return url;
  }
}

module.exports = fn;