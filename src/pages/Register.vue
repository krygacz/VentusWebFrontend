<template>
    <div class="container">
        <img src="@/assets/logo.svg" />
        <form @change="checkValidation()" class="form" ref="form">
            <div  class="input-wrapper">
                <input v-model="name" type="text" placeholder=" " ref="el1" required>
                <span>Imię i nazwisko</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper">
                <input v-model="location" type="text" placeholder=" " ref="el2" required>
                <span>Miejsce zamieszkania</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper half">
                <input v-model="age" type="number" placeholder=" " ref="el3" required>
                <span>Wiek</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <div  class="input-wrapper half">
                <label class="switch">
                    <input v-model="gender" class="switch-input" type="checkbox"/>
                    <span class="switch-label" data-on="Mężczyzna" data-off="Kobieta"></span> 
                    <span class="switch-handle"></span> 
            </label>
            </div>
            <div  class="input-wrapper">
                <input v-model="link" type="url" placeholder=" " ref="el4">
                <span>Link do Facebooka / Messengera</span>
                <i class="material-icons ok">done</i>
                <i class="material-icons error">close</i>
            </div>
            <button @click.prevent="register"  :class="{'visible':validated}" id="login">arrow_forward</button>
        </form>
        <transition name="er">
            <div v-if="error" class="errormsg"><span>{{error}}</span></div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'RegisterPage',
    props: ['loading', 'email', 'password'],
    model:{
        prop: 'loading',
        event:'load'
    },
    data(){
        return{
            name: null,
            location: null,
            age: null,
            gender: false,
            link: null,
            emailStatus: 0,
            error: null,
            validated:false
        }
    },
    methods:{
        checkValidation: function(){
            this.validated = this.$refs.form.checkValidity();
            return this.validated;
        },
        register: function(){
            if(!this.checkValidation()){
                return;
            }
            var that = this;
            this.error = null;
            this.axios.post('/register',{email: this.email, password: this.password, name: this.name, location: this.location, gender: this.gender, birthday: this.age, messenger:this.link})
                .then((response) => {
                    switch(response.status){
                        case 200:
                            that.$router.push({name:'home'});
                            break;
                        case 401:
                            that.error = "Wystąpił błąd podczas rejestracji";
                            if(response.data.error){
                                that.error = response.data.error
                            }
                            break;
                        default:
                            that.$emit('error', 'status ' + response.status);
                    }
                })
                .catch(() => {
                    that.error = "Wystąpił błąd podczas rejestracji";
                })
        }
        
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
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
}
.container > img{
    display:block;
    width:40vw;
    max-width:400px;
    padding-bottom:40px;
}
.form{
    display:flex;
    flex-flow:row wrap;
    justify-content: space-between;
    align-content: center;
    width:45vw;
    max-width:430px;
    background: $card_background_color;
    border: 1px solid $border_color;
    padding:50px;
    border-radius:20px;
    box-shadow: 8px 8px 24px 0 $shadow_color_dark;
}
.form .input-wrapper{
    box-sizing:border-box;
    width:100%;
    height: 50px;
    position: relative;
    margin-top:20px;
    margin-bottom:15px;
}
.form > .half{
    max-width:calc(50% - 15px);

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
.input-wrapper > span {
    padding:15px;
    padding-top:13px;
    position:absolute;
    left:0;
    top:0;
    transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
    font-size:18px;
    font-family:'Segoe UI';
    font-weight:600;
    color:$primary_light;
    opacity:0.7;
    pointer-events:none;
}
.input-wrapper > input:placeholder-shown{
    border:2px solid $border_color;
    color: $primary_light;
}
.input-wrapper > input:focus, .input-wrapper > input:not(:placeholder-shown){
    border-width:3px;
}
.form input:valid:not(:placeholder-shown), .form input:valid:not(:placeholder-shown) + span{
    border-color: $primary_light;
    color: $primary_light;
}
.form input:invalid:not(:placeholder-shown),.form input:invalid:not(:placeholder-shown) + span{
    border-color:$accent_orange;
    color: $accent_orange;
}
.input-wrapper > input:focus + span, .input-wrapper > input:not(:placeholder-shown) + span {
    opacity:1;
    padding-left:10px;
    transform-origin:center left;
    transform: scale(0.75) translateY(-100%);
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
    width:100%;
    height:50px;
    display: inline-block;
    padding: 10px 20px;
    border:2px solid $primary_light;
    border-radius: 50px;
    background-color: $primary_light;
    color: #fff;
    cursor:pointer;
    margin:auto;
    margin-top:30px;
    font-size:25px;
    font-weight:400;
    transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
    opacity:0;
    transform:scaleX(0);
    pointer-events:none;
    font-family: 'Material Icons'
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
  opacity:0.5;
}




.switch {
	display: block;
	width: 100%;
	height: 100%;
	cursor: pointer;
    box-sizing:border-box;
    overflow:hidden;
}
.switch-input {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
    box-sizing:border-box;
    padding: 0;
	margin: 15px 0 0;
}
.switch-label {
	position: relative;
	display: block;
	height: inherit;
	font-size: 19px;
	border-radius: inherit;
    box-sizing:border-box;
    transition: All 0.3s ease;
}
.switch-label:before, .switch-label:after {
	position: absolute;
	transition: inherit;
    box-sizing:border-box;
    width: 100%;
	height: 100%;
	top: 0;
	left: 0;
    text-align: center;
    padding-top:10px;
    border-radius:5px;
}
.switch-label::before {
	content: attr(data-off);
	color: white;
    background: $accent_teal;
	backface-visibility: hidden;
}
.switch-label::after {
	content: attr(data-on);
    opacity: 0;
    color: white;
	background: $accent_orange;
	backface-visibility: hidden;
	transform: rotateY(180deg);
}
.switch-input:checked ~ .switch-label {
    background: #FFF;
}
.switch-input:checked ~ .switch-label::before {
    opacity:0;
	transform: rotateY(180deg);
}
.switch-input:checked ~ .switch-label::after {
    opacity:1;
	transform: rotateY(0);
}
.form > button.visible{
    pointer-events:all;
    opacity:1;
    transform:scaleX(1)
}



</style>