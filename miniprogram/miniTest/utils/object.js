//isFunction：检查 value 是不是函数
function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

//isLength：检查 value 是否为有效的类数组长度
function isLength(value) {
  return (
    typeof value == "number" &&
    value > -1 &&
    value % 1 == 0 &&
    value <= Number.MAX_SAFE_INTEGER
  );
}

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
// isPlainObject：判断数据是不是Object类型的数据
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

Object.keys =
  Object.keys ||
  function keys(object) {
    if (object === null || object === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(key);
      }
    }
    return result;
  };

// Object.values：返回一个给定对象自身的所有可枚举属性值的数组
Object.values =
  Object.values ||
  function values(object) {
    if (object === null || object === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    let result = [];
    if (isArrayLike(object) || isPlainObject(object)) {
      for (let key in object) {
        object.hasOwnProperty(key) && result.push(object[key]);
      }
    }
    return result;
  };
