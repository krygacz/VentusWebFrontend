import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';

import HomePage from './pages/Home.vue';
import LoginPage from './pages/Login.vue';
import ProfilePage from './pages/Profile.vue';
import RegisterPage from './pages/Register.vue';
import OnboardingPage from './pages/Onboarding.vue';

Vue.use(VueRouter);

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = "https://ventusapi.herokuapp.com/api";
Vue.axios.defaults.withCredentials = true;
Vue.axios.defaults.crossDomain = true;

Vue.config.productionTip = false;

const routes = [
  {path: '/', name: 'home', component: HomePage},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/profile/:id', name: 'profile', component: ProfilePage},
  {path: '/login/register', name: 'register', component: RegisterPage, props:true},
  {path: '/onboarding/:stage', name: 'onboarding', component: OnboardingPage}
];

const router = new VueRouter({
  mode:'history',
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');