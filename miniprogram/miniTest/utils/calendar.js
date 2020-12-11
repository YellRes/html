var app = getApp();
var util = require( 'util.js' )
function show( param ) {
  var baseUrl = param.basePageUrl || '../../../';
  var calendarParam = util.extend( {
    }, param, {
      callback: 'calendarCallback'
    })

  app.globalData.calendarCallback = function( data ) {
    return param.callback && param.callback( data )
  }
  if( param.rangeFn ) {
    calendarParam.rangeFn = 'calendarRangeFn'; 
    app.globalData.calendarRangeFn = function( data ) {
      return param.rangeFn( data )
    }
  }
  if( param.rangeUnPass ) {
    calendarParam.rangeUnPass = 'calendarrangeUnPass'; 
    app.globalData.calendarrangeUnPass = function( data ) {
      return param.rangeUnPass( data )
    }
  }
  
  if( param.goBack ) {
    calendarParam.goBack = 'calendargoBack'; 
    app.globalData.calendargoBack = function( data ) {
      param.goBack( data )
    }
  }
  app.globalData.calendarParam = calendarParam;
  wx.navigateTo( {
    url: baseUrl + 'pages/common/calendar/calendar'
  })
}

module.exports = {
  show: show
}
