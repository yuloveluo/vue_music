import * as types from './mutation-types'
const matutaions = {
  // 获取当前点击歌手的id
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  // 获取到根据id查询到的歌手的歌单
  [types.GET_SONG](state, songArr) {
    state.songArr = songArr
  }
}

export default matutaions