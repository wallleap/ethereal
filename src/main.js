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

const appId = import.meta.env.VITE_LEANCLOUD_ID || ''
const appKey = import.meta.env.VITE_LEANCLOUD_KEY || ''
const serverURLs = import.meta.env.VITE_LEANCLOUD_SERVER || ''
const clarity = config.clarity

if (appId && appKey && serverURLs){
  localStorage.setItem('configLeancloud', 'yes')
  AV.init({
    appId,
    appKey,
    serverURLs,
  })
} else {
  localStorage.setItem('configLeancloud', 'no')
  console.warn('LeanCloud 相关配置未正确设置，请检查环境变量')
}

setTheme()
handleError(config.errorImg)

if (clarity) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarity}");
    `
  document.head.appendChild(script)
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
