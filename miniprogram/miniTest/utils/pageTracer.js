var EventTracer = require('eventtracerCbd.js')

let pageStartTime = 0
var pageTracer = [];
let pagePath = '';
wx.onAppRoute && wx.onAppRoute((e) => {
    // console.log(e)
    let time = Date.now()

    if (pageTracer.length) {
        let list = pageTracer.splice(0, pageTracer.length);
        let staytime = time - pageStartTime
        list.forEach((n, i) => {
            if (!n.stayTime && n.pagename.indexOf(pagePath) >= 0) {
                n.stayTime = staytime
            }
            EventTracer.page(n).submit()
        })
    }
    pagePath = e.path;
    pageStartTime = time
})
wx.onAppHide && wx.onAppHide((e) => {
    let time = Date.now()

    if (pageTracer.length) {
        let list = pageTracer.splice(0, pageTracer.length);
        let staytime = time - pageStartTime
        list.forEach((n, i) => {
            if (!n.stayTime && n.pagename.indexOf(pagePath) >= 0) {
                n.stayTime = staytime
            }
            EventTracer.page(n).submit()
        })
    }
})
wx.onAppShow && wx.onAppShow(e => {
    // console.log(e)
    pagePath = e.path;
    pageStartTime = Date.now()
})

function pushData(data){
    pageTracer.push(data)
}
module.exports = pushData