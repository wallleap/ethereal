<script>
import NavBar from '@/components/nav_bar/index.vue'
import Copyright from '@/components/copyright/index.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Copyright,
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
  </div>
</template>

<style lang="scss" scoped>
#app {
  position: relative;
}
</style>
