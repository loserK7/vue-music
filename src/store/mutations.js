const mutations = {
  UPDATE_MUSIC_LIST (state, data) {
    state.musicList = data
  },
  UPDATE_FULL_SCREEN (state) {
    state.fullScreen = !state.fullScreen
  },
  UPDATE_PLAY_LIST (state, music) {
    if (state.playList.indexOf(music) === -1) {
      state.playList.unshift(music)
    }
  },
  UPDATE_SHOW_PLAY_BAR (state, flag) {
    state.showPlayBar = flag
  },
  UPDATE_PLAYING_SONG (state, song) {
    state.playingSong = song
  },
  UPDATE_AUDIO_SONG (state, song) {
    state.audio = song
  },
  UPDATE_PLAY_STATE (state) {
    state.playState = !state.playState
  }
}

export default mutations
