<template>
  <q-form
    ref="form"
    v-bind="$attrs"
    :class="{'form--error_absolute': errorAbsolute}"
  >
    <slot></slot>
    <slot name="bottom" :valid="valid"></slot>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface API {
  validate: () => boolean;
}

interface Props {
  model: any;
  rules: any;
  errorAbsolute?: boolean;
}

const props = defineProps<Props>()
const form = ref<any>(null)

const valid = computed(() => {
  const { model, rules } = props
  const fields = Object.keys(model)
  return fields.every(key => {
    const rulesItem = rules[key]
    if (rulesItem?.length) {
      const value = model[key]
      return rulesItem.every((validator: any) => {
        const result = validator(value)
        if (typeof result === 'string') { // result为报错信息
          return false
        }
        return result // result为布尔值
      })
    }
    return true
  })
})

const validate = () => form.value?.validate()
defineExpose({
  validate,
})
</script>

<style lang="scss" scoped>
.form--error_absolute {
  :deep(.q-field) {
    padding-bottom: 0;
    .q-field__bottom {
      bottom: 22px;
      position: absolute;
    }
  }
}
</style>