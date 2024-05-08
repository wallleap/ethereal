<script>
import Comment from '@/components/comment/index.vue'
import MarkIt from '../../components/markdown/mark_it'
import Markdown from '@/components/markdown/index.vue'

export default {
  name: 'About',
  components: {
    Comment,
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
    if (localStorage.getItem('configLeancloud') === 'yes')
      this.queryLikeFn()
  },
  methods: {
    async getAboutFn() {
      const res = await this.$store.dispatch('github/getAboutAction').catch((err) => {
        this.$message({
          content: '获取关于内容失败',
          type: 'error',
        })
        throw new Error(err)
      }).finally(() => {
        this.loading = false
      })
      const content = res?.body || ''
      const markIt = new MarkIt()
      const parsedString = await markIt.parse(content).catch((err) => {
        this.$message({
          content: '解析 markdown 失败',
          type: 'error',
        })
        throw new Error(err)
      })
      this.about = parsedString?.content
      this.appendBusuanzi(parsedString?.content)
    },
    async queryLikeFn() {
      const res = await this.$store.dispatch('leancloud/queryLikeAction', 'getTimes').catch((err) => {
        this.$message({
          content: '获取点赞次数失败',
          type: 'error',
        })
        throw new Error(err)
      })
      if (res !== 'undefined')
        this.likeTimes = res
    },
    async likeClick() {
      if (localStorage.getItem('configLeancloud') === 'no'){
        this.$message({
          content: '博主还没有设置 Leancloud，点赞无效',
          type: 'error',
        })
        return
      }
      if (this.isLiked === 'isLiked') {
        this.$message({
          content: '您已经点过赞了哦~',
          type: 'warning',
        })
        return
      }
      this.likeTimes = await this.$store.dispatch('leancloud/queryLikeAction').catch((err) => {
        this.$message({
          content: '点赞失败',
          type: 'error',
        })
        throw new Error(err)
      })
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
    <div class="about">
      <div v-loading="loading" class="about-content">
        <Markdown :content="about" />
      </div>
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
    <Comment />
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
