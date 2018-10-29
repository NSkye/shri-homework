import App from '@/App.vue';
import router from '@/router';
import 'normalize.css';
import Vue from 'vue';

const appInstance: Vue = new Vue({
  router,
  render: h => h(App),
});

appInstance.$mount('#root');
