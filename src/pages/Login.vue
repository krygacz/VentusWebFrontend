<template>
    <div class="container">
        <img src="@/assets/logo.svg" />
        <form @input="errorUpdate" class="form">
            <div  class="input-wrapper">
                <input @change="checkEmail" v-model="email" type="email" placeholder="E-mail" ref="email" required>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div class="input-wrapper">
                <input type="password" v-model="password" minlength="8" placeholder="Hasło" ref="password" required>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <button @click.prevent="process"  :disabled="emailStatus == 0" id="submit">
                <span v-if="emailStatus == 2">Register</span>
                <i v-if="emailStatus == 1" :class="{'spin': form_loading}" class="material-icons error">{{form_loading?'refresh':'arrow_forward'}}</i>
            </button>
        </form>
        <transition name="er">
            <div v-if="error" class="errormsg"><span>{{error}}</span></div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    props: ['loading'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            form_loading: false,
            email: null,
            password: null,
            emailStatus: 0,
            error: null
        }
    },
    methods:{
        checkEmail: function(){
            var that = this;
            if(!this.$refs.email.checkValidity()){
                this.emailStatus = 0;
                return;
            }
            this.error = null;
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
                                that.$emit('error', 'wrong response from backend');
                        }
                    } else {
                        that.$emit('error', 'no data');
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
        },
        login: function(){
            var that = this;
            this.error = null;
            this.form_loading = true;
            this.axios.post('/login',{email: this.email, password: this.password}, {crossDomain:true, withCredentials:true})
                .then((response) => {
                    // eslint-disable-next-line
                    console.log(response);
                    // eslint-disable-next-line
                    console.log(document.cookie);
                    if(response.data.logged == 'yes'){
                        this.axios.get('/user',{crossDomain:true, withCredentials:true})
                            // eslint-disable-next-line
                            .then((r)=>{console.log(r)})
                            // eslint-disable-next-line
                            .catch((e)=>{console.log(e)});
                        //that.$router.push({name:'home'});
                    } else that.error = "Wystąpił błąd przy logowaniu";
                })
                .catch((e) => {
                    that.error = 'Wystąpił błąd: ';
                    if(e.response.data.error){
                        that.error = e.response.data.error;
                    } else {
                        that.error += e.message;
                    }
                    window.setTimeout(this.errorUpdate, 3500);
                })
                .finally(()=>{that.form_loading = false})
        },
        signup: function(){
            if(!this.$refs.password.checkValidity() || !this.$refs.email.checkValidity()){
                return;
            }
            this.error = null;
            this.$router.push({name:'register', params:{email: this.email, password: this.password}});
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
        },
        errorUpdate: function(){
            this.error = null;
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
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    transition:all 200ms;
}
.container > img{
    display:block;
    width:70vw;
    max-width:500px;
    margin-bottom:12vh;
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
.form .input-wrapper{
    box-sizing:border-box;
    width:100%;
    height: 50px;
    position: relative;
    margin-top:15px;
}
.input-wrapper > input{
    box-sizing:border-box;
    position:relative;
    width:100%;
    height:100%;
    top:0;
    right:0;
    left:0;
    bottom:0;
    background:transparent;
    padding:10px;
    padding-left:15px;
    padding-right:30px;
    border-radius:5px;
    border:2px solid $border_color;
    color: $primary_light;
    font-size:18px;
    font-family:'Segoe UI';
    font-weight:600;
    outline:none;
    transition:all 200ms;
}
.input-wrapper > input::placeholder{
    color:$primary_light;
    opacity:0.7;
}
.input-wrapper > input:focus, .input-wrapper > input:not(:placeholder-shown){
    border-width:4px;
}
.form input:valid{
    border-color: $primary_light;
    color: $primary_light;
}
.form input:invalid{
    border-color:$accent_orange;
    color: $accent_orange;
}
.input-wrapper > input:placeholder-shown{
    border:2px solid $border_color;
    color: $primary_light;
}

.input-wrapper >  i.material-icons{
    opacity:0;
    position:absolute;
    right:15px;
    top:50%;
    transform:translateY(-50%);
    color:transparent;
    transition: opacity 200ms;
    transition-delay:100ms;
    pointer-events:none;
    user-select:none;
    z-index:-1;
}
input:valid ~ .ok{
    opacity:0.4;
    color: $primary_light;
    transition-delay:0ms;
}
input:invalid ~ .error{
    opacity:1;
    color: $accent_orange;
    transition-delay:0ms;
}
input:placeholder-shown ~ .ok,input:placeholder-shown ~ .error{
    opacity:0;
}
.form > button{
    width:auto;
    display: flex;
    align-items:center;
    align-content:center;
    justify-content:center;;
    width:50%;
    min-width:100px;
    height:0;
    border:2px solid $primary_light;
    border-radius: 40px;
    background-color: $primary_light;
    color: #fff;
    cursor:pointer;
    margin:auto;
    margin-top:0;
    font-size:18px;
    font-weight:400;
    transform:scale(0);
    opacity:0;
    transform-origin:top center;
    outline:none;
    pointer-events:none;
    transition: all 250ms;
}
.form > button:hover{
    transform:scale(1.05);
}
.form > button > i.material-icons{
    justify-self:center;
    align-self:center;
    padding:5px;
}
.form > button > span{
    font-size:17px;
    font-family:'Segoe UI';
    margin-top:-2px;
}
.login{
    color:white;
    background-color:$primary_light;
    border-color:$primary_light;
}
.register{
    color:$primary_light;
    background-color:transparent;
    border-color:$primary_light;
}
.errormsg{
    position:fixed;
    left:0;
    right:0;
    top:0;
    height:60px;
    display:flex;
    justify-content: center;
    align-content: center;
    background: $error_light;
    color:white;
    transition:all 250ms;
}
.errormsg > span{
    position:relative;
    margin:auto;
    font-family: 'Segoe UI';
    font-weight:300;
    font-size:28px;
}
.er-enter-active, .er-leave-active {
  height:60px;
  opacity:1;
}
.er-enter, .er-leave-to{
  height:0;
  opacity:0.5;
}
.form > button:not(:disabled){
    margin-top:32px;
    height:40px;
    opacity:1;
    transform-origin:top center;
    transform: scale(1);
    pointer-events:all;
}
.spin {
  animation-name: spin;
  animation-duration:1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}
</style>