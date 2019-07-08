// 让低版本浏览器完全支持es6语法
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
// 导入图片懒加载的第三方包
import vueLazy from 'vue-lazyload'
// 导入重置默认样式还有icon图标
import 'assets/stylus/index.styl'
// 解决移动端点击延迟300ms
import fastclick from 'fastclick'
// 配置懒加载
Vue.use(vueLazy, {
  // 懒加载的时候显示的照片
  loading: require('assets/image/default.png')
})

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
