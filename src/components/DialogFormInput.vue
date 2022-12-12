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
    class="sign-dialog-field field-shadow"
  >
    <template v-for="(_, key) in $slots" v-slot:[key]>
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
const emits = defineEmits(['update:modelValue'])
const inputRef = ref<any>(null)

const inputValue = computed({
  get: () => props.modelValue,
  set: (nv: string) => emits('update:modelValue', nv)
})
const getMaxlength = computed(() => {
  return props.maxlength ?? 1000000
})

const validate = () => {
  inputRef.value?.validate()
}

defineExpose({
  validate
})
</script>