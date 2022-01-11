<template>
  <div>
    <Header/>
    <div class="view-container">
      <router-view />
    </div>
    <Footer/>
  </div>
</template>
<script>
import { } from 'vuex'
import Header from '../src/components/Header.vue'
import Footer from '../src/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  beforeCreate() {
		this.$store.commit('initialiseUserStore');
	}
}
</script>
<style lang="scss">

  .view-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 15px;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #ffd7d7;
  }
    a {
      font-weight: bold;
      color: #000000;
    }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #000000;

      &.router-link-exact-active {
        color: #6c757d;
      }
    }
  }
  .btn{
    margin-top: 25px;
    border-radius: 20px;
  }
  textarea {
    resize: none;
  }
  .formul {
    margin: 0 auto;
  }
  textarea.form-control{
    margin: 25px auto 0;
    border-radius: 35px;
    height: 80px;
    padding: 10px 20px;
  }
  label {
    font-weight: bold;
    margin-top: 25px;
  }
    h2 {
    font-size: 23px;
    margin: 25px 0 0 0 ;
  }
  p.card_subtitle {
    margin: 25px 0 0 0;
  }
  .form-control {
    border-radius: 17px;
  }
  a {
    text-decoration: none;
  }
  .hidden {
    display: none;
  }
  p.error {
    margin-top: 25px;
    color: red;
    font-weight: bold;
  }
  img{
    vertical-align: middle;
    max-width: 400px;
}
</style>
