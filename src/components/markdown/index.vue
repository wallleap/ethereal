<!-- eslint-disable max-statements-per-line -->
<script>
import Clipboard from 'clipboard'

export default {
  name: 'Markdown',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      clipboard: null,
    }
  },
  mounted() {
    this.clipboard = new Clipboard('.icon-copy', {
      target(trigger) {
        return trigger.parentNode.nextElementSibling
      },
    })
    this.registerClipboard(this.clipboard)
  },
  unmounted() {
    this.$message.closeAll()
    this.clipboard.destroy()
  },
  methods: {
    registerClipboard(clipboard) {
      clipboard.on('success', (e) => {
        this.$message({ content: '复制成功', type: 'success' })
        e.clearSelection()
      })
      clipboard.on('error', (e) => {
        this.$message({ content: '复制失败', type: 'error' })
        e.clearSelection()
      })
    },
  },
}
</script>

<template>
  <div class="markdown" v-html="content" />
</template>

<style lang="scss">
@import './index.scss'
</style>
