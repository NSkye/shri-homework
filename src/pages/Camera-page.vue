<template>
  <div class="container">
    <Camera />
  </div>
</template>

<script lang="ts">
import Camera from 'components/Camera.vue';
import Vue from 'vue';

export default Vue.extend({
  components: {
    Camera,
  },
});
</script>

<style lang="stylus" scoped>
.container
  display grid
  justify-content center
  align-items center
  width 100%
  height 100%
  font-size 20px
</style>
