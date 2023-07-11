import { poetry } from '@/utils/request.js'
import store from '@/store'

export function getPoetryTokenAPI() {
  return poetry({
    url: '/token',
  })
}

export function getPoetryAllAPI() {
  return poetry({
    url: '/one.json',
    params: {
      'client': 'npm-sdk/1.0',
      'X-User-Token': store.state.poetry.poetryToken,
    },
  })
}
