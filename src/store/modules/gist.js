import { getGistAPI, updateGistAPI } from '@/api/gist.js'
import { validJSON } from '../../utils/validJSON'

const COUNTER_FILE = 'counter.json'
const VISITOR_FILE = 'visitor.json'
const LIKE_FILE = 'like.json'
const COUNTER_INCREMENT = 1
const VISITOR_INCREMENT = 1
const LIKE_INCREMENT = 1

function state() {
  return {
    counter: [],
    visitor: [],
    like: {},
  }
}

const actions = {
  /**
   * 获取gist文件内容
   * @returns Promise
   */
  async getGistAction() {
    const res = await getGistAPI().catch((err) => {
      throw new Error(err)
    })
    if (res.status !== 200)
      return Promise.reject(res || 'error')

    state.counter = res.data?.files?.[COUNTER_FILE]?.content || []
    state.visitor = res.data?.files?.[VISITOR_FILE]?.content || []
    if (validJSON(res.data?.files?.[LIKE_FILE]?.content)) {
      state.like = JSON.parse(res.data?.files?.[LIKE_FILE]?.content)
    } else {
      state.like = {}
    }
    return state
  },
  /**
   * 更新文章热度
   * @param {*} param0 postNumber, title
   * @returns Promise
   */
  async updateCounterAction(context, { postNumber, title }) {
    postNumber = Number(postNumber)
    const gistState = await actions.getGistAction()

    let counters = [] // { id, site, times, title, createdAt, updatedAt }
    if (validJSON(gistState.counter)) {
      counters = JSON.parse(gistState.counter)
    }
    const counterIndex = counters.findIndex((item, index, arr) => item.id === postNumber)

    if (counterIndex === -1) {
      counters.push({ id: postNumber, site: window.location.href, times: 1, title, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    } else {
      counters[counterIndex].times += COUNTER_INCREMENT
      counters[counterIndex].updatedAt = new Date().toISOString()
    }

    await updateGistAPI({
      files: {
        [COUNTER_FILE]: {
          content: JSON.stringify(counters),
        }
      },
    })
    state.counter = counters

    return counters
  },
  /**
   * 更新访客数
   * @returns Promise
   */
  async updateVisitorAction(context, { referrer }) {
    referrer = referrer.trim()
    const gistState = await actions.getGistAction()
    let visitor = [] // { referrer, times, createdAt, updatedAt }
    if (validJSON(gistState.visitor)) {
      visitor = JSON.parse(gistState.visitor)
    }
    const visitorIndex = visitor.findIndex((item, index, arr) => item.referrer === referrer)
    if (visitorIndex === -1) {
      visitor.push({ referrer, times: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    } else {
      visitor[visitorIndex].times += VISITOR_INCREMENT
      visitor[visitorIndex].updatedAt = new Date().toISOString()
    }
    await updateGistAPI({
      files: {
        [VISITOR_FILE]: {
          content: JSON.stringify(visitor),
        }
      },
    })
    state.visitor = visitor
    return visitor
  },
  /**
   * 更新点赞数
   * @returns Promise
   */
  async updateLikeAction() {
    const gistState = await actions.getGistAction()
    let like = gistState.like // { count, createdAt, updatedAt }
    if (!like || !like.count) {
      like = { count: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    } else {
      like.count += LIKE_INCREMENT
      like.updatedAt = new Date().toISOString()
    }
    await updateGistAPI({
      files: {
        [LIKE_FILE]: {
          content: JSON.stringify(like),
        }
      },
    })
    state.like = like
    return like.count
  }
}

export default {
  namespaced: true,
  state,
  actions,
}
