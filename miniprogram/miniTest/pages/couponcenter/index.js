Page({
  data: {
    isLogin: false
  },


  onShareAppMessage: function () {
    // return custom share data when user share.
    return {
      title: '转发标题',
    }
  },
})