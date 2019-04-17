<template>
  <div id="app" ref="app">
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
    <play-bar v-show="showPlayBar"></play-bar>
  </div>
</template>

<script>
import Tab from '@/components/tab'
import PlayBar from '@/components/PlayBar'
import Player from '@/views/Player'

import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    Tab,
    Player,
    PlayBar
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['showPlayBar', 'audioSong'])
  }
}
</script>

<style lang="stylus">
#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgba(188, 188, 188, 0.15);
}
</style>
