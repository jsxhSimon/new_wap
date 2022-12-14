<template>
  <ValidationForm
    :rules="rules"
    :model="formModel"
    class="login-reset"
    @submit.prevent.stop="onSubmit"
  >
    <p class="userinfo-title fs-16 text-center fw-500 mb-20">{{$t('忘记密码')}}</p>

    <div class="q-field__bottom row items-start q-field__bottom--animated accountError" v-if= "showAccountError">
      <div class="q-field__messages col"><div style="padding-left:43px;">账号不存在 请先注册</div></div>
    </div>

    <DialogFormInput
      v-model.trim="formModel.mobile"
      :maxlength="sysStore.mobileMaxLen"
      :rules="rules.mobile"
      :placeholder="$t('请输入手机号码')"
      @focus="focusForFixInput"
    >
      <template v-slot:prepend>
        <span class="iconfont icon-mobile-phone"></span>
        <div class="sdy-select mr-10" :class="{active: selectActive}" @click="selectActive = !selectActive">
          <div class="label">{{sysStore.activeCode ? '+'+sysStore.activeCode.mobileAreaCode : $t('区号')}}</div>
        </div>
      </template>
    </DialogFormInput>

    <div class="mobileCaptcha">
      <DialogFormInput
        class="qrCode"
        v-model.trim="formModel.code"
        :maxlength="5"
        :rules="rules.code"
        :placeholder="$t('请输入验证码')"
        @focus="focusForFixInput"
      >
        <template v-slot:prepend>
          <span class="iconfont icon-Safe fs-18"></span>
        </template>
      </DialogFormInput>
      <CaptchaButton
        :disabled="disabledMobileCaptcha"
        v-model:isCaptchaSent="isMobileCaptchaSent"
        :fetchMethod="resetPasswordWithMobile"
        :needVerify="true"
        :captchaVerification="formModel.smsCaptcha"
        @openMobileVerify="openMobileVerify"
      />
      <Verify
        @success="mobileSuccess"
        mode="pop"
        captchaType="blockPuzzle"
        :imgSize="{ width: '310px', height: '155px' }"
        ref="mbVerify"
      />
    </div>
    <template v-slot:bottom="{ valid }">
      <div class="bottom-actions">
        <q-btn
          unelevated
          type="submit"
          :label="$t('找回密码')"
          :color="!valid?'unvalid-btn':'valid-btn'"
          :disable="!valid"
          :loading="isLoading"
          class="button-primary--block resetBtn userinfo-register"
        />
        <div class="noCountToRegister mt-10">
          <span @click="$router.push('/login')">{{ $t('返回登录') }}</span>
          <span @click="$router.push('/customerService')">{{$t('在线客服')}}</span>
        </div>
      </div>
    </template>
    <AreaCodePopup v-model:show="selectActive" @change="areaCodeChange" @close="selectActive = false" />
  </ValidationForm>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Platform } from 'quasar'
import { lengthMap, rules as rl } from 'src/utils'
import { useSysStore } from 'src/stores/sys'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ValidationForm from 'src/components/ValidationForm.vue'
import DialogFormInput from 'src/components/DialogFormInput.vue'
import AreaCodePopup from 'src/components/AreaCodePopup.vue'
import Verify from 'components/verify/index.vue'
import CaptchaButton from 'src/components/CaptchaButton.vue'

const { t: lang } = useI18n()

const router = useRouter()
const sysStore = useSysStore()
const userStore = useUserStore()
const isLoading = ref(false)
const showAccountError = ref(false)
const selectActive = ref(false)
const isMobileCaptchaSent = ref(false)
const mbVerify = ref<any>(null)
const formModel = reactive<Partial<IFormModel>>({
  mobile: '',
  code: '',
  token: '',
  smsCaptcha: '',
})

const rules = computed(() => {
  return {
    mobile: sysStore.activeCode ? ((rl.allMobile as any)[sysStore.activeCode.countryCode] || rl.allMobile.all)() : rl.allMobile.all(),
    code: [
      () => formModel.smsCaptcha || lang('请完成滑块验证'),
      () => isMobileCaptchaSent.value || lang('请先获取验证码'),
      ...rl.mobileCaptcha,
    ]
  }
})

const disabledMobileCaptcha = computed(() => {
  return !rules.value.mobile.every((rule: any) => rule(formModel.mobile) === true)
})

const onSubmit = () => {
  isLoading.value = true
  userStore.resetPasswordValidCode(formModel)
    .then(token => {
      router.push({
        path: '/resetPass',
        query: {
          token,
        }
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}

const focusForFixInput = () => {
  if (Platform.is.ios) {
    window.scroll(0, 0)
    window.setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }
}

const areaCodeChange = (areaCode: string) => {
  selectActive.value = false
  sysStore.$patch(state => state.mobileAreaCode = areaCode)
}

const resetPasswordWithMobile = () => {
  formModel.captchaVerification = formModel.smsCaptcha
  const params = { ...formModel }
  delete params.smsCaptcha
  params.mobileAreaCode = sysStore.mobileAreaCode

  return new Promise((resolve, reject) => {
    userStore.resetPasswordWithMobile(params)
      .then(token => {
        formModel.token = token
        resolve(token)
      }).catch(() => {
        reject()
      })
  })
}

const openMobileVerify = () => {
  mbVerify.value?.show()
}

const mobileSuccess = (params: { captchaVerification: string }) => {
  formModel.captchaVerification = params.captchaVerification
}
</script>
