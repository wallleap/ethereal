<script>
import { mapActions } from 'vuex'
import Loading from '@/components/loading/index.vue'
import PostCard from '@/components/post_card/index.vue'
import Pagination from '@/components/pagination/index.vue'

export default {
  name: 'Category',
  components: {
    PostCard,
    Pagination,
    Loading,
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
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
    },
  },
  watch: {
    $route() {
      this.posts = []
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
    pageChangeFn() {
      this.posts = []
      this.loading = true
      this.getPostsFn()
    },
    async getPostsCountFn() {
      this.totalCount = this.categoryNumber
        ? this.$store.state.github.currentCategory.open_issues
        : await this.getPostsCountAction().catch((err) => {
          this.$message({
            content: '获取文章总数失败',
            type: 'error',
          })
          throw new Error(err)
        })
    },
    async getPostsFn() {
      this.loading = true
      let res = []
      if (this.categoryNumber) {
        const filter = `&milestone=${this.categoryNumber}`
        res = await this.getPostsAction({ page: `${this.currentPage}`, filter }).catch((err) => {
          this.$message({
            content: '获取文章列表失败',
            type: 'error',
          })
          throw new Error(err)
        }).finally(() => {
          this.loading = false
        })
      }
      else {
        res = await this.getPostsAction({ page: `${this.currentPage}` }).catch((err) => {
          this.$message({
            content: '获取文章列表失败',
            type: 'error',
          })
          throw new Error(err)
        }).finally(() => {
          this.loading = false
        })
      }
      const ids = res.map(post => post.id)
      if (localStorage.getItem('configLeancloud') === 'yes'){
        const hot = await this.queryHotAction({ ids }).catch((err) => {
          this.$message({
            content: '获取文章热度失败',
            type: 'error',
          })
          throw new Error(err)
        })
        if (hot) {
          this.posts = res.map((post) => {
            const hotNum = hot[post.id] || 1
            post.hot = hotNum
            return post
          })
        }
      } else {
        this.posts = res.map((post) => {
          post.hot = 1
          return post
        })
      }
      
      this.$store.commit('github/setAllPosts', res)
    },
  },
}
</script>

<template>
  <div class="post-list">
    <div class="posts-wrap">
      <Loading v-if="loading" />
      <transition name="from-bottom">
        <div v-if="!loading" class="posts">
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
      </transition>
    </div>
    <Pagination
      :current-page.sync="currentPage"
      :total="totalCount"
      :page-size="$config.pageSize"
      @pageChange="pageChangeFn"
    />
  </div>
</template>

<style lang="scss" scoped>
.from-bottom-enter-active {
  transition: all 0.3s ease;
}
.from-bottom-enter {
  opacity: 0;
  transform: translateY(30px);
}
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
