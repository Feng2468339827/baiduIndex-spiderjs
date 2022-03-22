// js实现日期的相加减
exports.dateOperator = function dateOperator(date, days, operator) {
  date = date.replace(/-/g, "/"); //更改日期格式
  var nd = new Date(date);
  nd = nd.valueOf();
  if (operator == "+") {
  nd = nd + days * 24 * 60 * 60 * 1000;
  } else if (operator == "-") {
  nd = nd - days * 24 * 60 * 60 * 1000;
  } else {
  return false;
  }
  nd = new Date(nd);
  
  var y = nd.getFullYear();
  var m = nd.getMonth() + 1;
  var d = nd.getDate();
  if (m <= 9) m = "0" + m;
  if (d <= 9) d = "0" + d;
  var cdate = y + "-" + m + "-" + d;
  return cdate;
}

/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2020-05-02）
 * @returns {String}
 */
 exports.getWeek = function getWeek(dateString) {
  var dateArray = dateString.split("-")
  date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
  return date.getDay()
}

/**
 * 
 * @param {string} t 密钥 
 * @param {string} e 源码
 * @returns 
 */
 exports.decrypt = function decrypt(t, e) {
  for(var n=t.split(""),i=e.split(""),a={},r=[],o=0;o<n.length/2;o++)a[n[o]]=n[n.length/2+o]
  for(var s=0;s<e.length;s++) r.push(a[i[s]])
  return r.join("")
}