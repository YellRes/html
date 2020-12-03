//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: ''
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

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

    console.log(isOpen, 'isOpenisOpenisOpen');


    if (isOpen === 'error') {
      let getAuthorize = await this.getAuthorize()

      if (getAuthorize === 'error') {
        wx.showModal({
          title: '提示',
          content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
          success(res) {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
        return
      }

      return await this.saveImage(isPicDown && isPicDown.tempFilePath)
    }

    let isSave = await this.saveImage(isPicDown && isPicDown.tempFilePath)


  },

  // 下载
  getPicDownload() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: 'https://www.wangbase.com/blogimg/asset/202011/bg2020112601.jpg',
        success: (res) =>  {
          resolve(res)
          wx.hideLoading()
          console.log(this, 'successsuccesssuccesssuccesssuccess');
        },
        fail: (err) => {
          reject(err)
          wx.hideLoading()
        }
      })
    })
  },

  // 获取用户的设置
  getWeixinSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            reject('error')
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    }).catch(err => err)
  },

  // 获取授权
  getAuthorize() {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject('error')
        }
      })
    }).catch(err => err)
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
    }).catch(err => err)
    
  },

  async getAuthorize2() {
    await this.getAuthorize('scope.camera')
  },
  openSetting() {
    wx.openSetting()
  },

  // 预览媒体
  previewMedia() {
    const sources = [
      {
        url: 'https://www.wangbase.com/blogimg/asset/202011/bg2020112601.jpg'
      },
      {
        url: 'https://www.wangbase.com/blogimg/asset/202011/bg2020111508.jpg'
      },
      {
        url: 'https://www.wangbase.com/blogimg/asset/202011/bg2020111820.jpg'
      },
    ]
    wx.previewMedia({
      sources,
      current: 0,
      complete(res) {
        console.log(res, 'completecompletecompletecomplete');
      }
    })
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        debugger
        const tempFilePaths = res.tempFilePaths
        this.setData({
          avatarUrl: tempFilePaths[0]
        })
      }
    })
  },

  // 去登陆
  toLogin() {

    wx.login({
      success: (res) => {
        console.log(res, 'successsuccesssuccesssuccess');
      },
      complete: (res) => {
        console.log(res, 'completecompletecompletecomplete');
      }
    })
    
  },


  // 判断是否登录
  


})


// 1. 下载图片
// 2. 查询权限
// 3. 请求权限
//   3-1. 若拒绝， 请求打开设置

// 4. 保存图片