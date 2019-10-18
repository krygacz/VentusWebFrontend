<template>
    <div class="container">
        <img src="@/assets/logo.svg" />
        <button v-on:click="login()" id="fb-button" class="fb-button">
            Sign in with Facebook
        </button>
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
    methods:{
        checkLogin: function(){
            var that = this;
            this.axios.get('/user')
                .then((response) => {
                    if(response.status != 200) {
                        alert("status " + response.status);
                    }
                    if(response.data.user){that.$router.push({name:'home'})}
                })
                .catch(() => {
                    this.errored = true;
                })
                .finally(function(){that.$emit('load', false);})
        },
        login: function(){
            var that = this;
            this.$emit('load', true);
            let w = window.open("https://ventusapi.herokuapp.com/connect/facebook/");
            var timer = setInterval(function() { 
                if(w.closed) {
                    clearInterval(timer);
                    that.checkLogin();
                }
            }, 500);
        }
        
    }
}
</script>

<style lang="scss" scoped>
.container{
    display:flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
}
.container > img{
    width:400px;
    margin-bottom:50px;
}
.fb-button {
  display: inline-block;
  padding: 8px 12px;
  border:none;
  border-radius: 3px;
  background-color: $primary_light;
  color: #fff;
  cursor:pointer;
  margin:20px;
  font-size:20px;
}
</style>