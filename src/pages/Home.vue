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
import EventBus from '../event-bus';
export default {
    name: 'HomePage',
    components: {
        Header,
        UserCard
    },
    props: ['profile'],
    data(){
        return{
            recommendations:[]
        }
    },
    mounted(){
        EventBus.$emit('loading', true);
        this.api.get('/user/recommendations')
            .then((response) => {
                if(response.data){
                    this.recommendations = Object.assign({}, response.data, this.recommendations);
                } else {
                    EventBus.$emit('error_major');
                }
            })
            .catch((e) => {
                EventBus.$emit('error_major', e.message);
            })
            .finally(function(){EventBus.$emit('loading', false);})
    }
}
</script>

<style lang="scss" scoped>
.card-container{
    max-width:100vw;
    columns: 340px 3;
    column-gap:0;
    align-items:center;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:50px;
    padding-top:130px;
    white-space: nowrap;
}
@media screen and (max-width:600px){
    .card-container{
        padding:30px;
        padding-top:105px;
    }
}
</style>