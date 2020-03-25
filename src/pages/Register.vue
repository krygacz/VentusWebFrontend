<template>
    <div class="container">
        <img src="@/assets/logo.svg" />
        <form @input="checkValidation()" class="form" ref="form">
            <div  class="input-wrapper">
                <input v-model="name" type="text" placeholder=" " ref="el1" required>
                <span>First Name</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper">
                <input v-model="location" type="text" placeholder=" " ref="el2" required>
                <span>Address</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper half">
                <input v-model="age" type="number" placeholder=" " ref="el3" required>
                <span>Birth year</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper half">
                <label class="switch">
                    <input v-model="gender" class="switch-input" type="checkbox"/>
                    <span class="switch-label" data-on="Male" data-off="Female"></span> 
                    <span class="switch-handle"></span> 
            </label>
            </div>
            <div  class="input-wrapper">
                <input v-model="link" type="url" placeholder=" " ref="el4" required>
                <span>Link to your Facebook profile</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div class="input-multiple-wrapper">
                <span>Profile picture:</span>
                <input @change="checkFile" type="file" name="file" id="file" class="inputfile"  ref="fileSelector"/>
                <label :class="{'accepted': this.picture != null}" for="file" ref="fileSelectorLabel">Choose a file</label>
            </div>
            <div class="input-multiple-wrapper checkbox-wrapper">
                <span>I'm at least 13 years old<br>and I accept <a href="https://www.privacypolicies.com/privacy/view/192fd91baaf7982a542ef4974e24236c">our privacy policy</a></span>
                <label class="checkbox">
                    <input type="checkbox" required>
                    <span class="slider"></span>
                </label>
            </div>
            <button @click.prevent="register"  :class="{'visible':validated}" id="login"><i :class="{'spin': form_loading}" class="material-icons error">{{form_loading?'refresh':'arrow_forward'}}</i></button>
        </form>
    </div>
</template>

<script>
import EventBus from '../event-bus';
export default {
    name: 'RegisterPage',
    props: ['email', 'password'],
    data(){
        return{
            name: null,
            picture: null,
            location: null,
            age: null,
            gender: false,
            link: null,
            emailStatus: 0,
            form_loading: false,
            validated: false
        }
    },
    methods:{
        checkValidation: function(){
            if(this.password == null || this.email == null){
                this.$router.push({name:'login'});
            }
            this.validated = this.$refs.form.checkValidity();
            return this.validated;
        },
        checkFile: function(){
            var fileName = '';
            if(!this.$refs.fileSelector.files[0]){
                this.picture = null;
                return;
            }
            fileName = this.$refs.fileSelector.files[0].name;
            this.picture = this.$refs.fileSelector.files[0];
            if( fileName ){this.$refs.fileSelectorLabel.innerHTML = fileName;}
        },
        register: function(){
            if(!this.checkValidation()) return;
            this.form_loading = true;
            let that = this;
            let formData = new FormData();
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('first_name', this.name);
            formData.append('location', this.location);
            formData.append('birthday', this.age.toString());
            formData.append('gender', this.gender?'male':'female');
            formData.append('messenger', this.link);
            if(this.picture) formData.append('picture', this.picture);
            this.axios.post('/register',formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(() => {
                    that.login();
                })
                .catch((e) => {
                    let err = 'There was an error: ';
                    if(e.response)
                        if(e.response.data.error)
                            err = e.response.data.error;
                        else err += e.message;
                    else err += e.message;
                    EventBus.$emit('error_popup', err);
                })
                .finally(() => {
                    that.form_loading = false;
                })
        },
        login: function(){
            var that = this;
            this.form_loading = true;
            this.axios.post('/login_check',{username: this.email, password: this.password})
                .then((response) => {
                    if(response.data.token && response.data.refresh_token){
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('refresh_token', response.data.refresh_token);
                        that.$router.push({name:'home'});
                    } else EventBus.$emit('error_major');
                })
                .catch((e) => {
                    let err = 'There was an error: ';
                    if(e.response.data.error){
                        err = e.response.data.error;
                    } else {
                        err += e.message;
                    }
                    EventBus.$emit('error_popup', err);
                })
                .finally(()=>{that.form_loading = false})
        }
        
    },
    mounted(){
        this.checkValidation();
    }
}
</script>

<style lang="scss" scoped>
.container{
    display:flex;
    flex-flow: row nowrap;
    align-items: center;
    align-content: center;
    justify-items:center;
    justify-content:space-evenly;
    position:absolute;
    top:0;
    left:50px;
    right:50px;
    bottom:0;
    padding:15px;
    max-width:100vw;
    min-height:620px;
    min-width:360px;
}
.container > img{
    display:block;
    box-sizing: border-box;
    width:44vw;
    max-width:450px;
    padding:40px;
    min-width:100px;
}
.form{
    display:flex;
    flex-flow:row wrap;
    justify-content: space-between;
    align-content: center;
    width:42vw;
    max-width:420px;
    min-width:300px;
    background: $card_background_color;
    border: 1px solid $border_color;
    padding:50px;
    padding-top:38px;
    margin-right:20px;
    border-radius:20px;
    box-shadow: 8px 8px 24px 0 $shadow_color_dark;
}

@include input-styling;
@include register-button-styling;
@include checkbox-input-styling;
@include switch-input-styling;
@include file-input-styling;

@media screen and (max-width:1199px) {
    .container {
        left:0;
        right:0;
    }
    .container > img{
        width:40vw;
    }
    .container > form{
        width:48vw;
        margin-right:50px;
        max-width:380px;
    }
}
@media screen and (max-width:1000px) {
    .container{
        flex-direction: column;
        justify-content:flex-start;
        justify-items:flex-start;
        align-content:center;
        align-items:center;
        min-height:auto;
        max-height:none;
        height:auto;
        padding-top:0;
    }
    .container > img{
        padding:40px;
        padding-top:50px;
        width:90vw;
        margin:0;
    }
    .container > form{
        width:90vw;
        box-shadow:none;
        border:none;
        border-radius:0;
        padding:10px;
        padding-bottom:50px;
        background:transparent;
        max-width:490px;
        margin:0;
        transform:scale(0.95);
        margin-top:-15px;
    }
    
}
@media screen and (max-width:800px) {
    .container > img{
        padding:40px;
        padding-top:35px;
        width:90vw;
        margin:0;
        max-width:350px;
    }
    .container > form{
        max-width:460px;
        transform:scale(0.9);
        margin-top:-36px;
    }
    
}
@media screen and (max-height:700px) and (min-width:900px) {
    .container > form{
        transform:scale(0.9);
    }
}
</style>