<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view v-if="!errored && ready" :profile="profile"> </router-view>
    </transition>
    <transition name="fade">
      <div class="error-container" v-if="errored"><div class="error">THERE WAS AN ERROR<br><br><span>{{errormsg}}</span></div></div>
      <div class="loader-container" v-if="loading && !errored"><div class="loader"></div></div>
      <div @click="closeMenu" class="overlay" v-if="overlay"></div>
    </transition>
    <transition name="er">
        <div v-if="popup_msg" class="errormsg"><span>{{popup_msg}}</span></div>
    </transition>
  </div>
</template>

<script>
import EventBus from './event-bus';
export default {
  name: 'app',
  data(){
    return{
      errored:false,
      errormsg:'',
      popup_msg:null,
      loading:true,
      ready:false,
      transitionName:'slide-left',
      profile:null,
      overlay: false
    }
  },
  methods:{
    closeMenu:function(){
      EventBus.$emit('menu_close');
    },
    handleLoading:function(cl){
      this.loading = cl;
    },
    handleOverlay:function(cl){
      this.overlay = cl;
    },
    errorHandle: function(e = null) {
      if(e) this.errormsg = e;
      else this.errormsg = "We have an internal issue :c";
      this.errored = true;
    },
    errorPopup: function(e){
      this.popup_msg=e;
      let that = this;
      window.setTimeout(()=>{that.popup_msg=null}, 4500);
    },
    refreshData: function(){
      var that = this;
      if(localStorage.getItem('token')){
        this.api.get('/user')
          .then((response) => {
            if(response.data.categories.length == 0 || response.data.subcategories.length == 0){
              if(that.$router.currentRoute.name != 'onboarding' && that.$router.currentRoute.name != 'onboarding_specified'){
                that.$router.push({name: 'onboarding'});
              }
            } else {
              that.profile = Object.assign({}, response.data, that.profile);
            }
          })
          .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            this.$router.push({name:'login'});
          })
          .finally(() => {that.ready = true;});
      } else {
        switch(this.$router.currentRoute.name){
            case 'register':
            case 'login':
              break;
            default:
              this.$router.push({name:'login'});
        }
        this.ready = true;
        this.loading = false;
      }
    }
  },
  mounted(){
    EventBus.$on('overlay', this.handleOverlay);
    EventBus.$on('error_major', this.errorHandle);
    EventBus.$on('error_popup', this.errorPopup);
    EventBus.$on('loading', this.handleLoading);
    this.refreshData();
  },
  watch: {
    '$route' (to, from) {
      this.errored = false;
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      if(to.name == 'home'){
        this.loading = true;
        this.transitionName = 'slide-right';
      }
      if(this.loading){
        this.transitionName = 'fade';
      }
      if(this.$route.params.force_reload){
        this.forceUpdate();
      }
      switch(this.$router.currentRoute.name){
        case 'register':
        case 'login':
          break;
        default:
          this.refreshData();
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
  font-family: 'Baloo Da 2';
}
.overlay{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(240,240,240,0.8);
  z-index:890;
}
@include error-styling;
</style>
