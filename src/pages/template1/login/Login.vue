<template>
  <div class="c-login">
    <ValidationForm
      :rules="rules"
      :model="formModel"
      class="q-px-xs q-py-lg signIn"
      @submit.prevent.stop="onSubmit"
    >

    </ValidationForm>
    login page
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useSysStore } from 'src/stores/sys'
import { lengthMap, rules as rl } from 'src/utils'
import { apiCheckVfyRegisterAndLogin } from 'src/http/user'
import ValidationForm from 'components/ValidationForm.vue'
import { useI18n } from 'vue-i18n'


const { t: lang } = useI18n()

const sysStore = useSysStore()
const selectActive = ref(false)
const rememberPass = ref(false)
const pwdVisible = ref(false)
const isLoading = ref(false)
const isLoginByCaptcha = ref(false)
const isMobileCaptchaSent = ref(false)
const captchaKey = ref(Date.now())
const captchaOk = ref(true)
const dialogVisible = ref(false)
const mobileAreaCode = ref('86')
const verityRef: any = ref(null)


const formModel = reactive<IFormModel>({
  loginName: '',
  password: '',
  captchaVerification: '',
})

const activeCode = computed(() => {
  return sysStore.areaCodes.find(item => item.mobileAreaCode === mobileAreaCode.value)
})

const rules = computed(() => {
  if (isLoginByCaptcha.value) {
    return {
      loginName: rl.loginName,
      password: rl.password,
    }
  }
  return {
    mobile: activeCode.value ? ((rl.allMobile as any)[activeCode.value.countryCode] || rl.allMobile.all)() : rl.allMobile.all(),
    mobileCaptcha: [
      () => !!formModel.smsCaptcha || lang('请完成滑块验证'),
      () => isMobileCaptchaSent.value || lang('请先获取验证码'),
      ...rl.mobileCaptcha,
    ]
  }
})

const onSubmit = (valid?: boolean) => {
  if (valid) {
    const signIn = async () => {
      if (!formModel.captchaVerification) {
        const resVfyVfyRegisteAndLogin = await apiCheckVfyRegisterAndLogin({ loginName: formModel.loginName })
        if (resVfyVfyRegisteAndLogin?.code === 0 && resVfyVfyRegisteAndLogin?.msg === false) {
          useVerify()
          return
        }
      }
      gotoLogin()
    }
  }
}

const useVerify = () => {
  verityRef.value?.show()
}

const gotoLogin = () => {
  isLoading.value = true

  return 
}
</script>