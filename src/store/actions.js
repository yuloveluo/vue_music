// 导入mutation-types组件
import * as types from './mutation-types'
// 要用到打乱歌单的函数
import { shuffle } from 'assets/js/until.js'
// mode播放模式的判断条件
import { modeList } from 'assets/js/config.js'
// 封装一个找索引号的函数
function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}

export const setPlayInfo = ({ commit, state }, { list, index }) => {
  // 如果点击歌曲的时候模式是随机播放模式
  if (state.mode === modeList.random) {
    // playList需要进行打乱
    let randomList = shuffle(list)
    // 设置state中的playList的值
    commit(types.SET_PLAYLIST, randomList)
    // 找到当前点击的歌曲对应在打乱了排序的歌单里面的索引号
    let randomIndex = findIndex(randomList, list[index])
    // 设置state中的currentIndex
    commit(types.SET_CURRENT_INDEX, randomIndex)
  } else {
    // 设置state中的playList的值
    commit(types.SET_PLAYLIST, list)
    // 设置state中的currentIndex
    commit(types.SET_CURRENT_INDEX, index)
  }
  // 设置state中的sequenceList的值
  commit(types.SET_SEQUENCE_LIST, list)
  // 设置state中的playing的值
  commit(types.SET_PLAYING_STATE, true)
  // 设置state中的fullScreen
  commit(types.SET_FULL_SCREEN, true)
}

// 随机播放按钮触发的actions方法
export const randomPlayInfo = ({ commit }, { list }) => {
  // 设置state中的sequenceList的值
  commit(types.SET_SEQUENCE_LIST, list)
  console.log(list)
  // playList需要进行打乱
  let randomList = shuffle(list)
  // 设置state中的playList的值
  commit(types.SET_PLAYLIST, randomList)
  // 设置state中的currentIndex
  commit(types.SET_CURRENT_INDEX, 0)
  // 设置state中的playing的值
  commit(types.SET_PLAYING_STATE, true)
  // 设置state中的fullScreen
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_MODE, modeList.random)
}