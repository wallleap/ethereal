<!-- eslint-disable max-statements-per-line -->
<script>
import Clipboard from 'clipboard'
import MarkIt from './mark_it.js'

export default {
  name: 'Markdown',
  props: {
    content: {
      type: String,
      default: '',
    },
    needParsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clipboard: null,
      htmlString: '',
    }
  },
  async created() {
    if (this.needParsed) {
      const markIt = new MarkIt()
      const parsedString = await markIt.parse(this.content)
      this.htmlString = parsedString?.content
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
  <div class="markdown" v-html="htmlString || content" />
</template>

<style lang="scss">
@import './index.scss'
</style>
