function state() {
  return {
    theme: 'light',
    currentMenu: {},
    currentComment: 'utterances',
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
  setCurrentComment(state, currentComment) {
    state.currentComment = currentComment
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
