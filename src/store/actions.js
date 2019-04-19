const actions = {
  insertPlayList ({state, commit}, song) {
    state.playList.forEach(item => {
      if (item.id === song.id) {
        return false
      }
    })
    commit('INSERT_PLAY_LISH', song)
  }
}

export default actions
