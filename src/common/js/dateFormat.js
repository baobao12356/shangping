var dateFormat = {
  formatTimes(code,format) {
    var time = new Date(code)
      , year = time.getFullYear()
      , month = (time.getMonth() + 1) < 10 ?  '0' + (time.getMonth() + 1) : (time.getMonth() + 1)
      , date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      , hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      , min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      // , sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    let oneDay = 60*60*24*1000*1,
        oneYear = oneDay*365*1,
        today = Date.parse(new Date())*1,
        type = today - code,
        yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    if(format == 1){
      if(type<oneDay && yesterday.getDate() < time.getDate()){
        //当天时间   格式：HH:MM
        return   hour + ':' + min;
      }else if(type<=oneYear){
        //当年非当天时间  格式：mm-dd
        return  month + '-' + date;
      }else if(type>oneYear){
        //非当年时间 格式：YY-mm-dd
        return year + '-' + month + '-' + date;
      }
    }else{
      if(type<oneDay && yesterday.getDate() < time.getDate()){
        //当天时间   格式：HH:MM
        return   hour + ':' + min + '';
      }else if(type<oneDay && yesterday.getDate() == time.getDate()){
        //昨天时间
        return  '昨天 ' + hour + ':' + min + '';
      }else if(type>oneDay && type<oneYear){
        //当年时间  格式：X月X日
        return  month + '月' + date + '日';
      }else if(type>oneYear){
        //非当年时间 格式：YY年x月x日
        return year + '年' + month + '月' + date + ' ' + hour + ':' + min ;
      }
    }
  },
  GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+m+"-"+d;
  },
  /*调用：
   var time1 = new Date().Format("yyyy-MM-dd");
   var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
   */
  dateFormatPro () {
    Date.prototype.Format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };
  }
};
export default dateFormat
