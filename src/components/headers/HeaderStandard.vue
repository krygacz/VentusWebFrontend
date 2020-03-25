<template>
    <div class="header" id="header">
        <transition name="slide-right">
            <div v-if="menuopen" id="menu">
                <div class="head"></div>
                <div class="info">{{profile.first_name}}</div>
                <a @click="logout">Log out</a>
            </div>
        </transition>
        <div @click="toggleMenu" :class="{'wh': menuopen}" id="menu_toggle"><i v-if="!menuopen" class="material-icons">menu</i><i v-if="menuopen" class="material-icons">close</i></div>
        <img @click="home" id="logo" src="@/assets/logo.svg" />
        <div @click="$emit('profile')" id="profile_link" ><img loading="lazy" :src="(profile.picture)?profile.picture:'https://ventusapp.herokuapp.com/profile_placeholder.png'"></div>
    </div>
</template>

<script>
import EventBus from '../../event-bus';
export default {
    name: 'HeaderStandard',
    props: ['profile'],
    data(){
        return {
            menuopen: false
        }
    },
    methods: {
        logout: function(){
            this.closeMenu();
            localStorage.clear();
            this.$router.push({name:'login'});
        },
        toggleMenu: function(){
            if(this.menuopen){
                EventBus.$emit('overlay', false);
                this.menuopen = false;
            } else {
                EventBus.$emit('overlay', true);
                this.menuopen = true;
            }
        },
        closeMenu: function(){
            EventBus.$emit('overlay', false);
            this.menuopen = false;
        },
        home: function(){
            if(this.$router.currentRoute.name != "home")
                this.$router.push({name:'home'});
        }
    },
    mounted(){
        EventBus.$on("menu_close", this.closeMenu);
    }
}
</script>

<style lang="scss" scoped>
.header{
    display:flex;
    justify-content: space-between;
    align-items:center;
    background: $header_background_color;
    width:100%;
    height:80px;
    position:fixed;
    top:0;
    left:0;
    right:0;
    margin:0;
    padding:0;
    border-bottom: 2px solid $border_color;
    box-shadow: 0px 6px 9px -2px $shadow_color;
    z-index:900;
    user-select:none;
}
.header > img#logo{
    justify-self:center;
    height:40%;
    transition: all 250ms;
    cursor:pointer;
}
.header i.material-icons{
    font-size:35px;
    text-align:center;
    z-index:9999999;
}
.header > div#menu_toggle{
    display:flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition:all 200ms ease-in-out;
    color: $primary_light;
    cursor:pointer;
    margin-left:30px;
    margin-right:30px;
}
.header > div#menu_toggle:hover{
    transform:scale(1.16);
}
.header > img#logo:hover{
    opacity: 0.8;
}
.header > #profile_link{
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left:30px;
    margin-right:30px;
    transition:all 300ms ease-in-out;
    cursor:pointer;
}
.header > #profile_link:hover{
    transform: scale(1.1);
}
.header > #profile_link > img{
    display:block;
    border-radius: 100%;
    width: 35px;
    height: 35px;
}
#menu{
    top:0;
    left:0;
    padding-top:82px;
    position:fixed;
    background: $primary_darker;
    min-height:100vh;
    width:400px;
    color:white;
    z-index:-1;
    display:flex;
    flex-flow:column;
    user-select:none;
}
#menu > .head{
    position:absolute;
    top:0;
    right:0;
    height:82px;
    width:100%;
    background:$header_background_color;
    margin:0;
}
#menu > .info {
    position:relative;
    background:$primary_dark;
    width:100%;
    height:80px;
    display:flex;
    font-size:25px;
    font-weight:200;
    font-family: 'Segoe UI';
    color:whitesmoke;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    margin:0;
    line-height:1;
    pointer-events:none;
}
#menu > a{
    font-size:25px;
    font-weight:500;
    font-family: 'Baloo Da 2';
    display:flex;
    text-decoration: none;
    cursor:pointer;
    color:white;
    width:100%;
    height:80px;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    transition: all 250ms;
}
#menu > a:hover{
    color:$primary_darker;
    background:white;
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  transition-delay:100ms;
  overflow: hidden;
}
.slide-right-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
@media screen and (max-width:1140px){
    #menu > .head{
        background:white;
    }
    .header  i.material-icons{
        color:$primary_darker;
    }
}
@media screen and (max-width:700px){
    .header{
        height:60px;
    }
    .header  i.material-icons{
        font-size:27px!important;
        color:$primary_darker;
    }
    .header > div#return, .header > div#done{
        margin-left:25px;
        margin-right:25px;
    }
    .header > #profile_link > img{
        width:30px;
        height:30px;
    }
    #menu{
        width:100vw;
        padding-top:62px;

    }
    #menu > a, #menu > .info{
        height:70px;
    }
    #menu > a{
        font-size:22px;
    }
    #menu > .info{
        font-size:24px;
    }
    #menu > .head{
        background:white;
        height:62px;
    }
}
</style>