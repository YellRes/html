import { getDictionaryValue } from '../api/apiActivities';
//数据字典接口 code (String)
export default function requestDicConfig({code}){
    return new Promise((reslove,reject)=>{
        getDictionaryValue({code}).then(res=>{
            let { code='',dictionaryList=[] } = res;
            if(code == 0 && dictionaryList.length > 0){
                let json = {};
                dictionaryList.map((item) => {
                    const { code,isactive='0',value='' } = item;
                    json[code] = {
                        value,
                        isactive
                    }
                })
                reslove(json)
            }else{
                reject({})
            }
        }).catch(res=>{
            reject(res)
        })
    })
}