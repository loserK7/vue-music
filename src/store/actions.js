const actions = {
  insertPlayList ({ state, commit }, song) {
    let flag = true
    state.playList.forEach(item => {
      if (item.id === song.id) {
        flag = false
      }
    })
    if (flag) {
      commit('INSERT_PLAY_LIST', song)
    }
  },
  deletedPlayList ({ state, commit }, song) {
    state.playList.forEach((item, index) => {
      if (item.id === song.id) {
        commit('DELETE_PLAY_PIST', index)
      }
    })
  }
}

export default actions
