import Vue from 'vue'
import App from './App'
import router from './router'
import { post, fetch, patch, put } from '@/utils/request'
import VueLazyload from 'vue-lazyload'
import EventBus from './utils/eventBus.js'
import 'lib-flexible/flexible.js' // 适配库
import './common/css/reset.css'
import fastclick from 'fastclick'
import store from './store'
Vue.use(VueLazyload, {
  loading: require('./common/img/default.png')
})
fastclick.attach(document.body)

Vue.use(EventBus)
// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
