<template>
  <main class='main'>
    <router-view />
  </main>
</template>

<style lang="stylus" scoped>
@import '~@/globals'

.main
  min-width 100vw
  display flex
  flex-grow 1
  margin-top $header-desktop-height
  @media (max-width $break-mobile)
    margin-top $header-mobile-height
</style>

