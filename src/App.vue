<template>
  <router-view v-if="selectApi" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useSysStore } from 'src/stores/sys';
import { useEnvStore } from 'src/stores/env';
import { useTimStore } from 'src/stores/tim'
import { selectLine } from 'boot/selectLine';
import { LocalStorage, Platform, Notify } from 'quasar';
import { axios } from 'boot/axios';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const sysStore = useSysStore();
const envStore = useEnvStore();
const timStore = useTimStore();
const selectApi = ref('');

watch(
  () => envStore.envConfig,
  (val) => {
    console.log('language: ', locale)
    if (envStore.envAppTitle) document.getElementsByTagName('title')[0].innerText = envStore.envAppTitle;
    if (envStore.envConfig.APP_LANGUAGE) locale.value = envStore.envConfig.APP_LANGUAGE
    if (envStore.envMobileAreaCode) sysStore.$patch(state => state.mobileAreaCode = envStore.envMobileAreaCode)
  },
  {
    immediate: true,
  }
);

onBeforeMount(() => {
  window.shakeApp = () => {
    try {
      if (Platform.is.cordova && Platform.is.ios && window.testModel && window.testModel.appshakemethod) {
        const SuccessCallBack = (msg: string) => {
          // alert('sucess-:', msg)
        }
        const FailCallBack = (msg: string) => {
          // alert('fail-:', msg)
        }
        window.testModel.appshakemethod(SuccessCallBack, FailCallBack)
      }
    } catch (e) {
      // console.log(e)
    }
  }

});

onMounted(() => {
  getSelectApiUrl(() => {
    sysStore.queryStationSet();
    sysStore.getMobileAreaCodes();
    envStore.getEnvConfig();
    timStore.timInit()
  });
})

const getSelectApiUrl = (callback: () => void) => {
  selectLine().then((res) => {
    LocalStorage.set('selectApi', res);
    selectApi.value = res as string;
    if (Platform.is.cordova) {
      document.addEventListener('deviceready', () => {
        window.navigator.splashscreen.hide();
        if (res === '') {
          Notify.create({
            message: '???????????????????????????????????????',
            timeout: 0, // ??????????????????; 0?????????????????????
          });
        }
      });
    } else if (res === '') {
      Notify.create({
        message: '???????????????????????????????????????',
        timeout: 0, // ??????????????????; 0?????????????????????
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
