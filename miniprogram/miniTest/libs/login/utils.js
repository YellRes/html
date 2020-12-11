/**
 * 扩展对象
 */

/* exports.extend = function extend(target){
  var sources = Array.prototype.slice.call(arguments, 1);

  for(var i=0; i < sources.length; i += 1){
    var source = sources[i];
    for (var key in source){
      target[key] = source[key];
    }
  }
  return target
} */


var slice = [].slice,
  class2type = {},
  toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error"
  .split(" ")
  .forEach(function(name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

function type(obj) {
  return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
}

function isObject(obj) {
  return type(obj) == "object";
}

function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}
var isArray =
  Array.isArray ||
  function(object) {
    return object instanceof Array;
  };



function extended(target, source, deep) {
  for (var key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {};
      if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
      extend(target[key], source[key], deep);
    } else if (source[key] !== undefined) target[key] = source[key];
}

exports.extend = function extend(target) {
  var deep,
    args = slice.call(arguments, 1);
  if (typeof target == "boolean") {
    deep = target;
    target = args.shift();
  }
  args.forEach(function(arg) {
    extended(target, arg, deep);
  });
  return target;
}