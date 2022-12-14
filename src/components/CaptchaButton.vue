<template>
  <q-btn
    :label="btnLabel"
    :color="'none'"
    class="text-lowercase qrCodeBtn fs-10"
    :class="{'btn-disabled': disabled || !enableSending}"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  disabled: boolean;
  isCaptchaSend: boolean;
  fetchMethod: () => any;
  needVerify: boolean;
  captchaVerification: undefined | string;
}

const props = withDefaults(defineProps<Props>(), {
  needVerify: false,
})
const emits = defineEmits(['openMobileVerify', 'update:isCaptchaSend'])

const { t: lang } = useI18n()

const countdown = ref(0)
const isSendingCode = ref(false)
let timer: any = null

const enableSending = computed(() => {
  return !countdown.value && !isSendingCode.value
})

const btnLabel = computed(() => {
  if (isSendingCode.value) {
    return lang('正在发送验证码')
  }
  if (countdown.value) {
    return `${countdown.value}s(${lang('重新发送')})`
  }
  if (props.isCaptchaSend) {
    return lang('重新发送')
  }
  return lang('获取验证码')
})

watch(
  () => props.captchaVerification,
  (val) => {
    if (props.needVerify && val) send()
  }
)

const handleClick = () => {
  if (props.needVerify) {
    emits('openMobileVerify')
  } else {
    send()
  }
}

const send = () => {
  isSendingCode.value = true
  props.fetchMethod()
    .then(() => {
      countdown.value = 60
      emits('update:isCaptchaSend', true)
      timer = window.setInterval(() => {
        countdown.value -= 1
        if (countdown.value === 0) {
          window.clearInterval(timer)
        }
      }, 1000)
    })
    .finally(() => {
      isSendingCode.value = false
    })
}
</script>

<style lang="scss">
.qrCodeBtn {
  .block {
    color: var(--theme-text-color);
    font-size: 13px;
  }
  &.btn-disabled {
    pointer-events: none;
    opacity: .5;
  }
  &::before {
    display: none;
  }
}
</style>
