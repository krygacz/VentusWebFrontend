<template>
    <div class="container">
        <img src="@/assets/logo.svg" />
        <form class="form">
            <div  class="input-wrapper">
                <input @change="checkEmail" v-model="email" type="email" placeholder="E-mail" ref="email" required>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div class="input-wrapper">
                <input type="password" v-model="password" minlength="8" placeholder="Password" ref="password" required>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <button @click.prevent="process"  :disabled="emailStatus == 0" id="submit">
                <span v-if="emailStatus == 2">Register</span>
                <i v-if="emailStatus == 1" :class="{'spin': form_loading}" class="material-icons error">{{form_loading?'refresh':'arrow_forward'}}</i>
            </button>
        </form>
    </div>
</template>

<script>
import EventBus from '../event-bus';
export default {
    name: 'LoginPage',
    data(){
        return{
            form_loading: false,
            email: null,
            password: null,
            emailStatus: 0
        }
    },
    methods:{
        checkEmail: function(){
            var that = this;
            if(!this.$refs.email.checkValidity()){
                this.emailStatus = 0;
                return;
            }
            var vf = new FormData();
            vf.append("email", this.email);
            this.axios.post('/check_email',vf)
                .then((response) => {
                    if(response.data){
                        switch(response.data.status){
                            case 'login':
                                that.emailStatus = 1;
                                break;
                            case 'register':
                                that.emailStatus = 2;
                                break;
                            default:
                                EventBus.$emit('error_major');
                        }
                    } else {
                        EventBus.$emit('error_major');
                    }
                })
                .catch((e) => {
                    EventBus.$emit('error_major', e.message);
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
                        EventBus.$emit('loading', true);
                        setTimeout(()=>{that.$router.push({name:'home'});}, 100);
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
        },
        signup: function(){
            if(!this.$refs.password.checkValidity() || !this.$refs.email.checkValidity()){
                return;
            }
            var that = this;
            this.$router.push({name:'register', params:{email: that.email, password: that.password}});
        },
        process:function(){
            switch(this.emailStatus){
                case 0:
                    break;
                case 1:
                    this.login();
                    break;
                case 2:
                    this.signup();
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    display:flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-items:center;
    justify-content:space-around;
    position: relative;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    padding:15px;
    transition:all 200ms;
}
.container > img{
    display:block;
    width:70vw;
    max-width:450px;
    margin-bottom:10vh;
    margin-top:auto;
}
.form{
    margin-bottom:auto;
    display:flex;
    flex-flow:column nowrap;
    width:90vw;
    max-width:400px;
    padding-bottom:100px;
}

@include input-styling;
@include login-button-styling;
.form .input-wrapper{
    margin-top:15px;
    margin-bottom:0;
}
</style>