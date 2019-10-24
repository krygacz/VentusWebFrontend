<template>
    <div id="home">
        <Header :type="'HeaderStandard'" :profile="profile" />
        <div class="card-container">
            <UserCard v-for="card in recommendations" :key="card.id" :card="card" />
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import UserCard from '../components/UserCard.vue'
export default {
    name: 'HomePage',
    components: {
        Header,
        UserCard
    },
    props: ['loading', 'profile'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            recommendations:[],
            errored:false
        }
    },
    mounted(){
        this.$emit('load', true);
        var that = this;
        this.api.get('/user/recommendations')
                .then((response) => {
                    if(response.data.recommendations){
                        this.recommendations = Object.assign({}, response.data, this.recommendations);
                    } else {
                        that.$emit('error', 'no data received');
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
                .finally(function(){that.$emit('load', false);})
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