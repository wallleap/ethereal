import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import poetry from './modules/poetry'
import github from './modules/github'
import style from './modules/style'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    poetry,
    github,
    style,
  },
  plugins: [createPersistedState()],
})
