import { getCategoriesAPI, getPostsAPI, getPostsCountAPI, searchPostsAPI } from '@/api/github.js'
import { formatPost } from '@/utils/format.js'

function state() {
  return {
    categories: [],
    currentCategory: {},
    currentPage: 1,
  }
}

const actions = {
  /**
   * 获取文章总数
   * @returns count
   */
  async getPostsCountAction() {
    const res = await getPostsCountAPI()
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.data.repository.issues.totalCount || 0
  },
  /**
   * 搜索文章
   * @param {*} context
   * @param {*} params q: 搜索关键词
   * @returns { searchCount, posts }
   */
  async searchPostsAction(context, params) {
    const res = await searchPostsAPI(params)
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const searchCount = res.data.total_count
    const posts = res.data.items.map((post) => {
      return {
        id: post.id,
        title: post.title,
        url: post.url,
      }
    })
    return { searchCount, posts }
  },
  /**
   * 获取文章分类
   * @returns Object
   */
  async getCategoriesAction() {
    const res = await getCategoriesAPI()
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data
  },
  /**
   * 获取文章列表
   * @param {*} context
   * @param {*} params page, pageSize, filter
   * @returns posts
   */
  async getPostsAction(context, params) {
    const res = await getPostsAPI(params)
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const posts = res.data.map((post) => {
      return {
        id: post.id,
        title: post.title,
        url: post.url,
        created_at: post.created_at,
        updated_at: post.updated_at,
        body: post.body,
        tags: post.labels,
        tags_url: post.labels_url,
        categories: post.milestone,
        hot: 1,
        comment: true,
      }
    })
    posts.map(formatPost)
    return posts
  },
}

const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  },
  setCurrentCategory(state, category) {
    state.currentCategory = category
  },
  setCurrentPage(state, currentPage) {
    state.currentPage = currentPage
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
