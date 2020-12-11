const app = getApp();
const navigate = require('./navigate');
var util = require('util.js');
const openHotelSearch = (params) =>{


  app.globalData.searchHotel = util.extend({}, params, { callback: 'searchHotelCallback' });

  app.globalData.searchHotelCallback = function (data) {
    params.callback && params.callback(data);
  };
  if (params.goBack) {
    app.globalData.searchHotel.goBack = 'searchHotelGoBack';
    app.globalData.searchHotelGoBack = function (data) {
      params.goBack(data);
    };
  }
    // app.globalData['openHotelSearchCallback'] = function(data){
    //     params.callback && params.callback(data)
    // }
    navigate.showPage('../../hotel/searchHotel/searchHotel',{cityId:params.cityId,sectionId:params.sectionId});
}

export{
openHotelSearch
} 