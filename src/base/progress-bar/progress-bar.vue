<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div
        class="progress-btn"
        ref="progressBtn"
        @touchstart.prevent='BtnStart'
        @touchmove.prevent='BtnMove'
        @touchend='BtnEnd'
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prance: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
    }
  },

  methods: {
    // 当btn开始被手指头点击时触发的回调函数
    BtnStart(e) {
      // 手指头开始进行移动的判断
      this.touch.startFlg = true
      // 当点击的时候手指头坐在的位子
      this.touch.startX = e.touches[0].pageX
      // 当点击的时候进度条移动的距离
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 当进度条被移动的时候触发回调函数
    BtnMove(e) {
      if (!this.touch.startFlg) {
        return
      }
      // 获取到移动了多少距离
      let detailX = e.touches[0].pageX - this.touch.startX
      // 可以获取到了进度条应该在的位子
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0, this.touch.left + detailX))
      // 设置进度条
      this.setMove(offsetWidth)
    },
    // 当手指头离开时触发的回调函数
    BtnEnd() {
      this.touch.startFlg = false
      // 进度条总共的距离
      const barWidth = this.$refs.progressBar.clientWidth - 16
      // 距离的比例
      const prance = this.$refs.progress.clientWidth / barWidth
      // 将这个比例发送给父组件
      this.$emit('setCurrentTime', prance)
    },
    // 设置进度条和进度条按钮
    setMove(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      // 给进度条的球也设置移动
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    // 监视播放时间的比例
    prance(newTime) {
      if (this.touch.startFlg) {
        return
      }
      // 获取到进度条要移动的距离
      const barWidth = this.$refs.progressBar.clientWidth - 16
      // 进度条的进度就是播放时间比乘以要移动的距离
      const yidongWidth = newTime * barWidth
      this.setMove(yidongWidth)
    }
  },

  created () {
    this.touch = {}
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/stylus/variable.styl'
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
