Page({

  data: {
    alphabetArr: 
    [
      'A', 'B', 'C', 
      'D', 'E', 'F', 
      'G', 'H', 'I', 
      'J', 'K', 'L', 
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 
      'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    selectedNum: '',
    popularCities: ['南京', '苏州', '无锡', '南通', '常州', '淮安', '扬州', '布宜诺斯艾利斯'],
    historyCities: ['布宜诺斯艾利斯省', '阿克苏', '科特迪瓦']
  },

  tapPhone(e) {
    let { selectedNum } = this.data
    let res = e.target.dataset.type

    if (res && res !== 'delete') {
      selectedNum += res
      this.setData({
        selectedNum 
      })
    } else if (res && res === 'delete') {
      this.setData({
        selectedNum: selectedNum.slice(0, selectedNum.length - 1)
      })
    }

  }
})