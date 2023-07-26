<script>
export default {
  name: 'Comment',
  data() {
    return {
      showUtterances: true,
      showTwikoo: false,
      loading: true,
    }
  },
  computed: {
    currentComment: {
      get() {
        return this.$store.state.style.currentComment || 'utterances'
      },
      set(val) {
        this.$store.commit('style/setCurrentComment', val)
      },
    },
    utterancesOpts() {
      const scriptTag = this.$config.utterances.code
      const regex = /(\w+)\s*=\s*["']([^"']+)["']/g
      const matches = scriptTag.match(regex)
      const obj = {}
      if (scriptTag.includes('async'))
        obj.async = true
      matches?.forEach((match) => {
        const [_, key, value] = match.match(/(\w+)\s*=\s*["']([^"']+)["']/)
        obj[key] = value
      })
      obj.theme = this.theme === 'dark' ? 'github-dark' : 'github-light'
      return obj
    },
    theme() {
      return this.$store.state.style.theme
    },
  },
  watch: {
    $route() {
      if (document.querySelector('.utterances .utterances'))
        document.querySelector('.utterances .utterances').remove()
      this.loadAll()
    },
    theme() {
      const theme = this.theme === 'dark' ? 'github-dark' : 'github-light'
      document.querySelector('.utterances .utterances iframe').contentWindow.postMessage(
        {
          type: 'set-theme',
          theme,
        },
        'https://utteranc.es',
      )
    },
  },
  mounted() {
    this.loadAll()
  },
  methods: {
    installUtterances() {
      const utterancesEL = document.createElement('script')
      utterancesEL.async = this.utterancesOpts.async || false
      utterancesEL.setAttribute('src', this.utterancesOpts.src || 'https://utteranc.es/client.js')
      utterancesEL.setAttribute('repo', this.utterancesOpts.repo)
      utterancesEL.setAttribute('issue-term', this.utterancesOpts.term)
      if (this.utterancesOpts.label !== '')
        utterancesEL.setAttribute('label', this.utterancesOpts.label)
      utterancesEL.setAttribute('theme', this.utterancesOpts.theme)
      utterancesEL.setAttribute('crossorigin', this.utterancesOpts.crossorigin || 'anonymous')
      this.$refs.utterances.appendChild(utterancesEL)
    },
    installTwikoo() {
      twikoo.init({
        envId: import.meta.env.VITE_TWIKOO_ID,
        el: '.twikoo',
      })
    },
    setActiveComment(comment) {
      if (comment) {
        if (comment === 'utterances') {
          this.showUtterances = true
          this.showTwikoo = false
        }
        else if (comment === 'twikoo') {
          this.showUtterances = false
          this.showTwikoo = true
        }
        const allComments = this.$refs.commentsNav?.querySelectorAll('li')
        allComments?.forEach((li) => {
          li?.classList.remove('active')
        })
        const activeComment = this.$refs.commentsNav?.querySelector(`.${comment}-toggle`)
        activeComment?.classList.add('active')
      }
    },
    setCurrentComment(e) {
      if (e.target.nodeName === 'LI') {
        const comment = e.target.classList[0].split('-')[0]
        this.currentComment = comment
        this.setActiveComment(comment)
      }
    },
    loadAll() {
      new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (this.$refs.utterances) {
            clearInterval(timer)
            this.loading = false
            resolve()
          }
          else {
            reject(new Error('加载评论失败，正在重试中...'))
          }
        }, 100)
      }).then(() => {
        this.setActiveComment(this.currentComment)
        this.installUtterances()
        this.installTwikoo()
      })
    },
  },
}
</script>

<template>
  <div class="comments">
    <div class="comments-header">
      <h2><SvgIcon name="comment" /> 评论</h2>
      <ul ref="commentsNav" class="comments-nav" @click="setCurrentComment">
        <li class="utterances-toggle active">
          Utterances
        </li>
        <li class="twikoo-toggle">
          Twikoo
        </li>
      </ul>
    </div>
    <div v-loading="loading" class="comments-body">
      <transition name="slide">
        <div v-show="showUtterances" class="u-wrap">
          <div ref="utterances" class="utterances">
            <!-- utterances script here -->
          </div>
        </div>
      </transition>
      <transition name="slide">
        <div v-show="showTwikoo" class="t-wrap">
          <div class="twikoo" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
@import './index.scss'
</style>
