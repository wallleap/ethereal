<script>
import { mapActions } from 'vuex'
import RelatedPost from '@/components/related_post/index.vue'
import Markdown from '@/components/markdown/index.vue'
import MarkIt from '@/components/markdown/mark_it.js'
import { updateCurrentLink } from '@/utils'

export default {
  name: 'Post',
  components: {
    Markdown,
    RelatedPost,
  },
  data() {
    return {
      post: {},
      relates: [],
      toc: '',
      currentLink: 0,
      content: '',
    }
  },
  computed: {
    postNumber() {
      const url = window.location.href
      const postId = url.match(/\/post\/(\d+)/)[1]
      return this.$route?.params?.number || Number(postId)
    },
    showTagText() {
      return this.post.tags && this.post.tags.length > 0
    },
  },
  watch: {
    $route() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      this.getPostFn()
      this.generateRelatesFn()
    },
  },
  created() {
    this.getPostFn()
    this.generateRelatesFn()
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.updateCurrentTocLink)
    })
  },
  methods: {
    ...mapActions({
      getPostsCountAction: 'github/getPostsCountAction',
      getPostsAction: 'github/getPostsAction',
      getPostAction: 'github/getPostAction',
    }),
    async getPostsCountFn() {
      return await this.getPostsCountAction()
    },
    async getPostsFn() {
      const pageSize = await this.getPostsCountFn()
      return await this.getPostsAction({ page: 1, pageSize })
    },
    async getPostFn() {
      const markIt = new MarkIt()
      this.post = await this.getPostAction({ number: this.postNumber })
      const parsedMarked = await markIt.parse(this.post.body)
      this.toc = parsedMarked?.toc
      this.content = parsedMarked?.content
    },
    async generateRelatesFn() {
      const LOOP = 2
      const postList = await this.getPostsFn()
      this.relates = []
      while (true) {
        const len = postList.length
        const index = Math.floor(Math.random() * len)
        const post = postList[index]
        const num = this.postNumber
        if (this.relates.includes(post))
          continue
        if (post.number !== num)
          this.relates.push(post)
        if (this.relates.length >= LOOP)
          break
      }
    },
    handleClick(e) {
      const tocLinks = document.querySelectorAll('.toc-link')
      if (e.target.classList.contains('toc-link')) {
        tocLinks.forEach((item) => {
          item.classList.remove('active')
        })
        const id = e.target.getAttribute('href')
        const el = document.querySelector(id)
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    },
    updateCurrentTocLink() {
      updateCurrentLink('.toc-link')
    },
    backLastPage() {
      this.$router.back()
    },
    showToc() {
      this.$refs.tocWrap.classList.add('show')
    },
    hideToc() {
      this.$refs.tocWrap.classList.remove('show')
    },
  },
}
</script>

<template>
  <article class="post">
    <section ref="tocWrap" class="toc-wrap">
      <div class="toc-header">
        <div class="toc-title">
          <SvgIcon name="toc" />
          <span>文章目录</span>
        </div>
        <div class="toc-close" @click="hideToc">
          <SvgIcon name="close" />
        </div>
      </div>
      <div class="toc" @click.prevent="handleClick" v-html="toc" />
    </section>
    <section class="post-header">
      <div class="page-control">
        <div class="back" @click="backLastPage">
          <SvgIcon name="back" />
        </div>
        <div class="show-toc" @click="showToc">
          <SvgIcon name="toc" />
        </div>
      </div>
      <figure class="post-cover">
        <img :src="post.cover || $config.defaultCover" alt="cover">
      </figure>
    </section>
    <section class="post-body">
      <div class="post-info">
        <div class="title-wrap">
          <div class="cate-wrap">
            <span v-if="!post.category" class="cate-text">未分类</span>
            <template v-else>
              <router-link
                class="cate-link"
                :to="{ name: 'Category', params: { category: post.category?.title, number: post.category.number } }"
              >
                {{ post.category.title }}
              </router-link>
            </template>
          </div>
          <h1 class="post-title">
            {{ post.title }}
          </h1>
        </div>
        <div class="tags-wrap">
          <div class="author">
            <figure class="author-avatar">
              <img :src="$config.avatar" alt="头像">
            </figure>
            <div class="text">
              <p class="author-name">
                {{ $config.author }}
              </p>
              <div class="meta">
                <span class="time"><SvgIcon name="shijian" /> {{ post.created_by }}</span>
                <span class="hot"><SvgIcon name="huore" /> {{ post.hot }}</span>
              </div>
            </div>
          </div>
          <div class="tags">
            <SvgIcon name="biaoqian" />
            <template v-if="showTagText">
              <span v-for="tag in post.tags" :key="tag.id" class="tag" :style="{ color: `#${tag.color}` }">
                {{ tag.name }}
              </span>
            </template>
            <span v-else>无标签</span>
          </div>
        </div>
      </div>
      <div class="post-main">
        <Markdown :content="content" :parsed="true" />
      </div>
    </section>
    <section class="post-footer">
      <div class="related-posts">
        <RelatedPost v-for="relate in relates" :key="relate.id" :post="relate" />
      </div>
      <div class="comments">
        评论
      </div>
    </section>
  </article>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
