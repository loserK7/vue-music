<template>
  <div id="app" ref="app">
    <tab></tab>
    <router-view />
  </div>
</template>

<script>
import Tab from '@/components/tab'
export default {
  name: 'App',
  components: {
    Tab
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
  background-color: rgba(188, 188, 188, .15);
}
</style>
