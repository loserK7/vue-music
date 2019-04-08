import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend'
import Rank from '@/views/rank'
import Singer from '@/views/singer'

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
      component: Recommend
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    }
  ]
})
