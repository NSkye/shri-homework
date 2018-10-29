import Vue from 'vue';
import VueRouter from 'vue-router';

import Camera from 'pages/Camera-page.vue';
import Events from 'pages/Events-page.vue';
import VideoFeed from 'pages/VideoFeed-page.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/events', component: Events },
  { path: '/camera', component: Camera },
  { path: '/videofeed', component: VideoFeed },
];

const router = new VueRouter({
  routes,
});

export default router;
