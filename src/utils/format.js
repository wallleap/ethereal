import fm from 'front-matter'
import { formatTime, parseDate } from '@/utils'
import config from '@/config'

const annotationRegex = /^(.+)?\r\n\s*(.+)?\r\n/
const firstLineReg = /^(.+)?\s+/
const frontMatterReg = /^---\s+.*\s+---/s
const coverRegex = /^\[(.+)\].*(http.*(?:jpg|jpeg|png|gif|webp))/

/**
 * 格式化文章
 * @param {*} post 文章对象
 * post.body 文章内容有三种情况
 * - 没有注解和front-matter，直接是文章内容
 * - 第一行就是注释 #[author](cover)，不需要处理文章内容
 * - 开头是 front-matter，文章内容在 front-matter 之后
 * @returns Object
 */
export function formatPost(post) {
  const { created_at, updated_at, body } = post
  post.created_by = parseDate(created_at)
  post.updated_by = parseDate(updated_at)
  post.created_at = formatTime(created_at)
  post.updated_at = formatTime(updated_at)
  if (firstLineReg.test(post.body))
    post.summary = firstLineReg.exec(post.body)[1]
  if (annotationRegex.test(body)) {
    const result = annotationRegex.exec(body)
    if (result[2])
      post.summary = result[2]
    if (coverRegex.test(result[1])) {
      const cover = coverRegex.exec(result[1])
      if (cover && cover.length > 2) {
        if (cover[1].startsWith('作者：') || cover[1].startsWith('作者:')) {
          cover[1] = cover[1].substring(3)
          post.author = cover[1].trim()
        }
        else {
          post.author = config.author
        }
        post.cover = cover[2]
      }
    }
  }
  if (frontMatterReg.test(body)) {
    const frontMatter = fm(body)
    if (frontMatter.attributes) {
      const { title, author, cover, date, updated, comment } = frontMatter.attributes
      post.title = title || post.title
      post.author = author || post.author || config.author
      post.cover = cover || config.defaultCover
      post.comment = comment || post.comment
      post.created_at = formatTime(date || post.created_at)
      post.created_by = parseDate(date || post.created_at)
      post.updated_at = formatTime(updated || post.updated_at)
      post.updated_by = parseDate(updated || post.updated_at)
    }
    if (frontMatter.body) {
      post.body = frontMatter.body
      if (firstLineReg.test(frontMatter.body))
        post.summary = firstLineReg.exec(frontMatter.body)[1]
    }
    return post
  }
  return post
}

export function formatFriend(friend) {
  if (!friend || !friend.body)
    return []
  const { body } = friend
  const res = body.split('\r\n')
  res.forEach((item) => {
    friend[item.split(': ')[0].trim()] = item.split(': ')[1].trim()
  })
  return friend
}
