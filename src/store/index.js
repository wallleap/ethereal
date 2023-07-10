import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import module from './modules/module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    module,
  },
  plugins: [createPersistedState()],
})
