<script>
import { mapActions } from 'vuex'
import IdeaItem from '@/components/idea_item/index.vue'

export default {
  name: 'Inspiration',
  components: {
    IdeaItem,
  },
  data() {
    return {
      ideas: [],
      loading: true,
    }
  },
  created() {
    this.getInspirationFn()
  },
  methods: {
    ...mapActions({
      getInspirationCountAction: 'github/getInspirationCountAction',
      getInspirationAction: 'github/getInspirationAction',
    }),
    async getInspirationCountFn() {
      return await this.getInspirationCountAction().catch((err) => {
        this.$message({
          content: '获取灵感总数失败',
          type: 'error',
        })
        throw new Error(err)
      })
    },
    async getInspirationFn() {
      const totalCount = await this.getInspirationCountFn()
      this.ideas = await this.getInspirationAction({ page: 1, pageSize: totalCount }).catch((err) => {
        this.$message({
          content: '获取灵感失败',
          type: 'error',
        })
        throw new Error(err)
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<template>
  <div class="inspiration-wrap">
    <div class="inspiration">
      <h2><SvgIcon name="tongzhi" /> 絮絮叨叨</h2>
      <div v-loading="loading" class="ideas-wrap">
        <transition name="from-bottom">
          <div v-if="!loading">
            <div v-for="idea in ideas" :key="idea.id" class="idea-item">
              <IdeaItem
                :idea="idea.body"
                :create="idea.created_at.slice(0, 10)"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
