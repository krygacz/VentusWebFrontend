<template>
    <div>
        <div class="category-container">
            <label class="switch" v-for="category in categories" :key="category.id">
                    <input v-model="category.selected" class="switch-input" type="checkbox"/>
                    <span class="switch-label"><span>{{category.name}}</span></span>
            </label>
        </div>
    </div>
</template>

<script>
import EventBus from '../event-bus';
export default {
    name: 'SelectCategory',
    props: ['profile'],
    data(){
        return{
            categories:[]
        }
    },
    methods: {
        process: function(){
            EventBus.$emit('loading', true);
            let that = this;
            let checked = [];
            for(let cat of this.categories){
                if(cat.selected){
                    checked.push(cat.id);
                }
            }
            if(checked.length == 0){
                EventBus.$emit('loading', false);
                EventBus.$emit('error_popup', 'Please select at least one category');
                return;
            }
            this.api.post('/user/category/new', checked)
                .then(() => {
                    that.$router.push({name:'onboarding_specified', params:{stage:'interests'}});
                })
                .catch((e) => {
                    EventBus.$emit('error_major', e.messge);
                })
        }
    },
    mounted(){
        var that = this;
        EventBus.$on('header_done', this.process);
        this.axios.get('/category/')
            .then((response) => {
                if(response.data.length > 0){
                    for(var cat of response.data){
                        cat.selected = false;
                        that.categories.push(cat);
                    }
                }else EventBus.$emit('error_major');
            })
            .catch((e) => {
                EventBus.$emit('error_major', e.message);
            })
            .finally(function(){EventBus.$emit('loading', false);})
    }
}
</script>

<style lang="scss" scoped>
.category-container{
    display:flex;
    flex-flow: row wrap;
    align-items: top;
    align-content:flex-start;
    justify-content:space-between;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:80px;
    padding-top:150px;
}

.switch {
    display:inline-block;
	cursor: pointer;
    box-sizing:content-box;
    overflow:hidden;
    padding:20px;
}

.switch-input {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
    box-sizing:border-box;
    padding: 0;
	margin: 15px 0 0;
}
.switch-label {
	position: relative;
	display: flex;
    align-content: center;
    align-items:center;
    justify-content:center;
    justify-items:center;
	height: inherit;
    width:100%;
	font-size: 19px;
	border-radius: inherit;
    box-sizing:border-box;
    background:transparent;
    color: $primary_light;
    border: 4px solid $primary_light;
    border-radius:10px;
    padding: 20px 30px;
    transition: All 0.3s ease;
}
.switch-label > span{
    display:inline-block;
    font-family: 'Baloo Da 2';
    font-weight:600;
    font-size:26px;
    user-select:none;
}
.switch{
    @include children-colors;
}
.switch-input:checked ~ .switch-label {
    background: $primary_light;
    color:white;
}

@media screen and (max-width:700px){
    .switch{
        padding:10px;
    }
    .switch-label{
        padding: 12px 18px;
        
    }
    .switch-label > span{
        font-size: 22px;
    }
    .category-container{
        padding:46px;
        padding-top:100px;
    }
}
</style>