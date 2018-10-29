<style lang="stylus" scoped src='./Camera.styl'></style>
<template>
  <div class="camera">
    <div class="camera__window-wrapper">
      <div class="camera__window" 
        ref='cameraWindow'
        :style='{
          backgroundImage: `url(${panoramicImage})`,
          backgroundPosition: `${position}px`,
          transform: `scale(${zoom})`,
          filter: `brightness(${brightness}%)`
        }'
        touch-action='none'
      />
    </div>
    <span>Zoom</span>
    <span> {{ zoom.toFixed(2) }}</span>
    <span>Brightness</span>
    <span>{{ brightness.toFixed(0) }}</span>
  </div>
</template>

<script lang="ts">
import panoramicImage from 'assets/panorama.jpg';
import Vue from 'vue';
import Camera from './Camera';

interface CameraComponentState {
  panoramicImage: string;
  camera: Camera | null;
}

export default Vue.extend({
  data(): CameraComponentState {
    return {
      panoramicImage,
      camera: null,
    };
  },
  mounted() {
    this.camera = new Camera(this.$refs.cameraWindow as HTMLElement, {
      zoom: 1,
      brightness: 100,
      position: 0,
    });
  },
  computed: {
    zoom(): number {
      return this.camera ? this.camera.zoom : 1;
    },
    brightness(): number {
      return this.camera ? this.camera.brightness : 100;
    },
    position(): number {
      return this.camera ? this.camera.position : 0;
    },
  },
});
</script>
