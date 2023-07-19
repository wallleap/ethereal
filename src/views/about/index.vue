<script>
import MarkIt from '../../components/markdown/mark_it'
import Markdown from '@/components/markdown/index.vue'

export default {
  name: 'About',
  components: {
    Markdown,
  },
  data() {
    return {
      about: '',
    }
  },
  created() {
    this.getAboutFn()
  },
  methods: {
    async getAboutFn() {
      const res = await this.$store.dispatch('github/getAboutAction')
      const content = res?.body || ''
      const markIt = new MarkIt()
      const parsedString = await markIt.parse(content)
      this.about = parsedString?.content
      this.appendBusuanzi(parsedString?.content)
    },
    appendBusuanzi(string) {
      if (!string)
        return
      const hasBusuanzi = string.includes('busuanzi')
      if (hasBusuanzi) {
        const busuanziScript = document.querySelector('script[src*="busuanzi"]')
        if (busuanziScript)
          busuanziScript.remove()
        const script = document.createElement('script')
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
        document.body.appendChild(script)
      }
    },
  },
}
</script>

<template>
  <div class="about-wrap">
    <div class="about">
      <Markdown :content="about" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
