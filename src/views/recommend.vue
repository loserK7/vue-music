<template>
  <div class="recommend-page" ref="recommendPage">
    <div ref="recommendContend" class="recoment-contend">
      <div>
        <div class="slider-wrapper">
          <div class="slider" ref="slider">
            <div class="slider-group" ref="sliderGroup">
              <div v-for="(item, key) in bannerList" :key="key">
                <img :src="item.imageUrl" alt="" />
              </div>
            </div>
            <div class="dots">
              <span class="dot" v-for="(dot, index) in dots" :key="index" :class="{ active: currentIndex === index }">
              </span>
            </div>
          </div>
        </div>
        <div class="recommend-list" ref="recommendList">
          <ul class="list-wrapper" ref="listWrapper">
            <li class="list-item" v-for="(item, index) in recommendMusicList" :key="index" @click="detail(item)">
              <div class="icon">
                <p class="play-count">
                  <i class="iconfont icon-play"></i>
                  {{Math.floor(item.playCount / 10000) }}万
                </p>
                <img v-lazy="item.picUrl" alt="" />
              </div>
              <div class="text">
                <p class="name">{{ item.name }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="decorate">
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>

</template>

<script>
import { addClass } from 'common/js/common.js'
import BScroll from 'better-scroll'
export default {
  name: 'recommend',
  data () {
    return {
      bannerList: [],
      recommendMusicList: [],
      currentIndex: 0,
      dots: [],
      loop: true,
      autoPlay: true,
      interval: 4000
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.refresh()
    next()
  },
  mounted () {
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this.$nextTick(() => {
        this.setSliderWidth()
        this.initSlider()
        this.onScrollEnd()
        this.initDots()
      })
    })
    Promise.all([this.getBannerList(), this.getRecommendList()]).then(
      result => {
        this.$nextTick(() => {
          this.initScroll()
        })
      }
    )
  },
  watch: {
    bannerList () {
      setTimeout(() => {
        if (!this.$refs.sliderGroup) {
          this.setSliderWidth()
          this.initSlider()
        }
        this.refresh()
      }, 20)
    }
  },
  methods: {
    getBannerList () {
      return new Promise((resolve, reject) => {
        this.$fetch('/banner').then(res => {
          this.bannerList = res.banners
          this.$nextTick(() => {
            this.setSliderWidth()
            this.initSlider()
            this.onScrollEnd()
            this.initDots()
            resolve(res)
          })
        })
      })
    },
    getRecommendList () {
      return new Promise((resolve, reject) => {
        this.$fetch('/personalized').then(res => {
          this.recommendMusicList = res.result
          this.$nextTick(() => { })
          resolve(res)
        })
      })
    },
    detail (item) {
      this.$store.commit('UPDATE_MUSIC_LIST', item)
      this.$router.push({ path: `/recommend/${item.id}` })
    },
    setSliderWidth () {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        // scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        snapSpeed: 400,
        bounce: false,
        stopPropagation: true
        // click: true
      })
      this.slider.on('scrollEnd', this.onScrollEnd)
    },
    initDots () {
      this.dots = new Array(this.children.length - 2)
    },
    initScroll () {
      this.scroll = new BScroll(this.$refs.recommendContend, {
      })
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    onScrollEnd () {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentIndex = pageIndex
      this.play()
    }
  }
}
</script>

<style lang="stylus">
.decorate {
  background: #d44439;
  width: 100%;
  height: 50vh;
  top: -30vh;
  z-index: -10;
  position: absolute;
}

.recommend-page {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;

  .recoment-contend {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}

.slider-wrapper {
  width: 97%;
  margin: 0 auto;
  border-radius: 5px;
  overflow: hidden;

  .slider {
    min-height: 1px;
    overflow: hidden;
    position: relative;

    .slider-group {
      overflow: hidden;

      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;

        img {
          display: block;
          width: 100%;
        }
      }
    }

    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      overflow: hidden;

      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f1f1f1;

        &.active {
          width: 12px;
          border-radius: 5px;
          background: #fd6c62;
        }
      }
    }
  }
}

.recommend-list {
  width: 100%;
  text-align: center;
  margin-top: 40px;

  .list-item {
    position: relative;
    width: 33%;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 1%;
    margin: 5px 0;

    .icon {
      position: relative;
      display: inline-block;
      width: 100%;

      .play-count {
        position: absolute;
        top: 1px;
        right: 5px;
        font-size: 10px;
        color: #f1f1f1;
        line-height: 16px;

        i {
          font-size: 12px;
          position: relative;
          left: 3px;
        }
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    .text {
      font-size: 12px;
      text-align: left;
      height: 40px;
      line-height: 16px;
      overflow: hidden;

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
