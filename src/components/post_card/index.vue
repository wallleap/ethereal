<script>
import Markdown from '@/components/markdown/index.vue'
import MarkIt from '@/components/markdown/mark_it.js'

export default {
  name: 'PostCard',
  components: {
    Markdown,
  },
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      content: '',
    }
  },
  async created() {
    const markIt = new MarkIt()
    const parsedMarked = await markIt.parse(this.post.summary).catch((err) => {
      this.$message({
        content: '解析 markdown 失败',
        type: 'error',
      })
      throw new Error(err)
    })
    this.content = parsedMarked?.content
  },
}
</script>

<template>
  <div class="post-card">
    <figure class="post-cover">
      <img v-if="post.cover" :src="post.cover" alt="Cover">
      <img v-else :src="$config.defaultCover" alt="Cover">
    </figure>
    <div class="post-info">
      <div class="post-meta">
        <span class="post-tags">
          <span v-if="post.tags.length === 0" class="post-tag">暂无标签</span>
          <span v-for="tag in post.tags" :key="tag.id" class="post-tag" :style="{ color: `#${tag.color}` }"># {{ tag.name }}</span>
        </span>
      </div>
      <div class="post-text">
        <h2 class="post-title">
          {{ post.title }}
        </h2>
        <p class="post-summary">
          <Markdown :content="content" />
        </p>
      </div>
      <div class="post-meta-num">
        <span class="post-created"><SvgIcon name="shijian" /> {{ post.created_by }}</span>
        <span class="post-hot"><SvgIcon name="huore" /> 热度 {{ post.hot }} &#8451;</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
