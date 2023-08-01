<script>
import { mapActions } from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      searchValue: '',
      searchCount: 0,
      posts: [],
      showModal: false,
      loading: true,
    }
  },
  methods: {
    ...mapActions({
      searchPostsAction: 'github/searchPostsAction',
    }),
    showSearchWrap() {
      this.showModal = true
      this.searchPostsFn()
      document.documentElement.classList.add('modal-open')
      this.$refs.searchWrap.classList.add('active')
    },
    hideSearchWrap() {
      this.showModal = false
      this.searchValue = ''
      document.documentElement.classList.remove('modal-open')
      this.$refs.searchWrap.classList.remove('active')
    },
    pushToPost(number) {
      this.$router.push({ name: 'Post', params: { number } })
      this.hideSearchWrap()
    },
    async searchPostsFn() {
      this.loading = true
      this.posts = []
      const q = this.searchValue
      const res = await this.searchPostsAction({ q }).catch((err) => {
        this.$message({
          content: '搜索文章失败',
          type: 'error',
        })
        throw new Error(err)
      }).finally(() => {
        this.loading = false
      })
      this.searchValue = ''
      this.searchCount = res.searchCount
      this.posts = res.posts
    },
  },
}
</script>

<template>
  <div class="site-search">
    <div ref="searchWrap" class="search-wrap">
      <form class="search-box" @submit.prevent="searchPostsFn">
        <input
          v-model="searchValue"
          type="text"
          class="search-input"
          placeholder="输入关键词进行搜索"
          @focus="showSearchWrap"
        >
        <button type="submit" class="search-btn">
          搜索
        </button>
      </form>
      <div v-if="showModal" class="search-res">
        <div class="close-btn" @click="hideSearchWrap">
          <SvgIcon name="close" />
        </div>
        <div class="container">
          <div v-loading="loading" class="posts">
            <ul class="items">
              <li
                v-for="post in posts"
                :key="post.id"
                class="item"
                @click="pushToPost(post.number)"
              >
                <SvgIcon name="arrow" />
                <span>{{ post.title }}</span>
              </li>
            </ul>
          </div>
          <p class="tip">
            <span v-if="searchCount >= 10">仅展示前 10 条结果，点击可跳转至相应文章</span>
            <span v-else>找到了 {{ searchCount }} 条结果，点击即可跳转至相应文章</span>
          </p>
        </div>
      </div>
    </div>
    <div class="mask" @click="hideSearchWrap" />
  </div>
</template>

<style lang="scss" scoped>
@import 'index.scss'
</style>
