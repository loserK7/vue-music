<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span>歌手</span>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      index: 'rec'
    }
  }
}
</script>

<style lang="stylus">
#app {
  .tab {
    box-sizing: border-box;
    display: flex;
    text-align: center;
    height: 44px;
    line-height: 25px;
    padding: 2px 0;
    background-color: #d44439;

    .tab-item {
      flex: 1;
      text-align: center;
      margin: 10px 0;
      box-sizing: border-box;
      border-right: 1px solid rgba(109, 109, 109, 0.4);

      &:last-child {
        border-right: 0;
      }

      &.router-link-active {
        span {
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }
}
</style>
