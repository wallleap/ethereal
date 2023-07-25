<script>
import { mapActions } from 'vuex'
import PostCard from '@/components/post_card/index.vue'
import Pagination from '@/components/pagination/index.vue'

export default {
  name: 'Category',
  components: {
    PostCard,
    Pagination,
  },
  data() {
    return {
      posts: [],
      totalCount: 0,
      loading: true,
    }
  },
  computed: {
    categoryNumber() {
      return this.$store.state.github.currentCategory.number || this.$route.params.number
    },
    currentPage: {
      get() {
        return this.$store.state.github.currentPage || 1
      },
      set(val) {
        this.$store.commit('github/setCurrentPage', val)
        this.getPostsFn()
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
    },
  },
  watch: {
    $route() {
      this.currentPage = 1
      this.$store.commit('github/setCurrentCategory', this.$route.params.category || '')
      this.getPostsFn()
      this.getPostsCountFn()
    },
  },
  created() {
    this.currentPage = 1
    this.$store.commit('github/setCurrentCategory', this.$route.params.category || '')
    this.getPostsFn()
    this.getPostsCountFn()
  },
  methods: {
    ...mapActions({
      queryHotAction: 'leancloud/queryHotAction',
      getPostsAction: 'github/getPostsAction',
      getPostsCountAction: 'github/getPostsCountAction',
    }),
    async getPostsCountFn() {
      this.totalCount = this.categoryNumber
        ? this.$store.state.github.currentCategory.open_issues
        : await this.getPostsCountAction()
    },
    async getPostsFn() {
      let res = []
      if (this.categoryNumber) {
        const filter = `&milestone=${this.categoryNumber}`
        res = await this.getPostsAction({ page: `${this.currentPage}`, filter })
      }
      else { res = await this.getPostsAction({ page: `${this.currentPage}` }) }
      this.posts = res
      const ids = res.map(post => post.id)
      const hot = await this.queryHotAction('queryHot', { ids })
      console.log('hot', hot)
      if (hot && hot.length > 0) {
        this.posts = this.posts.map((item) => {
          const index = hot.findIndex(hotItem => hotItem.id === item.id)
          if (index !== -1)
            item.hot = hot[index].hot
          return item
        })
      }
      if (this.posts)
        this.loading = false
      this.$store.commit('github/setAllPosts', res)
    },
  },
}
</script>

<template>
  <div class="post-list">
    <div v-loading="loading" class="posts-wrap">
      <div class="posts">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="{ name: 'Post', params: { number: post.number } }"
        >
          <PostCard
            :post="post"
          />
        </router-link>
      </div>
    </div>
    <Pagination
      :current-page.sync="currentPage"
      :total="totalCount"
      :page-size="$config.pageSize"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-list {
  .posts-wrap {
    position: relative;
    width: 100%;
    min-height: 200px;
    margin: 0 auto;
    margin-top: 1em;
    .posts {
      width: 100%;
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
      & > a {
        margin: 0;
        width: calc(100% / 3 - 10.7px);
        > div {
          width: 100%;
          height: 100%;
        }
      }
    }
    @media screen and (min-width: 876px) {
      max-width: 876px;
    }
    @media screen and (max-width: 876px) {
      .posts {
        padding-left: 9px;
      }
    }
    @include sm-layout {
      .posts {
        padding: 0 calc(1em - 9px) 0 1em;
        & > a {
          width: calc(100% / 2 - 8px);
        }
      }
    }
    @include xs-layout {
      .posts {
        & > a {
          width: 100%;
        }
      }
    }
  }
}
</style>
