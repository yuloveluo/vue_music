<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script>
// 导入vuex的getters组件的数据
import { mapGetters, mapMutations } from 'vuex'
// 导入请求歌手详情的参数
import { getSinger } from 'api/singer.js'
// 导入请求成功的判断条件
import { ERR_OK } from 'api/config.js'
// 导入工厂模式创建Song实例
import { createSong } from 'assets/js/song.js'
// 导入music-list组件
import musicList from '_c/music-list/music-list'
export default {
  data () {
    return {
      // 放置歌手的每一个歌曲实例
      song: []
    }
  },

  methods: {
    // mapMutations中的方法
    ...mapMutations({
      getSongs: 'GET_SONG'
    }),
    // 请求歌手列表的函数
    async _getSingerInfo() {
      const res = await getSinger(this.singer.id)
      // 请求成功
      if (res.code === ERR_OK) {
        // 初始化歌手详情数据
        this.song = this._InitSingerInfo(res.data.list)
        // 将歌手歌单数据传送到state状态管理中心
        this.getSongs(this.song)
      }
    },
    // 初始化歌手详情,让歌手详情中的每一列都变成Song的实例
    _InitSingerInfo(list) {
      // 先设置一个返回数组
      let ret = []
      // 循环歌手详情数据
      list.forEach(item => {
        // 需要每一项中的额musicData对象数据
        let { musicData } = item
        // 判断是否存在albummid和songid
        if (musicData.albummid && musicData.songid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },

  created () {
    this._getSingerInfo()
    if (!this.singer.id) {
      this.$router.push('/singer')
    }
  },
  computed: {
    // 将getter的数据映射到这里
    ...mapGetters(['singer'])
  },
  components: {
    musicList
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/stylus/variable'

.slide-enter-active,.slide-leave-active
  transition: all 0.3s

.slide-enter,.slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
