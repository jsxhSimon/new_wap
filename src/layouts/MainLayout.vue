<template>
  <q-layout view="lHh Lpr lFf" class="pro-layout" :data-footer="$route.meta.footerVisible">
    <Header v-if="!route.meta.hideHeader" />
    <Footer />
    <q-page-container>
      <kepp-alive :include="['home', 'videoGames', 'activityList']">
        <router-view :key="$route.fullPath" />
      </kepp-alive>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from 'components/Header.vue'
import Footer from 'components/Footer.vue'

const route = useRoute()

</script>
