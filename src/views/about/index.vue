<script>
import MarkIt from '../../components/markdown/mark_it'
import Markdown from '@/components/markdown/index.vue'

export default {
  name: 'About',
  components: {
    Markdown,
  },
  data() {
    return {
      about: '',
      isLiked: 'notLiked', // isLiked: 'isLiked' | 'notLiked'
      likeTimes: 0,
      loading: true,
    }
  },
  created() {
    if (localStorage.getItem('isLiked') === 'undefined') {
      localStorage.setItem('isLiked', 'notLiked')
      this.isLiked = 'notLiked'
    }
    else {
      this.isLiked = localStorage.getItem('isLiked')
    }
    this.getAboutFn()
  },
  mounted() {
    this.queryLikeFn()
  },
  methods: {
    async getAboutFn() {
      const res = await this.$store.dispatch('github/getAboutAction')
      const content = res?.body || ''
      const markIt = new MarkIt()
      const parsedString = await markIt.parse(content)
      this.about = parsedString?.content
      this.appendBusuanzi(parsedString?.content)
      if (res)
        this.loading = false
    },
    async queryLikeFn() {
      const res = await this.$store.dispatch('leancloud/queryLikeAction', 'getTimes')
      if (res !== 'undefined')
        this.likeTimes = res
    },
    likeClick() {
      if (this.isLiked === 'isLiked') {
        this.$message({
          content: '您已经点过赞了哦~',
          type: 'warning',
        })
        return
      }
      this.likeTimes = this.$store.dispatch('leancloud/queryLikeAction')
      this.isLiked = 'isLiked'
      localStorage.setItem('isLiked', 'isLiked')
      this.$message({
        content: '谢谢您的点赞~',
        type: 'success',
      })
    },
    appendBusuanzi(string) {
      if (!string)
        return
      const hasBusuanzi = string.includes('busuanzi')
      if (hasBusuanzi) {
        const busuanziScript = document.querySelector('script[src*="busuanzi"]')
        if (busuanziScript)
          busuanziScript.remove()
        const script = document.createElement('script')
        script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
        document.body.appendChild(script)
      }
    },
  },
}
</script>

<template>
  <div class="about-wrap">
    <div v-loading="loading" class="about">
      <Markdown :content="about" />
      <div class="like">
        <figure class="like-img">
          <img src="../../assets/images/like.png" alt="like">
        </figure>
        <div class="info">
          <h2>喜欢就点赞 疼爱就打赏</h2>
          <p>觉得博客不错的话，就点个赞吧</p>
          <div
            class="like-btn"
            :data-text="`已经有 ${likeTimes} 人点赞了~`"
            @click="likeClick"
          >
            <SvgIcon name="like" />
          </div>
        </div>
        <figure class="alipay-qr">
          <img :src="$config.alipay_qr" alt="支付宝二维码">
        </figure>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
