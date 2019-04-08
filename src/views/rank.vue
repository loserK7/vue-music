<template>
  <div class="rank-page" ref="rankPage">
    <div>
      <ul class="rank-wrapper">
        <li class="rank-item" v-for="(ritem, index) in yunTopList" :key="index">
          <div class="img">
            <img v-lazy="ritem.coverImgUrl" alt="" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(item, index) in ritem.top" :key="index">
              <span>
                {{ index + 1 + '.' }}
              </span>
              <span> {{ item.name }} - {{ item.ar[0].name }} </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
const YUNMUSIC_TOP = [0, 1, 2, 3, 4, 22, 23]
export default {
  data () {
    return {
      yunTopList: []
    }
  },
  mounted () {
    this.getTop()
    this.$nextTick(() => {
      this.initScroll()
    })
    console.log(this.yunTopList)
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  methods: {
    getTop () {
      for (let i = 0; i < YUNMUSIC_TOP.length; i++) {
        this.$fetch('top/list', { idx: YUNMUSIC_TOP[i] }).then(res => {
          let list = res.playlist
          list.top = res.playlist.tracks.slice(0, 3)
          this.yunTopList.push(list)
        })
      }
    },
    initScroll () {
      this.scroll = new BScroll(this.$refs.rankPage)
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style lang="stylus">
.rank-page {
  position: fixed;
  bottom: 0px;
  top: 54px;
  width: 100%;
  overflow: hidden;

  .rank-wrapper {
    width: 100%;
    height: 100%;
    margin-bottom: 20px;

    .rank-item {
      display: flex;
      justify-content: center;
      margin: 0 10px;
      padding: 3px 0;
      border-bottom: 1px solid rgb(228, 228, 228);

      &:last-child {
        padding-bottom: 30px;
      }

      .img {
        width: 100px;
        height: 100px;
        border-radius: 5px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        padding: 0 10px;
        overflow: hidden;

        .song {
          padding: 5px 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
