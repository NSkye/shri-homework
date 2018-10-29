<style lang="stylus" scoped src='./Footer.styl'></style>

<template>
  <footer class='footer'>
    <span v-for='(item, i) in footer.items' :key='i' class='footer__item'>
      <a v-bind:href='item.href' class='footer__link'>{{ item.title }}</a>
    </span>
    <span class='footer__copyright'>{{ footer.copyright }}</span>
  </footer>
</template>

<script lang="ts">
import config from '@/App.config';
import Vue from 'vue';
const { footer } = config;

export default Vue.extend({
  data() {
    return { footer };
  },
});
</script>
