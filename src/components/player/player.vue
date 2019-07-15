<template>
  <div class="player" v-show="playList.length">
    <transition
    name="normal"
    @enter='enter'
    @after-enter='afterEnter'
    @leave='leave'
    @after-leave='afterLeave'
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="backSmall">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
        class="middle"
        @touchstart.prevent='middleStart'
        @touchmove.prevent='middleMove'
        @touchend='middleEnd'
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="addCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                class="text"
                ref="currentLyric"
                v-for="(item, index) in currentLyric.lines" :key="item.time"
                :class="{'current': currrentLyricIndex === index}"
                >
                {{item.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="['dot', currentDotFlg==='cd'? 'active':'']" ></span>
            <span :class="['dot', currentDotFlg==='lyric'? 'active':'']"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | format}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :prance='prance' @setCurrentTime='setCurrentTime'></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration | format}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="setPlay" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"  v-show="!fullScreen" @click="bigFullScreen">
        <div class="icon">
          <img :class="addCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="setPlay">
          <progress-circle :radius='radius' :prance='prance'>
            <i :class="minIcon" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
    ref="audio"
    :src="currentSong.url"
    @canplay='ready'
    @timeupdate='timeupdate'
    @ended="endSong"
    ></audio>
  </div>
</template>

<script>
// 导入getter
import { mapGetters, mapMutations} from 'vuex'
// 导入vue动画的模块
import animations from 'create-keyframe-animation'
// 导入进度条的组件
import progressBar from 'base/progress-bar/progress-bar'
// 导入小屏幕进度条的组件
import progressCircle from 'base/progress-circle/progress-circle'
// 导入mode的判断条件
import { modeList } from 'assets/js/config.js'
// 导入随机播放列表的函数
import { shuffle } from 'assets/js/until.js'
// 导入lyric-parser
import Lyric from 'lyric-parser'
// 导入better-scroll的初始化组件
import scroll from 'base/scoll/scoll'
export default {

  data () {
    return {
      songFlg: false,
      // 播放器的实时播放时间
      currentTime: 0,
      // 要传入到progress-circle的值
      radius: 32,
      // 歌曲歌词的对象
       currentLyric: null,
       // 当前歌词索引号
       currrentLyricIndex: 0,
       // 当前dot的索引
       currentDotFlg: 'cd',
       // 在歌曲页面，获取到当前播放的歌词
       playingLyric: ''
    }
  },

  methods: {
    // 动画过渡时进入
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()// 获取变化数值

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,// 动画时长
          easing: 'linear'// 动画曲线
        }
      })
      // 绑定动画元素，done--到下一步afterEnter
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    // 该动画后部分（注释）功能会影响singer-detail的回退
    // 使用enter和afterEnter的方法则可行
    leave(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(0,0,0) scale(1)`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        }
      }

      animations.registerAnimation({
        name: 'out',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'out', done)
      // this.$refs.cdWrapper.style.transition = 'all 0.4s'
      // const {x, y, scale} = this._getPosAndScale()
      // this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      // this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      animations.unregisterAnimation('out')
      this.$refs.cdWrapper.style.animation = ''
      // this.$refs.cdWrapper.style.transition = ''
      // this.$refs.cdWrapper.style[transform] = ''
    },
    // 当歌曲播放完了就会触发这个回调
    endSong() {
      // 如果播放模式mode是单曲循环
      if (this.mode === modeList.loop) {
        // 调用单曲循环
        this.loop()
      }else {
        // 直接调用next
        this.next()
      }
    },
    // 单曲循环
    loop() {
      // 将歌曲播放时间变为0
        this.$refs.audio.currentTime = 0
        // 播放歌曲
        this.$refs.audio.play()
        // 当时歌曲循环的时候，让歌词也跟着一起循环
        if (this.currentLyric) {
          // 将歌词跳转到开始
          this.currentLyric.seek(0)
        }
    },
    // 下一曲
    next () {
      if (!this.songFlg) {
        return
      }
      // 点击了这个就让currentIndex加一来进行下一曲
      let index = this.currentIndex + 1
      // 如果index大于歌曲列表的长度的时候让它变成0进行一个循环播放
      if (index >= this.playList.length) {
        index = 0
      }
      // 调用mutations来改变当前歌曲
      this.setCurrentIndex(index)
      // 如果在切换歌曲时是暂停的时候，那就让它为开启
      if (!this.playing) {
        this.setPlay()
      }
      this.songFlg = false
    },
    // 上一曲
    prev() {
      if (!this.songFlg) {
        return
      }
      let index = this.currentIndex - 1
      if (index <= -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      // 如果在切换歌曲时是暂停的时候，那就让它为开启
      if (!this.playing) {
        this.setPlay()
      }
      this.songFlg = false
    },
    // 当音频开始播放时触发的回调函数
    ready() {
      this.songFlg = true
    },
    // 当音频播放时间发生改变时触发
    timeupdate(e) {
      // 把播放的时间赋值出去
      this.currentTime = e.target.currentTime
    },
    // 接收子组件传过来的参数
    setCurrentTime(prance) {
      let timer = this.currentSong.duration * prance
      // 将当前播放的时间改变
      this.$refs.audio.currentTime = timer
      // 当拉动了进度条，歌词也随之改变
      if (this.currentLyric) {
        this.currentLyric.seek(timer * 1000)
      }
      // 当暂停的时候拉动进度条，松开让它播放
      if (!this.playing) {
        this.setPlay()
      }
    },
    middleStart(e) {
      this.touch.startFlg = true
      // 获取到当前手指头开始的x轴和y轴的位子
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleMove(e) {
      // 如果不是通过手指头点击移动的都return
      if (!this.touch.startFlg) return
      // 计算出实时移动x和y轴的距离
      let detailX =e.touches[0].pageX - this.touch.startX
      let detailY = e.touches[0].pageY - this.touch.startY
      // 如果y轴的差值大于x轴的插值就return，因为我们是x轴的位移
      if (Math.abs(detailX) < Math.abs(detailY)) return
      // 根据在哪个页面设置要滑动的距离
      let left = this.currentDotFlg === 'cd' ? 0 : -window.innerWidth
      // 实时获取到滑动的距离,这个距离在0~-window.innerWidth之间
      let width = Math.min(0, Math.max(-window.innerWidth, left + detailX))
      // 计算出移动的距离和屏幕宽度的比例
      this.touch.perance = Math.abs(width / window.innerWidth)
      console.log(this.touch.perance)
      // 设置歌词页面的位移
       this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`
       this.$refs.lyricList.$el.style.transitionDuration = 0
       // 在移动的同时，歌曲播放页面也设置透明
       this.$refs.middleL.style.opacity = 1 - this.touch.perance
       this.$refs.middleL.style.transitionDuration = 0
    },
    middleEnd() {
      // 设置一个歌词页面的偏移
      let offsetWidth
      // 如果是在cd的页面中的话
      if (this.currentDotFlg === 'cd') {
        // 当移动的距离占据了屏幕宽度的10%，就全部移动到屏幕正中间
        if (this.touch.perance >= 0.1) {
          offsetWidth = -window.innerWidth
          this.currentDotFlg = 'lyric'
          // 将透明度变为1
          this.$refs.middleL.style.opacity = 0
        } else {
          offsetWidth = 0
        }
      } else if (this.currentDotFlg === 'lyric') {
        // 如果移动的距离占据的比例小于90%，就让它回到之前的位子
        if (this.touch.perance <= 0.9) {
          offsetWidth = 0
          this.currentDotFlg = 'cd'
          this.$refs.middleL.style.opacity = 1
        } else {
          offsetWidth = -window.innerWidth
        }
      }
      // 将这个偏移真正给到歌词列表
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      // 移动的时候给它有个过度
      this.$refs.lyricList.$el.style.transitionDuration = `300ms`
      this.$refs.middleL.style.transitionDuration = `300ms`
    },
    // 跳转到小屏幕播放器
    backSmall() {
      this.setFullScreen(false)
    },
    // 切换到大屏幕播放器
    bigFullScreen() {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPalayList: 'SET_PLAYLIST'
    }),
    setPlay() {
      if (!this.songFlg) {
        return
      }
      this.setPlayState(!this.playing)
      // 当歌曲暂停，歌词也跟着暂停
      if (this.currentLyric) {
        // 使用togglePlay来进行切换歌词的暂停和开始
        this.currentLyric.togglePlay()
      }
      
    },
    // 改变mode的值
    changeMode() {
      // 每次点击就将mode增加1并且取余3让它进行一直在0-2之间
      const mode = (this.mode + 1) % 3
      // 使用mutation的方法改变播放模式的值
      this.setPlayMode(mode)
      // 当改变了播放模式，就改变歌曲列表
      if (this.mode === modeList.random) {
        // 打乱播放歌曲的列表
        const list = shuffle(this.sequenceList)
        // 我们不想在改变模式的时候改变当前歌曲，所以要获取到改变后的歌曲列表的当前歌曲的索引号
        const currentIndex = this._changeListIndex(list)
        // 将打乱的歌曲列表通过mutations来改变歌曲列表
        this.setPalayList(list)
        // 调用改变当前歌曲，让歌曲还是当前的歌曲
        this.setCurrentIndex(currentIndex)
      }
    },
    // 封装一个请求歌曲歌词的函数
    async _gitLyric() {
      // 获取到歌词
      let songLyric = await this.currentSong._getSongLyric()
      // 利用lyric-parser将歌词封装为一个对象,当播放歌词的时候就会有一个回调函数
      this.currentLyric = new Lyric(songLyric, this.handleLyric)
      // 如果在播放的时候，就使用Lyric实例的play()方法开始播放歌词
      if (this.playing) {
        this.currentLyric.play()
      }
      console.log(this.currentLyric)
    },
    // 当歌词播放的时候，触发的回调函数
    // 这个函数有两个参数，1. 当前播放歌词的索引号 2. 当前播放歌词的内容
    handleLyric({lineNum, txt}) {
      // 保存实时变化的歌词索引号
      this.currrentLyricIndex = lineNum
      // 如果linNum大于5时
      if (lineNum > 5) {
        // 获取到当前linNum - 5的歌词元素
        const elM = this.$refs.currentLyric[lineNum - 5]
        // 滚动到该元素，让歌词一直在屏幕中间
        this.$refs.lyricList.scrollToElement(elM, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      // 获取到当前播放的歌词
      this.playingLyric = txt
    },
    // 当改变了歌曲列表，找到当前歌曲在歌曲列表的索引号
    _changeListIndex(list) {
      return list.findIndex(item => item.id === this.currentSong.id)
    },
    // 从小屏幕的图片移动到大图片
    _getPosAndScale() {
      // 小屏幕中的图片距离左侧屏幕的距离
      const targetWidth = 40
      // 大屏幕距离左侧屏幕的距离
      const bigLeftWidth = - (window.innerWidth / 2)
      // 小屏幕要移动到大屏幕的距离
      const x = bigLeftWidth + targetWidth
      // 获取到小屏幕距离屏幕底部的距离
      const targetHeight = 30
      // 获取到大屏幕图片的宽度
      const bigWidth = window.innerWidth * 0.8
      // 获取到大屏幕图片距离屏幕顶部的距离
      const bigTop = 80
      // 获取到大屏幕距离顶部
      const y = window.innerHeight - bigTop -(bigWidth / 2)
      // 计算出来scale
      const scale = targetWidth / bigWidth
      // 将这几个值返回
      return {
        x,
        y,
        scale
      }
    }
  },
  filters: {
    format(timer) {
      timer = timer | 0
      const minute = ((timer / 60 | 0) + '').padStart(2, '0')
      const second = (timer % 60 + '').padStart(2, '0')
      return `${minute}:${second}`
    } 
  },
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    // 根据playing来判断是暂停的图标还是开始的图标
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 小屏幕的开始和暂停的图标
    minIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 根据this.playing来旋转图片
    addCls() {
      return this.playing ? 'play' : 'play pause'
    },
    // 设置切换歌曲的时候，songFlg是false就添加移额disable
    disableCls() {
      return this.songFlg ? '' : 'disable'
    },
    // 计算出歌曲的总时长和当前播放时长的比例
    prance() {
      return this.currentTime / this.currentSong.duration
    },
    // 根据mode改变播放模式的icon图标
    iconMode() {
      return this.mode === modeList.sequence ? 'icon-sequence' : this.mode === modeList.loop ? 'icon-loop' : 'icon-random'
    }
  },
  watch: {
    // 监视当前歌曲的变化
    currentSong(newSong, oldSong) {
      // 如果变化前的歌曲和变化后的歌曲是一样的，就不要执行这个播放
      // 防止发生歌曲播放模式时，歌曲时暂停。切换了就自动播放
      if (newSong.id === oldSong.id) {
        return
      }
      // 因为每次切换歌曲的时候就会添加一个lyric实例对象
      // 如果有
      if (this.currentLyric) {
        // 歌词停止播放
        this.currentLyric.stop()
        // 重置歌曲播放时间
        this.currentTime = 0
        // 重置歌曲的索引号
        this.currrentLyricIndex = 0
        this.playingLyric = ''
      }
      // 当前歌曲发生改变，利用nextTick进行延迟，当数据发生改变后在触发这个方法的回调
      this.$nextTick(() => {
        // 歌曲播放
        this.$refs.audio.play()
        // 调用getlyric
        this._gitLyric()
      })
    },
    // 监视playing的变化，判断是否开启播放
    playing(newPlay) {
      // 因为也是数据发送改变后触发的所以也要使用nextTick
      this.$nextTick(() => {
        newPlay ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  },
  components: {
    progressBar,
    progressCircle,
    scroll
  },
  created () {
    // 储存touch事件的信息
    this.touch = {}
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/stylus/variable'
@import '~assets/stylus/mixin'

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
