<template>
    <div v-if="current" class="category-container">
        <div class="interest">
            <transition name="slide-left" mode="out-in">
                <div class="label" :key="current.id">
                    <span class="small">{{current.category_name}}</span>
                    <span class="big">{{current.name.toUpperCase()}}</span>
                </div>
            </transition>
        </div>
        <vue-slider :processStyle="style" ref="slider" class="slider" v-bind="sliderOptions" @drag-end="next" v-model="current.percentage">
        </vue-slider>
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
                tooltip:'none',
                useKeyboard:false,
                railStyle:{
                    background:'rgba(0,0,0,0.10)'
                },
                dotStyle:{
                    outline:'none',
                }
            }
        }
    },
    computed:{
        style: function(){
            return {'background-color': (this.current.percentage < 35)?'#FFAD6F':(this.current.percentage < 70)?'#FEB74E':'#46B29D'}
        }
    },
    methods: {
        load: function(){
            if(this.categories.length == 0){
                return false;
            }
            this.current = this.categories.shift();
            if(this.$refs.slider){
                this.$refs.slider.setValue(50);
            }
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
    flex-flow: column nowrap;
    align-items: center;
    align-content:center;
    justify-content:space-evenly;
    justify-items:center;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:40px;
    padding-top:120px;
}
.interest{
    display:flex;
    flex-flow:column nowrap;
    align-items: center;
    align-content:center;
    justify-content:center;
    justify-items:center;
}
.interest > .label{
    display:flex;
    flex-flow:column nowrap;
    align-items: center;
    align-content:center;
    justify-content:center;
    justify-items:center;
    height:30vw;
    max-height:290px;
    
    transition: all 200ms ease-in-out;
}
.interest > .label > .big{
    font-size:48px;
    font-family:'Concert One';
    font-weight:400;
    color:$primary_dark;
    padding:25px;
    padding-bottom:35px;
    margin:auto;
}
.interest > .label > .small{
    font-size:22px;
    font-family:'Concert One';
    font-weight:200;
    padding:10px;
    padding-left: 18px;
    padding-right:18px;
    background:$accent_teal;
    color:white;
    border-radius:7px;
}
.slider{
    justify-self:center;
    min-height:20px;
    width:80vw!important;
    max-width:550px;
}
.fade-enter-active, .fade-leave-active {
  opacity:1;
  
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 300ms cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

</style>