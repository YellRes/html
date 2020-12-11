/**
 * 拼车的通用方法
 * @param {*} string 
 * @param {*} str 
 */
function matchStr(string,str){
    let matchedStr = string.match(str);
    if(matchedStr && matchedStr.length >=1 ){
        return true;
    }else {
        return false;
    }
}

export function getDistrict(district) {
    if(typeof district =='object'){
      return '';
    }
    if(district&&district.length>2){
        let newDistrict = district;
        
        if(!(matchStr(district,'园区') || matchStr(district,'自治区'))){
            /* eslint-disable no-useless-escape */
            newDistrict = newDistrict.replace(/\区/g,"");
        }
        if(!matchStr(district,'自治县')){
            /* eslint-disable no-useless-escape */
            newDistrict = newDistrict.replace(/\县/g,"");
        }
        /* eslint-disable no-useless-escape */
        return newDistrict.replace(/\市/g,"");
    }else {
        return district;
    }
}

/**
 * 判断当前区域是否支持拼车  
 * @param {} position 
 * @param {*} cityList 
 */


// switch (match.matchedType){//0-无匹配项; 1-匹配到city级 2-匹配到区域级
//     case 3://3-匹配到区域级
//     case 2://2-匹配到city级
//         // addressShowCity = match.matchedCity;

//         break;
//     case 1://1-匹配到城市大市范围,但没匹配到区域
//         // toast('该区域暂未开通拼车服务');
//         break;
//     case 0://0-无匹配项;
//     default:
//         break;
// }

export function judgeIsInService(position,cityList){
    let nowDistrict = getDistrict(position.district);
    // let isIn = departureList.some((item)=>{
    //     return item.cities.some((obj)=>{
    //       if(obj.fullName == city || obj.fullName == district){
    //         sameName = obj.fullName;
    //         return true
    //       }
    //       return false
    //     })
    // })
    if(nowDistrict){
        for(let i=0; i<cityList.length;i++) {
            for(let j=0;j<cityList[i].cities.length;j++){
                let oneCity = cityList[i].cities[j];
                let districtStr = oneCity.name.match(nowDistrict);
                if(districtStr && districtStr.length >=1 ){
                    return {
                        matchedType:2,
                        matchedCity:nowDistrict,
                        matchData: oneCity
                    };
                }
            }
        }
    }
    if(position.city){
        for(let i=0; i<cityList.length;i++) {
            for(let j=0;j<cityList[i].cities.length;j++){
                let oneCity = cityList[i].cities[j];
                if(getDistrict(position.city) == getDistrict(oneCity.name) ){
                    if(oneCity.areaList.length>0){
                        for(let kk=0;kk<oneCity.areaList.length;kk++){
                            
                            if(oneCity.areaList[kk].areaName){
                                let districtStr = oneCity.areaList[kk].areaName.match(nowDistrict);
                                if(districtStr && districtStr.length >=1 ){
                                    return {
                                        matchedType:3,
                                        matchedCity:oneCity.name,
                                        matchData: oneCity
                                    };
                                }
                            }
                        }
                    }
                    return {//匹配到城市大市范围,但没匹配到区域
                        matchedType:1,
                        matchedCity:oneCity.name,//定位时用
                        matchData: {}
                    };
                }
            }
        }
    }
    return {
        matchedType:0,
        matchedCity:'',
        matchData: {}
    };
}

// 计算附加费用
export  function calculateAddFee(param ={}){
    //判断是否在圈内
    function isInside(calList = []){
        var temp = [];
        for (var m = 0; m < calList.length; m++) {
            temp.push([calList[m].gdLat, calList[m].gdLng]);
        }
        var x = Number(param.selectedLat), y = Number(param.selectedLng);
        var inside = false;
        for (var i = 0, j = temp.length - 1; i < temp.length; j = i++) {
            var xi = Number(temp[i][0]), yi = Number(temp[i][1]);
            var xj = Number(temp[j][0]), yj = Number(temp[j][1]);
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    return new Promise((resolve,reject)=> {
        if(param.serviceAreaList&&param.serviceAreaList.length>0&&param.serviceAreaList[0].mapPointList&&param.serviceAreaList[0].mapPointList.length>0){
            for(var i = 0 ,len = param.serviceAreaList.length ; i < len ;i++){
                if(isInside(param.serviceAreaList[i].mapPointList)){
                    resolve({
                        "carAddFee": param.serviceAreaList[i].carAddFee||0,
                        "carPoolAddFee": param.serviceAreaList[i].carPoolAddFee||0,
                        "isInAreas":true
                    });
                    return;
                }
            }
            resolve({
                "carAddFee": 0,
                "carPoolAddFee": 0,
                "isInAreas":false
            });
        }else{
            resolve({
                "carAddFee": 0,
                "carPoolAddFee": 0,
                "isInAreas":true
            })
        }
    });
}

/**
 *获取当前时间
 */
export function getCurrentDate() {
    var currentTime = new Date(); //当前时间
    return currentTime;
}

//  计算开始 结束时间
export function getTimeArea(data) {
   
        //数据错误的时候调用默认值
        if(!data){
            var mindatetime = new Date().format("yyyy-MM-dd hh:mm:ss");
            var maxdatetime = new Date(new Date().getTime() + (24 * 3600 * 1000 * 6)).format("yyyy-MM-dd") + " 23:50:00";
            
            return {
                type : "DATETIME_INFO",
                carpolLimitTime : {
                    mindataTime : mindatetime,
                    maxdataTime : maxdatetime
                }
            };
        }
        var {
            //大小写兼容M和混合中间层
            SaleDays,
            saleDays,
            SaleBegin,
            saleBegin,
            advanceTime,
            AdvanceTime
        } = data || {};
        
        
        /* eslint-disable no-redeclare */
        var saleDay =( parseInt(SaleDays || saleDays) == 0 ? 1 : parseInt(SaleDays || saleDays)) -1,
            sbegin = SaleBegin || saleBegin || "",//开售日期
            /* eslint-disable no-redeclare */
            advanceTime = AdvanceTime || advanceTime || "0",//拼车包车提前预约时间parseInt
            workBegin = data.workBegin || "00:00",//供应商上班时间
            workEnd = data.workEnd || "23:50",//供应商下班时间
            nowDate = getCurrentDate().format('yyyy-MM-dd hh:mm:ss'),
            caculatMinTime = () => {//计算开始时间
                var mindataTime = nowDate;//默认是当前时间
                if (sbegin && timeAlert(nowDate) < timeAlert(sbegin)) {
                    mindataTime = new Date(timeAlert(sbegin) + timegets(workBegin)).format('yyyy-MM-dd hh:mm:ss');//开售日期+供应商上班时间
                } else {//当天日期大于等于开售日期
                    //当天日期+提前预约时间<=供应商上班时间(hh:mm)
                    var currentyuyue = timegets(nowDate.split(" ")[1]) + timegets(advanceTime),//当天时间（hm）+提前预约时间
                        workbegintimes = timegets(workBegin),//供应商上班时间
                        workendtimes = timegets(workEnd);//供应商下班时间
                    if (currentyuyue <= workbegintimes) {
                        mindataTime = new Date(timeAlert(nowDate) + workbegintimes).format('yyyy-MM-dd hh:mm:ss');//当天日期+供应商上班时间
                    } else if (currentyuyue > workbegintimes && currentyuyue < workendtimes) {
                        //当天日期+提前预约时间
                        mindataTime = new Date(getdateTimes(nowDate) + timegets(advanceTime)).format('yyyy-MM-dd hh:mm:ss');
                    } else if (currentyuyue >= workendtimes) {
                        mindataTime = new Date(24 * 60 * 60 * 1000 + timeAlert(nowDate) + workbegintimes).format('yyyy-MM-dd hh:mm:ss');//第二天日期+供应商上班时间
                    }
                }
                console.log(mindataTime)
                return mindataTime;
            } ;
            //
        // if (sbegin) {rstype 区分包车拼车参数去掉，后面提前预约时间统一用 advanceTime
            var carpoolMinTime = caculatMinTime();
            return {
                type : "DATETIME_INFO",
                carpolLimitTime : {
                    mindataTime : carpoolMinTime,
                    maxdataTime : addDate1(saleDays - 1, carpoolMinTime.replace(/-/g, "/").split(" ")[0]+" 23:50:00").format('yyyy-MM-dd hh:mm:ss')
                }
            }
        // }else{
        //     var mindatetime = new Date().format("yyyy-MM-dd hh:mm:ss");
        //     var maxdatetime = new Date(new Date().getTime() + (24 * 3600 * 1000 * saleDay)).format("yyyy-MM-dd") + " 23:50:00";
        //     return {
        //         type : "DATETIME_INFO",
        //         carpolLimitTime : {
        //             mindataTime : mindatetime,
        //             maxdataTime : maxdatetime
        //         },
        //         carsourceLimitTime : {
        //             mindataTime : mindatetime,
        //             maxdataTime : maxdatetime
        //         }
        //     };
        // }
    
}

export function addDate1(count1, date1) {
    date1 = processDate(date1);
    date1.setDate(date1.getDate() + Number(count1));
    return processDate(date1);
}
/**
 * 日期处理
 * date {string/Date} //要处理的时间 ''
 * @return {Date}
 * */
export function processDate(date) {
    if (typeof date === 'string') {
        date = new Date(date.replace(/\..*$/, "").replace(/-/g, '/').replace(/\+/g, ' ').replace(/T/g, ' '));
        return date;
    }else if(date instanceof Date){
        return date;
    }
    return new Date();
}
//时间处理
export function getdateTimes(value) {
    return Number(new Date(value.replace(/-/g, "/")).getTime());
}
export function timeAlert(value) {
    return Number(new Date(value.replace(/-/g, "/").split(" ")[0]).getTime());
}
export function timegets(value) {
    if (!value.split(":")[1]) {
        return value * 60 * 1000
    } else {
        return value.split(":")[0] * 60 * 60 * 1000 + value.split(":")[1] * 60 * 1000
    }
}