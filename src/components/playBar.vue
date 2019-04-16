<template>
  <div class="play-bar">
    <div class="img">
      <img src="" alt="">
    </div>
    <div class="info">

    </div>
    <div class="play">

    </div>
    <div class="menu">

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
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
  padding: 0 15px;

  .img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }

  .info {
    flex: 1;
    height: 40px;
  }

  .play, .menu {
    height: 40px;
    width: 40px;
  }
}
</style>
