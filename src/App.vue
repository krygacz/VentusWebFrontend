<template>
  <div id="app">
    <div class="error-container" v-if="errored"><div class="error">THERE WAS AN ERROR<br><br><span>{{errormsg}}</span></div></div>
    <transition name="fade">
      <div class="loader-container" v-if="loading"><div class="loader"></div></div>
    </transition>
    <router-view  v-on:error="errorHandle" v-if="!errored && ready" v-model="loading" :profile="profile"> </router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      errored:false,
      errormsg:'',
      loading:true,
      ready:false,
      profile:{}
    }
  },
  methods:{
    errorHandle: function(e) {
      this.errormsg = e;
      this.errored = true;
    }
  },
  mounted(){
    this.axios.get('/user')
      .then((response) => {
        if(response.status != 200) {
          this.errorHandle('status ' + response.status);
        }
        if(!response.data) this.errorHandle('no data received');
        if(!response.data.User){this.$router.push({name:'login'})}
        else if(!response.data.User.initialized){this.$router.push('/setup')}
        this.profile = Object.assign({}, response.data, this.profile);
      })
      .catch((e) => {
        this.errorHandle(e.message);
      })
      .finally(() => {this.ready = true; this.loading = false;})
  },
  // eslint-disable-next-line
  beforeRouteUpdate (a,b,next) {
    this.errored = false;
    next();
  }
}
</script>

<style lang="scss" scoped>
.loader-container{
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
.error-container{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:-1;
  background:#B71C1C;
}
.error-container .error{
  text-align:center;
  font-size: 60px;
  font-weight:700;
  color:white;
  opacity:0.4;
  word-wrap: normal;
  user-select:none;
}
.error span{
  font-size:40px;
  font-weight:400;
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
  transition: opacity 200ms ease-in-out;
  transition-delay:200ms;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
*{font-family:"Segoe UI"}
</style>
