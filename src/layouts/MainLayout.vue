<template>
  <q-layout view="lHh Lpr lFf" class="pro-layout" :data-footer="$route.meta.footerVisible">
    <Footer />
    <q-page-container>
      <keep-alive :include="['home', 'videoGames', 'activityList']">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Footer from 'components/Footer.vue'

const route = useRoute()

</script>
