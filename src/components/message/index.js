import Vue from 'vue'
import Message from './index.vue'

const MessageConstructor = Vue.extend(Message)

let instance
const instances = []
let seed = 1

const MessagePlugin = function (options) {
  options = options || {}
  const id = `message_${seed++}`
  const onClose = options.onClose

  options.onClose = function () {
    MessagePlugin.close(id, onClose)
  }

  instance = new MessageConstructor({
    propsData: options,
  })

  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.show()
  instances.push(instance)
  return instance
}

MessagePlugin.close = function (id, onClose) {
  for (let i = instances.length - 1; i >= 0; i--) {
    if (id === instances[i].id) {
      if (typeof onClose === 'function')
        onClose(instances[i])

      instances.splice(i, 1)
      break
    }
  }
}

MessagePlugin.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--)
    instances[i].close()
}

export default MessagePlugin
