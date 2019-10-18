<template>
    <div class="header" id="header">
        <div v-on:click="$emit('header-event-menu')" id="menu"><i class="material-icons">menu</i></div>
        <img id="logo" src="@/assets/logo.svg" />
        <div v-on:click="$emit('header-event-profile')" id="profile_link" ><img :src="profile.picture" /><p>{{profile.first_name}}</p></div>
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
    .header > div#menu:hover{
        transform:scale(1.2);
    }
    .header > #profile_link{
        display:flex;
        flex-flow: row nowrap;
        align-items: center;
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
    .header > #profile_link > p{
        display:inline-block;
        margin:0;
        padding:0;
        margin-left:10px;
    }
</style>