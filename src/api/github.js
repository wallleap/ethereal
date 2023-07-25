import config from '@/config'
import { github, githubGraphql } from '@/utils/request'

const { username, repository, friendsRepo } = config
const blog = `/repos/${username}/${repository}`
const friends = `/repos/${username}/${friendsRepo}`

/**
 * 获取文章总数
 * @returns {Promise}
 */
export function getPostsCountAPI() {
  return githubGraphql({
    method: 'post',
    data: {
      query: `
        query {
          repository(owner: "${username}", name: "${repository}") {
            issues(states: OPEN) {
              totalCount
            }
          }
        }
      `,
    },
  })
}

/**
 * 获取友链总数
 * @returns {Promise}
 */
export function getFriendsCountAPI() {
  return githubGraphql({
    method: 'post',
    data: {
      query: `
        query {
          repository(owner: "${username}", name: "${friendsRepo}") {
            issues(states:CLOSED) {
              totalCount
            }
          }
        }
      `,
    },
  })
}

/**
 * 获取灵感总数
 * @returns {Promise}
 */
export function getInspirationCountAPI() {
  return githubGraphql({
    method: 'post',
    data: {
      query: `
        query {
          repository(owner:"${username}", name: "${repository}") {
            issues(states:CLOSED, labels: ["Inspiration"]) {
              totalCount
            }
          }
        }
      `,
    },
  })
}

/**
 * 搜索文章，返回文章列表
 * @param {*} param0 q: 搜索关键词
 * @returns Promise
 */
export function searchPostsAPI({ q = '' }) {
  return github({
    url: `/search/issues?q=${q}+is:issue+state:open+repo:${username}/${repository}&sort=created&order=asc&per_page=10&page=1`,
  })
}

/**
 * 获取文章分类
 * @returns {Promise}
 */
export function getCategoriesAPI() {
  return github({
    url: `${blog}/milestones?state=open&sort=created&direction=asc&per_page=10&page=1`,
  })
}

/**
 * 获取文章标签
 * @returns {Promise}
 */
export function getTagsAPI() {
  return github({
    url: `${blog}/labels?per_page=100&page=1`,
  })
}

/**
 * 获取文章列表
 * @param {*} param0 page, pageSize, filter
 * @returns Promise
 */
export function getPostsAPI({ page = 1, pageSize = 12, filter = '' }) {
  return github({
    url: `${blog}/issues?state=open&page=${page}&per_page=${pageSize}${filter}`,
  })
}

/**
 * 获取友链列表
 * @param {*} param0 page, pageSize, filter
 * @returns Promise
 */
export function getFriendsAPI({ page = 1, pageSize = 12, filter = '' }) {
  return github({
    url: `${friends}/issues?state=closed&page=${page}&per_page=${pageSize}${filter}`,
  })
}

/**
 * 获取灵感列表
 * @param {*} param0 page 当前页码 pageSize 每页数量
 * @returns Promise
 */
export function getInspirationAPI({ page = 1, pageSize = 12 }) {
  return github({
    url: `${blog}/issues?state=closed&labels=inspiration&page=${page}&per_page=${pageSize}`,
  })
}

/**
 * 获取文章详情
 * @param {*} number 文章 number
 * @returns Promise
 */
export function getPostAPI(number) {
  return github({
    url: `${blog}/issues/${number}?state=open`,
  })
}

export function getAboutAPI() {
  return github({
    url: `${blog}/issues?state=closed&labels=About`,
  })
}
