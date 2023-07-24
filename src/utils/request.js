import axios from 'axios'

const GITHUB_API = 'https://api.github.com'
const POETRY_API = 'https://v2.jinrishici.com'

const GitHub_Arr = import.meta.env.VITE_GITHUB_TOKEN?.split(', ')
const GITHUB_TOKEN = GitHub_Arr.join('')

export const github = axios.create({
  baseURL: GITHUB_API,
  timeout: 10000,
})

/**
 * GitHub GraphQL API
 */
export const githubGraphql = axios.create({
  baseURL: `${GITHUB_API}/graphql`,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
})

export const poetry = axios.create({
  baseURL: POETRY_API,
  timeout: 10000,
})

/**
 * 请求拦截器
 * 为每个 GitHubAPI 请求添加 token
 * @param {Object} config
 * @returns {Object}
 */
github.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  return config
}, (error) => {
  return Promise.reject(error)
})
