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
  INSERT_PLAY_LIST (state, song) {
    state.playList.unshift(song)
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
  },
  DELETE_PLAY_PIST (state, index) {
    state.playList.splice(index, 1)
  },
  UPDATE_PLAY_MODE (state, mode) {
    state.playMode = mode
  }
}
export default mutations
