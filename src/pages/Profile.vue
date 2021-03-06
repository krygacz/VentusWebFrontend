<template>
    <div id="profile">
        <Header :type="'HeaderStandard'" :profile="profile" />
        <div class="profile-container">
            <div class="details">
                <radial-progress-bar class="circle"
                    :diameter="140"
                    :completed-steps="user.match"
                    :total-steps="100"
                    :innerStrokeColor="'#dddddd00'"
                    :strokeWidth="9"
                    :startColor="(user.match>40)?(user.match>70)?'#46B29D':'#FEB74E':'#FFAD6F'"
                    :stopColor="(user.match>40)?(user.match>70)?'#46B29D':'#FEB74E':'#FFAD6F'">
                        <img loading="lazy" :src="(user.picture)?user.picture:'https://ventusapp.herokuapp.com/profile_placeholder.png'">
                </radial-progress-bar>
                <h1>{{user.name}}</h1>
                <h2>{{user.location}}</h2>
                <h3>Lat {{age}}</h3>
                <button id="contact" @click="message">Send message request</button>
            </div>
            <div class="hobbies">
                <div class="progressbar" :class="{low:item.percentage<35, mid:item.percentage>= 35 && item.percentage < 70, high: item.percentage > 70}" v-for="item in user.subcategories" :key="item.id">
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
import EventBus from '../event-bus';
export default {
    name: 'ProfilePage',
    components: {
        Header,
        RadialProgressBar
    },
    props: ['profile'],
    data(){
        return{
            user:{}
        }
    },
    computed: {
        age: function(){
            if(!this.user.birthday) return 'N/A';
            let d = new Date();
            let a = d.getFullYear() - this.user.birthday;
            if(a <= 0) return "N/A";
            return a;
        }
    },
    methods: {
        message: function(){
            if(!this.user.messenger){
                EventBus.$emit('error_popup', "This user didn't provide his contact info");
                return;
            }
            window.open(this.user.messenger);
        }
    },
    mounted(){
        var that = this;
        EventBus.$emit('loading', true);
        this.api.post('/user/' + this.$route.params.id)
                .then((response) => {
                    if(response.data.id){
                        that.user = Object.assign({}, response.data, that.user);
                    } else EventBus.$emit('error_major');
                })
                .catch((e) => {
                    EventBus.$emit('error_major', e.message);
                })
                .finally(function(){EventBus.$emit('loading', false);})
    }
}
</script>

<style lang="scss">
.profile-container{
    display:flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content:center;
    position:absolute;
    top:0;
    right:0;
    padding:40px;
    padding-top:120px;
    width:50%;
}
.profile-container > .details, .profile-container > .hobbies{
    box-sizing:border-box;
    height:100%;
    display:flex;
    flex-flow:column nowrap;
    align-items:center;
    align-content:center;
    justify-items: center;
    justify-content:center;
    flex-shrink:0;
    min-width:350px;
}
.profile-container > .details{
    position:fixed;
    left:0;
    top:0;
    bottom:0;
    width:50%;
}
.profile-container > .hobbies{
    position:relative;
    width:100%;
    padding:20px;
    padding-left:40px;
    padding-top:20px;
    padding-bottom:30px;
    justify-items: flex-start;
    justify-content:flex-start;
    flex:1;
}
.hobbies > .progressbar{
    width:90%;
    box-sizing: border-box;
    display:flex;
    flex-direction:row nowrap;
    justify-content:space-between;
    align-items:center;
    padding: 10px 0px 10px 0px;
}
.progressbar > .label{
    padding:0;
    padding-right:15px;
    margin:0;
    margin-top:1px;
    max-width:50%;
    color:$primary_darker;
    font-size:$progress_label_size_profile;
    font-family: 'Baloo Da 2';
    font-weight:600;
    line-height:1;
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    box-sizing: border-box;
}
.progressbar > .progress-container{
    width:60%;
    min-width:60%;
    height:12px;
    justify-self:flex-end;
    border-bottom-left-radius:12px 100%;
    border-top-left-radius:12px 100%;
    border-bottom-right-radius:12px 100%;
    border-top-right-radius:12px 100%;
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
    margin-bottom:25px;
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
    margin: 0 auto;
    font-family:'Baloo Da 2';
    display:inline-block;
    text-align: center;
    line-height:1;
}
.details h1{
    color:$primary_darker;
    font-size:36px;
    font-weight:700;
}
.details h2{
    color: $primary_dark;
    font-weight:400;
    font-size: 19px;
    margin-top:10px;
}
.details h3{
    color: $primary_light;
    font-weight:200;
    font-size:16px;
    margin-top:2px;
}
.details #contact{
    margin: 0;
    margin-top:15%;
    display:block;
    text-decoration: none;
    padding:8px;
    border:none;
    border-radius:80px;
    height:42px;
    min-height:42px;
    width:80%;
    max-width:430px;
    background:$primary_dark;
    color:white;
    font-family: 'Baloo Da 2';
    font-size:17px;
    font-weight:500;
    cursor:pointer;
    user-select:none;
    outline:none;
    transition:all 200ms ease-in-out;
}
.details #contact:hover{
    transform:scale(1.07);
}
@media screen and (max-width:850px){
.profile-container{
    width:100%;
    display:flex;
    flex-flow: column nowrap;
    align-content: center;
    align-items: center;
    justify-content:flex-start;
    justify-items:flex-start;
    padding:0px;
    padding-top:80px;
    padding-bottom:80px;
}
.profile-container > .details, .profile-container > .hobbies{
    max-width:100%;
    width:100%!important;
    height:auto;
    padding:20px;
}
.profile-container > .details{
    position:relative;
    left:initial;
    top:initial;
    bottom:initial;
    width:100%;
}
.details #contact{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    max-width:100%;
    min-width:100%;
    margin:0;
    border-radius:0;
    height:70px;
    z-index:999;
    font-size:21px;
    box-sizing:border-box;
}
.details #contact:hover{
    background:white;
    color:$primary_dark;
    transform:none;
}
}
</style>