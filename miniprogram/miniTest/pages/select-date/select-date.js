import util from "../../utils/util.js";
Page({
    data: {
      days: [],
      row_num: 5,
      firstday: 0,
      monthDayNum: 30,
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      selectMonthIndex: 0,
      selectDay: 0,
      dates: [{
        date: '2020-12',
        showDate: '2020年12月'
      },
      {
        date: '2021-01',
        showDate: '2021年01月'
      }]
    },
    onLoad() {
      this.getCalendar('2020-12');
    },
  
    leapYear(year) {
      return year % 100 == 0 ? year % 400 == 0 ? 1 : 0 : year % 4 == 0 ? 1 : 0;
    },

    parseDate(day) {
      const { dates, selectMonthIndex } = this.data;
      const year_month = dates[selectMonthIndex].date;
      const compareDay = `${year_month}-${day > 9 ? day : `0${day}`}`
      const oneDayTimestamp = 1000 * 3600 * 24;
      const today = util.formatDate(new Date(), "yyyy-MM-dd");
      const tomorrow = util.formatDate(new Date(Date.now() + oneDayTimestamp), "yyyy-MM-dd");
      const acquired = util.formatDate(new Date(Date.now() + oneDayTimestamp * 2), "yyyy-MM-dd");
      const newsYear = '2021-01-01'; // 元旦

      const parseObject = {
        [today]: '今天',
        [tomorrow]: '明天',
        [acquired]: '后天',
        [newsYear]: '元旦'
      }

      return parseObject[compareDay] ? parseObject[compareDay] : day;
    },
  
    getCalendar(data) {
      const days = [];
      const date = new Date(data);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const monthDayOne = new Date(year, month, 1);
      const firstday = monthDayOne.getDay();
      const monthDays = new Array(31, 28 + this.leapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
      const monthDayNum = monthDays[month];
      const row_num = Math.ceil((monthDayNum + firstday) / 7);
      
      for (let i=0; i<row_num;i++) {
        for (let w=0; w<7; w++) {
          days.push(this.parseDate(i*7 + w - firstday + 1));
        }
      }
      this.setData({row_num, firstday, monthDayNum, days});
    },
  
    selectMonth(e) {
      const {index} = e.currentTarget.dataset;
      this.setData({selectMonthIndex: index});
      this.getCalendar(this.data.dates[index].date);
    },
  
    selectDate(e) {
      const {day} = e.currentTarget.dataset;
      const { selectMonthIndex, dates } = this.data;
      const year_month = dates[selectMonthIndex].date;
      this.setData({selectDay: day});
      console.log(`${year_month}-${day}`)
    }
  })