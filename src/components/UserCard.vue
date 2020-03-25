<template>
    <div class="card" @click="profile">
        <div class="head">
            <img loading="lazy" :src="(card.picture)?card.picture:'https://ventusapp.herokuapp.com/profile_placeholder.png'">
            <span class="big">{{card.name}}</span>
            <span class="small">{{card.location}}</span>
        </div>
        <div class="match-info">
            <div class="progressbar" :class="{low:item.percentage<35, mid:item.percentage>= 35 && item.percentage < 70, high: item.percentage > 70}" v-for="item in card.top" :key="item.id">
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
    methods:{
        profile: function(){
            this.$router.push({name:'profile', params:{id: this.card.id}})
        }
    }
    
}
</script>

<style lang="scss" scoped>
.card{
    max-width:310px;
    min-width:220px;
    height:auto;
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
    padding-bottom:20px;
    padding-top:24px;
    margin:0 auto;
    margin-bottom:40px;
    color:$primary_darker;
    cursor:pointer;
    box-shadow: 2px 3px 7px 0px $shadow_color;
    font-family:'Baloo Da 2';
    break-inside: avoid-column;
    transform:translateZ(0); //Chrome shadow cropping fix
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
    text-overflow:ellipsis;
}
.head > span{
    padding:0;
    margin:0;
    justify-self:left;
    display:inline-block;
    width:100%;
    overflow:hidden;
    text-overflow: ellipsis;
    box-sizing:border-box;
}
.head > img{
    grid-area: 1 / 1 / 3 / 2;
    height:50px;
    width:50px;
    padding:5px;
    border-radius:100%;
}
.head > .big{
    grid-area: 1 / 2 / 2 / 4;
    align-self:flex-end;
    font-size:$card_header;
    font-weight: 600;
    color:$primary_dark;
    line-height:1.2;
}
.head > .small{
    grid-area: 2 / 2 / 3 / 4;
    align-self:flex-start;
    font-size:$card_details;
    font-weight:500;
    line-height:1.2;
}
.card > .match-info{
    display:flex;
    flex-flow:column nowrap;
    width:100%;
    height:auto;
    padding-top:16px;
}
.match-info > .progressbar{
    width:100%;
    box-sizing: border-box;
    display:flex;
    flex-direction:row nowrap;
    justify-content:space-between;
    align-items:center;
    padding: 6px 0px 6px 0px;
}
.progressbar > .label{
    display:block;
    max-width:50%;
    padding:0;
    padding-right:10px;
    margin:0;
    margin-top:-2px;
    font-size:$progress_label_size;
    font-family: 'Baloo Da 2';
    line-height:1;
    font-weight:600;
    white-space: nowrap;
    text-overflow:ellipsis;
    box-sizing:border-box;
}
.progressbar > .progress-container{
    width:50%;
    min-width:50%;
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
@media screen and (max-width:1135px){
    .card{
        max-width:330px;
    }
}
@media screen and (max-width:800px){
    .card{
        width:90%;
        max-width: 400px;
    }
}
</style>