import {
  increaseHot,
  queryHot,
  queryLike,
  visitorStatistics,
} from '@/api/leancloud.js'

const actions = {
  /**
   * 查询文章热度
   * @param {*} context
   * @param {*} param1
   * @returns promise
   */
  async queryHotAction(context, { ids }) {
    return await queryHot(ids)
  },
  /**
   * 增加文章热度
   * @param {*} context
   * @param {*} param1
   * @returns promise
   */
  async increaseHotAction(context, { post }) {
    return await increaseHot(post)
  },
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
