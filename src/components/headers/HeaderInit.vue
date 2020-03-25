<template>
    <div class="header" id="header">
        <div @click="back" id="return"><i class="material-icons">arrow_back_ios</i></div>
        <img id="logo" src="@/assets/logo.svg" />
        <div @click="done" id="done" ><i class="material-icons">check</i></div>
    </div>
</template>

<script>
import EventBus from '../../event-bus';
export default {
  name: 'HeaderInit',
  methods: {
        back:function(){
            this.$router.back();
        },
        done:function(){
            EventBus.$emit("header_done");
        }
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
        height:100px;
        position:fixed;
        top:0;
        left:0;
        right:0;
        margin:0;
        padding:0;
        border-bottom: 2px solid $border_color;
        box-shadow: 0px 3px 9px -2px $shadow_color;
        z-index:999;
    }
    .header > img#logo{
        height:40%;
    }
    .header i.material-icons{
        font-size:40px;
        text-align:center;
    }
    .header > div#return, .header > div#done{
        display:flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition:all 200ms ease-in-out;
        cursor:pointer;
        margin-left:50px;
        margin-right:50px;
    }
    .header > div#return:hover, .header > div#done:hover{
        transform:scale(1.2);
    }
    .header > #return{
        color: $primary_light;
        padding-right:5px;
        margin-left:45px;
    }
    .header > #done{
        color: $accent_teal;
    }
    .header > #done > i.material-icons{
        font-size:43px;
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
}
</style>