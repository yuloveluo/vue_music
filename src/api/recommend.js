// 导入封装好的jsonp
import jsonp from 'assets/js/jsonp'
// 导入axios
import axios from 'axios'
// 导入封装好的公用参数和默认的函数
import { commonParams, options } from 'api/config.js'

// 封装一个获取轮播图的请求
export function getRecommend() {
  // 请求地址
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  // 请求参数
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  // 返回jsonp函数
  return jsonp(url, data, options)
}

// 获取歌单列表
export function getSingList() {
  // 请求地址
  const url = '/api/getDiscList'

  // 请求参数
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  })
}