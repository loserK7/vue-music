<template>
  <div class="player-page">
    <div class="player-contend" v-show="fullScreen">
      <div class="fliter">
      </div>
      <div class="player-top">
        <div class="icon">
          <i class="iconfont icon-xiangzuo"></i>
        </div>
        <div class="title-contend">
          <h1 class="song-title">1</h1>
          <h2 class="song-singer">2</h2>
        </div>
      </div>
      <div class="player-middle">
        <div class="cdplay">
          <div class="img-box" :class="[playState?'play':'stop']">
            <img src="http://p3.music.126.net/xUAfdMHdXhu3BmO4g8nOYA==/109951163573311341.jpg" alt="">
          </div>
        </div>
      </div>
      <div class="player-bottom">
        <div class="bottom-wrapper">
          <span class="time timel">0:00</span>
          <progress-bar class="progress-bar-wrapper"></progress-bar>
          <span class="time timer">0:00</span>
        </div>
      </div>
    </div>
    <play-bar v-show="!fullScreen"></play-bar>
  </div>
</template>

<script>
import PlayBar from '@/components/PlayBar'
import ProgressBar from '@/components/progressBar'
import { mapState } from 'vuex'
export default {
  components: {
    PlayBar,
    ProgressBar
  },
  data () {
    return {
      playState: true
    }
  },
  computed: {
    ...mapState(['fullScreen'])
  }
}
</script>

<style lang="stylus">
.player-page {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #F2F3F4;

  .fliter {
    position: absolute;
    height: 100%;
    width: 100%;
    background: black;
    opacity: 0.4;
  }

  .player-top {
    position: relative;
    height: 40px;
    padding: 10px;
    display: flex;

    .icon {
      color: #fff;
      display: inline-block;
      padding: 10px;
      transform: rotate(-90deg);

      .iconfont {
        font-size: 20px;
      }
    }

    .title-contend {
      flex: 1;
      color: #fff;
      margin-right: 40px;

      .song-title, .song-singer {
        text-align: center;
      }

      .song-title {
        line-height: 30px;
        font-size: 24px;
      }

      .song-singer {
        line-height: 20px;
        font-size: 14px;
      }
    }
  }

  .player-middle {
    position: absolute;
    top: 80px;
    bottom: 160px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .cdplay {
      width: 280px;
      height: 280px;

      .img-box {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        border: 15px solid rgba(255, 255, 255, 0.1);

        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          border: 10px;
        }

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .player-bottom {
    position: absolute;
    bottom: 100px;
    width: 100%;
    margin: 0 auto;

    .bottom-wrapper {
      width: 80%;
      margin: 0 auto;
      display: flex;

      .progress-bar-wrapper {
        flex: 1;
        padding:0 5px;
      }

      .time {
        font-size: 10px;
        flex: 0 0 30px;
        line-height: 30px;
        width: 30px;
        color: #f1f1f1;

        &.timel {
          text-align: left;
        }

        &.timer {
          text-align: right;
        }
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
