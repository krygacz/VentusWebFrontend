import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import VueRouter from 'vue-router';

import HomePage from './pages/Home.vue';
import LoginPage from './pages/Login.vue';
import ProfilePage from './pages/Profile.vue';
import RegisterPage from './pages/Register.vue';
import OnboardingPage from './pages/Onboarding.vue';

Vue.use(VueRouter);

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = "https://ventusapi.herokuapp.com/api";
Vue.axios.defaults.withCredentials = false;
Vue.axios.defaults.crossDomain = true;
const api = Vue.axios.create();
function getAccessToken(){
  return localStorage.getItem('token');
}

function getRefreshToken(){
  return localStorage.getItem('refresh_token');
}
const refreshAuthLogic = failedRequest => Vue.axios.post('/token/refresh', {"refresh_token": getRefreshToken()}).then(tokenRefreshResponse => {
    localStorage.setItem('token', tokenRefreshResponse.data.token);
    failedRequest.response.config.headers['Authentication'] = 'Bearer ' + tokenRefreshResponse.data.token;
    return Promise.resolve();
});
api.interceptors.request.use(request => {
  request.headers['Authorization'] = 'Bearer ' + getAccessToken();
  return request;
});
createAuthRefreshInterceptor(api, refreshAuthLogic);
Vue.prototype.api = api;


Vue.config.productionTip = false;

const routes = [
  {path: '/', name: 'home', component: HomePage},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/profile/:id', name: 'profile', component: ProfilePage},
  {path: '/login/register', name: 'register', component: RegisterPage, props:true},
  {path: '/onboarding', name: 'onboarding', component: OnboardingPage},
  {path: '/onboarding/:stage', name: 'onboarding_specified', component: OnboardingPage}
];

const router = new VueRouter({
  mode:'history',
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');