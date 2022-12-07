<template>
  <q-page class="home-page">
    <DownloadBar v-if="!Platform.is.cordova && sysStore.isShowDownloadBar" />
    <q-pull-to-refresh>
      <BalanceHeader type="user" rightButton="menu" />
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Platform } from 'quasar';
import { useSysStore } from 'src/stores/sys';
import DownloadBar from 'components/DownloadBar.vue';
import BalanceHeader from 'src/components/BalanceHeader.vue';

const sysStore = useSysStore();

onMounted(() => {
  init();
});

const init = () => {
  sysStore.getGameCenterData();
};
</script>
