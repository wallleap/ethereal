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
