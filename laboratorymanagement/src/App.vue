<template>
  <div class="login">
    <div v-if="this.$route.path == '/'">
      <router-view></router-view>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>
    