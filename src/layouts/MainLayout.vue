<template>
  <q-layout view="lHh Lpr lFf" class="pro-layout" :data-footer="$route.meta.footerVisible">
    <MainHeader v-if="!route.meta.hideHeader" />
    <Footer v-if="footerVisible" />
    <q-page-container>
      <keep-alive :include="['home', 'videoGames', 'activityList']">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainHeader from 'src/components/MainHeader.vue';
import Footer from 'components/Footer.vue'
import router from 'src/router';

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    document.querySelector('#q-app')!.scrollTop = 0
  }
)

const footerVisible = computed(() => {
  return route.meta.footerVisible
})

</script>
