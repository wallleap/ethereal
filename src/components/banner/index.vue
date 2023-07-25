<script>
import { mapMutations } from 'vuex'
import { getPoetryAllAPI, getPoetryTokenAPI } from '@/api/poetry.js'

export default {
  name: 'Banner',
  data() {
    return {
      timerId: null,
    }
  },
  computed: {
    poetryTitle() {
      return this.$store.state.poetry.poetryTitle
    },
    poetryContent() {
      return this.$store.state.poetry.poetryContent
    },
  },
  created() {
    if (!this.$store.state.poetry.poetryTitle && this.$store.state.poetry.poetryContent.length === 0)
      this.retryGetPoetryFn()
  },
  beforeUnmount() {
    clearTimeout(this.timerId)
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
      return res.data
    },
    async getPoetryAllFn() {
      let xUserToken = this.$store.state.poetry.poetryToken
      if (!this.$store.state.poetry.poetryToken)
        xUserToken = await this.getPoetryTokenAPI()
      const { data: res } = await getPoetryAllAPI(xUserToken)
      if (res.status === 'success') {
        const poetryData = res.data.origin
        this.setPoetryTitle(poetryData.title)
        this.setPoetryContent(poetryData.content.slice(0, 2))
      }
      return res
    },
    async retryGetPoetryFn() {
      const RETRY_COUNT = 5
      let count = 0
      await this.getPoetryAllFn()
      while (this.poetryContent.some(item => item.length > 26)) {
        await this.getPoetryAllFn()
        this.timerId = setTimeout(() => {
          clearTimeout(this.timerId)
          if (count > RETRY_COUNT || this.poetryContent.every(item => item.length <= 26))
            return
          count++
        }, 300)
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
