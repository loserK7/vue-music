<template>
    <transition name="list-fade">
        <div class="play-list" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="iconfont" :class="playMode" @click.stop="changePlayMode"></i>
                        <span class="mode-text">
                            {{modeText}}
                            <span>
                                ({{playList.length}})
                            </span>
                        </span>
                        <span class="clear" @click.stop="clear">
                            <i class="iconfont icon-shanchu"></i>
                        </span>
                    </h1>
                </div>
                <div class="list-content" ref="listContent">
                    <transition-group name="list" tag="ul" class="content-items">
                        <li class="item" v-for="item in playList" :key="item.id">
                            <i class="iconfont icon-volume" v-if="item.id==playingSong.id"></i>
                            <span class="item-text" @click="changePlaySong(item)">
                                {{item.name}}
                            </span>
                            <span class="delete" @click="deletedSong(item)">
                                <i class="iconfont icon-shanchu1"></i>
                            </span>
                        </li>
                    </transition-group>
                </div>
                <div class="list-bottom" @click="hide">
                    <span>
                        关闭
                    </span>
                </div>
            </div>
            <confirm-box :visible='visible' @cancel="cancelEmit" @confirm="confirmEmit"></confirm-box>
        </div>
    </transition>
</template>

<script>
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import ConfirmBox from '@/components/confirmBox'
export default {
    components: {
        ConfirmBox
    },
    data() {
        return {
            showFlag: false,
            playModeIndex: 0,
            playModeList: [
                'icon-xunhuan',
                'icon-danquxunhuan',
                'icon-suijibofang'
            ],
            modeText: '循环播放',
            visible: false
        }
    },
    mounted() {
        console.log('asdsad')
        if (this.scroll) {
            this.scroll.refresh()
        } else {
            this.scroll = new BScroll(this.$refs.listContent, {
                click: true
            })
        }
    },
    computed: {
        ...mapState(['playList', 'playingSong', 'playMode'])
    },
    watch: {
        playList: {
            handler(newVal, oldVal) {
                if (this.scroll) {
                    console.log('asdasd')
                    this.scroll.refresh()
                }
            },
            deep: true
        },
        playMode: function (newValue) {
            let index = this.playModeList.indexOf(newValue)
            this.playModeIndex = index
            this.setPlayModeText()
        }
    },
    methods: {
        cancelEmit() {
            this.visible = false
        },
        confirmEmit() {
            this.visible = false
            this.showFlag = false
            this.$store.commit('INIT_STATE')
        },
        changePlaySong(item) {
            this.$store.commit('UPDATE_PLAYING_SONG', item)
        },
        deletedSong(item) {
            // 只有一首歌
            if (this.playList.length === 1) {
                this.$store.commit('INIT_STATE')
                this.showFlag = false
            }
            // 删除的是正在播放的歌曲
            if (item.id === this.playingSong.id) {
                let index = this.playList.indexOf(item) + 1
                let len = this.playList.length
                let list = index < len ? this.playList[index] : this.playList[0]
                this.$store.commit('UPDATE_PLAYING_SONG', list)
                this.$store.commit('DELETE_PLAY_PIST', index - 1)
            } else {
                // 删除的是其他歌曲
                let index = this.playList.indexOf(item)
                this.$store.commit('DELETE_PLAY_PIST', index)
            }
        },
        clear() {
            this.visible = true
        },
        show() {
            this.showFlag = true
        },
        hide() {
            this.showFlag = false
        },
        changePlayMode(e) {
            this.playModeIndex = (++this.playModeIndex) % 3
            this.$store.commit('UPDATE_PLAY_MODE', this.playModeList[this.playModeIndex])
            this.setPlayModeText()
        },
        setPlayModeText() {
            switch (this.playModeIndex) {
                case 0: {
                    this.modeText = '循环播放'
                    break
                }
                case 1: {
                    this.modeText = '单曲循环'
                    break
                }
                case 2: {
                    this.modeText = '随机播放'
                    break
                }
            }
        }
    }
}
</script>

<style lang="stylus">
.list-fade-enter-active, .list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
        transition: all 0.3s;
    }
}
.list-fade-enter, .list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
        transform: translate3d(0, 100%, 0);
    }
}
.play-list {
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 201;
    .list-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f2f3f4;
        border-radius: 8px;
        .list-header {
            font-size: 16px;
            padding: 20px 30px 10px 20px;
            .title {
                display: flex;
                align-items: center;
                .iconfont {
                    font-size: 20px;
                }
                .mode-text {
                    padding: 0 10px;
                    flex: 1;
                    font-size: 14px;
                }
                .clear {
                    position: relative;
                    &:before {
                        content: '';
                        position: absolute;
                        top: -10px;
                        left: -10px;
                        right: -10px;
                        bottom: -10px;
                    }
                }
            }
        }
        .list-content {
            max-height: 220px;
            overflow: hidden;
            .content-items {
                .item {
                    padding: 0 30px 0 20px;
                    font-size: 14px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    &.list-enter-active, &.list-leave-active {
                        transition: all 0.1s;
                    }
                    &.list-enter, &.list-leave-to {
                        height: 0;
                    }
                    .icon-volume {
                        color: #d44439;
                        margin-right: 5px;
                    }
                    .item-text {
                        line-height: 25px;
                        flex: 1;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .delete {
                        position: relative;
                        line-height: 25px;
                        color: #d44439;
                        &:before {
                            content: '';
                            position: absolute;
                            top: -8px;
                            left: -8px;
                            right: -8px;
                            bottom: -8px;
                        }
                        .iconfont {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .list-bottom {
            text-align: center;
            line-height: 50px;
            background: #f2f3f4;
            font-size: 16px;
            color: #2e3030;
        }
    }
}
</style>
