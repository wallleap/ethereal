import config from '@/config'
import { github, githubGraphql } from '@/utils/request'

const { username, repository } = config
const blog = `/repos/${username}/${repository}`

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
 * 搜索文章，返回文章列表
 * @param {*} param0 q: 搜索关键词
 * @returns Promise
 */
export function searchPostsAPI({ q = '' }) {
  return github({
    url: `/search/issues?q=${q}+state:open+repo:${username}/${repository}&sort=created&order=asc&per_page=10&page=1`,
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
 * 获取文章详情
 * @param {*} number 文章 number
 * @returns Promise
 */

export function getPostAPI(number) {
  return github({
    url: `${blog}/issues/${number}?state=open`,
  })
}
