<template>
    <div id="home">
        <Header @return="back" @done="process" :type="'HeaderInit'" :profile="profile" />
        <component :is="type" :done="done" ref="content"/>
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
            errored:false
        }
    },
    methods:{
        process: function(){
            this.$refs.content.process();
        },
        back: function(){
            this.$router.go(1);
        }
    },
    mounted(){
        if(this.$route.params.stage){
            switch(this.$route.params.stage){
                case 'categories':
                    this.type="SelectCategory";
                    return;
                case 'interests':
                    this.type="SelectInterest";
                    return;
            }
        }
        this.$emit('load', true);
        var that = this;
        this.api.get('/user')
                .then((response) => {
                    if(!response.data.categories){
                        that.type = "SelectCategory";
                    }else if(!response.data.interests){
                        that.type = "SelectInterest";
                    }else{
                        that.$emit('error', 'Wrong redirection');
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
                /*.finally(function(){that.$emit('load', false);})*/
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
</style>