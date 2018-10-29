<style lang="stylus" scoped src='./Header.styl'></style>

<template>
  <header class='fix-pos'>
    <div class='header'>
      <div 
        class="header__logo" 
        role="banner"
        aria-label="Яндекс Дом"
        :style='{
        "background-image": `url(${logo})`
        }' 
      />
    </div>
  </header>
</template>

<script lang="ts">
import logo from 'assets/logo.svg';
import Navigation from 'components/Navigation.vue';
import NavigationHamburgerButton from 'components/NavigationHamburgerButton.vue';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      logo,
      navOpen: false,
    };
  },
  methods: {
    toggleNav() {
      this.navOpen = !this.navOpen;
    },
  },
});
</script>
