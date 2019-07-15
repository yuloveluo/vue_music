import * as types from './mutation-types'
const matutaions = {
  // 获取当前点击歌手的id
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  // 获取到根据id查询到的歌手的歌单
  [types.GET_SONG](state, songArr) {
    state.songArr = songArr
  },
  // 获取到是否播放
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  // 获取当前是否是全屏
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  // 获取到当前播放的歌单列表
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  // 获取到播放模式
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  // 获取到当前歌曲的索引号
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
}

export default matutaions