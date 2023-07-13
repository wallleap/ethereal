import config from '@/config'
import { github } from '@/utils/request'

const { username, repository } = config
const ACCESS_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

export function searchPostsAPI({ q = '' }) {
  return github({
    url: `https://api.github.com/search/issues?q=${q}+state:open+repo:${username}/${repository}&sort=created&order=asc&per_page=10&page=1`,
    headers: {
      Authorization: `token ${ACCESS_TOKEN}`,
    },
  })
}
