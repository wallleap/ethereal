import Vue from 'vue'
import AV from 'leancloud-storage'
import config from './config.js'
import store from './store'
import router from './router'
import { handleError, setTheme } from '@/utils'
import SvgIcon from '@/components/svg_icon/index.vue'
import Message from '@/components/message/index.js'
import loadingDirective from '@/components/loading/directive.js'
import App from '@/app.vue'
import '@/assets/style/global.scss'

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$message = Message
Vue.component('SvgIcon', SvgIcon)
Vue.directive('loading', loadingDirective)

const isProduction = process.env.NODE_ENV === 'production'

AV.init({
  appId: isProduction ? process.env.VITE_LEANCLOUD_ID : import.meta.env.VITE_LEANCLOUD_ID,
  appKey: isProduction ? process.env.VITE_LEANCLOUD_KEY : import.meta.env.VITE_LEANCLOUD_KEY,
  serverURL: isProduction ? process.env.VITE_LEANCLOUD_URL : import.meta.env.VITE_LEANCLOUD_URL,
})
setTheme()
handleError(config.errorImg)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
