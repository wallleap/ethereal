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

const appId = import.meta.env.VITE_LEANCLOUD_ID ?? 'zGSs6NeL8XrO61kH7uNOu2Iz-MdYXbMMI'
const appKey = import.meta.env.VITE_LEANCLOUD_KEY ?? 'zrR76W2dRogjUXiiPdjVLF57'
const serverURL = import.meta.env.VITE_LEANCLOUD_URL ?? 'https://api.leancloud.wallleap.cn'

AV.init({
  appId,
  appKey,
  serverURL,
})
setTheme()
handleError(config.errorImg)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
