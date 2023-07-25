import { poetry } from '@/utils/request.js'

export function getPoetryTokenAPI() {
  return poetry({
    url: '/token',
  })
}

export function getPoetryAllAPI(xUserToken) {
  return poetry({
    url: '/one.json',
    params: {
      'client': 'npm-sdk/1.0',
      'X-User-Token': xUserToken,
    },
  })
}
