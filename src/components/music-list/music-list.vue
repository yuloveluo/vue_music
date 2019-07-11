<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="singer.name"></h1>
    <div class="bg-image" :style='bgStyle' ref="bgImg">
      <div class="play-wrapper" ref='playWrapper' v-show="songArr.length">
        <div class="play">
          <i class="icon-play">随机播放全部</i>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
    class="list"
    ref="list"
    :probeType='probeType'
    :listenScroll='listenScroll'
    @scroll='scroll'
    >
      <div class="song-list-wrapper">
        <song-list :songArr='songArr'></song-list>
      </div>
      <div class="loading-container" v-show="!songArr.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
// 导入getters里面的数据
import { mapGetters } from 'vuex'
// 导入song-list组件
import songList from 'base/song-list/song-list'
// 导入better-scroll初始化组件
import scroll from 'base/scoll/scoll'
// 导入loading组件
import loading from 'base/loading/loading'
export default {

  data () {
    return {
      // 让better-scroll初始化组件进行实时发送滚动事件
      probeType: 3,
      // 开启监听滚动事件
      listenScroll: true,
      // bg-layerdiv的滚动距离
      scrollY: 0
    }
  },

  methods: {
    // 歌单类别的滚动事件的回调函数
    scroll(pos) {
      // 将bg-layer的div滚动距离赋值为歌单的滚动距离
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    }
  },
  computed: {
    // 将getters的数据映射到这里
    ...mapGetters([
      'singer',
      'songArr'
    ]),
    bgStyle() {
      return `background-image:url(${this.singer.avater})`
    }
  },
  components: {
    scroll,
    songList,
    loading
  },
  created() {
  },
  mounted() {
    // 将图片的高度放到一个变量里
    this.imgHeight = this.$refs.bgImg.clientHeight
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  watch: {
    // 监听scrollY
    scrollY(newY) {
      // 层级zIndex
      let zIndex = 0
      // 当下拉时图片放大
      let scal = 1
      const minTranY = -this.imgHeight + 40
      // 设置bg-layer的滚动范围
      let transformY = Math.max(minTranY, newY)
      this.$refs.bgLayer.style.transform = `translate3d(0,${transformY}px,0)`
      this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0,${transformY}px,0)`
      // 如果newY滑动到小于minTranY，那么我们就覆盖文字.图片高度也设置小点
      if (newY < minTranY) {
        // 让图片的层级变大
        zIndex = 10
        // 图片的高度固定
        this.$refs.bgImg.style.height = 40 + 'px'
        // 因为使用padding来自适应高度的，所以这里要设为0
        this.$refs.bgImg.style.paddingTop = 0
        // 随机播放按钮消失
        this.$refs.playWrapper.style.display = 'none'
      } else {
        // 当newY更大的时候就让它保持不变
        this.$refs.bgImg.style.height =0
        this.$refs.bgImg.style.paddingTop = '70%'
        // 随机播放按钮显示
        this.$refs.playWrapper.style.display = ''
      }
      // 放大多少是去newY和图片本身大小的比例
      let prant = Math.abs(newY / this.imgHeight)
      // 下拉时newY是大于0的
      if (newY > 0) {
        scal = 1 + prant
        zIndex = 10
      }

      // 设置图片放大
      this.$refs.bgImg.style.transform =  `scale(${scal})`
      // 这里可以根据条件设置层级
      this.$refs.bgImg.style.zIndex = zIndex
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/stylus/variable.styl'
@import '~assets/stylus/mixin.styl'

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
