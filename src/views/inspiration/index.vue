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
      totalCount: 0,
    }
  },
  created() {
    this.getInspirationCountFn()
    this.getInspirationFn()
  },
  methods: {
    ...mapActions({
      getInspirationCountAction: 'github/getInspirationCountAction',
      getInspirationAction: 'github/getInspirationAction',
    }),
    async getInspirationCountFn() {
      this.totalCount = await this.getInspirationCountAction()
    },
    async getInspirationFn() {
      this.ideas = await this.getInspirationAction({ page: 1, pageSize: this.totalCount })
    },
  },
}
</script>

<template>
  <div class="inspiration-wrap">
    <div class="inspiration">
      <h2><SvgIcon name="tongzhi" /> 絮絮叨叨</h2>
      <div class="ideas-wrap">
        <div v-for="idea in ideas" :key="idea.id" class="idea-item">
          <IdeaItem
            :idea="idea.body"
            :create="idea.created_at.slice(0, 10)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
