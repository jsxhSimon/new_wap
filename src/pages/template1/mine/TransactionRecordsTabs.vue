<template>
  <div class="transaction-record-tabs-wrapper">
    <q-tabs
      dense
      inline-label
      :breakpoint="0"
      narrow-indicator
      active-color="tabs-active"
      indicator-color="tabs-primary"
      :mobile-arrows="true"
      content-class="content-class"
      v-model="activeTab"
      align="center"
    >
      <q-tab class="transaction-record-tab" name="deposit">
        <span class="transaction-record-tab_label text-body2">{{ $t('存款') }}</span>
      </q-tab>

      <q-tab class="transaction-record-tab" name="withdraw">
        <span class="transaction-record-tab_label text-body2">{{ $t('提款') }}</span>
      </q-tab>

      <q-tab class="transaction-record-tab" name="coupons">
        <span class="transaction-record-tab_label text-body2">{{ $t('优惠') }}</span>
      </q-tab>

      <q-tab class="transaction-record-tab" name="bonus">
        <span class="transaction-record-tab_label text-body2">{{ $t('奖补') }}</span>
      </q-tab>

      <q-tab class="transaction-record-tab" name="washcode">
        <span class="transaction-record-tab_label text-body2">{{ $t('洗码') }}</span>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string;
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change'])

const activeTab = computed({
  get: () => props.modelValue,
  set: (nv: string) => {
    emits('update:modelValue', nv)
    emits('change')
  }
})
</script>

<style lang="scss" scoped>
.transaction-record-tabs-wrapper {
  // background: #000;
  // margin-top: 50px;
  z-index: 1;
  :deep(.q-tab__indicator) {
    background-color: var(--theme-color);
  }
}
.q-tabs {
  width: 100%;
  background: #343438;
  background: #f8f8f8;
  /*box-shadow: 5px 7px 20px #f0f0f0;*/
  // background: #000;
}

.transaction-record-tabs {
  min-height: 44px;
  color: var(--t2);
}

.transaction-record-tab {
  .text-body2 {
    color: var(--t2);
  }
  &.q-tab--active {
    .transaction-record-tab_label {
      // font-weight: bold;
      color: var(--theme-color);
    }
  }

}
</style>
