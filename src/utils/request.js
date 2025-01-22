import axios from 'axios'

const GITHUB_API = 'https://api.github.com'
const POETRY_API = 'https://v2.jinrishici.com'

let GITHUB_TOKEN = ''
const TEMP_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
if (TEMP_TOKEN === '')
  console.error('GITHUB_TOKEN 未配置')
else if (!TEMP_TOKEN.includes(', '))
  GITHUB_TOKEN = ''
else
  GITHUB_TOKEN = TEMP_TOKEN.split(', ').join('')

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
  if (GITHUB_TOKEN === '' || !GITHUB_TOKEN.match(/^github_/))
    return Promise.reject(new Error('GITHUB_TOKEN 未配置或格式错误'))
  config.headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  return config
}, (error) => {
  return Promise.reject(error)
})
