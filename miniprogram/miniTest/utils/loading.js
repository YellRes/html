
import * as util from './util';

export function showLoading(obj){

    var defaults = {
      title: '加载中',
    }

  var settings = util.extend({},defaults,obj);

  if (wx.showLoading) {
      wx.showLoading(settings)
  } else {
    settings = util.extend({}, { icon: 'loading' }, settings);
    wx.showToast(settings)
  }
}

export function hideLoading(){
  if(wx.hideLoading){
    wx.hideLoading()
  }else{
    wx.hideToast()
  }
}
