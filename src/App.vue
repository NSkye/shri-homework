<template>
  <div class="app">
    <Header />
    <Main />
    <Footer />
  </div>
</template>

<script lang="ts">
import Footer from 'components/Footer.vue';
import Header from 'components/Header.vue';
import Main from 'components/Main.vue';
import Vue from 'vue';

export default Vue.extend({
  components: {
    Header,
    Main,
    Footer,
  },
});
</script>

<style lang="stylus" scoped>
.app
  display flex
  flex-direction column
  min-height 100vh
  font-family Arial, Helvetica, sans-serif
</style>
