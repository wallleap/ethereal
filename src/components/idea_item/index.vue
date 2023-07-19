<script>
import Markdown from '@/components/markdown/index.vue'

export default {
  name: 'IdeaItem',
  components: {
    Markdown,
  },
  props: {
    idea: {
      type: String,
      default: '',
    },
    create: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <div class="idea-wrap">
    <figure class="avatar">
      <img :src="$config.avatar" alt="avatar">
    </figure>
    <div class="idea">
      <h3 class="author">
        {{ $config.author }}
      </h3>
      <div class="content">
        <Markdown :content="idea" :need-parsed="true" />
      </div>
      <div class="publish-time">
        发布于 {{ create }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
