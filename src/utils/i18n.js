/**
 * 获取当前语言
 * @returns {string} en-US | zh-CN
 */
export function getLocale() {
  const checkForZh = (lang) => lang && lang.indexOf('zh') > -1

  const localeFromStorage = localStorage.getItem('locale')
  if (checkForZh(localeFromStorage)) {
    document.documentElement.lang = 'zh-CN'
    return 'zh-CN'
  } else if (localeFromStorage) {
    document.documentElement.lang = 'en-US'
    return 'en-US'
  }

  if (navigator.language) {
    const language = checkForZh(navigator.language) ? 'zh-CN' : 'en-US'
    document.documentElement.lang = language
    return language
  }

  document.documentElement.lang = 'en-US'
  return 'en-US'
}
