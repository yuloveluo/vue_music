<template>
  <scroll
  class="listview"
  ref='listView'
  :listenScroll='true'
  @scroll='scroll'
  :probeType='probeType'
  >
    <ul>
      <li
      class="list-group"
      v-for="group in data"
      :key="group.id"
      ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
          class="list-group-item"
          v-for="(item, index) in group.items"
          :key="index"
          @click="select(item)"
          >
            <img v-lazy="item.avater" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart='onShortcut' @touchmove.stop.prevent='onShortMove'>
      <ul>
        <li
        v-for="(item, index) in getListZiMu"
        :key="index"
        :class="['item', currentIndex === index ? 'current' : '']"
        :data-index='index'>{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fix_title" ref="fixed">
      <h2 class="fixed-title">{{fix_title}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
// 导入better-scroll的初始化组件
import scroll from 'base/scoll/scoll'
// 导入获取dom属性的函数
import { getAttr } from 'assets/js/dom'
// 导入loading组件
import loading from 'base/loading/loading'

// 定义一个字母的高度
const Z_HIGHT = 18

// title的高度
const Z_TITLE = 30
export default {
  props: {
    // 接受父组件传过来的歌手列表数据
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      // 定义一个对象，存储touch事件的一些信息
      touch: {},
      // 定义一个保存歌单滑动的距离
      scrollY: -1,
      // 保存每一个分类的高度
      listHeight: [],
      // 设置scroll组件的probeType
      probeType: 3,
      // 保存歌手列表滑动时，字母对应的当前索引号
      currentIndex: 0,
      // 差值
      diff: 0
    }
  },
  components: {
    scroll,
    loading
  },

  methods: {
    // 发送给父组件，告诉它我被点击了，并将当前歌手的信息传输过去
    select(item) {
      this.$emit('selectInfo', item)
    },
    // 手指头点击触发的事件
    onShortcut(e) {
      // 获取到字母列表响应的索引号
      let startIndex = getAttr(e.target, 'index')

      // 当手指头点击的时候获取到当时的索引号
      this.touch.startIndex = startIndex
      // 获取到点击时的手指头的位子
      this.touch.startPageY = e.touches[0].pageY
      this._scrollTo(startIndex)
    },
    // 手指头移动时触发的事件
    onShortMove(e) {
      // 获取到移动的手指头的位子
      this.touch.movePageY = e.touches[0].pageY
      // 算出移动了多少距离,后面的|0相当于向下取整
      let PageYdetail = (this.touch.movePageY - this.touch.startPageY) / Z_HIGHT | 0
      // 然后就可以计算出到底滑动了多少个字母
      let moveIndex = this.touch.startIndex - 0 + PageYdetail
      this._scrollTo(moveIndex)
    },
    // 子组件触发的函数
    scroll(pos) {
      // console.log(pos)
      this.scrollY = pos.y
    },
    // 封装一个滚动的效果
    _scrollTo(index) {
      // 因为在字母的分类栏上下都有两个空白处
      // 所以要进行一个处理
      // 当点击的时候，点到空白处是返回一个null，所以就返回
      if (!index && index !== 0) return
      // 当为滑动的时候进行处理
      if (index < 0 || index > this.listHeight.length - 2) return
      // 将当前index中的listHeigt高度赋值给
      // 根据这个索引号来跳转到歌手列表的位子this.scrollY,触发watch监听
      this.scrollY = -this.listHeight[index]
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index])
    },
    // 封装一个计算高度的函数
    _setListHeight() {
      this.listHeight = []
      // 获取到所有listGroup组成的数组
      const list = this.$refs.listGroup
      // 设置一个最开始的height
      let height = 0
      // 将最初的height添加到listHeight
      this.listHeight.push(height)
      // console.log(this.listHeight)
      // 遍历list数组
      list.forEach((item, index) => {
        // 获取到每一项的高度,height每次叠加一次
        height += item.clientHeight
        // height没加一次就添加到listHeight
        this.listHeight.push(height)
      })
    }
  },
  watch: {
    // 监听歌手列表的数据
    data() {
      // 设置一个延时器，保证dom与数据渲染有效果
      setTimeout(() => {
        this._setListHeight()
      }, 20)
    },
    // 监听scrollY的变化
    scrollY(newY) {
      // 设置一个保存了listHeight的常量
      const list = this.listHeight
      // 循环遍历list
      for (let i = 0; i < list.length - 1; i++) {
        // 获取到当前的高度
        let height1 = list[i]
        // 获取到下一个的高度
        let height2 = list[i + 1]
        // 保存移动中还距离下一个的插值
        this.diff = height2 + newY
        // 如果newY大于0，证明是在往下拉。所以currentIndex = 0
        if (newY > 0) return this.currentIndex = 0

        // 在中间滑动,加一个等号让上面点击的时候可以高亮
        if ((-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          return
        }
        // 如果滑动到了最底部,因为list的长度比getListZiMu的长度多出来一个
        this.currentIndex = list.length - 2
      }
    },
    diff(newY) {
      // 设置一个值，是分类标题唯一的距离
      let flexTop = (newY > 0 && newY < Z_TITLE) ? newY - Z_TITLE : 0
      // 设置一个值与flexTop进行比对，如果这个值一直与flexTop一致就表明为0了
      if (this.flexTop === flexTop) return
      // 将这个值赋值为flexTop
      this.flexTop = flexTop
      // 获取到字母标题，让它位移
      this.$refs.fixed.style.transform = `translate3d(0,${flexTop}px,0)`
    }
  },

  created () {
  },
  computed: {
    // 获取到旁边字母栏的数组
    getListZiMu() {
      // 使用map数组循环data
      return this.data.map((item) => {
        // 获取到data中的title,因为热门是两个所以要截取下
        return item.title.substr(0, 1)
      })
    },
    // 获取到当前的data中的title
    fix_title() {
      if (this.scrollY > 0) {
        return ''
      }
      // 使用三元表达式，防止data还没有请求过来
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~assets/stylus/variable'
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
