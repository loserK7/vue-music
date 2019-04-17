<template>
  <transition name="normal">

    <div class="play-bar">
      <div class="bar-left" @click="play">
        <div class="img play" :class="[playState?'':'pause']">
          <img :src="playingSong.image" alt="">
        </div>
        <div class="info">
          <div class="song-name">
            <span>{{playingSong.album}}</span>
          </div>
          <div class="singer-name">
            <span>{{playingSong.singer}}</span>
          </div>
        </div>
      </div>
      <div class="bar-right">
        <div class="play" @click="changePlayState">
          <i class="iconfont " :class="[playState?'icon-zanting':'icon-bofang']"></i>
        </div>
        <div class="menu">
          <i class="iconfont icon-menu"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },

  computed: {
    ...mapState(['playingSong', 'playState'])
  },
  methods: {
    play () {
      this.$store.commit('UPDATE_FULL_SCREEN')
      this.$store.commit('UPDATE_SHOW_PLAY_BAR', false)
    },
    changePlayState () {
      this.$store.commit('UPDATE_PLAY_STATE')
    }
  }
}
</script>

<style lang="stylus">
.normal-enter-active, &.normal-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

.normal-enter, &.normal-leave-to {
  opacity: 0;
}

.play-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.85);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;

  .bar-left {
    flex: 2;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;

      &.play {
        animation: rotate 20s linear infinite;
      }

      &.pause {
        animation-play-state: paused;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      flex: 1;
      height: 40px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .bar-right {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .play, .menu {
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      text-align: right;

      .iconfont {
        font-size: 28px;
      }

      .icon-menu {
        font-size: 22px;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
