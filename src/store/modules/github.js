import {
  getAboutAPI,
  getCategoriesAPI,
  getFriendsAPI,
  getFriendsCountAPI,
  getInspirationAPI,
  getInspirationCountAPI,
  getPostAPI,
  getPostsAPI,
  getPostsCountAPI,
  getTagsAPI,
  searchPostsAPI,
} from '@/api/github.js'
import { formatFriend, formatPost } from '@/utils/format.js'

function state() {
  return {
    allPosts: [],
    categories: [],
    currentCategory: {},
    currentPage: 1,
    currentLink: 0,
  }
}

const actions = {
  /**
   * 获取文章总数
   * @returns count
   */
  async getPostsCountAction() {
    const res = await getPostsCountAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.data?.repository?.issues.totalCount || 0
  },
  /**
   * 获取友链总数
   * @returns count
   */
  async getFriendsCountAction() {
    const res = await getFriendsCountAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.data?.repository?.issues.totalCount || 0
  },
  /**
   * 获取灵感总数
   * @returns count
   */
  async getInspirationCountAction() {
    const res = await getInspirationCountAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data.data?.repository?.issues.totalCount || 0
  },
  /**
   * 搜索文章
   * @param {*} context
   * @param {*} params q: 搜索关键词
   * @returns { searchCount, posts }
   */
  async searchPostsAction(context, params) {
    const res = await searchPostsAPI(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const searchCount = res.data.total_count
    const posts = res.data.items.map((post) => {
      return {
        id: post.id,
        number: post.number,
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
    const res = await getCategoriesAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data
  },
  /**
   * 获取文章标签
   * @returns Object
   */
  async getTagsAction() {
    const filterLabel = ['Inspiration', 'Friend', 'Book', 'About']
    const res = await getTagsAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const data = res.data.filter(o => !filterLabel.includes(o.name))
    return data
  },
  /**
   * 获取文章列表
   * @param {*} context
   * @param {*} params page, pageSize, filter
   * @returns posts
   */
  async getPostsAction(context, params) {
    const res = await getPostsAPI(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const posts = res.data.map((post) => {
      return {
        number: post.number,
        id: post.id,
        title: post.title,
        url: post.url,
        created_at: post.created_at,
        updated_at: post.updated_at,
        body: post.body,
        tags: post.labels,
        tags_url: post.labels_url,
        category: post.milestone,
        hot: 1,
        comment: true,
      }
    })
    posts.map(formatPost)
    return posts
  },
  /**
   * 获取文章列表
   * @param {*} context
   * @param {*} params page, pageSize, filter
   * @returns posts
   */
  async getFriendsAction(context, params) {
    const res = await getFriendsAPI(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    const friends = res.data.map((friend) => {
      return {
        number: friend.number,
        id: friend.id,
        title: friend.title,
        origin_url: friend.url,
        created_at: friend.created_at,
        updated_at: friend.updated_at,
        body: friend.body,
        labels: friend.labels,
        labels_url: friend.labels_url,
        category: friend.milestone,
      }
    })
    friends.map(formatFriend)
    return friends
  },
  /**
   * 获取灵感列表
   * @param {*} context
   * @param {*} params page, pageSize
   * @returns Promise
   */
  async getInspirationAction(context, params) {
    const res = await getInspirationAPI(params).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data
  },
  /**
   * 获取文章详情
   * @param {*} context
   * @param {*} param1 number 文章 number
   * @returns post
   */
  async getPostAction(context, { number }) {
    const res = await getPostAPI(number).catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    let post = res.data
    post = {
      number: post.number,
      id: post.id,
      title: post.title,
      url: post.url,
      created_at: post.created_at,
      updated_at: post.updated_at,
      body: post.body,
      tags: post.labels,
      tags_url: post.labels_url,
      category: post.milestone,
      hot: 1,
      comment: true,
    }
    return formatPost(post)
  },
  async getAboutAction() {
    const res = await getAboutAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')
    return res.data[0]
  },
}

const mutations = {
  setAllPosts(state, posts) {
    state.allPosts = posts
  },
  setCategories(state, categories) {
    state.categories = categories
  },
  setCurrentCategory(state, category) {
    state.currentCategory = category
  },
  setCurrentPage(state, currentPage) {
    state.currentPage = currentPage
  },
  setCurrentLink(state, currentLink) {
    state.currentLink = currentLink
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
