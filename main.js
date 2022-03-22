/*
 * @Author: feng 
 * @Date: 2022-03-15 16:19:53 
 * @Last Modified by: feng
 * @Last Modified time: 2022-03-22 15:52:20
 */

let { requestGet } = require('./axios')
let { provinces, cityShip } = require('./provinces')
let { dateOperator, decrypt } = require('./common')
var xlsx = require("node-xlsx")
const fs = require('fs')
let setting = JSON.parse(fs.readFileSync("./setting.json"))

// excel数组
let resultArr = []

// 城市数据
let cityKeys= Object.keys(cityShip)
let cityValues= Object.values(cityShip)



// 为空值赋值0
function getDecryptValue(keys, value) {
  return decrypt(keys, value).split(',').map((d) => {
    if (!d) return '0'
    return d
  })
}

// 填充参数
let params = JSON.stringify({
  name: setting.keyword,
  wordType: 1
})
// 获取源码
async function getList(code, city) {
  let dataUrl = `https://index.baidu.com/api/SearchApi/index?area=${code}&word=[[${encodeURI(params)}]]&startDate=2011-01-01&endDate=2021-01-01`
  let allData = new Promise((resolve, reject) => {
    try {
      requestGet(dataUrl)
        .then((res) => {
          let data = res.data
          let crypto = data.userIndexes[0].all.data
          let uniqid = data.uniqid
          resolve({
            crypto, uniqid
          })
        })
    } catch (error) {
      reject(error)
      console.log(error)
    }
  })
  let uniqid = (await allData).uniqid
  let data = (await allData).crypto
  let uniqidUrl = `http://index.baidu.com/Interface/ptbk?uniqid=${uniqid}`
  // 获取密钥
  requestGet(uniqidUrl).then((res) => {
    let key = res.data
    makeExcel(getDecryptValue(key, data), city)
  })
}

// excel元素,excel初始化
let rowArr = [], init = false
// 初始化excel，仅在第一次制表时执行
function initExcel(info) {
  // 表头日期
  let ROW_TIME = []
  ROW_TIME.push('城市')
  // 起始日期
  let date = "2010-12-27"
  for (let d of info) {
    // 添加表头，以星期为单位
    let newdate = dateOperator(date, 6, "+")
    ROW_TIME.push(date + ' ~ ' + newdate)
    date = dateOperator(newdate, 1, "+")
  }
  rowArr.push(ROW_TIME)
}

// 制表
function makeExcel(info, city) {
  // 表中数据
  let ROW_DATA = []
  // 标注城市名
  ROW_DATA.push(city)
  // 初始化excel表
  if (!init) {
    initExcel(info)
    init = true
  }
  // 在获取到信息后建表
  for (let d of info) {
    // 添加数据
    ROW_DATA.push(parseInt(d))
  }
  // 将一个城市数据推进数组中
  rowArr.push(ROW_DATA)
}

// 导出excel
async function exportExcel() {
  resultArr.push({
    name: '城市数据',
    data: rowArr
  })
  let buffer = xlsx.build(resultArr)
  await fs.writeFileSync(`${setting.fileLocation}/${setting.fileName}.xlsx`, buffer)
}

// 延时请求-子城市
/**
 * 
 * @param {*int} count 当前遍历的页数
 * @param {*int} sum 总遍历的次数
 * @param {*int} time 延时时间
 * @param {*array} keys 需要遍历城市的键值（城市代码）
 * @param {*array} values 需要遍历城市的名称
 * @returns 
 */
// 当前城市位置
let ccount = 0
// 延时器
let time = setting.delayTime

let delayCity = (pcount, sum, keys, values) => {
  return setTimeout(async () => {
    if (ccount >= sum) {
      // 爬取所有的子城市后遍历下一个省份城市
      delayProvinces(++pcount)
      return
    }
    // 将城市数据导入excel数组
    getList(keys[ccount], values[ccount])
    console.log(`正在爬取${provinces[cityKeys[pcount]]}的子城市${values[ccount]},已爬取第${ccount + 1}个城市，还剩下${sum-ccount-1}个城市需要爬取`)
    // 令城市位置自增1
    ++ccount
    // 继续遍历
    delayCity(pcount, sum, keys, values)
  }, time)
}

// 延时请求-省份城市
// 省份城市的数量
let psum = cityKeys.length
/**
 * 
 * @param {*int} pcount 当前遍历位置
 * @returns 
 */
let delayProvinces = (pcount) => {
  return setTimeout(async () => {
    if (pcount >= psum) {
      // 将内容制表
      exportExcel()
      console.log("已完成数据导出")
      // 收集数据后结束遍历
      return
    }
    console.log(`正在爬取${provinces[cityKeys[pcount]]}省份城市,还剩下${psum-pcount-1}个省份城市需要爬取`)
    // 将城市数据导入excel数组
    if (cityValues[pcount].length != 0) {
      // 创建新的子城市列表，方便直接调用上面的函数
      let keys = []
      let values = []
      for (let city of cityValues[pcount]) {
        keys.push(city.value)
        values.push(city.label)
      }
      // 重置城市计数
      ccount = 0
      // 传入当前省份城市位置
      delayCity(pcount, keys.length, keys, values)
    } else {
      // 若子城市列表为空，则该省份城市是特殊城市,直接跳过
      delayProvinces(++pcount, psum)
    }
  }, time)
}


// 爬取所有城市控制器
// 当前遍历位置
let pcount = 0
delayProvinces(pcount)
console.log(`正在对关键词“${setting.keyword}”进行爬取`)