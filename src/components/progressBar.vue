<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
    <div class="bar-inner">
      <div class="progress" ref="progress">
      </div>
    </div>
    <div class="bar-btn" ref="progressBtn">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      rec: '',
      maxWidth: 0, // 播放条最大宽度
      left: 0, // 播放条距离左边距离,
      touch: {},
      percent: 0
    }
  },
  mounted () {
  },
  watch: {
    percentage (newVal) {
      this.offsetWithPercentage()
    }
  },
  methods: {
    init () {
      this.rec = this.$refs.progressBar.getBoundingClientRect()
      this.maxWidth = this.rec.width - 17 //
      this.left = this.rec.left
    },
    progressClick (e) {
      this.offset(e.pageX - this.left)
      this.$emit('progressClick', this.percent)
    },
    progressTouchStart (e) {
      this.touch.initiated = true
      this.$emit('progressTouchStart')
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      let touch = e.touches[0]
      let offsetWidth = touch.pageX - this.left
      this.offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.$emit('progressTouchEnd', this.percent)
    },
    offset (offsetWidth) {
      // this.$refs.progress.style.width = `${offsetWidth}px`
      console.log(offsetWidth, 'offsetWidth')
      if (offsetWidth > 0 && offsetWidth < this.maxWidth) {
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.percent = offsetWidth / this.maxWidth
      } else if (offsetWidth < 0) {
        this.$refs.progressBtn.style.transform = `translate3d(0, 0, 0)`
        this.$refs.progress.style.width = 0
        this.percent = 0
      } else {
        this.$refs.progressBtn.style.transform = `translate3d(${this.maxWidth}px, 0, 0)`
        this.$refs.progress.style.width = '100%'
        this.percent = 1
      }
    },
    offsetWithPercentage (percentage) {
      if (!this.maxWidth) {
        this.init()
      }
      let distant = this.maxWidth * (this.percentage / 100)
      this.$refs.progressBtn.style.transform = `translate3d(${distant}px, 0, 0)`
      this.$refs.progress.style.width = `${this.percentage}%`
    }
  }
}
</script>

<style lang="stylus">
.progress-bar {
  width: 95%;
  height: 30px;
  position: relative;

  .bar-inner {
    position: relative;
    top: 15px;
    height: 4px;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      width: 0;
      height: 4px;
      background: #d44439;
    }
  }

  .bar-btn {
    position: absolute;
    top: 10px;
    box-sizing: border-box;
    border: 4px solid #f1f1f1;
    width: 14px;
    height: 14px;
    left: -2px;
    background: #d44439;
    border-radius: 50%;
  }
}
</style>
