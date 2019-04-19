const mutations = {
  UPDATE_MUSIC_LIST (state, data) {
    state.musicList = data
  },
  UPDATE_FULL_SCREEN (state) {
    state.fullScreen = !state.fullScreen
  },
  UPDATE_PLAY_LIST (state, music) {
    state.playList = music
  },
  INSERT_PLAY_LISH (state, song) {
    state.playList.unshift(song)
  },
  UPDATE_SHOW_PLAY_BAR (state, flag) {
    state.showPlayBar = flag
  },
  UPDATE_PLAYING_SONG (state, song) {
    console.log('mutations', song)
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
