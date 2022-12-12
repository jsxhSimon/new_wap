<template>
  <header class="site-header">
    <div class="header-left" @click="router.go(-1)">
      <span class="iconfont icon-xiangzuo1"></span>
    </div>
    <div class="header-title">{{title}}</div>
    <div class="header-right">
      <slot name="right" />
      <span v-if="hasKf" class="sdy-icon icon-kf" @click="router.push('/customerService')" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  hasKf?: boolean;
  title: string;
}
const props = defineProps<Props>()

const router = useRouter()
</script>

<style lang="scss">
.site-header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: var(--header-bg);
  z-index: 9;
  padding-top: env(safe-area-inset-top);
  box-sizing: border-box;
  text-align: center;
  .header-title {
    font-size: 18px;
  }
  .header-left,
  .header-right {
    position: absolute;
    top: env(safe-area-inset-top);
    height: calc(100% - env(safe-area-inset-top));
    box-sizing: content-box;
    padding: 0 14px;
    display: flex;
    align-items: center;
  }
  .header-left {
    left: 0;
  }
  .header-right {
    right: 0;
  }
  .icon-kf {
    width: 20px;
    height: 20px;
    background-image: url('images/common/kefu.png');
  }
}
</style>
