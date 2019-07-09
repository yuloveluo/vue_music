// 导入封装好的jsonp
import jsonp from 'assets/js/jsonp'
// 导入封装好的公用参数和默认的函数
import { commonParams, options } from 'api/config.js'

// 请求歌手列表
export function getSingerList() {
  // 请求的地址
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  // 请求参数, 第三个参数会覆盖前面的对象，如果有属性时重复的
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 200,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  // 返回一个jsonp的请求
  return jsonp(url, data, options)
}