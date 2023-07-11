function state() {
  return {
    poetryToken: '',
    poetryTitle: '',
    poetryContent: [],
  }
}

const mutations = {
  setPoetryToken(state, poetryToken) {
    state.poetryToken = poetryToken
  },
  setPoetryTitle(state, poetryTitle) {
    state.poetryTitle = poetryTitle
  },
  setPoetryContent(state, poetryContent) {
    state.poetryContent = poetryContent
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
