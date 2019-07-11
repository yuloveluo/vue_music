import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
// 相当于将该组件导出来的变量或方法都放置到了getters里，可以使用
// getters.的方法来调用属性和方法
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// vuex的调试器
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
