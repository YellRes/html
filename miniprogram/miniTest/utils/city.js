var app = getApp();

var util = require('util.js');



function open(param){

	var baseURL = param.baseURL || '/'

	app.globalData.cityParam = util.extend({},param,{callback:'cityCallback'});

	app.globalData.cityCallback= function(data){
		param.callback && param.callback(data);
	}
	if( param.goBack ){
		app.globalData.cityParam.goBack = 'citygoBack';
		app.globalData.citygoBack = function(){
			param.goBack();
		}
	}

	if(param.cityType == 1){
		wx.navigateTo({
			url: baseURL+ 'pages/common/trainCity/trainCity?start=' + param.start + '&city=' + param.city+'&deptCity='+param.deptCity
		})
	}else if(param.cityType == 2){
		wx.navigateTo({
			url: baseURL+ 'pages/common/hotelCityPicker/hotelCityPicker?cityName=' + param.cityName
		})
	}else{
		wx.navigateTo({
			url: baseURL+ 'pages/common/city-picker/city-picker?start=' + param.start + '&city=' + param.city+'&deptCity='+param.deptCity
		})
	}


}




module.exports = {
	open:open
} 