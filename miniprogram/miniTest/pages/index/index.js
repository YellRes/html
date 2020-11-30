//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })  
  },
  savePic() {
    wx.getImageInfo({
      src: '../../images/bee.jpg',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          complete: (res) => {
            console.log(res);
          }
        })
      },
      complete: (res) => {
        console.log(res);
      }
    })
  },

 

  async getPicImage() {

    let isPicDown = await this.getPicDownload() 

    let isOpen = await this.getWeixinSetting()

    
    let isSave = await this.saveImage(isPicDown && isPicDown.tempFilePath)

  },

  getPicDownload() {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: 'https://www.wangbase.com/blogimg/asset/202011/bg2020112601.jpg',
        success: (res) =>  {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        } 
      })
    })
  },

  // 获取用户的设置
  getWeixinSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotoAlbum"]) {
            reject(res)
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  // 获取授权
  getAuthorize() {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.record',
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  saveImage(imageUrl) {

    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: imageUrl,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    
  }


  
})
