<template>
  <div id="app">
    <transition name="fade">
      <div class="error-container" v-if="errored"><div class="error">THERE WAS AN ERROR<br><br><span>{{errormsg}}</span></div></div>
      <div class="loader-container" v-if="loading && !errored"><div class="loader"></div></div>
    </transition>
    <transition :name="transitionName">
      <router-view  v-on:error="errorHandle" v-if="!errored && ready" v-model="loading" :profile="profile"> </router-view>
    </transition>
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
      transitionName:'slide-left',
      profile:null
    }
  },
  methods:{
    errorHandle: function(e) {
      this.errormsg = e;
      this.errored = true;
    }
  },
  mounted(){
    if(localStorage.getItem('token')){
      this.api.get('/user')
        .then((response) => {
          if(!response.data.categories){
            this.$router.push('onboarding');
          } else {
            this.profile = Object.assign({}, response.data, this.profile);
          }
        })
        .catch((e) => {
          /*localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          this.$router.push({name:'login'});*/
          this.errorHandle(e.message)
        })
        .finally(() => {this.ready = true; this.loading = false;});
    } else {
      this.loading = false;
      this.ready = true;
      this.$router.push({name:'login'});
    }
  },
  watch: {
    '$route' (to, from) {
      this.errored = false;
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      if(this.profile == null && localStorage.getItem('token')){
        this.loading = true;
        this.ready = false;
        this.api.get('/user')
          .then((response) => {
            if(!response.data.categories){
              this.$router.push('onboarding');
            } else {
              this.profile = Object.assign({}, response.data, this.profile);
            }
          })
          .catch((e) => {
            this.errorHandle(e.message);
          })
          .finally(() => {this.ready = true; this.loading = false;});
      }
    }
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
  background: $error;
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
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
#app{
  position:absolute;
  min-height:450px;
  top:0;
  bottom:0;
  left:0;
  right:0;
  margin:0;
  padding:0;
  font-family: 'Segoe UI';
}
</style>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    display: none; 
    -webkit-appearance: none!important;
    margin: 0; 
}

input[type=number] {
    -moz-appearance:textfield; 
}
</style>
