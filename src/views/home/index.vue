<script>
import Category from '@/views/category/index.vue'

export default {
  name: 'Home',
  components: {
    Category,
  },
  computed: {
    isHome() {
      return this.$route.name === 'Home'
    },
    categories() {
      return this.$store.state.github.categories
    },
  },
  created() {
    if (this.$store.state.github.categories.length === 0)
      this.getCategoriesFn()
  },
  mounted() {
    this.$store.commit('github/setCurrentCategory', '')
  },
  methods: {
    async getCategoriesFn() {
      const res = await this.$store.dispatch('github/getCategoriesAction').catch((err) => {
        this.$message({
          content: '获取分类失败',
          type: 'error',
        })
        throw new Error(err)
      })
      this.$store.commit('github/setCategories', res)
    },
  },
}
</script>

<template>
  <div class="home-page">
    <div class="categories-bar">
      <div class="categories">
        <router-link to="/">
          近期文章
        </router-link>
        <router-link v-for="category in categories" :key="category.id" :to="{ name: 'Category', params: { number: category.number, category } }">
          {{ category.title }}
        </router-link>
      </div>
    </div>
    <transition name="fade">
      <template v-if="isHome">
        <Category />
      </template>
      <template v-else>
        <router-view />
      </template>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
