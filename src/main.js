import Vue from 'vue'
import App from './App'
import router from './router'
import { post, fetch, patch, put } from './request'
import VueLazyload from 'vue-lazyload'

import 'lib-flexible/flexible.js' // 适配库
import './common/css/reset.css'
Vue.use(VueLazyload, {
  loading: require('./common/img/default.png')
})
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
  render: h => h(App)
})
