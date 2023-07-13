import { searchPostsAPI } from '@/api/github'

function state() {
  return {
  }
}

const actions = {
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
}

const mutations = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
