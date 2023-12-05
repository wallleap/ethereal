<!-- eslint-disable max-statements-per-line -->
<script>
import Clipboard from 'clipboard'
import VueEasyLightbox from 'vue-easy-lightbox'
import MarkIt from './mark_it.js'

export default {
  name: 'Markdown',
  components: {
    VueEasyLightbox,
  },
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
      images: [],
      lightboxVisible: false,
    }
  },
  watch: {
    content: {
      immediate: true,
      handler() {
        this.extractImages()
        this.addClickEvents()
      },
    },
  },
  async created() {
    if (this.needParsed) {
      const markIt = new MarkIt()
      const parsedString = await markIt.parse(this.content).catch((err) => {
        this.$message({
          content: '解析 markdown 失败',
          type: 'error',
        })
        throw new Error(err)
      })
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
    openLightbox(imageSrc) {
      this.images = [imageSrc]
      this.lightboxVisible = true
    },
    extractImages() {
      const matches = this.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/g)
      if (matches)
        this.images = matches.map(tag => tag.match(/src="([^"]*)"/)[1])
    },
    addClickEvents() {
      this.$nextTick(() => {
        const images = this.$el.querySelectorAll('img')
        images.forEach((img) => {
          img.addEventListener('click', () => {
            this.openLightbox(img.src)
          })
        })
      })
    },
  },
}
</script>

<template>
  <div>
    <div class="markdown" v-html="htmlString || content" />
    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="images"
      @hide="lightboxVisible = false"
    />
  </div>
</template>

<style lang="scss">
@import './index.scss'
</style>
