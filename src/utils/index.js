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
