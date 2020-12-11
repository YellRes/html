/**
 * 值是否为空
 * @module isempty
 */

/**
 * 检测是否为空
 * @param  {Mixed} sth 要检测的数据
 * @return {Boolean}    如果空字符串、空数组、空对象返回true，其余返回false
 */
function isempty(sth){
  // 空字符串
  if(sth == '') return true;
  // 空数组
  if(typeof sth == 'object' && (sth).constructor == Array && sth.length == 0) return true;
  // 空对象
  if(typeof sth == 'object' && (sth).constructor == Object){
    for(var k in sth){
      return false;
    }
    return true;
  }

  return false;
}

module.exports = isempty;
