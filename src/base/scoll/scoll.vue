<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
// 导入better-scroll
import BScroll from 'better-scroll'
export default {
  // 设置一些better-scroll的命令
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true
    },
    // 列表的数据
    data: {
      type: Array,
      default: null
    },
    // 判断是否开启监听歌单列表的滚动
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },

  methods: {
    // 初始化better-scroll
    _initScroll() {
      // 判断最外层的wrapper是否渲染完成,没有就返回
      if (!this.$refs.wrapper) return
      // 创造一个better-scroll的实例
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      // 如果父组件传过来的listenScroll时true
      if (this.listenScroll) {
        // 给组件绑定一个滚动时触发的事件
        this.scroll.on('scroll', (pos) => {
          // 传参给父组件,将滚动的信息传过去
          this.$emit('scroll', pos)
        })
      }
    },
    // 封装一些better-scroll的方法
    // 启动better-scroll
    enable() {
      // 如果实例存在就执行这个方法
      this.scroll && this.scroll.enable()
    },
    // 禁用better-scroll
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到指定的位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到指定的目标元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        // 每次下来了菜单就重新计算better-scroll
        this.refresh()
      }, 20)
    }
  },

  mounted () {
    // 保证dom的渲染
    setTimeout(() => {
      this._initScroll()
    }, 20)
  }
}
</script>
