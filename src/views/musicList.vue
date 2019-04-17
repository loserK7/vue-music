<template>
  <div>
    <transition name="slide" mode="out-in">
      <div class="music-list">
        <div class="list-header" ref="listHeader">
          <span @click="$router.back()">
            <i class="iconfont icon-xiangzuo"></i>
          </span>
          <span>
            {{headDetailTitle||headTitle[index]}}
          </span>
        </div>
        <div class="music-list-wrapper" ref=musicListWrapper>
          <div>
            <div class="wrapper-bg" :style="bgStyle" ref="bgImage">
              <div class="filter"></div>
              <div class="bg-info">
                <h2 class="info-title">{{musicList.name}}</h2>
                <div class="info-meg" v-if="!$route.path.includes('singer')">
                  <i class="iconfont icon-play"></i>
                  {{Math.floor(musicList.playCount / 10000) }}万
                </div>
              </div>
            </div>
            <div class="music-content">
              <div class="content-head">
                <i class="iconfont icon-bofang"></i>
                <span>播放全部</span>
                <span>(共{{listDetail.length}}首)</span>
              </div>
              <div class="content-list">
                <ul>
                  <li class="list-item" v-for="(song,index) in listDetail" :key="song.id" @click="play(song)">
                    <p class="index">{{index +1}}</p>
                    <div class="song-meg">
                      <div class="song-name">{{song.name}}</div>
                      <div class="song-singer">{{song.singer}}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { createRecommendListSong } from 'common/js/song'
import BScroll from 'better-scroll'

export default {
  name: 'musicList',
  data () {
    return {
      listDetail: [],
      scrollY: 0,
      index: 0,
      headTitle: [
        '歌单',
        '排行',
        '歌手'
      ],
      headDetailTitle: '',
      audioUrl: '',
      duration: 0
    }
  },
  created () {
    if (this.$route.path.includes('recommend')) {
      this.index = 0
    }
    if (this.$route.path.includes('rank')) {
      this.index = 1
    }
    if (this.$route.path.includes('singer')) {
      this.index = 2
    }
  },
  computed: {
    ...mapState(['musicList']),
    bgStyle () {
      return `background-image: url(${this.musicList.picUrl})`
    }
  },
  watch: {
    'listDetail': function (newValue) {
      if (!newValue.length) {
      } else {
        this.musicScroll = new BScroll('.music-list-wrapper', {
          // click: true,
          probeType: 3
        })
        this.musicScroll.on('scroll', this.onScroll)
      }
    },
    'audioUrl': function (val) {
      let stop = setInterval(() => {
        this.duration = this.$refs.musicAudio.duration
        if (this.duration) {
          console.log(this.duration)

          clearInterval(stop)
        }
      }, 150)
    }
  },
  beforeDestroy () {
    this.musicScroll.off('scroll')
  },
  mounted () {
    if (this.$route.path.includes('singer')) {
      console.log(this.$route.params.id)
      this.getSingerDetail(this.$route.params.id)
    } else if (!this.musicList.id) {
      this.$router.back()
    } else {
      this.getListDetail()
    }
    this.imageHeight = this.$refs.bgImage.clientHeight
  },
  methods: {
    getListDetail () {
      this.$fetch(`/playlist/detail?id=${this.musicList.id}`).then(res => {
        this.listDetail = res.playlist.tracks.map((item) => {
          return createRecommendListSong(item)
        })
      })
    },
    getSingerDetail (id) {
      this.$fetch(`/artists?id=${id}`).then(res => {
        this.$store.commit('UPDATE_MUSIC_LIST', res.artist)
        this.listDetail = res.hotSongs.map((item) => {
          return createRecommendListSong(item)
        })
      })
    },

    play (song) {
      this.$store.commit('UPDATE_FULL_SCREEN')
      this.$store.commit('UPDATE_SHOW_PLAY_BAR', false)
      this.$store.commit('UPDATE_PLAY_LIST', song)
      this.$store.commit('UPDATE_PLAYING_SONG', song)
    },
    onScroll (position) {
      console.log(position, 'position')
      let scrollY = position.y
      let percent = Math.abs(scrollY / this.imageHeight)
      if (scrollY < -this.imageHeight - 20) {
        this.headDetailTitle = this.musicList.name
      } else {
        this.headDetailTitle = ''
      }
      if (this.$refs.listHeader) {
        if (scrollY < 0) {
          this.$refs.listHeader.style.background = `rgba(212, 68, 57, ${percent})`
        } else {
          this.$refs.listHeader.style.background = `rgba(212, 68, 57, 0)`
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(30%, 0, 0);
  opacity: 0;
}

.music-list {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  background: #fff;

  .list-header {
    z-index: 10;
    height: 44px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    line-height: 44px;
    padding: 0 5px;
    font-size: 16px;
    color: #fff;

    & span {
      display: inline-block;
      margin: 0 5px;
    }
  }

  .music-list-wrapper {
    background-color: #F2F3F4;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .wrapper-bg {
      display: block;
      position: relative;
      width: 100%;
      padding-top: 75%;
      background-size: cover;
      transform-origin: top;
      background-position: 0 30%;

      .filter {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        opacity: 0.2;
      }

      .bg-info {
        position: absolute;
        bottom: 40px;
        left: 10px;
        color: #fff;
        font-size: 12px;

        .info-title {
          width: 250px;
          font-size: 16px;
          margin-bottom: 5px;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }
    }

    .music-content {
      position: relative;
      top: -20px;
      background: #f2f3f4;
      border-radius: 12px 12px 0 0;
      overflow: hidden;

      .content-head {
        font-size: 16px;
        padding-left: 10px;
        line-height: 40px;
        background: #F2F3F4;
        border: 1px solid #e4e4e4;
        display: flex;
        align-items: center;

        i {
          font-size: 24px;
          padding: 0 5px;
        }

        & span:last-child {
          font-size: 12px;
          color: #757575;
        }
      }

      .content-list {
        .list-item {
          display: flex;
          border-bottom: 1px solid #e4e4e4;
          font-size: 16px;
          align-items: center;
          height: 50px;

          p {
            flex: 0 0 50px;
            width: 50px;
            text-align: center;
            color: #757575;
          }

          .song-meg {
            div {
              margin: 5px;
            }

            .song-singer {
              color: #757575;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
