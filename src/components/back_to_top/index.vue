<script>
export default {
  name: 'BackToTop',
  data() {
    return {
      display: false,
      isFirstScreen: true,
      prevScrollTop: 0,
    }
  },
  watch: {
    isFirstScreen() {
      this.display = !this.isFirstScreen
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (!this.isFirstScreen)
        this.display = scrollTop < this.prevScrollTop
      this.isFirstScreen = scrollTop === 0
      this.prevScrollTop = scrollTop
    },
  },
}
</script>

<template>
  <transition name="fade">
    <div v-if="display" class="back-to-top" @click="backToTop">
      <SvgIcon name="backtop" />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: .4em;
  bottom: 1em;
  padding: .4em;
  border-radius: .5em;
  background-color: var(--bg-thin);
  @include box-shadow;
  font-size: 1.4rem;
  cursor: pointer;
  svg {
    color: var(--accent);
  }
  &:hover {
    background-color: var(--bg-thin-hover);
  }
  @include xs-layout {
    & {
      bottom: 80px;
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(80px);
}
</style>
