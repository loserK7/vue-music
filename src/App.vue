<template>
  <div id="app" ref="app">
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Tab from '@/components/tab'

export default {
  name: 'App',
  components: {
    Tab
  },
  data () {
    return {
      showPlay: false
    }
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
