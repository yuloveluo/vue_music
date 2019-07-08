<template>
  <div class="tab">
    <router-link tag="div" to="/recommend" class="tab_item">
      <span class="tab_link">推荐</span>
    </router-link>
    <router-link tag="div" to="/singer" class="tab_item">
      <span class="tab_link">歌手</span>
    </router-link>
    <router-link tag="div" to="/rank" class="tab_item">
      <span class="tab_link">排行</span>
    </router-link>
    <router-link tag="div" to="/search" class="tab_item">
      <span class="tab_link">搜索</span>
    </router-link>
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
// 导入字体和颜色的样式表
@import '~assets/stylus/variable'
.tab
  display flex
  height 44px
  line-height 44px
  font-size $font-size-medium
  .tab_item
    flex 1
    text-align center
    .tab_link
      padding-bottom 5px
      color $color-text-l
    &.router-link-active
      .tab_link
        color $color-theme
        border-bottom 2px solid $color-theme
</style>
