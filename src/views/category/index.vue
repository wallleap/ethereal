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
    },
  },
}
</script>

<template>
  <div class="post-list">
    <div class="posts-wrap">
      <div class="posts">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
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
    width: 100%;
    margin: 0 auto;
    margin-top: 1em;
    .posts {
      width: 100%;
      display: flex;
      gap: 1em;
      flex-wrap: wrap;
      & > div {
        margin: 0;
        width: calc(100% / 3 - 10.7px);
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
        & > div {
          width: calc(100% / 2 - 8px);
        }
      }
    }
    @include xs-layout {
      .posts {
        & > div {
          width: 100%;
        }
      }
    }
  }
}
</style>
