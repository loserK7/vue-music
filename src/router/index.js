import Vue from 'vue'
import Router from 'vue-router'

const MusicList = resolve => {
  import('@/views/musicList').then(module => {
    resolve(module)
  })
}
const Recommend = resolve => {
  import('@/views/recommend').then(module => {
    resolve(module)
  })
}
const Rank = resolve => {
  import('@/views/rank').then(module => {
    resolve(module)
  })
}
const Singer = resolve => {
  import('@/views/singer').then(module => {
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
