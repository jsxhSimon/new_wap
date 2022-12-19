<template>
  <div class="sdy-collapse" :class="{closed: close, [`tid-${tid}`]: !!tid}">
    <div class="sdy-collapse-header">
      <slot name="header" />
    </div>
    <div class="sdy-collapse-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  close: boolean;
  tid?: string;
}

defineProps<Props>()
</script>

<style lang="scss">
  .sdy-collapse {
    background: var(--sports-item-bg);
    box-shadow:  var(--box-shadow);
    margin-bottom: 10px;
    color: var(--t2);
    border-radius: 4px;
    &.closed {
      .sdy-collapse-content {
        display: none;
        padding-bottom: 0;
      }
      .sdy-icon-unfold {
        transform: rotate(90deg);
      }
    }
    &-header {
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      .sdy-icon-unfold {
        transition: .2s ease-in-out;
        transform: rotate(-90deg);
      }
    }
    &-content {
      padding-bottom: 10px;
      overflow: hidden;
      transition: height .3s ease-in-out;
      will-change: height;
    }
  }
</style>
