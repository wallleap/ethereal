import axios from 'axios'

const GITHUB_API = 'https://api.github.com'
const POETRY_API = 'https://v2.jinrishici.com'

export const github = axios.create({
  baseURL: GITHUB_API,
  timeout: 10000,
})

export const poetry = axios.create({
  baseURL: POETRY_API,
  timeout: 10000,
})
