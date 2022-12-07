<template>
  <div class="download-bar">
    <div class="bg"></div>
    <p class="close" @click="close">
      <span class="iconfont icon-yuyinguanbi"></span>
    </p>
    <div class="download-bar-logo"></div>
    <div class="download-text">{{$t('真人娱乐、体育投注、电子游艺等尽在一手掌握!')}}</div>
    <p class="dld" @click="downloadAPP">{{ $t('立即下载') }}</p>
  </div>
</template>

<script setup lang="ts">
import { getDownloadUrl } from 'src/utils'
import { useSysStore } from 'src/stores/sys'

const sysStore = useSysStore()
const downloadAPP = () => {
  window.open(getDownloadUrl())
  // window.open('#/app-download')
}

const close = () => {
  sysStore.closeDownloadBar()
}
</script>

<style lang="scss">
.download-bar {
  width: 100%;
  height: var(--download-bar-height);
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  z-index: 1;
  padding: 0 10px;
  background: var(--download-bar-bg);
  .download-bar-logo {
    width: 66px;
    height: 66px;
    background: url('site_theme_images/app-logo.png') no-repeat center center;
    background-size: contain;
    margin-right: 6px;
  }
  .download-text {
    width: 240px;
    color: var(--download-bar-text-color);
    font-size: 17px;
  }
  .dld {
    position: absolute;
    width: 106px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    background: var(--download-bar-btn-bg);
    border-radius: 10px;
    color: var(--t1);
    right: 14px;
    bottom: 12px;
  }
  .close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    color: var(--download-bar-close-color);
    letter-spacing: 0.3px;
  }
}
</style>