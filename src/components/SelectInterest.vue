<template>
    <div>
        <transition name="fade">
            <div v-if="current" class="category-container">
                <div class="interest">
                    <div class="label">
                        <span class="small">{{current.name}}</span>
                        <span class="big">{{current.name}}</span>
                    </div>
                    <vue-slider class="slider" v-bind="sliderOptions" @drag-end="next" v-model="current.percentage"></vue-slider>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
export default {
    name: 'SelectInterest',
    props: ['profile'],
    components:{
        VueSlider
    },
    data(){
        return{
            categories:[],
            current: null,
            total: 0,
            errored:false,
            sliderOptions:{
                contained:true,
                height:20,
                dotSize:30,
                dragOnClick:true,
                lazy:true,
                tooltip:'none',
                useKeyboard:false,
                processStyle:{
                    background:'#FFAD6F'
                },
                railStyle:{
                    background:'rgba(0,0,0,0.10)'
                },
                dotStyle:{
                    outline:'none',
                }
            }
        }
    },
    methods: {
        load: function(){
            if(this.categories.length == 0){
                return false;
            }
            this.current = this.categories.shift();
            this.current.percentage = 50;
            return true;
        },
        next: function(){
            let that = this;
            if(!this.current){
                return false;
            }
            this.api.post('/user/subcategory/new', {subcategory: this.current.id, percentage: this.current.percentage})
                .then(() => {
                    if(!that.load()){
                        that.$emit('ready');
                        that.$router.push({name: 'home'});
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
        },
        process: function(){
            this.categories = [];
            this.next();
        }
    },
    mounted(){
        var that = this;
        this.api.post('/user/recommended_subcategories')
            .then((response) => {
                if(response.data.length > 0){
                    that.total = response.data.length;
                    for(var cat of response.data){
                        cat.selected = false;
                        that.categories.push(cat);
                    }
                    that.load();
                }else that.$emit('error', 'no data received');
            })
            .catch((e) => {
                that.$emit('error', e.message);
            })
            .finally(function(){that.$emit('ready');})
    }
}
</script>

<style lang="scss" scoped>
.category-container{
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content:center;
    justify-content:center;
    justify-items:center;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:80px;
    padding-top:150px;
}
.interest{
    width:90vw;
    max-width:500px;
    height:100%;
    display:flex;
    flex-flow:column nowrap;
    align-items: center;
    align-content:center;
    justify-content:center;
    justify-items:center;
    padding-bottom:100px;
}
.interest > .label{
    display:flex;
    flex-flow:column nowrap;
    align-items: center;
    align-content:center;
    justify-content:center;
    justify-items:center;
    height:30vw;
    max-height:450px;
}
.interest > .label > .big{
    font-size:40px;
    font-family:'Segoe UI';
    font-weight:200;
    padding:40px;
    padding-left: 30px;
    padding-right:30px;
    color:$primary_dark;
}
.interest > .label > .small{
    font-size:23px;
    font-family:'Segoe UI';
    font-weight:200;
    padding:10px;
    padding-left: 18px;
    padding-right:18px;
    background:$accent_teal;
    color:white;
    border-radius:7px;
}
.interest > .slider{
    display:block;
    width:100%!important;
}
.fade-enter-active, .fade-leave-active {
  opacity:1;
  transition: opacity 200ms ease-in-out;
  transition-delay:200ms;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}

</style>
