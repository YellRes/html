var app = getApp();
var util = require('util.js');
var api = require('../api/apiHotel');
var Amap = require('../libs/gdmap/amap-wx.js');
var gdmap = new Amap.AMapWX({ key: 'bae38b4de724d2b15f41739be154236b' });

var fail = {
  locationFail: true
};
function location(param, type) {
  const { useGdMap = false } = param;

  var locationData = getCache(param.cache, useGdMap);
  //noCache 不记上一次的缓存地址
  if (!param.noCache && locationData) {
    param.callback(locationData);
    return;
  }
  // if(wx.getStorageSync('chebada.unionid')!=''){
  wx.getLocation({
    type: type || 'wgs84',//TODO:wgs84存在定位误差一公里左右，370任务后，尝试用gcj02
    success: function (res) {
      if (useGdMap) {
        getGdCity(res.latitude, res.longitude, param);
        return;
      }
      if (param.cityType == 'hotel') {
        // getHotelCity(param);
        getCity(res.latitude, res.longitude, param);
      } else {
        getCity(res.latitude, res.longitude, param);
      }
    },
    fail: function (res) {
      fails(res, param);
    }
  });
  // }

}
function fails(res, param) {
  if (Object.prototype.toString.call(res) === "[object Object]") {
    param.callback && param.callback(util.extend({}, fail, res));
  }
}

//通过高德解析标注的经纬度得到定位地址 latitude longitude 是gcj02（火星坐标）
//谷歌，腾讯，高德 使用的是gcj02（火星坐标）
function getGdCity(latitude, longitude, param) {

  gdmap.getRegeo({
    location: longitude + "," + latitude,
    success: res => {
      if (param.callback && res.length > 0) {
        let data = res[0];
        let {addressComponent, formatted_address} = data.regeocodeData;
        let bdLoc = gd2bd({lng: longitude, lat: latitude});
        var loca = util.extend(
          {
            latitude: latitude,
            longitude: longitude
          },
          addressComponent,
          {
            bdlocation: bdLoc,
            street: addressComponent.streetNumber.street,
            street_number: addressComponent.streetNumber.number,
            name: data.desc || data.name,
            formatted_address
          }
        );

        if (!param.noCache) {
          setCache(loca, true);
        }
        param.callback(loca);
      } else {
        fails(res.data, param);
      }
    },
    fail: res => {
      fails(res, param);
    }
  });
}

function getCity(latitude, longitude, param) {

  wx.request({
    // url:'https://wx.chebada.com/mina/Location/GetPlace',
    url: 'https://wx.17u.cn/appapi/Map/GetAddress',
    data: {
      // lng:longitude,
      // lat:latitude
      location: latitude + ',' + longitude,
      coord_type: 1
    },
    method: "POST",
    success: function (res) {
      if (param.callback && res.data && res.data.ZoneReturnFiled) {
        var loca = util.extend(
          {
            latitude: latitude,
            longitude: longitude,
            detail: res.data.result //detail-统计代码用
          },
          res.data.ZoneReturnFiled,
          res.data.result.address_component
        );

        console.log('同程接口解析:', loca)
        setCache(loca); //设置缓存
        param.callback(loca);
      } else {
        fails(res.data, param);
      }
    },
    fail: function (res) {
      fails(res, param);
    }
  });
}

function getHotelCity(latitude, longitude, param) {
  api.getCityLocation()
    .then(res => {
      if (param.callback && res.isSuccess == '1') {
        var loca = util.extend({
          latitude: latitude,
          longitude: longitude
        },
          {
            cityId: res.locationId,
            cityName: res.locationName
          });
        setCache(loca); //设置缓存
        param.callback(loca);
      } else {
        fails(res.data, param);
      }
    })
    .catch(error => {
      fails(error, param);
    });
}



var cacheName = 'commonLocationCache919';
var cacheGdName = 'GdLocationCache919';
function setCache(data, useGdMap = false) {
  storageHelper.set(useGdMap ? cacheGdName : cacheName, {
    times: new Date().getTime(),
    data: data
  });
}
function getCache(times, useGdMap = false) {
  var rdata = false,
    caches = storageHelper.get(useGdMap ? cacheGdName : cacheName),
    nowTime = new Date().getTime();
  if ((typeof times === 'number' && times * 1000 + caches.times > nowTime) || times === true) {
    rdata = caches.data;
  }
  return rdata;
}
var storageHelper = {
  set: function (key, data) {
    try {
      wx.setStorageSync(key, data);

    } catch (e) {
      console.log(e)
    }
  },
  get: function (key, data) {
    return wx.getStorageSync(key);
  },
  clear: function (key, data) {
    try {
      wx.setStorageSync(key, false);
    } catch (e) {
      console.log(e)
    }
  }
};
/* ***
 *经纬度转换
 */
function bd2gd({
  lng,
  lat
} = {}) {
  if (!lng || !lat) {
    return undefined;
  }
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = lng - 0.0065,
    y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {
    lat: gg_lat,
    lng: gg_lng
  }
}

function gd2bd({
  lng,
  lat
} = {}) {
  console.log(lng,lat)
  if (!lng || !lat) {
    return undefined;
  }
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = lng,
    y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    lng: bd_lng,
    lat: bd_lat
  };
}
module.exports = {
  bd2gd,
  gd2bd,
  location,
  getGdCity
};