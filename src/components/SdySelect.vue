<template>
  <div class="sdy-select" @click="show = !show">
    <div class="label">{{val || placeholder || $t('请选择')}}</div>
    <div class="option-list" :class="`has-${list.length}`" v-show="show">
      <div class="box">
        <div class="option" :class="{active: opt.value === value}" @click="handleChange(opt)" v-for="opt in list" :key="opt.value">{{opt.label}}</div>
        <div class="option" v-if="!list.length">{{ $t('暂无数据') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
interface Props {
  list: {value: any; label: string}[];
  value: any;
  placeholder: string;
}
const props = defineProps<Props>()
const emits = defineEmits(['change'])

const show = ref(false)
const val = computed(() => {
  const temp = props.list.find(item => item.value === props.value)
  return temp ? temp.label : null
})
const handleChange = (opt: any) => {
  emits('change', opt.value)
}
</script>

<style lang="scss">
  .sdy-select {
    width: 195px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    background: var(--select-bg);
    box-sizing: border-box;
    padding: 0 40px 0 20px;
    font-size: 12px;
    color: var(--t4);
    position: relative;
    .label {
      background: none;
      padding: 0;
    }
    .option-list {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      display: block;
      transform: translateY(100%);
      border: none;
      border-radius: 0 0 8px 8px;
      .box {
        max-height: 120px;
        overflow-y: auto;
      }
      .option {
        height: 40px;
        border-top: 1px solid #F3F2F2;
        box-sizing: border-box;
        padding: 0 20px;
        border-bottom: none;
        &.active {
          pointer-events: none;
          color: var(--t5);
          background: var(--theme-color);
        }
        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
    }
  }
</style>
