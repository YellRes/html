//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds(),
        "w+": Date.getWeek(this.getDay())
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
    return format;
};

Date.getWeek = function (e) {
    this.aWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return this.aWeek[e];
};
//字符串格式化为日期 输入格式：2016-09-30、2016/09/30
Date.parseString = function (e) {
    var b = /(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/i,
        a = b.exec(e),
        c = 0,
        d = null;
    if (a && a.length) {
        if (a.length > 5 && a[6]) {
            c = Date.parse(e.replace(b, "$2/$3/$1 $4:$5:$6"));
        } else {
            c = Date.parse(e.replace(b, "$2/$3/$1"));
        }
    } else {
        c = Date.parse(e);
    }
    if (!isNaN(c)) {
        d = new Date(c);
    }
    return d;
};
/**
 * @description 添加n天，
 * @param {n} 天数
 * @param {date} 默认今天, 支持Date()/timestmap/Y-M-D/Y/M/D 等格式
 * @param {formatStr} 默认Y-M-D
 * @return {string} 返回处理后的时间对象, 包括时间戳/日期/详情信息
 */
Date.prototype.addDay = function (n, date, formatStr) {
    var d = date || new Date();
    formatStr = formatStr || 'yyyy-MM-dd';
    if (typeof d === 'string' || typeof d === 'number') {
        d = new Date(date);
    }
    var day = 1000 * 60 * 60 * 24 * n;
    var newDay = new Date(d.getTime() + day);
    return {
        date: newDay,
        day: newDay.format(formatStr)
    }
};


Date.toHourMinute=function (minutes) {
    if(!minutes){
        return '';
    }
    if(minutes<60){
        return (minutes%60) + "分";
    }else if(minutes==60){
        return "1小时";
    }else{
        return (Math.floor(minutes/60) + "小时" + (minutes%60) + "分" );
    }
};

  Date.dateDiff =function(newDate, lastDate){ //lastDate和aDate是yyyy-MM-dd格式 ,lastDate 不传默认与当前日期比较
      var aDate, oDate1, oDate2, iDays, str;
      aDate = newDate.split("-");
      oDate1 = new Date(aDate[0],aDate[1]-1,aDate[2]);

      if(!lastDate){
      	var date = new Date();
      	lastDate = date.format('yyyy-MM-dd')
      }

      
      aDate = lastDate.split("-");
      oDate2 = new Date(aDate[0],aDate[1]-1,aDate[2]);

      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);
      if((oDate1 - oDate2) >= 0){
          if(iDays === 0){
              str = '今天';
          }else if(iDays === 1){
              str = '明天';
          }else if(iDays === 2){
              str = '后天';
          }else{
             str = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][oDate1.getDay()];
          }
      }else{
          str = '';
      }
      return str;
  }