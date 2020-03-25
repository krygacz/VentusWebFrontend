<template>
    <div class="header" id="header">
        <div @click="$emit('menu')" id="menu"><i class="material-icons">menu</i></div>
        <img @click="$emit('home')" id="logo" src="@/assets/logo.svg" />
        <div @click="$emit('profile')" id="profile_link" ><img loading="lazy" :src="(profile.picture)?profile.picture:'https://ventusapp.herokuapp.com/profile_placeholder.png'"></div>
    </div>
</template>

<script>
export default {
  name: 'HeaderStandard',
  props: ['profile']
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
    z-index:999999;
}
.header > img#logo{
    justify-self:center;
    height:40%;
    transition: all 300ms;
    cursor:pointer;
}
.header i.material-icons{
    font-size:35px;
    text-align:center;
}
.header > div#menu{
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
.header > div#menu:hover, .header > img#logo:hover{
    transform:scale(1.16);
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
@media screen and (max-width:700px){
    .header{
        height:60px;
    }
    .header  i.material-icons{
        font-size:27px!important;
    }
    .header > div#return, .header > div#done{
        margin-left:25px;
        margin-right:25px;
    }
    .header > #profile_link > img{
        width:30px;
        height:30px;
    }
}
</style>