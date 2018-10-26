import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import 'normalize.css'

new Vue({
  el: '#root',
  router,
  render: h => h(App)
})