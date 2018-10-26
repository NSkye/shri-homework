import VueRouter from 'vue-router'
import Vue from 'vue'

import Events from 'pages/Events.vue'
import Camera from 'pages/Camera.vue'
import VideoFeed from 'pages/VideoFeed.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/events', component: Events },
  { path: '/camera', component: Camera },
  { path: '/videofeed', component: VideoFeed }
]

const router = new VueRouter({
  routes
})

export default router