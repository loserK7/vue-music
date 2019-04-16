const mutations = {
  UPDATE_MUSIC_LIST (state, data) {
    state.musicList = data
  },
  UPDATE_FULL_SCREEN (state) {
    state.fullScreen = !state.fullScreen
  }
}

export default mutations
