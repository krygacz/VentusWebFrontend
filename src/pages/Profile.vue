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
                    :startColor="(user.percentage>40)?(user.percentage>70)?'#46B29D':'#FEB74E':'#FFAD6F'"
                    :stopColor="(user.percentage>40)?(user.percentage>70)?'#46B29D':'#FEB74E':'#FFAD6F'">
                        <img :src="user.picture" />
                </radial-progress-bar>
                <h1>{{user.first_name + ' ' + user.last_name}}</h1>
                <h2>{{user.location}}</h2>
                <h3>Lat {{user.age}}</h3>
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
            user:{},
            errored:false
        }
    },
    mounted(){
        this.$emit('load', true);
        var that = this;
        this.api.get('/profile/' + this.$route.params.id)
                .then((response) => {
                    if(response.status != 200) {
                        that.$emit('error', 'status ' + response.status);
                    }
                    if(response.data.user){
                        that.user = Object.assign({}, response.data, that.user);
                    }else that.$emit('error', 'no data received');
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
                .finally(function(){that.$emit('load', false);})
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
    left:0;
    right:0;
    bottom:0;
    padding:50px;
    padding-top:100px;
}
.profile-container > .details, .profile-container > .hobbies{
    width:50%;
    box-sizing:border-box;
    height:100%;
    display:flex;
    flex-flow:column nowrap;
    align-items:center;
    align-content:center;
    justify-items: center;
    justify-content:center;
    flex-shrink:0;
    min-width:250px;
}
.profile-container > .hobbies{
    padding:20px;
    padding-left:40px;
    padding-top:30px;
    align-items:center;
    align-content:center;
    justify-items: flex-start;
    justify-content:flex-start;
}
.hobbies > .progressbar{
    width:90%;
    box-sizing: border-box;
    display:flex;
    flex-direction:row nowrap;
    justify-content:space-between;
    align-items:center;
    padding: 7px 0px 7px 0px;
}
.progressbar > .label{
    padding:0;
    margin:0;
    margin-top:-4px;
    color:$primary_darker;
    font-size:18px;
    font-weight:400;
    font-family:'Segoe UI';
}
.progressbar > .progress-container{
    width:60%;
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
    margin-bottom:8px;
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
    font-family:'Segoe UI';
    display:inline-block;
    text-align: center;
}
.details h1{
    color:$primary_darker;
    font-size:35px;
    font-weight:700;
}
.details h2{
    color: $primary_dark;
    font-weight:400;
    font-size: 17px;
    margin-top:6px;
}
.details h3{
    color: $primary_light;
    font-weight:300;
    font-size:17px;
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
    width:100%;
    max-width:430px;
    background:$primary_dark;
    color:white;
    font-family: 'Segoe UI';
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:all 200ms ease-in-out;
}
.details #contact:hover{
    transform:scale(1.07);
}

</style>