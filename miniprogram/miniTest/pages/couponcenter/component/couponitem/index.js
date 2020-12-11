Component({
  properties: {
    // 券的价格
    price: {
      type: String,
      value: '5',
    },
    // 限制日期
    limitDay: {
      type: String,
      value: '7',
    },
    // 限制金额
    limitPrice: {
      type: String,
      value: '20',
    },
    // 是否领取
    isReceive: {
      type: Boolean,
      value: false,
    },
    // 券的类型
    type: {
      type: String,
      value: '车主专享',
    }

  }
})