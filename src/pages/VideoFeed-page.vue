<template>
  <div class='container'>
    <Feed
      v-for='(source, i) in sources'
      :key='i + 1'
      :source='source'
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Feed from 'components/Feed.vue'

export default Vue.extend({
  data() {
    return {
      sources: [
        'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
        'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
        'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
        'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8',
      ],
    }
  },
  components: {
    Feed
  }
})
</script>

<style lang="stylus" scoped>
.container
  position relative
  display grid
  grid-template-columns repeat(auto-fill, 360px)
  grid-template-rows repeat(auto-fill, 360px)
  grid-auto-rows 360px
  grid-auto-flow row dense
  max-width 720px
  height auto
  width 100%
  margin 0 auto
  margin-bottom 5.2vh
  justify-content center
  align-content center
  box-sizing border-box
</style>


