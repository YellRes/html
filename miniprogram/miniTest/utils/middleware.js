/**
 * 提供微信小程序框架页面中间件技术支持。
 * 核心思想是给page对象注入属性和方法。
 *
 * @module middleware
 * @required module:compose
 */

var compose = require('compose.js');

/**
 * 合并中间件，形成一个对象。
 * @param {Array Collection | Object} 传输对象或数组集合，合并成一个对象。
 * @return {Object} 合并成一个对象。
 */
function middleware(){
  var target = {};
  for(var i = 0; i < arguments.length; i++){
    var source = arguments[i];
    if(typeof source != 'object') throw new Error('middleware should be array collection or object.');

    // 数组集合
    if(typeof source == 'object' && (source).constructor == Array){
      target = middleware.apply(this, source);
    }
    // 普通对象
    else{
      // 进行深度合并。
      target = compose(target, source);
    }
  }

  return target;
}

module.exports = middleware;