<template>
  <div class="c-login">
    <ValidationForm
      :rules="rules"
      :model="formModel"
      class="q-px-xs q-py-lg signIn"
      @submit.prevent.stop="onSubmit"
    >
      <p class="userinfo-title fs-16 text-center fw-500 mb-20">{{ $t('登录') }}</p>
      <div class="out-div mb-20">
        <div  :class="!isLoginByCaptcha?'password-login login-active':'password-login login-unactive'" @click="toggleLoginMethod">
          {{ $t('密码登录') }}
        </div>
        <div :class="isLoginByCaptcha?'message-login login-active':'message-login login-unactive'" @click="toggleLoginMethod">
          {{ $t('短信登录') }}
        </div>
      </div>
      <!-- 短信登录 -->
      <template v-if="isLoginByCaptcha">
        <DialogFormInput
          v-model.trim="formModel.mobile"
          :maxlength="(lengthMap as any)[sysStore.mobileAreaCode] || 60"
          :rules="rules.mobile"
          :placeholder="$t('手机号')"
          @focus="focusForFixInput"
        >
          <template v-slot:prepend>
            <span class="iconfont icon-mobile-phone"></span>
            <div class="sdy-select mr-10" :class="{active: selectActive}" @click="selectActive = !selectActive">
              <div class="label">{{activeCode ? '+'+activeCode.mobileAreaCode : $t('区号')}}</div>
            </div>
          </template>
        </DialogFormInput>

        <div class="mobileCaptcha">
          <DialogFormInput
            class="qrCode fs-11"
            v-model.trim="formModel.mobileCaptcha"
            :maxlength="5"
            :rules="rules.mobileCaptcha"
            :clearable="false"
            :placeholder="$t('请输入验证码')"
            @focus="focusForFixInput"
          >
            <template v-slot:prepend>
              <span class="iconfont icon-Safe fs-18"></span>
            </template>
          </DialogFormInput>
          <CaptchaButton
            :disabled="disabledMobileCaptcha"
            v-model:isCaptchaSend="isMobileCaptchaSent"
            :fetchMethod="sendMobileCaptcha"
            :needVerify="true"
            :captchaVerification="formModel.smsCaptcha"
            @openMobileVerify="openMobileVerify"
          />
        </div>
      </template>
      <!-- 密码登录 -->
      <template v-else>
        <DialogFormInput
          v-model.trim="formModel.loginName"
          :rules="rules.loginName"
          :placeholder="$t('用户名')"
          @focus="focusForFixInput"
        >
          <template v-slot:prepend>
            <span class="iconfont icon-user"></span>
          </template>
        </DialogFormInput>

        <DialogFormInput
          @focus="focusForFixInput"
          v-model.trim="formModel.password"
          :rules="rules.password"
          :placeholder="$t('密码')"
          standout="text-white"
          :borderless="true"
          :outlined="false"
          :type="pwdVisible ? '' : 'password'"
        >
          <template v-slot:append>
            <span class="fs-18" :class="!pwdVisible?'iconfont icon-Invisible':'iconfont icon-kejian'" @click="pwdVisible = !pwdVisible"></span>
          </template>
          <template v-slot:prepend>
            <span class="iconfont icon-mima"></span>
          </template>
        </DialogFormInput>

        <div class="verifyCodeBox">
          <div class="hidden">
            <DialogFormInput
              ref="captchaRef"
              v-model.trim="formModel.captchaVerification"
              :maxlength="4"
              :placeholder="$t('请输入图片验证码')"
              @focus="focusForFixInput"
            >
            </DialogFormInput>
          </div>
          <div class="slider-check" :class="{'cap-sus': formModel.captchaVerification}" @click="useVerify" style="display: none">
          <van-icon :name="formModel.captchaVerification ? 'passed' : 'circle'" /> {{ formModel.captchaVerification ? $t('安全验证成功') : $t('点击进行安全验证')}}
          </div>
        </div>

        <div class="extra-fill">
          <div class="sdy-checkbox" @click="rememberPass = !rememberPass" :class="{checked: rememberPass}">
            <i class="sdy-checkbox-icon"></i>
            <span class="label">{{ $t('记住密码') }}</span>
          </div>
          <!-- <q-checkbox v-model="rememberPass" label="记住密码" /> -->
          <q-btn
            flat
            dense
            class="fw-400 fs-13"
            @click="changeModules('resetPass')"
          >
            {{ $t('忘记密码') }} ?
          </q-btn>
        </div>
      </template>

      <template v-slot:bottom="{ valid }">
        <div class="bottom-actions mt-10">
          <q-btn
            unelevated
            @click="onSubmit(valid)"
            :label="$t('登 录')"
            color="lg-primary"
            :disable="!valid"
            :loading="isLoading"
            :class="valid?'userinfo-login valid':'userinfo-login'"
          />
          <div class="noCountToRegister mt-10">
            <span @click="toIndex">{{ $t('先去逛逛') }}</span>
            <span @click="changeModules('register')">{{ $t('没有账号立即注册') }}</span>
          </div>
        </div>

      </template>
    </ValidationForm>
    <Verify
      v-if="!isLoginByCaptcha"
      @success="success"
      mode="pop"
      captchaType="blockPuzzle"
      :imgSize="{ width: '290px', height: '155px' }"
      ref="verityRef"
    />
    <Verify
      v-else    
      @success="mobileSuccess"
      mode="pop"
      captchaType="blockPuzzle"
      :imgSize="{ width: '290px', height: '155px' }"
      ref="mbVerifyRef"
      key="mbVerify"
    />
    <AreaCodePopup v-model:show="selectActive" @change="areaCodeChange" @close="selectActive = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useSysStore } from 'src/stores/sys'
import { useUserStore } from 'src/stores/user'
import { lengthMap, rules as rl } from 'src/utils'
import { apiCheckVfyRegisterAndLogin } from 'src/http/user'
import ValidationForm from 'components/ValidationForm.vue'
import DialogFormInput from 'src/components/DialogFormInput.vue'
import CaptchaButton from 'src/components/CaptchaButton.vue'
import { useI18n } from 'vue-i18n'
import { LocalStorage, Notify, Platform } from 'quasar'
import { useRouter } from 'vue-router'
import { apiSendCaptcha } from 'src/http'
import Verify from 'components/verify/index.vue'
import AreaCodePopup from 'src/components/AreaCodePopup.vue'

const emits = defineEmits(['success', 'toggleUserInfo'])

const { t: lang } = useI18n()

const router = useRouter()
const sysStore = useSysStore()
const userStore = useUserStore()
const selectActive = ref(false)
const rememberPass = ref(false)
const pwdVisible = ref(false)
const isLoading = ref(false)
const isLoginByCaptcha = ref(false)
const isMobileCaptchaSent = ref(false)
const captchaKey = ref(Date.now())
const captchaOk = ref(true)
const dialogVisible = ref(false)
const verityRef: any = ref(null)
const captchaRef: any = ref(null)
const mbVerifyRef: any = ref(null)


const formModel = reactive<IFormModel>({
  loginName: '',
  password: '',
  captchaVerification: '',
  mobileCaptcha: '',
})

const activeCode = computed(() => {
  return sysStore.areaCodes.find(item => item.mobileAreaCode === sysStore.mobileAreaCode)
})

const rules = computed(() => {
  if (!isLoginByCaptcha.value) {
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

const disabledMobileCaptcha = computed(() => {
  if (!formModel.mobile) {
    return true
  }
  return !rules.value.mobile.every((rule: any) => rule(formModel.mobile) === true)
})

onMounted(() => {
  const loginUserInfo: any = LocalStorage.getItem('loginUserInfo')
  if (loginUserInfo) {
    const { loginName = '', password = '' } = loginUserInfo
    formModel.loginName = loginName
    formModel.password = password
    rememberPass.value = true
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
    if (isLoginByCaptcha.value) {
      gotoLogin()
    } else {
      signIn()
    }
  }
}

const useVerify = () => {
  verityRef.value?.show()
}

const gotoLogin = () => {
  isLoading.value = true
  const params: any = {}
  Object.keys(formModel).forEach(key => {
    if (formModel.hasOwnProperty(key) && ![null, undefined, ''].includes((formModel as any)[key])) {
      params[key] = (formModel as any)[key]
    }
  })
  userStore.login(params)
    .then(({ loginLocked }) => {
      if (loginLocked) {
        dialogVisible.value = true
        return
      }
      LocalStorage.set('showDownloadbar', '')
      if (rememberPass.value) {
        LocalStorage.set('loginUserInfo', formModel)
      } else {
        LocalStorage.remove('loginUserInfo')
      }
      userStore.closeSignDialog()
      emits('success')
    })
    .catch((error) => {
      if (error?.data && error.data.msg?.indexOf('验证码错误') !== -1) {
        captchaKey.value = Date.now()
      }
    })
    .finally(() => {
      isLoading.value = false
    })
  return 
}
const areaCodeChange = (areaCode: string) => {
  selectActive.value = false
  sysStore.$patch(state => state.mobileAreaCode = areaCode)
}
const focusForFixInput = () => {
  if (Platform.is.ios) {
    window.scroll(0, 0)
    window.setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }
}

const changeModules = (mds: string) => {
  emits('toggleUserInfo', mds)
}

const toIndex = () => {
  router.push('/')
}

const sendMobileCaptcha = () => {
  formModel.mobileAreaCode = sysStore.mobileAreaCode
  const params = { ...formModel }
  params.captchaVerification = params.smsCaptcha
  delete params.smsCaptcha

  return new Promise((resolve, reject) => {
    userStore.checkIsMobileRegistered(formModel)
      .then((isRegistered) => {
        if (isRegistered) {
          apiSendCaptcha({
            fetchUrl: 'sendMobCodeLog',
            formModel: params,
          })
            .then(() => {
              captchaOk.value = true
              captchaRef.value?.validate()
              resolve(true)
            })
            .catch(() => {
              captchaOk.value = false
              captchaRef.value?.validate()
              captchaKey.value = Date.now()
              reject(false)
            })
        } else {
          Notify.create(lang('该手机号未注册！'))
          reject(false)
        }
      })
  })
}

const success = (params: any) => {
  formModel.captchaVerification = params.captchaVerification
  gotoLogin()
}

const openMobileVerify = () => {
  mbVerifyRef.value?.show()
}

const mobileSuccess = (params: any) => {
  formModel.smsCaptcha = params.captchaVerification
}

const toggleLoginMethod = () => {
  captchaOk.value = true
  isLoginByCaptcha.value = !isLoginByCaptcha.value
  if (isLoginByCaptcha.value) {
    formModel.mobileCaptcha = ''
    formModel.smsCaptcha = ''
    formModel.mobile = ''
  } else {
    formModel.loginName = ''
    formModel.password = ''
    formModel.captchaVerification = ''
    const loginUserInfo: Partial<IUserInfo> = LocalStorage.getItem('loginUserInfo') || {}
    if (loginUserInfo) {
      const { loginName = '', password = '' } = loginUserInfo
      formModel.loginName = loginName
      formModel.password = password
      rememberPass.value = true
    }
  }

}
</script>

<style lang="scss">
.c-login {
  .out-div {
    width: 184px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 8px;
    background: var(--login-input-bg);
    display: flex;
    margin-left: auto;
    margin-right: auto;
    color: var(--t6);
    > div {
      flex: 1;
      &:first-child {
        border-radius: 8px 0 0 8px;
      }
      &:last-child {
        border-radius: 0 8px 8px 0;
      }
    }
    .login-active {
      background: var(--theme-color);
      color: var(--t5);
    }
  }
  
  .extra-fill {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
  }
}
</style>