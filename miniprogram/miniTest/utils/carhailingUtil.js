
function filterCityByAdcode(locationInfo,cityList){
    let { adcode='' } = locationInfo;
    if(!cityList || (cityList && cityList.length == 0) || adcode == ''){
        return {
            matchedType:0,
            matchData: {}
        };
       }
       adcode = adcode+''
       let nowAdCode = adcode;
       let nowCityAdCode = adcode.replace(/\d{2}$/,'00');
       for(let i=0;i<cityList.length;i++){
        let citiesArr = cityList[i].cities;
        for(let j=0;j<citiesArr.length;j++){
            let cityItem = citiesArr[j];
            let cityCode = cityItem.cityCode;

            //匹配到具体的adcode
            if(nowAdCode == cityCode){
                return {
                    matchedType:2,
                    matchData: cityItem
                }
            }else if(nowCityAdCode == cityCode){
                return {
                    matchedType:1,
                    matchData: cityItem
                }
            }
        }
    }
    return {
        matchedType:0,
        matchData: {}
    };
}
function filterCity(locationInfo,cityList){
    /* 
        matchType 0未匹配到 1城市 2匹配到县级市
    */
   
   if(!cityList || (cityList && cityList.length == 0)){
    return {
        matchedType:0,
        matchedCity:'',
        matchData: {}
    };
   }
    let nowDistrict = matchDistrict(locationInfo.district);
    let nowCity = matchDistrict(locationInfo.city);

    for(let i=0;i<cityList.length;i++){
        let citiesArr = cityList[i].cities;
        for(let j=0;j<citiesArr.length;j++){
            let cityItem = citiesArr[j];
            let districtStr = cityItem.name.match(nowDistrict);
            let cityStr = cityItem.name.match(nowCity);

            if(nowDistrict && districtStr && districtStr.length >=1 ){
               return {
                    matchedType:2,
                    matchedCity:nowDistrict,
                    matchData: cityItem
                }
            }
            if(nowCity && cityStr && cityStr.length >=1 ){
                return {
                    matchedType:1,
                    matchedCity:cityStr,
                    matchData: cityItem
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

function matchStr(string,str){
    let matchedStr = string.match(str);
    if(matchedStr && matchedStr.length >=1 ){
        return true;
    }else {
        return false;
    }
}

function matchDistrict(district) {
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

export {
    filterCity,
    filterCityByAdcode
} 