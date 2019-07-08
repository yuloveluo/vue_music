<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 导入头部组件
import MHeader from '_c/m-header/m-header'
// 导入导航栏组件
import Tab from '_c/tab/tab'
export default {
  // 配置子组件
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" scoped>
</style>
