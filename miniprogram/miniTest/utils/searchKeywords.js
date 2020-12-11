import {getGdPoi} from '../api/apiCarpool'

module.exports =  class gdmap {

    constructor(param) {
        this.ak = param && param["ak"] || '2e5416eb4a1f79a40e58066836502982';
        
    }

    search(param) {
        let searchParam ={
            citylimit: true,
            children:1,
            offset: 20,
            page: 1,
            output: 'JSON',
            city:'',
            keywords:'',
            s:'rsv3',
            platform: 'JS',
            extensions:'all'
        }

        let allParam = {
            ...searchParam, 
            key: this.ak,
            keywords: param['keywords'],
            city: param['city']
        }

        getGdPoi(allParam).then((data)=>{
            param.success(data)
        }).catch((err)=>{
            param.fail && param.fail(err)
        })
    }


}