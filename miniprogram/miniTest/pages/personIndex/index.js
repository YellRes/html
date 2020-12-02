Page({
  onLoad() {
    wx.login({
      complete: (res) => {
        console.log(res, 'login completelogin completelogin complete');
      }
    })
  },
  getAuthorize() {
    wx.login({
      complete: (res) => {
        console.log(res, 'login completelogin completelogin complete');
      }
    })
  }
})