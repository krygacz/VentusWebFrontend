import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';

import HomePage from './pages/Home.vue';
import LoginPage from './pages/Login.vue';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const routes = [
  {path: '/', name: 'home', component: HomePage},
  {path: '/login', name: 'login', component: LoginPage},
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');