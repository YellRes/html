Page({
  data: {
    isOrderTypeIn3Month: true
  },

  tapNav(e) {
    let result = e.target.dataset.index || ''
    this.setData({
      isOrderTypeIn3Month: result === 'threeMonth' 
    })
  }
})