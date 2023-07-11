function state() {
  return {
    theme: 'light',
    currentMenu: {},
  }
}

const mutations = {
  setTheme(state, theme) {
    state.theme = theme
    document.documentElement.setAttribute('data-theme', this.state.style.theme)
  },
  setCurrentMenu(state, currentMenu) {
    state.currentMenu = currentMenu
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
