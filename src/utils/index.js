import store from '@/store'

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
