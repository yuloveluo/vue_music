// 导入封装好的公用参数和默认的函数
import { commonParams } from 'api/config.js'
// 导入axios
import axios from 'axios'

// 获取歌曲的歌词
export function getSongLyric(songId) {
  // 请求的地址
  const url = '/api/lyric'
  // 请求的参数
  const data = Object.assign({}, commonParams, {
    songmid: songId,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  // 将axios返回出去
  return axios.get(url, {
    params: data
  })
}