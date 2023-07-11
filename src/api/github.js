import { github } from '@/utils/request.js'

export function getRepos(params) {
  return github.get('/users/wallleap/repos', { params })
}
