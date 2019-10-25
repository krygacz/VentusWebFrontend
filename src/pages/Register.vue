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
                <span>I'm at least 13 years old<br>and I accept<a href="#" >our privacy policy</a></span>
                <label class="checkbox">
                    <input type="checkbox" required>
                    <span class="slider"></span>
                </label>
            </div>
            <button @click.prevent="register"  :class="{'visible':validated}" id="login"><i :class="{'spin': form_loading}" class="material-icons error">{{form_loading?'refresh':'arrow_forward'}}</i></button>
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
            picture: null,
            location: null,
            age: null,
            gender: false,
            link: null,
            emailStatus: 0,
            error: null,
            form_loading:false,
            validated:false
        }
    },
    methods:{
        checkValidation: function(){
            this.error = null;
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
        login: function(){
            let that = this;
            this.axios.post('/login_check',{username: this.email, password: this.password})
                .then((response) => {
                    if(response.data.token && response.data.refresh_token){
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('refresh_token', response.data.refresh_token);
                        that.$router.push({name:'home'});
                    } else that.error = "We couldn't log you in";
                })
                .catch((e) => {
                    that.error = 'There was an error: ';
                    if(e.response.data.error){
                        that.error = e.response.data.error;
                    } else {
                        that.error += e.message;
                    }
                    window.setTimeout(this.errorUpdate, 3500);
                })
                .finally(()=>{that.form_loading = false})
        },
        register: function(){
            if(!this.checkValidation()){
                return;
            }
            var that = this;
            this.form_loading = true;
            this.error = null;
            let formData = new FormData();
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('first_name', this.name);
            formData.append('location', this.location);
            formData.append('birthday', this.age.toString());
            formData.append('gender', this.gender?'male':'female');
            formData.append('messenger', this.link);
            if(this.picture){
                formData.append('picture', this.picture);
            }
            this.axios.post('/register',formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(() => {
                    this.login();
                })
                .catch((e) => {
                    that.error = 'Wystąpił błąd: ';
                    if(e.response.data.error){
                        that.error = e.response.data.error;
                    } else {
                        that.error += e.message;
                    }
                    that.form_loading = false;
                    window.setTimeout(that.checkValidation, 3500);
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
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding:15px;
    max-width:100vw;
    min-height:620px;
}
.container > img{
    display:block;
    box-sizing: border-box;
    width:44vw;
    max-width:450px;
    padding:20px;
    padding:40px;
}
.form{
    display:flex;
    flex-flow:row wrap;
    justify-content: space-between;
    align-content: center;
    width:42vw;
    max-width:420px;
    background: $card_background_color;
    border: 1px solid $border_color;
    padding:50px;
    padding-top:38px;
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
.form > .input-multiple-wrapper{
    display:flex;
    flex-flow: row nowrap;
    align-content:center;
    align-items:center;
    justify-content: space-between;
    box-sizing:border-box;
    width:100%;
    height: 50px;
    position: relative;
    margin-top:15px;
    margin-bottom:15px;
}
.input-multiple-wrapper span{
    padding:8px;
    display:inline-block;
    font-size:22px;
    font-family:'Segoe UI';
    font-weight:400;
    line-height:1.2;
    color:$primary_light;
}
.form > .checkbox-wrapper{
    margin-top:20px;
    margin-bottom:15px;
    padding-left:20px;
    padding-right:20px;
}
.checkbox-wrapper > span{
    color:$primary_dark;
    font-weight:400;
    font-size:17px;
    padding-left:0;
}
span > a, span > a:visited{
    color:$primary_light;
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
    padding:2px;
    padding-left:15px;
    padding-right:30px;
    border-radius:5px;
    border:2px solid $border_color;
    color: $primary_light;
    font-size:19px;
    font-family:'Concert One';
    font-weight:400;
    outline:none;
    box-shadow:none;
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
    border:2px solid $primary_light;
    border-radius: 50px;
    background-color: $primary_light;
    color: #fff;
    cursor:pointer;
    font-size:25px;
    font-weight:400;
    transition:all 300ms cubic-bezier(0.25, 0.1, 0.25, 1) 250ms;
    opacity:0;
    height:0;
    width:0;
    margin:-10px auto;
    pointer-events:none;
    outline:none;
    font-family: 'Material Icons'
}
.form > button:hover{
    transition-delay:0ms;
    transform:scale(1.04);
}
.form > button.visible{
    pointer-events:all;
    opacity:1;
    height:50px;
    width:100%;
    padding: 10px 20px;
    margin-top:30px;
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
    font-family: 'Concert One';
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
    font-size: 20px;
    font-family:'Concert One';
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
    padding-top:12px;
    border-radius:5px;
}
.switch-label::before {
	content: attr(data-off);
	color: white;
    background: $primary_light;
	backface-visibility: hidden;
}
.switch-label::after {
	content: attr(data-on);
    opacity: 0;
    color: white;
	background: $primary_light;
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


.checkbox {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 30px;
}

.checkbox input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 28px;
  width: 28px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

input:checked + .slider {
  background-color: $primary_light;
}


input:checked + .slider:before {
  transform: translateX(20px);
}


.inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
.inputfile + label {
    color: $primary_light;
    background-color: white;
    height:100%;
    box-sizing:border-box;
    font-family:'Concert One';
    border:2px solid $primary_light;
    border-radius:5px;
    padding-left:15px;
    padding-right:15px;
    align-items:center;
    display:flex;
    transition:all 300ms;
}

.inputfile:focus + label,
.inputfile + label:hover {
    color:white;
    background-color: $primary_light;
}
.inputfile + .accepted {
    color:white;
    background-color: $accent_teal;
    border-width:0px;
}
.inputfile + label {
	cursor: pointer;
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

@media screen and (max-width:899px) {
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
        padding-top:35px;
        width:90vw;
    }
    .container > form{
        width:90vw;
        box-shadow:none;
        border:none;
        border-radius:0;
        padding:10px;
        padding-bottom:50px;
        background:transparent;
    }
    .input-multiple-wrapper span{
        font-size:16px;
    }
}
@media screen and (max-height:700px) and (min-width:900px) {
    .container > form{
        transform:scale(0.9);
    }
}
</style>