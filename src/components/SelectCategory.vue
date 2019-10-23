<template>
    <div>
        <div class="category-container">
            <label class="switch" v-for="category in categories" :key="category.id">
                    <input v-model="category.selected" class="switch-input" type="checkbox"/>
                    <span class="switch-label">{{category.name}}</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectCategory',
    props: ['loading', 'profile'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            categories:[],
            errored:false
        }
    },

    mounted(){
        this.$emit('load', true);
        var that = this;
        this.axios.get('/category')
                .then((response) => {
                    if(response.data.length > 0){
                        that.categories = Object.assign({}, response.data, that.categories);
                    }else that.$emit('error', 'no data received');
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
                .finally(function(){that.$emit('load', false);})
    }
}
</script>

<style lang="scss" scoped>
.category-container{
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