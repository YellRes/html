Page({
  data: {
    selectData: ['不限', '上午(00:00-12:00)', '下午(12:00-18:00)', '晚上(18:00-24:00)'],
    selectIndex: 0
  },

  selectDate(e) {
    const {index} = e.target.dataset;
    this.setData({selectIndex: index});
  }
})