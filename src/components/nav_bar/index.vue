<script>
export default {
  name: 'NavBar',
  data() {
    return {
      menus: [
        { id: 0, title: this.$t('home'), path: '/', icon: 'home' },
        { id: 1, title: this.$t('archives'), path: '/archives', icon: 'archives' },
        { id: 2, title: this.$t('inspiration'), path: '/inspiration', icon: 'inspire' },
        { id: 3, title: this.$t('friends'), path: '/friend', icon: 'friends' },
        { id: 4, title: this.$t('about'), path: '/about', icon: 'about' },
      ],
      routerChanged: true,
      theme: 'light',
    }
  },
  computed: {
    darkMode() {
      return this.theme === 'dark'
    },
  },
  watch: {
    '$store.state.style.theme': function () {
      this.getCurrentTheme()
    },
  },
  mounted() {
    this.initCurrentMenu()
    this.getCurrentTheme()
    this.setCurrentMenu()
    this.$router.afterEach(() => {
      this.routerChanged = true
      this.setCurrentMenu()
    })
  },
  methods: {
    getCurrentTheme() {
      const theme = this.$store.state.style.theme
      this.theme = theme
    },
    changeTheme() {
      this.getCurrentTheme()
      this.$store.commit('style/setTheme', this.theme === 'light' ? 'dark' : 'light')
    },
    initCurrentMenu() {
      this.routerChanged = true
      this.setCurrentMenu()
    },
    setCurrentMenu() {
      const path = this.routerChanged ? this.$route.path : this.$store.state.style.currentMenu.path
      const menu = this.menus.find(item => item.path === path)
      if (menu) {
        const leftDu = `${menu.id * 100 / this.menus.length}%`
        const menuWrap = this.$refs['menu-wrap']
        menuWrap.style.setProperty('--left-du', leftDu)
        this.$store.commit('style/setCurrentMenu', menu)
      }
      this.routerChanged = false
    },
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<template>
  <div class="nav-bar" @dblclick="backToTop">
    <div class="site-title">
      <h1>
        <RouterLink class="title" to="/">
          {{ $config.title }}
        </RouterLink>
        <span class="subtitle">{{ $config.subtitle }}</span>
      </h1>
    </div>
    <nav class="site-nav">
      <ul ref="menu-wrap">
        <li v-for="menu in menus" :key="menu.id">
          <RouterLink :to="menu.path">
            <SvgIcon :name="menu.icon" color="currentColor" /> {{ menu.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="site-control">
      <div class="change-theme" @click="changeTheme">
        <span class="theme__toggle-wrap">
          <span class="theme__icon">
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
            <span class="theme__icon-part" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>
