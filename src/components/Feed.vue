<style lang="stylus" scoped src='./Feed.styl'></style>
<script lang="ts">
import { AudioStatsProcessor, VideoStatsProcessor } from '@/logic/Feed';
import { AnimatedFeed, VideoElementStyle, ComponentStyle } from '@/logic/Feed';
import Vue from 'vue';

interface State {
  audioProcessor: AudioStatsProcessor | null;
  videoProcessor: VideoStatsProcessor | null;
  animation: AnimatedFeed | null;
  showControls: boolean;
  brightness: string;
  contrast: string;
}

export default Vue.extend({
  data(): State {
    return {
      audioProcessor: null,
      videoProcessor: null,
      animation: null,
      showControls: false,
      brightness: '100',
      contrast: '100',
    };
  },
  mounted() {
    const videoContainer: HTMLVideoElement = this.$refs.videoContainer as HTMLVideoElement;

    interface windowWithHLS extends Window {
      Hls?: any
    }

    const globalNameSpace = window as windowWithHLS;
    const HLS = globalNameSpace.Hls;
    if (HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(this.source);
      hls.attachMedia(videoContainer);
      hls.on(HLS.Events.MANIFEST_PARSED, () => videoContainer.play());
    }
    const canvas : HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
    this.audioProcessor = new AudioStatsProcessor(videoContainer);
    this.videoProcessor = new VideoStatsProcessor(videoContainer, canvas);
    this.animation = new AnimatedFeed(
      this.$refs.wrapperDiv as HTMLElement,
      this.$refs.videoDiv as HTMLElement
    );
  },
  computed: {
    volumeLevel(): number {
      if (!this.audioProcessor) { return 0; }
      return this.audioProcessor.volumeLevel;
    },
    brightnessLevel(): number {
      if (!this.videoProcessor) { return 0; }
      return this.videoProcessor.brightnessLevel;
    },
    motionLevel(): number {
      if (!this.videoProcessor) { return 0; }
      return this.videoProcessor.motionLevel;
    },
    scaleLevel(): number {
      if (!this.animation) { return 1; }
      return this.animation.scaleLevel;
    },
    videoDivStyle(): ComponentStyle {
      if (!this.animation) { return {
        position: 'static',
        left: 'auto',
        top: 'auto',
        width: '100%',
        height: '100%',
        transform: 'none',
        zIndex: 0,
      };}
      return this.animation.videoDivStyle
    },
    videoElementStyle(): VideoElementStyle {
      if (!this.animation) { return { 
        filter: `brightness(${this.brightness}%) contrast(${this.contrast}%)`,
        zIndex: 'auto' 
      }; }
      return {
        filter: `brightness(${this.brightness}%) contrast(${this.contrast}%)`,
        ...this.animation.videoElementStyle
      }
    }
  },
  beforeDestroy() {
    this.audioProcessor && this.audioProcessor.kill();
    this.videoProcessor && this.videoProcessor.kill();
  },
  methods: {
    adjustBrightness(e: Event): void {
      if (e) {
        this.brightness = (e.srcElement as HTMLInputElement).value;
      }
    },
    adjustContrast(e: Event): void {
      if (!e) { return; }
      this.contrast = (e.srcElement as HTMLInputElement).value;
    },
    open(): void {
      this.animation && this.animation.focusOn(() => {
        this.videoProcessor && this.videoProcessor.startProcessing();
        this.audioProcessor && this.audioProcessor.startProcessing();
        this.showControls = true;
      });
    },
    close(): void {
      this.animation && this.animation.focusOff(() => {
        this.showControls = false;
        if (this.videoProcessor) {
          this.videoProcessor.kill();
        }
        if (this.audioProcessor) {
          this.audioProcessor.kill();
        }
      });
    },
  },
  props: {
    source: String,
  },
});
</script>

<template>
  <div ref='wrapperDiv' class="video-wrapper">
    <div v-on:click='open' :style='videoDivStyle' ref='videoDiv' class="video">
      <div class="position-relative-wrapper">
        <div v-show='showControls' class="video__controls">
          <div class='video__all-videos' role='button' v-on:click='close'>Все видео</div>
          <div class="video__filters">
            <span>Ярк.</span><input v-on:change='adjustBrightness' :style='{ transform: `scale(${1 / scaleLevel})`}' min='0' value='100' max='300' step='any' type="range" >
            <span>Контр.</span><input v-on:change='adjustContrast' :style='{ transform: `scale(${1 / scaleLevel})`}' min='0' value='100' max='300' step='any' type="range">
          </div>
        </div>
        <div v-show='showControls' class='video__info'>
          <div>
            <span>Уровень шума</span>
            <div class='volume-level'>
              <div class='volume-level__bar' :style='{ width: `${volumeLevel}%` }' />
            </div>
          </div>
          <div>
            <span>Движение</span>
            <div class='volume-level'>
              <div class='volume-level__bar' :style='{ width: `${motionLevel}%` }' />
            </div>
          </div>
          <div>
            <span>Освещение</span>
            <div class='volume-level'>
              <div class='volume-level__bar' :style='{ width: `${brightnessLevel}%` }' />
            </div>
          </div>
        </div>
        <video :style='videoElementStyle' ref='videoContainer' :muted='!showControls' src="" class="video__video" />
        <canvas class='canvas' ref='canvas' />
      </div>
    </div>
  </div>
</template>