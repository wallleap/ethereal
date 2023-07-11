<script>
import NavBar from '@/components/nav_bar/index.vue'
import Copyright from '@/components/copyright/index.vue'
import BackToTop from '@/components/back_to_top/index.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Copyright,
    BackToTop,
  },
}
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="main">
      main
    </main>
    <Copyright />
    <BackToTop />
  </div>
</template>

<style lang="scss" scoped>
#app {
  position: relative;
  .main {
    height: 300vh;
  }
}
</style>
