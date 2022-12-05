<template>
  <q-input
    ref="inputRef"
    v-bind="$attrs"
    v-model="inputValue"
    clearable
    :borderless="true"
    lazy-rules
    no-error-icon
    :maxlength="getMaxlength"
    @blur="blurCheckData"
    @clear="changeCheckData"
    class="sign-dialog-field field-shadow"
  >
    <template v-for="(val, key) in $slots" v-slot:[key]>
      <slot :name="key"></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string;
  maxlength?: number;
  blurCheck?: boolean;
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'checkBlurEvent', 'clearUserError'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (nv: string) => emits('update:modelValue', nv)
})
const getMaxlength = computed(() => {
  return props.maxlength ?? 1000000
})
const blurCheckData = () => {
  if (props.blurCheck) {
    emits('checkBlurEvent', )
  }
}

const changeCheckData = () => {
  if (props.blurCheck) {
    emits('clearUserError')
  }
}
</script>