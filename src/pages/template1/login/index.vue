<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="logo-box">
      <div class="app-logo"></div>
    </div>
    <div class="main-container mt-60">
      <Login v-if="type === 'login'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Login from './Login.vue'

const route = useRoute()
const type = computed(() => {
  return route.params?.field || 'login'
})

console.log(route.params)
</script>

<style lang="scss">
  .login-page {
    .login-bg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('images/login/login-bg.jpg') no-repeat center top;
      background-size: cover;
      z-index: -1;
    }
    .logo-box {
      padding-top: 60px;
      margin-bottom: 58px;
    }
    .app-logo {
      width: 173px;
      height: 42px;
      margin: 0 auto;
      background: url('site_images/logo.png') no-repeat center center;
      background-size: contain;
    }
    .main-container {
      width: 251px;
      margin: 0 auto;
    }
  }
</style>