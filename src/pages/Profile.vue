<template>
    <div id="profile">
        <Header :type="'HeaderStandard'" :profile="profile" />
        <div class="profile-container">
            <div class="details">
                <radial-progress-bar class="circle"
                        :diameter="140"
                       :completed-steps="user.percentage"
                       :total-steps="100"
                       :innerStrokeColor="'#dddddd00'"
                       :strokeWidth="9"
                       :startColor="(user.percentage>35)?(user.percentage>70)?'#46B29D':'#FEB74E':'#FFAD6F'"
                       :stopColor="(user.percentage>35)?(user.percentage>70)?'#46B29D':'#FEB74E':'#FFAD6F'">
                    <img src="@/assets/im.jpg" />
                </radial-progress-bar>
                <h1>Piast Bulgocki</h1>
                <h2>Góry Sowie, Poland</h2>
                <h3>24 lata</h3>
                <button id="contact">Wyślij prośbę o kontakt</button>
            </div>
            <div class="hobbies">
                <div class="progressbar" :class="{low:item.percentage<35, mid:item.percentage>= 35 && item.percentage < 70, high: item.percentage > 70}" v-for="item in user.hobbies" :key="item.id">
                    <span class="label">{{item.name}}</span>
                    <div class="progress-container"  >
                        <div class="progress-value" :style="{width: item.percentage + '%'}"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import RadialProgressBar from 'vue-radial-progress'
export default {
    name: 'ProfilePage',
    components: {
        Header,
        RadialProgressBar
    },
    props: ['loading', 'profile'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            user:{percentage:70},
            errored:false
        }
    }
}
</script>

<style lang="scss">
.profile-container{
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content:space-between;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:50px;
    padding-top:100px;
}
.profile-container > .details{
    width:50%;
    height:100%;
    display:flex;
    flex-flow:column nowrap;
    align-content: flex-start;
    justify-content: center;
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
.circle{
    justify-self:flex-start;
    align-self:flex-start;
    margin:auto;
}
.circle img{
    border-radius:50%;
    width:100%;
    height:100%;
    padding:13.1px;
    z-index:-1;
    box-sizing:border-box;
}
.radial-progress-inner{
    width:100%!important;
    height:100%!important;
    padding:0;
}
h1,h2,h3{
    align-self:flex-start;
    justify-self:flex-start;
    margin: auto;
    font-family:'Segoe UI';
    display:inline-block;
    text-align: center;
}
.details h1{
    color:$primary_dark;
    font-size:36px;
}
.details h2{
    font-weight:400;
    font-size: 20px;

}
.details h3{
    font-weight:300;
    font-size:18px;
}
.details #contact{
    align-self:center;
    justify-self: center;
    text-decoration: none;
    padding:15px;
    border:none;
    border-radius:80px;
    height:50px;
    width:300px;
    background:$primary_light;
}
</style>