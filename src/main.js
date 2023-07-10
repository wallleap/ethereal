import Vue from 'vue'
import config from './config.js'
import store from './store'
import router from './router'
import SvgIcon from '@/components/svg_icon/index.vue'
import App from '@/app.vue'
import '@/assets/style/global.css'

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.component('SvgIcon', SvgIcon)

// document.title = `${config.title} | ${config.subtitle}`

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
