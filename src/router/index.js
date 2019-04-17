import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend'
import Rank from '@/views/rank'
import Singer from '@/views/singer'

const MusicList = (resolve) => {
  import('@/views/musicList').then((module) => {
    resolve(module)
  })
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          name: 'recommendList',
          component: MusicList
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'rankList',
          component: MusicList
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'singerList',
          component: MusicList
        }
      ]
    }
  ]
})
