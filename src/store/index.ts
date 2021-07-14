import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 容器的状态只能实现共享，组件访问方便，但是没有持久化功能
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前登录用户状态
  },
  mutations: {
    // 修改容器数据必须使用
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 为了防止页面刷新数据丢失，需要数据持久化
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {},
  modules: {}
})
