<template>
  <div id="app">
    <h1 style="font-size:150px;color:red;" v-if="errored">ERROROORORR</h1>
    <transition name="fade">
    <div class="loader_container" v-if="loading"><div class="loader"></div></div>
    </transition>
    <router-view v-if="!errored" v-model="loading" :profile="profile"> </router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      errored:false,
      loading:true,
      profile:{}
    }
  },
  mounted(){
    this.axios.get('https://ventusapi.herokuapp.com/user/')
      .then((response) => {
        if(response.status != 200) {
          alert("backend be trippin\n\nstatus " + response.status + "\n\n" + JSON.stringify(response.data));
          this.errored = true;
        }
        if(!response.data)throw new Error('gOt nO dAtA');
        if(!response.data.User){this.$router.push('login')}
        else if(!response.data.User.initialized){this.$router.push('/setup')}
        this.profile = Object.assign({}, response.data, this.profile);
      })
      .catch((e) => {
        this.errored = true;
        alert("backend be trippin\n\n" + e.message);
      })
      .finally(() => {this.loading = false;})
  }
}
</script>

<style lang="scss" scoped>
.loader_container{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:99999999;
  background:white;
}
.loader {
  width: 64px;
  height: 64px;
}
.loader:after {
  content: " ";
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-color: $accent_teal transparent $accent_teal transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fade-enter-active, .fade-leave-active {
  opacity:1;
  transition: all 200ms ease-in-out;
  transition-delay:100ms;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
*{font-family:"Segoe UI"}
</style>
