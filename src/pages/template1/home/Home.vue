<template>
  <q-page class="home-page">
    <DownloadBar v-if="(!Platform.is.cordova && sysStore.isShowDownloadBar)" />
  </q-page>
</template>

<script setup lang="ts">
import { Platform } from 'quasar'
import { useSysStore } from 'src/stores/sys'
import DownloadBar from 'components/DownloadBar.vue'

const sysStore = useSysStore()

console.log(sysStore.isShowDownloadBar)

</script>