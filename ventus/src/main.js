import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data: {
    profile: {
      name: 'Krystian',
      img: 'img.png'
    }
  }
}).$mount('#app')
