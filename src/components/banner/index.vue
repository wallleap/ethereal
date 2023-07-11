<script>
import { mapMutations } from 'vuex'
import { getPoetryAllAPI, getPoetryTokenAPI } from '@/api/poetry.js'

export default {
  name: 'Banner',
  computed: {
    poetryTitle() {
      return this.$store.state.poetry.poetryTitle
    },
    poetryContent() {
      return this.$store.state.poetry.poetryContent
    },
  },
  created() {
    if (!this.$store.state.poetry.poetryToken)
      this.getPoetryTokenAPI()
    if (!this.$store.state.poetry.poetryTitle && this.$store.state.poetry.poetryContent.length === 0)
      this.retryGetPoetryFn()
  },
  methods: {
    ...mapMutations({
      setPoetryToken: 'poetry/setPoetryToken',
      setPoetryTitle: 'poetry/setPoetryTitle',
      setPoetryContent: 'poetry/setPoetryContent',
    }),
    async getPoetryTokenAPI() {
      const { data: res } = await getPoetryTokenAPI()
      if (res.status === 'success')
        this.setPoetryToken(res.data)
    },
    async getPoetryAllFn() {
      const { data: res } = await getPoetryAllAPI()
      if (res.status === 'success') {
        const poetryData = res.data.origin
        this.setPoetryTitle(poetryData.title)
        this.setPoetryContent(poetryData.content.slice(0, 2))
      }
      return res
    },
    async retryGetPoetryFn() {
      let count = 0
      await this.getPoetryAllFn()
      while (this.poetryContent.some(item => item.length > 26)) {
        await this.getPoetryAllFn()
        const timerId = setTimeout(() => {
          if (count > 5 || this.poetryContent.every(item => item.length <= 26))
            return
          count++
          clearTimeout(timerId)
        }, 1000)
      }
    },
  },
}
</script>

<template>
  <div class="banner">
    <div class="banner-content">
      <div class="banner-title">
        <h2>{{ poetryTitle }}</h2>
      </div>
      <div class="banner-poetry">
        <p v-for="poetry in poetryContent" :key="poetry">
          {{ poetry }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
