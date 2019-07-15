// 导入获取歌手歌词的请求
import { getSongLyric } from 'api/song.js'
// 导入解析base64格式的第三包
import { Base64 } from 'js-base64'

export default class Song {
  // 构造器
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  async _getSongLyric() {
    const { data: res } = await getSongLyric(this.mid)
    res.lyric = Base64.decode(res.lyric)
    return res.lyric
  }
}

// 因为这个要在多处去new，为了不要写那么多次代码
// 在这里就进行工程模式的创建实例对象,然后使用这个工厂模式就行了
export function createSong(musicData, url) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: url
  })
}

// 需要musicData.singer的是一个字符串而不是一个对象，所以要进行一个处理
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}