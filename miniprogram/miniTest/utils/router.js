/**
 * url处理方法
 * @module url
 */

var isempty = require('isempty.js');

module.exports = {
  /**
   * 根据参数返回查询字符串
   * @code
   *   var params = {
   *     key1 = [1,2,3],
   *     key2 = 'a',
   *     key3 = 'b'
   *   }
   *
   *   url = getComponents(params) // url => key1=1,2,3&key2=a&key3=b
   * @endcode
   *
   * @param {Object} params 参数，键值对对象
   * @param {Boolean} isclean 是否过滤空值 @see isempty()。
   * @param {Boolean} isencode 是否对参数进行url编码。
   * @return {String} 查询字符串。
   */
  getQueryString: function(params, isclean, isencode){
    var url = [];
    for(var key in params){
      if(isempty(params[key]) && isclean) continue;

      // 根据类型，生成相应的参数
      var param;
      switch(typeof params[key]){
        case 'string' :
          // 字符串
          param = params[key];
          break;
        case 'object' :
          // 数组
          param = params[key].toString();
          break;
        case 'boolean' :
          // 布尔
          if(params[key]){
            param = 'true';
          }else{
            param = 'false';
          }
          break;
        default :
          // 默认不知道什么类型。
          param = params[key];
      }
      param = key + '=' + param;

      url.push(param)
    }

    return isencode ? encodeURI(url.join('&')) : url.join('&');
  },

  /**
   * 将url和参数拼接成新的url
   *
   * ```js
   * var params = {age:18, name:'Jack'};
   * // 输出 path/to?age=18&name=Jack
   * get('path/to', params)
   * // 输出 path_to_18_Jack
   * get('path_to_{age}_{name}', params, true)
   * ```
   *
   * @param  {String} url    url地址
   * @param  {String|Object} params url参数，字符串或对象皆可
   * @param  {Boolean} isReplace 是否是替换模式，替换模式下，会将url中的占位符替换掉。
   * @return {String}        拼接好的url地址
   */
  get: function(url, params, isReplace){
    if(!url) throw new Error('url must be a value.');

    // 替换模式
    if(isReplace){
      return replaceStrByParams(url, params);
    }
    // 非替换模式
    else{
      // 参数解析成key=value形式字符串。
      params = typeof params == 'object' ? this.getQueryString(params) : params;
      // 和url拼接成一起。
      if(url.indexOf('?') < 0) url += '?';
      url += '&' + params;
      return url.replace(/&&/ig, '&');
    }
  },

  /**
   * 根据url和参数前往对应地址
   * @param  {String} url    url地址
   * @param  {String|Object} params url参数，字符串或对象皆可
   * @param  {Boolean} isRedirect 是否是重定向形式，是的话调用wx.redirectTo，否则wx.navigateTo
   */
  go: function(url, params, isRedirect, isReplace){
    url = this.get(url, params, isReplace);
    // 根据类型进行跳转
    var type = isRedirect ? 'redirectTo' : 'navigateTo';
    wx[type]({
      url: url
    })
  }
}


/**
 * 将字符中的占位符根据键值对替换掉。
 * @param  {String} str    要替换字符串
 * @param  {Object} params 键值对参数
 * @return {String}        替换成功返回字符串，否则为undefined。
 */
function replaceStrByParams(str, params){
  if(!str || typeof params != 'object') return;

  for(var key in params){
    if(!params.hasOwnProperty(key)) continue;
    var reg = new RegExp('{' + key + '}', 'ig');
    str = str.replace(reg, params[key]);
  }

  return str;
}

