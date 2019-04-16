<template>
  <div class="singer-page" ref="singerPage">
    <div class="singer-contend" ref=singerContend>
      <div>
        <ul class="singer-list" v-if="singers" ref="singerList">
          <li class="list-item" v-for="(item, key) in singers" :key="key" ref="singerItem" >
            <div class="item-title">
              {{ item.title }}
            </div>
            <ul class="singer-wrapper">
              <li class="singer" v-for="(singer, key) in item.items" :key="key" @click="singerDetail(singer)">
                <div class="singer-img">
                  <img v-lazy="singer.avatar" alt="">
                </div>
                <div class="singer-name">
                  <span>
                    {{singer.name}}
                  </span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="shortcut-bar" @touchstart="onShortcutStart" @touchmove.stop.prevent="onShortcutMove">
      <ul>
        <li v-for="(item,index) in shortcutList" :data-index="index" :key="index" class="bar-item" :class="{active:currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { getData } from 'common/js/common'
const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_SINGERS = 10
export default {
  data () {
    return {
      singers: [],
      listHeight: [],
      currentIndex: 0,
      scrollY: 0,
      touch: {}

    }
  },
  mounted () {
    this.getSingers()
  },
  watch: {
    singers () {
      setTimeout(() => {
        console.log('work')
        this.calHeight()
      }, 20)
    },
    scrollY (newY) {
      console.log(newY)
      console.log('= this.listHeight', this.listHeight, this.scroll.maxScrollY)
      const listHeight = this.listHeight

      if (newY <= this.scroll.maxScrollY) {
        this.currentIndex = listHeight.length - 2
        return
      }
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    }

  },
  computed: {
    shortcutList () {
      return this.singers.map(item => {
        return item.title.substr(0, 1)
      })
    }
  },
  methods: {
    getSingers () {
      this.$fetch('/top/artists?limit=100').then(res => {
        let s = res.artists
        s.map(item => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          })
          item.initial = py[0][0].toUpperCase()
        })
        this.singers = this.normalizerSinger(s)
        this.initScroll()
        this.$nextTick(() => {
          this.calHeight()
        })
      })
    },
    singerDetail (item) {
      this.$store.commit('UPDATE_MUSIC_LIST', {})
      this.$router.push({ path: `/singer/${item.id}` })
      console.log(item)
    },
    initScroll () {
      this.scroll = new BScroll(this.$refs.singerContend, {
        probeType: 3
      })
      this.scroll.on('scroll', (pos) => {
        this.scrollY = pos.y
      })
    },
    calHeight () {
      this.listHeight = []
      const shortList = this.$refs.singerList.children
      let height = 0
      this.listHeight.push(height)
      let listLen = shortList.length
      for (let i = 0; i < listLen; i++) {
        let item = shortList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      console.log(this.listHeight)
    },
    onShortcutStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutMove (e) {
    },
    _scrollTo (index) {
      if (index === 0) {
        index = 0
      }
      this.scrollY = -this.listHeight[index]
      this.scroll.scrollToElement(this.$refs.singerItem[index], 0)
    },
    normalizerSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGERS) {
          let object = {
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / ')
          }
          map.hot.items.push(object)
        }
        const key = item.initial
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        let object = {
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias[0]
        }
        map[key].items.push(object)
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[A-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus">
.singer-page {
  position: absolute;
  overflow: hidden;
  top: 44px;
  width: 100%;
  bottom: 0;

  .singer-contend {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .singer-list {
    .list-item {
      .item-title {
        background-color: rgba(0, 0, 0, 0.1);
        padding-left: 5px;
        margin-bottom: 10px;
        color: #fff;
        font-size: 11px;
        height: 20px;
        line-height: 20px;
      }

      .singer-wrapper {
        .singer {
          display: flex;
          margin: 0 5px;
          padding: 5px 0;
          border-bottom: 1px solid #e4e4e4;
          align-items: center;

          &:last-child {
            margin-bottom: 10px;
            border: none;
          }

          .singer-img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            overflow: hidden;

            img {
              height: 100%;
              width: 100%;
            }
          }

          .singer-name {
            overflow: hidden;
            padding-left: 15px;
            text-align: center;
            font-size: 14px;
          }
        }
      }
    }
  }

  .shortcut-bar {
    position: fixed;
    width: 20px;
    top: 0;
    bottom: 0;
    right: 5px;
    padding: 200px 0;
    z-index: 200;
    overflow: hidden;
    text-align: center;

    .bar-item {
      font-size: 11px;
      font-weight: bold;
      padding: 5px 0;
      color: #757575;

      &.active {
        color: #d44439;
      }
    }
  }
}
</style>
