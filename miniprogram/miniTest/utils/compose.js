/**
 * 合并对象。
 * @module compose
 */

/**
 * 合并对象，属性值非方法会覆盖，是方法类型会合并（合并的方法会并行，但执行结果
 * 是最后一个函数返回的值)
 *
 * @param  {Object} target 目标对象
 * @param  {Object} source 需要合并的对象
 * @param  {Number} deep   遍历对象层级
 * @return {Object}        合并完成的对象
 */
function compose(target, source, deep){
  // 目标一定要为对象。
  if(typeof target != 'object' && (target).constructor != Object){
    throw new Error('composeed target must be object.');
  }

  // 小于目标深度则不进行遍历。
  if(deep < 0) return target;

  for(var key in source){
    // 不继承原型上的属性
    if(!source.hasOwnProperty(key)) continue;

    // 目标有相同属性。
    // 如果是对象则进行遍历。
    if(typeof source[key] == 'object' && source[key] && (source[key]).constructor == Object){
      if(typeof deep == 'number'){
        target[key] = compose(target[key] || {}, source[key], deep - 1);
      }else{
        target[key] = compose(target[key] || {}, source[key]);
      }
    }
    // 如果是函数，则进行合并。
    else if(typeof source[key] == 'function'){
      target[key] = (function(lastFn, currentFn){
        return function(){
          var page = this,
              lastRst = lastFn && lastFn.apply(page, arguments),
              currentRst = currentFn && currentFn.apply(page, arguments);

          return currentRst;
        }
      })(target[key], source[key])
    }
    // 其他值，则source覆盖target
    else{
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = compose;
