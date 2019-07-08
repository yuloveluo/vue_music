<template>
  <div>
    <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <div class="dots">
        <span :class="['dot', currentPage === index ? 'active' : '']" v-for="(item, index) in dotsArr" :key="index"></span>
      </div>
    </div>
  </div>
</template>

<script>
// 导入添加class的模块
import { addClass } from 'assets/js/dom'
// 导入better-scoll模块
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },

  data () {
    return {
      // 设置一个轮播控件的数组
      dotsArr: [],
      // 设置一个标识当前值
      currentPage: 0
    }
  },

  methods: {
    // 设置轮播图的长度
    _setSliderWidth(isResize) {
      // 获取到轮播图每一项的子元素
      this.children = this.$refs.sliderGroup.children
      // 设置轮播图的总宽度
      let width = 0
      // 轮播图每一项的长度
      let sliderWidth = this.$refs.slider.clientWidth
      // 将轮播图的子元素循环出来
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        // 给子元素添加一个class
        addClass(child, 'slider-item')
        // 将每个子元素长度跟父盒子一样长
        child.style.width = sliderWidth + 'px'
        // 计算出轮播图的总宽度
        width += sliderWidth
      }
      // 如果要无缝轮播就要在加两个sliderWidth
      if (this.loop && !isResize) width += 2 * sliderWidth
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        // 横向滚动
        scrollX: true,
        // 不允许纵向滚动
        scrollY: false,
        // 关闭动量动画，提示效能
        momentum: false,
        // 新版snap需要写成一个对象
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      // better-scoll有一个事件，每次轮播图滚动完成一次触发
      this.slider.on('scrollEnd', () => {
        // 通过内置的方法获取到当前的页面数
        let pageIndex = this.slider.getCurrentPage().pageX
        // 将当前的页面数赋值给标识当前页面的值
        this.currentPage = pageIndex

        // 每次轮播完成时清除上一个延时器，然后在调用
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })

      // 当轮播图滚动前的事件
      this.slider.on('beforeScrollStart', () => {
        // 开始滚动之前就先把定时器清除
        clearTimeout(this.timer)
      })
    },
    _initDots() {
      this.dotsArr = new Array(this.children.length)
    },
    // 设置自动轮播
    _play() {
      // 新版本不需要设置页码数
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },

  mounted () {
    // 页面刷新大概17ms
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      // 如果是自动轮播的话
      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 注册一个屏幕改变触发的事件
    window.addEventListener('resize', () => {
      // 如果没有改变屏幕
      if (!this.slider) return
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed() {
    // 在组件销毁的时候及时释放定时器
    clearTimeout(this.timer)
  }
}

</script>

<style lang='stylus' scoped>
// 导入一些定义好的颜色
@import '~assets/stylus/variable'
.slider
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background $color-text-l
      &.active
        width 20px
        border-radius 5px
        background $color-text-ll
</style>
