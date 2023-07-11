import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import style from './modules/style'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    style,
  },
  plugins: [createPersistedState()],
})
