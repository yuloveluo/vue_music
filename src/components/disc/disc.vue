<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script>
import MusicList from '_c/music-list/music-list'
export default {

  data () {
    return {
    }
  },

  methods: {},
  components: {
    MusicList
  },

  created () {
  }
}
</script>

<style lang='stylus' scoped>
.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter. .slide-leave-to
  transform: translate3d()(100%, 0, 0)
</style>
