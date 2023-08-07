import store from '@/store'

/**
 * 处理控制台出错，例如图片加载失败
 * @param {*} img 图片地址
 */
export function handleError(img) {
  window.addEventListener('error', (e) => {
    const target = e.target
    const tagName = target.tagName
    const times = Number(target.dataset.times) || 0
    const TIMES = 3
    if (tagName.toUpperCase() === 'IMG') {
      if (times >= TIMES) {
        target.src = 'data:image/svg+xml,%3Csvg class=\'icon\' viewBox=\'0 0 1024 1024\' xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cpath d=\'M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z\' fill=\'%23e6e6e6\'/%3E%3Cpath d=\'M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z\' fill=\'%23e6e6e6\'/%3E%3C/svg%3E'
      }
      else {
        target.dataset.times = times + 1
        target.src = img
      }
    }
  }, true)
}

export function setTheme() {
  const html = document.documentElement
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  function listenThemeChange(e) {
    const prefersDarkMode = e.matches
    if (prefersDarkMode)
      store.commit('style/setTheme', 'dark')
    else
      store.commit('style/setTheme', 'light')
  }
  if (typeof media.addEventListener === 'function')
    media.addEventListener('change', listenThemeChange)
  else if (typeof media.addListener === 'function')
    media.addListener(listenThemeChange)
  html.setAttribute('data-theme', store.state.style.theme)
}

/**
 * 解析时间为 xxx 前
 * @param {*} date 时间戳/字符串/Date对象/时间格式字符串
 * @returns string 1年前/1个月前/1天前/1小时前/1分钟前/1秒前
 */
export function parseDate(date) {
  const c = new Date()
  const d = new Date(date) || c
  const diff = c.getTime() - d.getTime()
  const map = [
    { text: '年前', value: 1000 * 60 * 60 * 24 * 365 },
    { text: '个月前', value: 1000 * 60 * 60 * 24 * 30 },
    { text: '天前', value: 1000 * 60 * 60 * 24 },
    { text: '小时前', value: 1000 * 60 * 60 },
    { text: '分钟前', value: 1000 * 60 },
    { text: '秒前', value: 1000 },
  ]
  let result = ''
  for (let i = 0; i < map.length; i++) {
    const { text, value } = map[i]
    const n = Math.floor(diff / value)
    if (n > 0) {
      result = `${n} ${text}`
      break
    }
  }
  return result
}

/**
 * 格式化时间
 * @param {*} time 时间戳/字符串/Date对象/时间格式字符串
 * @returns string yyyy-mm-dd hh:mm:ss
 */
export function formatTime(time) {
  const date = new Date(time)
  // 格式化时间为 yyyy-mm-dd hh:mm:ss
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formatNumber = n => n.toString().padStart(2, '0')
  const t = [year, month, day].map(formatNumber).join('-')
  const h = [date.getHours(), date.getMinutes(), date.getSeconds()].map(formatNumber).join(':')
  return `${t} ${h}`
}

/**
 * 设置当前滚动到的目录
 * @param {*} selector 目录中 a 标签的选择器
 * @returns currentLink 当前滚动到的目录的索引
 */
export function updateCurrentLink(selector) {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const tocLinks = document.querySelectorAll(selector)
  const offsetTopList = [scrollTop]
  let currentLink = 0
  tocLinks.forEach((item) => {
    const id = item.getAttribute('href')
    const el = document.querySelector(id)
    const offsetTop = el.getBoundingClientRect().top + window.pageYOffset
    offsetTopList.push(offsetTop)
  })
  offsetTopList.sort((a, b) => {
    return a - b
  })
  currentLink = offsetTopList.findIndex((item, index) => {
    return item <= scrollTop && offsetTopList[index + 1] > scrollTop
  })
  if (scrollTop >= offsetTopList[offsetTopList.length - 1])
    currentLink = offsetTopList.length - 2
  if (scrollTop <= offsetTopList[0])
    currentLink = 0
  tocLinks.forEach((item) => {
    item.classList.remove('active')
  })
  tocLinks[currentLink]?.classList.add('active')
  return currentLink
}

/**
 * 将 hex 颜色值转换为 hsl 颜色值
 * @param {*} hex 颜色值 #ffffff
 * @returns h, s%, l%
 */
export function hexToHsl(hex) {
  let r = Number.parseInt(hex.substring(1, 3), 16)
  let g = Number.parseInt(hex.substring(3, 5), 16)
  let b = Number.parseInt(hex.substring(5, 7), 16)

  r /= 255
  g /= 255
  b /= 255

  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)

  let h
  let s
  let l = (max + min) / 2

  if (max === min) {
    h = 0
    s = 0
  }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h}, ${s}%, ${l}%`
}
/**
 * 处理文章归档
 * @param {*} archives
 * @returns
 */
export function parseArchives(archives) {
  const map = new Map()
  archives.forEach((archive) => {
    const year = archive.created_at.slice(0, 4)
    const key = `${year}`
    if (!map.has(key))
      map.set(key, [])
    map.get(key).push(archive)
  })
  return Object.fromEntries(map)
}
/**
 * 对归档进行排序
 * @param {*} archiveMap
 * @returns
 */
export function sortArchiveMap(archiveMap) {
  Object.keys(archiveMap).forEach((key) => {
    return archiveMap[key].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  })
  return archiveMap
}
