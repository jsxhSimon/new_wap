<template>
  <router-view v-if="selectApi" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useSysStore } from 'src/stores/sys';
import { useEnvStore } from 'src/stores/env';
import { selectLine } from 'boot/selectLine';
import { LocalStorage, Platform, Notify } from 'quasar';
import { axios } from 'boot/axios';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const sysStore = useSysStore();
const envStore = useEnvStore();
const selectApi = ref('');

watch(
  () => envStore.envConfig,
  (val) => {
    if (envStore.envAppTitle) document.getElementsByTagName('title')[0].innerText = envStore.envAppTitle;
    if (envStore.envConfig.APP_LANGUAGE) locale.value = envStore.envConfig.APP_LANGUAGE
    if (envStore.envMobileAreaCode) sysStore.$patch(state => state.mobileAreaCode = envStore.envMobileAreaCode)
  },
  {
    immediate: true,
  }
);

onBeforeMount(() => {
  getSelectApiUrl(() => {
    sysStore.getMobileAreaCodes();
    envStore.getEnvConfig();
  });
});

const onScroll = (e: any) => {
  e.preventDefault();
}

const getSelectApiUrl = (callback: () => void) => {
  selectLine().then((res) => {
    LocalStorage.set('selectApi', res);
    selectApi.value = res as string;
    if (Platform.is.cordova) {
      document.addEventListener('deviceready', () => {
        window.navigator.splashscreen.hide();
        if (res === '') {
          Notify.create({
            message: '线路故障，请切换网络重试！',
            timeout: 0, // 以毫秒为单位; 0意味着没有超时
          });
        }
      });
    } else if (res === '') {
      Notify.create({
        message: '线路故障，请切换网络重试！',
        timeout: 0, // 以毫秒为单位; 0意味着没有超时
      });
    }
    axios.interceptors.request.use(
      (config) => {
        const BASE_URL = `${res}/api/`;
        const BASE_URL2 = `${res}/`;
        const { url } = config;
        if ((url || '').indexOf('/n2') !== -1) {
          config.url = url;
        } else if ((url || '').indexOf('splive/') === -1) {
          config.url = BASE_URL + url;
        } else {
          config.url = BASE_URL2 + url;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    if (res) sysStore.$patch((state) => (state.hasPrefixUrl = true));
    callback();
  });
};
</script>
