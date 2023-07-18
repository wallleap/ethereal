<script>
import NavBar from '@/components/nav_bar/index.vue'
import Banner from '@/components/banner/index.vue'
import Search from '@/components/search/index.vue'
import Copyright from '@/components/copyright/index.vue'
import BackToTop from '@/components/back_to_top/index.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Banner,
    Search,
    Copyright,
    BackToTop,
  },
  computed: {
    isShowSearch() {
      const whiteList = {
        '/': true,
        '/archives': true,
        '/about': false,
        '/post': false,
      }
      return whiteList[this.$route.path] || this.$route.path.startsWith('/category')
    },
  },
}
</script>

<template>
  <div id="app">
    <NavBar />
    <Banner v-if="!$route.path.startsWith('/post')" />
    <Search v-if="isShowSearch" />
    <main class="main">
      <router-view />
    </main>
    <Copyright />
    <BackToTop />
  </div>
</template>

<style lang="scss" scoped>
#app {
  position: relative;
}

.main {
  padding-bottom: 240px;
}
</style>
