<template>
  <div id="app">
    <Header :type="headerType" :profile="profile"/>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  },
  data: ()=>{
    return {
      profile: {
        name: 'Krystian',
        img: 'favicon.ico'
      },
      headerType: 'headerStandard'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
