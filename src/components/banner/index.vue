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
      const { data: res } = await getPoetryTokenAPI().catch((err) => {
        this.$message({
          content: '获取诗词token失败',
          type: 'error',
        })
        throw new Error(err)
      })
      if (res.status === 'success')
        this.setPoetryToken(res.data)
      return res.data
    },
    async getPoetryAllFn() {
      let xUserToken = this.$store.state.poetry.poetryToken
      if (!this.$store.state.poetry.poetryToken) {
        xUserToken = await this.getPoetryTokenAPI().catch((err) => {
          throw new Error(err)
        })
      }
      const { data: res } = await getPoetryAllAPI(xUserToken).catch((err) => {
        this.$message({
          content: '获取诗词失败',
          type: 'error',
        })
        throw new Error(err)
      })
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
      await this.getPoetryAllFn().catch((err) => {
        this.$message({
          content: '获取诗词失败',
          type: 'error',
        })
        throw new Error(err)
      })
      while (this.poetryContent.some(item => item.length > 26)) {
        await this.getPoetryAllFn().catch((err) => {
          this.$message({
            content: '获取诗词失败',
            type: 'error',
          })
          throw new Error(err)
        })
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
