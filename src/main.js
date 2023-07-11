import Vue from 'vue'
import config from './config.js'
import store from './store'
import router from './router'
import { setTheme } from '@/utils'
import SvgIcon from '@/components/svg_icon/index.vue'
import App from '@/app.vue'
import '@/assets/style/global.scss'

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.component('SvgIcon', SvgIcon)

setTheme()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')