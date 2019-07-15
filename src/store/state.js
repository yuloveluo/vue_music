// 导入播放模式
import { modeList } from 'assets/js/config.js'

const state = {
  // 当前歌手的id
  singer: {},
  // 获取到当前歌手的歌单列表
  songArr: [],

  // 定义一些播放器所用的最底层的数据
  // 定义播放器的开关
  playing: false,
  // 定义播放器是否全屏
  fullScreen: false,
  // 定义顺序播放
  playList: [],
  // 定义除了顺序播放的其他模式
  sequenceList: [],
  // 定义播放模式
  mode: modeList.sequence,
  // 当前播放歌曲的索引号
  currentIndex: -1
}

export default state
