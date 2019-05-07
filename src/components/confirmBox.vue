<template>
  <transition name="confirm-fade">

    <div class="confirm-box" v-show="visible" @click.stop="cancel">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">
            是否清空播放列表
          </p>
          <div class="operation">
            <div class="operate-btn" @click.stop="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click.stop="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    confirmBtnText: {
      type: String,
      default: '清空'
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="stylus">
.confirm-fade-enter-active {
  animation: confirm-fadein 0.3s;

  .confirm-content {
    animation: confirm-zoom 0.3s;
  }
}

.confirm-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .confirm-content {
      width: 240px;
      padding-top: 10px;
      border-radius: 5px;
      background: #f2f3f4;

      .text, .operation {
        text-align: center;
      }

      .text {
        padding: 12px 15px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #2e3030;
      }

      .operation {
        display: flex;
        align-items: center;
        justify-content: center;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 12px 0;
          border-top: 1px solid #f2f3f4;
          color: #d44439;
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
