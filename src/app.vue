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
  data() {
    return {
      transitionName: 'slide-left',
    }
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
  watch: {
    $route(to, from) {
      if (to.path === from.path)
        return
      this.transitionName = to.meta.index > from.meta.index ? 'slide-left' : 'slide-right'
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
      <transition :name="transitionName">
        <router-view />
      </transition>
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

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
  transition: all 0.3s ease;
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
  transition: all 0.3s ease;
}
</style>
