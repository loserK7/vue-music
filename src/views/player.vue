<template>
  <div>
    <transition name="normal">
      <div class="player-page" v-show="fullScreen">
        <div class="player-contend">
          <div class="fliter">
          </div>
          <div class="player-top">
            <div class="icon" @click="hide">
              <i class="iconfont icon-xiangzuo"></i>
            </div>
            <div class="title-contend">
              <h1 class="song-title">{{playingSong.album}}</h1>
              <h2 class="song-singer">{{playingSong.singer}}</h2>
            </div>
          </div>
          <div class="player-middle" @click="changeCurrentShow">
            <transition name="cdplay" mode="out-in">
              <div class="cdplay" v-show="currentShow==='cd'">
                <div class="cdplay-wrapper">
                  <div class="img-box play" :class="[playState?'':'pause']">
                    <img :src="playingSong.image" alt="">
                  </div>
                </div>
              </div>
            </transition>
            <transition name="lyric" mode="out-in">
              <div class="lyric" v-show="currentShow=='lyric'">
                <div class="lyric-wrapper" ref="lyricWrapper">
                  <div>
                    <div class="currentLyric" v-if="currentLyric">
                      <p class="lyric-text" v-for="(line,index) in currentLyric.lines" :key="index">
                        {{line.txt}}
                      </p>
                    </div>
                    <div>
                      <p class="lyric-text">暂无歌词</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="player-bottom">
            <div class="bottom-wrapper">
              <span class="time timel">{{format(currentTime)}}</span>
              <progress-bar class="progress-bar-wrapper" ref="progressBar" :percentage="percentage" @progressClick="progressClick" @progressTouchEnd="progressTouchEnd" @progressTouchStart="progressTouchStart"></progress-bar>
              <span class="time timer">{{format(duration)}}</span>
            </div>
            <div class="operators">
              <div class="play-mode" @click="changePlayMode">
                <i class="iconfont" :class="playMode"></i>
              </div>
              <div class="play-prev" @click="changeSong(false)">
                <i class="iconfont icon-xiayigexiayishou"></i>
              </div>
              <div class="play-state" @click="changePlayState">
                <i class="iconfont" :class="[playState?'icon-zanting':'icon-bofang']"></i>
              </div>
              <div class="play-next" @click="changeSong(true)">
                <i class="iconfont icon-xiayigexiayishou"></i>
              </div>
              <div class="play-like" @click="addLikeList">
                <i class="iconfont icon-xihuan"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <audio id="music-audio" :src="audioUrl" autoplay ref="musicAudio" @ended="songEnd" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import PlayBar from '@/components/PlayBar'
import Lyric from 'lyric-parser'
import ProgressBar from '@/components/progressBar'
import BScroll from 'better-scroll'
import { mapState } from 'vuex'
export default {
  components: {
    PlayBar,
    ProgressBar
  },
  data () {
    return {
      playModeIndex: 0, // 0顺序，1单曲，2随机
      playModeList: [
        'icon-xunhuan',
        'icon-danquxunhuan',
        'icon-suijibofang'
      ],
      currentShow: 'cd',
      currentLyric: null,
      duration: 0,
      currentTime: 0,
      audioUrl: '',
      noLyric: false,
      currentLineNum: 0,
      percentage: 0
    }
  },
  mounted () {
  },
  computed: {
    ...mapState(['fullScreen', 'playingSong', 'playState', 'playList', 'playMode'])
  },
  watch: {
    playingSong (newVal, oldVal) {
      console.log(newVal, 'newVal')
      if (!newVal.id) {
        this.$refs.musicAudio.pause()
        this.$refs.currentTime = 0
        this.currentTime = 0
        this.audioUrl = ''
        return
      }
      if (newVal.id === oldVal.id) {
        return
      }
      this.getSongInfo(newVal.id)
    },
    playState (newVal, oldVal) {
      if (newVal) {
        this.$refs.musicAudio.play()
      } else {
        this.$refs.musicAudio.pause()
      }
    },
    audioUrl (newUrl) {
      if (newUrl) {
        let stop = setInterval(() => {
          this.duration = this.$refs.musicAudio.duration
          if (this.duration) {
            clearInterval(stop)
          }
        }, 150)
      }
    },
    currentTime (time) {
      this.updateProgressBar()
    },
    currentLyric () {
      setTimeout(() => {
        this.lyricScroll.refresh()
      }, 20)
    },
    playMode (newVal) {
      let index = this.playModeList.indexOf(newVal)
      this.playModeIndex = index
    }
  },
  methods: {
    getSongInfo (id) {
      this.$fetch(`/song/url?id=${id}`).then(res => {
        this.$store.commit('UPDATE_AUDIO_SONG', res.data[0])
        this.audioUrl = res.data[0].url
      })
      this.$fetch(`lyric?id=${id}`).then(res => {
        this.currentLyric = new Lyric(res.lrc.lyric, this.lyricHandle)
        if (!this.lyricScroll) {
          this.lyricScroll = new BScroll(this.$refs.lyricWrapper, {
            click: true
          })
        }
        console.log('this.currentLyric', this.currentLyric)
      }).catch(() => {
        this.currentLyric = null
        this.noLyric = true
        this.currentLineNum = 0
      })
    },
    changeCurrentShow () {
      if (this.currentShow === 'cd') {
        this.currentShow = 'lyric'
      } else {
        this.currentShow = 'cd'
      }
    },
    format (interval) {
      interval = interval | 0
      let minute = interval / 60 | 0
      let second = interval % 60
      if (second < 10) {
        second = '0' + second
      }
      return minute + ':' + second
    },
    lyricHandle ({ lineNum, txt }) {
      console.log(lineNum, txt)
    },
    updateTime (e) {
      // console.log(e)
      this.currentTime = e.target.currentTime
    },
    updateProgressBar () {
      this.percentage = (this.currentTime / this.duration) * 100
    },
    progressClick (percent) {
      this.$refs.musicAudio.currentTime = this.duration * percent === this.duration ? this.duration - 0.1 : this.duration * percent
      if (!this.playState) {
        this.changePlayState()
      }
    },
    progressTouchStart () {
      if (this.playState) {
        this.changePlayState()
      }
    },
    progressTouchEnd (percent) {
      this.$refs.musicAudio.currentTime = this.duration * percent
      if (!this.playState) {
        this.changePlayState()
      }
    },
    songEnd () {
      // playModeIndex: 0, // 0顺序，1单曲，2随机

      switch (this.playModeIndex) {
        case 0: {
          // 顺序播放
          this.changeSong(true)
          break
        }
        case 1: {
          // 单曲循环
          this.$refs.musicAudio.currentTime = 0
          this.$refs.musicAudio.play()
          break
        }
        case 2: {
          // 随机播放
          let maxLength = this.playList.length - 1
          let index = Math.floor(Math.random() * (maxLength + 1))
          console.log(index, 'index')
          if (this.playList[index].id === this.playingSong.id) {
            this.$refs.musicAudio.currentTime = 0
            this.$refs.musicAudio.play()
          } else {
            this.$store.commit('UPDATE_PLAYING_SONG', this.playList[index])
          }
          break
        }
      }
    },
    hide () {
      this.$store.commit('UPDATE_FULL_SCREEN')
      this.$store.commit('UPDATE_SHOW_PLAY_BAR', true)
    },
    changePlayMode () {
      this.playModeIndex = (++this.playModeIndex) % 3
      this.$store.commit('UPDATE_PLAY_MODE', this.playModeList[this.playModeIndex])
    },
    changeSong (flag) {
      let index
      let length = this.playList.length - 1
      // 只有一首歌的时候
      if (!length) {
        this.$refs.musicAudio.currentTime = 0
        this.$refs.musicAudio.play()
        return
      }
      this.playList.forEach((item, i) => {
        if (item.id === this.playingSong.id) {
          index = i
        }
      })
      if (flag) {
        // 下一首
        if (index < length) {
          this.$store.commit('UPDATE_PLAYING_SONG', this.playList[index + 1])
        } else if (index === length) {
          // 返回第一首
          this.$store.commit('UPDATE_PLAYING_SONG', this.playList[0])
        }
      } else {
        // 上一首
        if (index !== 0) {
          this.$store.commit('UPDATE_PLAYING_SONG', this.playList[index - 1])
        } else if (!index) {
          // 返回最后一首
          this.$store.commit('UPDATE_PLAYING_SONG', this.playList[length])
        }
      }
    },
    changePlayState () {
      this.$store.commit('UPDATE_PLAY_STATE')
    },
    addLikeList () { }
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

  &.normal-enter-active, &.normal-leave-active {
    transition: all 0.4s;

    .top, .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  &.normal-enter, &.normal-leave-to {
    opacity: 0;
  }

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
        font-size: 22px;
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

    .cdplay-enter-active, .cdplay-leave-active {
      transition: all 0.3s;
    }

    .cdplay-enter, .cdplay-leave-to {
      opacity: 0;
    }

    .cdplay {
      width: 100%;
      height: 0;
      padding-top: 80%;
      position: relative;

      .cdplay-wrapper {
        width: 280px;
        height: 280px;
        margin: 0 auto;
        position: absolute;
        top: 0;
        left: 10%;
      }

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

    .lyric-enter-active, .lyric-leave-active {
      transition: all 0.3s;
    }

    .lyric-enter, .lyric-leave-to {
      opacity: 0;
    }

    .lyric {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: hidden;

      .lyric-wrapper {
        width: 80%;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        overflow: hidden;

        p {
          margin: 15px 0;
          color: #c7c7c7;
          line-height: 30px;
          font-size: 14px;

          &.current {
            color: #fff;
          }
        }
      }
    }
  }

  .player-bottom {
    position: absolute;
    bottom: 40px;
    width: 100%;
    margin: 0 auto;

    .bottom-wrapper {
      width: 80%;
      margin: 0 auto;
      display: flex;

      .progress-bar-wrapper {
        flex: 1;
        padding: 0 5px;
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

    .operators {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      margin-top: 10px;

      .play-mode, .play-prev, .play-state, .play-next, .play-like {
        flex: 1;
        text-align: center;
        color: #fff;

        .iconfont {
          font-size: 32px;
        }

        .icon-bofang, .icon-zanting {
          font-size: 42px;
        }
      }

      .play-prev {
        transform: rotate(-180deg);
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
