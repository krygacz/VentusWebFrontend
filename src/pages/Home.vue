<template>
    <div id="home">
        <Header :type="'HeaderStandard'" v-if="profile != null" :profile="profile" />
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
                    if(response.data){
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
    max-width:100vw;
    columns: 340px 6;
    column-gap:0;
    align-items:center;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:50px;
    padding-top:130px;
}
@media screen and (max-width:600px){
    .card-container{
        padding:30px;
        padding-top:105px;
    }
}
</style>