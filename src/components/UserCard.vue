<template>
    <div class="card" >
        <div class="head">
            <img src=""/>
            <span class="big">{{card.name}}</span>
            <span class="small">{{card.location}}</span>
        </div>
        <div class="match-info">
            <div class="progressbar" :class="{low:item.percentage<35, mid:item.percentage>= 35 && item.percentage < 70, high: item.percentage > 70}" v-for="item in card.hobbies" :key="item.id">
                <span class="label">{{item.name}}</span>
                <div class="progress-container"  >
                    <div class="progress-value" :style="{width: item.percentage + '%'}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserCard',
    props: ['card'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            errored:false
        }
    }
    
}
</script>

<style lang="scss" scoped>
.card{
    width:300px;
    height:200px;
    border:1px solid $border_color;
    border-radius:10px;
    background-color:$card_background_color;
    display:flex;
    flex-flow:column nowrap;
    justify-items: center;
    align-content:flex-start;
    align-items:flex-start;
    box-sizing: border-box;
    padding:28px;
    margin:30px;
    color:$primary_darker;
    box-shadow: 2px 3px 7px 0px $shadow_color;
}
.card > .head{
    height:50px;
    width:100%;
    align-self: flex-start;
    display: grid;
    grid-template-columns: 50px repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap:0;
    grid-column-gap: 20px;
    justify-items:center;
    align-items: center;
    overflow:hidden;
}
.head > span{
    padding:0;
    margin:0;
    justify-self:left;
}
.head > img{
    grid-area: 1 / 1 / 3 / 2;
    height:100%;
    width:100%;
    padding:5px;
    border-radius:100%;
}
.head > .big{
    grid-area: 1 / 2 / 2 / 4;
    align-self:center;
    font-size:15px;
    font-weight: 600;
    color:$primary_dark;
}
.head > .small{
    grid-area: 2 / 2 / 3 / 4;
    align-self:flex-start;
    font-size:12px;
    font-weight:400;
}
.card > .match-info{
    display:flex;
    flex-flow:column nowrap;
    width:100%;
    height:auto;
    padding-top:15px;
}
.match-info > .progressbar{
    width:100%;
    box-sizing: border-box;
    display:flex;
    flex-direction:row nowrap;
    justify-content:space-between;
    align-items:center;
    padding: 5px 0px 5px 0px;
}
.progressbar > .label{
    padding:0;
    margin:0;
    margin-top:-2px;
    font-size:14px;
}
.progressbar > .progress-container{
    width:50%;
    height:9px;
    justify-self:flex-end;
    border-bottom-left-radius:9px 100%;
    border-top-left-radius:9px 100%;
    border-bottom-right-radius:9px 100%;
    border-top-right-radius:9px 100%;
    overflow:hidden;
}
.progressbar > .progress-container::before{
    content: "";
    display:block;
    position: relative;
    top: 0; 
    left: 0;
    width: 100%; 
    height: 100%;  
    opacity: .3; 
}
.progress-container > .progress-value{
    position:relative;
    height:100%;
    width:50%;
    justify-self:left;
    background-color:$accent_teal;
    transform:translateY(-100%);
    animation:prog 900ms ease-in-out 100ms 1;
}
.low .progress-container::before, .low .progress-value{
    background-color: $accent_orange;
}
.mid .progress-container::before, .mid .progress-value{
    background-color: $accent_yellow;
}
.high .progress-container::before, .high .progress-value{
    background-color: $accent_teal;
}
@keyframes prog{
    from{
        width:0;
    }
}
</style>