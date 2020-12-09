Page({
    data: {
    },

    toDownload() {
      let downloadTask = wx.downloadFile({
        url: 'https://www.wangbase.com/blogimg/asset/202012/bg2020120303.jpg',
        success: () => {

        },
        complete: () => {
          console.log('complete');
        }
      })

      let firstTime = new Date()
      downloadTask.onProgressUpdate(res => {
        console.count('onProgressUpdate has run ')


        let currentTime = new Date()
        if (currentTime.getTime() - firstTime.getTime() > 100 || res.progress % 10 === 0) {
          console.count('setData has run ')
          this.setData({
            progress: res.progress
          })

          if (currentTime.getTime() - firstTime.getTime() > 100) {
            console.count('throttle has run ')
            firstTime = currentTime
          }
        }
        
      })
    }
})