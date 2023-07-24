import {
  queryLike,
  visitorStatistics,
} from '@/api/leancloud.js'

const actions = {
  /**
   * 获取点赞数
   * @param {*} context
   * @param {*} payload
   * @returns promise
   */
  async queryLikeAction(context, payload) {
    return await queryLike(payload)
  },
  /**
   * 统计访问来源
   * @param {*} context
   * @param {*} payload
   */
  async visitorStatisticsAction(context, payload) {
    await visitorStatistics(payload)
  },
}

export default {
  namespaced: true,
  actions,
}
