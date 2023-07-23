import Vue from 'vue'
import Loading from './index.vue'

function append(el) {
  el.appendChild(el.instance.$el)
}

function remove(el) {
  el.removeChild(el.instance.$el)
}

const loadingDirective = {
  inserted(el, binding) {
    const app = new Vue(Loading)
    const instance = app.$mount(document.createElement('div'))
    el.instance = instance
    if (binding.value)
      append(el)
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value)
        append(el)
      else
        remove(el)
    }
  },
}

export default loadingDirective
