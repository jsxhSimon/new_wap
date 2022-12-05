<template>
  <div v-if="isShowDownloadBar" class="download-bar">
    <div class="bg"></div>
    <p class="close" @click="close">
      <span class="iconfont icon-yuyinguanbi"></span>
    </p>
    <div class="download-bar-logo"></div>
    <div class="download-text">{{$t('真人娱乐、体育投注、电子游艺等尽在一手掌握!')}}</div>
    <p class="dld" @click="downloadAPP">立即下载</p>
  </div>
</template>

<script setup lang="ts">
import { getDownloadUrl } from 'src/utils'

const downloadApp = () => {
  window.open(getDownloadUrl())
  // window.open('#/app-download')
}
</script>