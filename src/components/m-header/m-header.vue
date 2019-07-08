<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default {

  data () {
    return {
    }
  },

  methods: {},

  created () {
  }
}
</script>

<style lang='stylus' scoped>
// 导入一些定义好的颜色
@import '~assets/stylus/variable'
// 导入一些封装好的样式函数
@import '~assets/stylus/mixin'

.m-header
  position relative
  height 44px
  text-align center
  color: $color-theme
  font-size 0
  .icon
    display: inline-block
    vertical-align top
    margin-top 6px
    width 30px
    height 32px
    margin-right 9px
    bg-image('logo')
    background-size 30px 32px
  .text
    display inline-block
    vertical-align top
    line-height 44px
    font-size $font-size-large
</style>
