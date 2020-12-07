Page({
  data: {
    alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    cityArr: ['昆山南站', '苏州北站', '苏州站', '苏州南站', '苏州北站', '苏州北站', '苏州北站', '苏州北站' ]
  },
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