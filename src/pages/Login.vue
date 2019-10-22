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
                <input type="password" v-model="password" minlength="8" placeholder="Hasło" ref="password" required>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <transition name="bttn">
                <button @click.prevent="login"  v-if="emailStatus == 1" id="login">Log in</button>
                <button @click.prevent="signup" v-if="emailStatus == 2" id="signup">Register</button>
            </transition>
            
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
            this.axios.post('/check_email',{email: this.email})
                .then((response) => {
                    switch(response.status){
                        case 200:
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
                            break;
                        default:
                            that.$emit('error', 'status ' + response.status);
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
        },
        login: function(){
            if(!this.$refs.password.checkValidity() || !this.$refs.email.checkValidity()){
                return;
            }
            var that = this;
            this.error = null;
            this.axios.post('/login',{email: this.email, password: this.password})
                .then((response) => {
                    switch(response.status){
                        case 200:
                            that.$router.push({name:'home'});
                            break;
                        case 401:
                            that.error = "Wystąpił błąd podczas logowania";
                            if(response.data.message){
                                that.error = response.data.error
                            }
                            break;
                        default:
                            that.$emit('error', 'status ' + response.status);
                    }
                })
                .catch((e) => {
                    that.$emit('error', e.message);
                })
        },
        signup: function(){
            if(!this.$refs.password.checkValidity() || !this.$refs.email.checkValidity()){
                return;
            }
            this.error = null;
            this.$router.push({name:'register', params:{email: this.email, password: this.password}});
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
}
.container > img{
    display:block;
    width:70vw;
    max-width:470px;
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
  display: inline-block;
  padding: 10px 20px;
  border:2px solid $primary_light;
  border-radius: 10px;
  background-color: $primary_light;
  color: #fff;
  cursor:pointer;
  margin:auto;
  margin-top:30px;
  font-size:18px;
  font-weight:400;
  transition: all 200ms;
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
    background: $error;
    color:white;
    transition:all 300ms;
}
.errormsg > span{
    position:relative;
    margin:auto;
    font-family: 'Segoe UI';
    font-weight:300;
    font-size:30px;
}
.er-enter-active, .er-leave-active {
  height:60px;
  opacity:1;
}
.er-enter, .er-leave-to{
  height:0;
  opacity:0;
}
.bttn-enter-active, .bttn-leave-active {
  transform:scale(1);
}
.bttn-enter, .bttn-leave-to{
  transform:scale(0);
}
</style>