<script>
export default {
  name: 'RelatedPost',
  props: {
    post: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    postCategory() {
      return this.post.category ? this.post.category.title || '未分类' : '未分类'
    },
    showTagText() {
      return this.post.tags && this.post.tags.length > 0
    },
  },
}
</script>

<template>
  <router-link :to="{ name: 'Post', params: { number: post.number } }" class="related-post">
    <figure class="post-cover">
      <img v-if="post.cover" :src="post.cover" alt="Cover">
      <img v-else :src="$config.defaultCover" alt="Cover">
    </figure>
    <div class="post-info">
      <div class="post-meta">
        <span class="post-cate">{{ postCategory }}</span>
        <span class="post-tags">
          <template v-if="showTagText">
            <SvgIcon name="biaoqian" />
            <span v-for="tag in post.tags" :key="tag.id" class="post-tag">{{ tag.name }}</span>
          </template>
          <span v-if="post.tags.length === 0" class="post-tag">暂无标签</span>
        </span>
      </div>
      <div class="post-text">
        <h2 class="post-title">
          {{ post.title }}
        </h2>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
