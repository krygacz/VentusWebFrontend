<template>
    <div id="home">
        <Header @return="back" @done="process" :type="'HeaderInit'" :profile="profile" />
        <component :is="type" @ready="ready" @done="next" @error="errorHandle" ref="content"/>
        <transition name="er">
            <div v-if="error" class="errormsg"><span>{{error}}</span></div>
        </transition>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import SelectCategory from '../components/SelectCategory.vue'
import SelectInterest from '../components/SelectInterest.vue'
export default {
    name: 'OnboardingPage',
    components: {
        Header,
        SelectCategory,
        SelectInterest
    },
    props: ['loading', 'profile'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            type:null,
            done:false,
            error:null
        }
    },
    methods:{
        process: function(){
            this.$emit('load', true);
            this.$refs.content.process();
        },
        back: function(){
            this.$router.go(1);
        },
        ready: function(){
            this.$emit('load', false);
        },
        next: function(){
            this.$emit('load', true);
        },
        errorHandle: function(e){
            this.error = e;
            let that = this;
            setTimeout(()=>{that.error = null;}, 3000);
        },
        paramsHandle: function(){
            if(this.$route.params.stage){
                switch(this.$route.params.stage){
                    case 'categories':
                        this.type="SelectCategory";
                        break;
                    case 'interests':
                        this.type="SelectInterest";
                        break;
                    default:
                        this.$router.push({name:'onboarding'});
                }
                return true;
            }
            return false;
        }
    },
    mounted(){
        this.$emit('load', true);
        if(this.paramsHandle()){
            return;
        }
        var that = this;
        this.api.get('/user')
                .then((response) => {
                    if(response.data.categories.length == 0){
                        that.$router.push({name:'onboarding_specified', params:{stage:'categories'}});
                    } else if(response.data.subcategories.length == 0){
                        that.$router.push({name:'onboarding_specified', params:{stage:'interests'}});
                    } else {
                        that.$router.push({name: 'home'});
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
    },
    watch: {
    '$route' () {
        this.paramsHandle();
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container{
    display:flex;
    flex-flow: row wrap;
    align-items: top;
    justify-content:left;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:50px;
    padding-top:100px;

}
.errormsg{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    height:60px;
    display:flex;
    justify-content: center;
    align-content: center;
    background: $error_light;
    color:white;
    z-index:9999999;
    transition:all 250ms;
}
.errormsg > span{
    position:relative;
    margin:auto;
    font-family: 'Concert One';
    font-weight:300;
    font-size:28px;
}
.er-enter-active, .er-leave-active {
  height:60px;
  opacity:1;
}
.er-enter, .er-leave-to{
  height:0;
  opacity:0.5;
}
</style>