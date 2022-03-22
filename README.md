# baidu-spider

基于nodejs的百度指数爬虫，爬取**所有城市**的关键词搜索指数，可以更改搜索关键词，爬取数据后导出为xlsx格式文件

目标网站：https://index.baidu.com/v2/main/index.html#/trend/%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80?words=%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80

![https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940631%281%29.jpg](https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940631%281%29.jpg)

## cmd安装工作模块

```
npm install
```

## cmd运行项目
```
node main
```

## 配置

在setting.json进行项目配置

时间范围需要自行查看是否超过百度指数提供的时间范围，**时间范围必须是1年以上！！！**，因为只做了周标注，而百度指数搜索范围小于一年时是呈现日标注。

暂时不支持对目标城市的爬取，默认爬取**所有城市**的数据

```
{
  "keyword": "金融科技", // 搜索关键词
  "delayTime": 2000, // 每次请求间隔时间
  "fileName": "city", // 导出文件名称
  "fileLocation": "./xlsx" // 导出文件位置
  "startDate": "2011-01-01", // 时间范围开始
  "endDate": "2021-01-01" // 时间范围结束
}
```

## 爬取过程

![https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940888%281%29.jpg](https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940888%281%29.jpg)



## 爬取结果

爬取结果以xlsx文件进行绘制，以周标注数据的时间范围

![https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940917%281%29.jpg](https://feng-common.oss-cn-beijing.aliyuncs.com/static/1647940917%281%29.jpg)
