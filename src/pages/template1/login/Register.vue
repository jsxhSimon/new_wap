<template>
<div class="signup">
  <div class="userinfo-title fs-16 text-center fw-500 mb-20">
    {{ $t('注册') }}
  </div>
  <ValidationForm
    :rules="rules"
    :model="formModel"
    class="q-px-xs q-py-lg signup-form"
    @submit.prevent.stop="onSubmit"
  >
    <template v-for="item in formFields" :key="item.field">
      <DialogFormInput
        @focus="focusForFixInput"
        v-if="item.field === 'loginPwd'"
        v-model.trim="formModel.loginPwd"
        :key="item.field"
        :rules="rules.loginPwd"
        :maxlength="item.maxlength"
        autocomplete="new-password"
        :placeholder="item.placeholder"
        :type="pwdVisible ? '' : 'password'"
      >
        <template v-slot:prepend>
          <span class="iconfont" :class="item.icon"></span>
        </template>
        <template v-slot:append>
          <span class="iconfont" :class="!pwdVisible ? 'icon-Invisible' : 'icon-kejian'"></span>
        </template>
      </DialogFormInput>

      <DialogFormInput
        @focus="focusForFixInput"
        v-else-if="item.field === 'reLoginPwd'"
        v-model.trim="formModel.reLoginPwd"
        :rules="rules.reLoginPwd"
        :maxlength="item.maxlength"
        autocomplete="new-password"
        :placeholder="item.placeholder"
        :type="pwdVisibleRe ? '' : 'password'"
      >
        <template v-slot:prepend>
          <span class="iconfont" :class="item.icon"></span>
        </template>

        <template v-slot:append>
          <span class="iconfont" :class="!pwdVisibleRe?'icon-Invisible':'icon-kejian'" @click="pwdVisibleRe = !pwdVisibleRe"></span>
        </template>
      </DialogFormInput>

      <DialogFormInput
        @focus="focusForFixInput"
        v-else-if="item.field === 'mobile'"
        v-model.trim="formModel.mobile"
        :type="item.type"
        :placeholder="item.placeholder"
        :rules="rules[item.field]"
        :maxlength="(lengthMap as any)[sysStore.mobileAreaCode] || 60"
      >
        <template v-slot:prepend>
          <span :class="'iconfont ' + item.icon"></span>
          <div class="sdy-select mr-10" :class="{active: selectActive}" @click="selectActive = !selectActive">
            <div class="label">{{activeCode ? '+'+activeCode.mobileAreaCode : $t('区号')}}</div>
          </div>
          <AreaCodePopup :show="selectActive" @change="areaCodeChange" @close="selectActive = false" />
        </template>
      </DialogFormInput>

      <div
        class="verifyCodeBox"
        v-else-if="item.field === 'captchareg'"
      >
        <div class="verifyCodeBox" style="order: 1;" :key="item.field + 1">
          <div class="slider-check" :class="{'cap-sus': formModel.captchaVerification}" @click="useVerify" style="display: none">
            <van-icon :name="formModel.captchaVerification ? 'passed' : 'circle'" /> {{ formModel.captchaVerification ? $t('安全验证成功') : $t('点击进行安全验证')}}
          </div>
        </div>
    
      </div>

      <div class="mobileCaptcha" v-else-if="item.field === 'mobileCaptchareg'">
        <DialogFormInput
          @focus="focusForFixInput"
          v-model.trim="formModel.mobileCaptchareg"
          :maxlength="5"
          :placeholder="item.placeholder"
          :rules="rules.mobileCaptchareg"
        >
          <template v-slot:prepend>
            <span class="iconfont icon-Safe"></span>
          </template>
        </DialogFormInput>
        <CaptchaButton
          :disabled="disabledMobileCaptcha"
          v-model:isCaptchaSent="isMobileCaptchaSent"
          :fetchMethod="sendMobileCaptcha"
          :needVerify="true"
          :captchaVerification="mobileVerityCode"
          @openMobileVerify="openMobileVerify"
        />
      </div>

      <DialogFormInput
        @focus="focusForFixInput"
        v-else
        v-model.trim="(formModel as any)[item.field]"
        :type="item.type"
        :placeholder="item.placeholder"
        :rules="rules[item.field]"
        :maxlength="item.maxlength"
      >
        <template v-slot:prepend>
          <span :class="'iconfont ' + item.icon"></span>
          <!-- <span class="sign-dialog-field_prepend ellipsis text-body2 text-white">{{item.label}}</span> -->
        </template>
      </DialogFormInput>
    </template>

    <template v-slot:bottom="{ valid }">
      <q-btn
        unelevated
        type="submit"
        :label="$t('注册')"
        class="regist-btn text-white mt-20"
        :disable="!valid"
        :loading="isLoading"
        :class="valid?'userinfo-register valid':'userinfo-register'"
      />
      <p class="noCountToRegister mt-10">
        <span @click="toIndex">{{ $t('先去逛逛') }}</span>
        <span @click="toLogin">
          {{ $t('已有账号, 返回登录') }}
        </span>
      </p>
    </template>
  </ValidationForm>
  <Verify
    @success="success"
    mode="pop"
    captchaType="blockPuzzle"
    :imgSize="{ width: '310px', height: '155px' }"
    ref="verifyRef"
  />
  <Verify
    @success="mobileSuccess"
    mode="pop"
    captchaType="blockPuzzle"
    :imgSize="{ width: '310px', height: '155px' }"
    ref="mbVerifyRef"
    key="mbVerify"
  />
</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { rules as rl, lengthMap } from 'src/utils'
import { useI18n } from 'vue-i18n'
import ValidationForm from 'src/components/ValidationForm.vue'
import { useSysStore } from 'src/stores/sys'
import { useUserStore } from 'src/stores/user'
import DialogFormInput from 'src/components/DialogFormInput.vue'
import CaptchaButton from 'src/components/CaptchaButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { Notify, Platform, LocalStorage } from 'quasar'
import { apiSendCaptcha } from 'src/http'
import { useEnvStore } from 'src/stores/env'
import Verify from 'components/verify/index.vue'
import AreaCodePopup from 'src/components/AreaCodePopup.vue'

const emits = defineEmits(['toggleUserInfo', 'success'])
const { t: lang } = useI18n()

const router = useRouter()
const route = useRoute()
const envStore = useEnvStore()
const sysStore = useSysStore()
const userStore = useUserStore()
const selectActive = ref(false)
const formModel = reactive<Partial<IFormModel>>({})
const isMobileCaptchaSent = ref(false)
const registerSetting: any = ref({})
const captchaShow = ref(false)
const pwdVisible = ref(false)
const pwdVisibleRe = ref(false)
const mobileVerityCode = ref('')
const captchaOk = ref(false)
const smsCaptchaKey = ref(0)
const captchaKey = ref(0)
const verifyRef = ref<any>(null)
const mbVerifyRef = ref<any>(null)
const isLoading = ref(false)

const activeCode = computed(() => {
  return sysStore.areaCodes.find(item => item.mobileAreaCode === sysStore.mobileAreaCode)
})

const disabledMobileCaptcha = computed(() => {
  return !rules.value.mobile.every((rule: (v: string) => boolean) => rule(formModel.mobile ?? '') === true)
})

const rules = computed(() => {
  const staticRules = {
    loginName: rl.registerName,
    loginPwd: rl.password,
    reloadPwd: [
      (val: string) => !!val || lang('请输入确认密码'),
      (val: string) => val === formModel.loginPwd || lang('确认密码与密码不匹配')
    ],
    mobile: activeCode.value ? ((rl.allMobile as any)[activeCode.value.countryCode] || rl.allMobile.all)() : rl.allMobile.all(),
    mobileCaptchareg: [
      () => !!mobileVerityCode.value || lang('请先完成滑块验证'),
      () => isMobileCaptchaSent.value || lang('请先获取验证码'),
      ...rl.mobileCaptcha,
    ],
    realName: [
      rl.realName[1]
    ],
  }
  return formFields.value.reduce((prev: any, curr: any) => {
    const { label, field, required } = curr
    if (field === 'mobileCaptchareg') {
      prev[field] = [
        ...(staticRules as any)[field] || []
      ]
    } else if (field === 'mobile') {
      prev[field] = activeCode.value ? ((rl.allMobile as any)[activeCode.value.countryCode] || rl.allMobile.all)() : rl.allMobile.all()
    } else {
      prev[field] = [
        (val: string) => (
          required
            ? !!val || `${lang('请输入xxx', [label])}`
            : true
        )
      ]
    }
    return prev
  }, {} as any)
})

const formFields = computed(() => {
  const fastRegisterFields = [
    {
      label: lang('手机号'),
      field: 'mobile',
      maxlength: 11,
      icon: 'icon-mobile-phone',
      placeholder: lang('请输入手机号'),
    },
    {
      label: lang('短信验证码'),
      field: 'mobileCaptchareg',
      maxlength: 5,
      icon: 'icon-Safe',
      placeholder: lang('短信验证码'),
    }
  ]
  const fields = [
    {
      label: lang('账号'),
      field: 'loginName',
      placeholder: lang('6~10位字母或数字组合'),
      icon: 'icon-user',
      maxlength: 10,
    },
    {
      label: lang('密码'),
      field: 'loginPwd',
      icon: 'icon-mima',
      placeholder: lang('6~18位字母或数字组合'),
      maxlength: 18,
    },
    {
      type: 'password',
      label: lang('确认密码'),
      field: 'reLoginPwd',
      icon: 'icon-mima',
      placeholder: lang('请再次输入密码'),
      maxlength: 18,
    },
    ...fastRegisterFields,
    {
      label: lang('地址'),
      field: 'address',
      icon: 'icon-adress',
      placeholder: lang('请填写地址'),
      maxlength: 50,
    },
    {
      label: lang('邮箱'),
      field: 'email',
      icon: 'icon-email',
      placeholder: lang('请填写邮箱'),
    },
    {
      label: lang('qq号'),
      field: 'qq',
      icon: 'icon-QQ',
      placeholder: lang('请填写qq号码'),
      maxlength: 15,
    },
    {
      label: lang('姓名'),
      field: 'realName',
      icon: 'icon-user',
      placeholder: lang('请填写姓名'),
      maxlength: 30,
    },
    {
      label: lang('微信'),
      field: 'weChat',
      icon: 'icon-weixin',
      placeholder: lang('请填写微信号'),
      maxlength: 20,
    },
    {
      label: lang('验证码'),
      field: 'captchareg',
      icon: 'icon-Safe',
      placeholder: lang('验证码'),
    },
  ]
  if (formModel.registerMethod) {
    return fastRegisterFields.map(item => ({
      ...item,
      required: true,
    }))
  }
  return fields.reduce((prev, curr: any) => {
    const { field } = curr
    if (registerSetting.value[`${field}isVisible`]) {
      prev.push({
        ...curr,
        required: registerSetting.value[`${field}isRequire`],
      })
    }
    return prev
  }, [] as any)
})

const registerOrigin = computed(() => {
  // 注册来源有三种 正常注册 代理推广链接注册 用户推广链接注册
  if (Platform.is.cordova && envStore.envHasOpeninstall) {
    return {  mainDomain: LocalStorage.getItem('spreadCode') || '' }
  }
  const mainDomain = sysStore.domain
  const { codeId, agentId } = route.query
  if (codeId) {
    return { codeId }
  }
  if (agentId) {
    return { agentId }
  }
  return { mainDomain }
})

onBeforeMount(() => {
  getRegisterSetting()
})

const areaCodeChange = (areaCode: string) => {
  selectActive.value = false
  sysStore.$patch(state => state.mobileAreaCode = areaCode)
}

const toIndex = () => {
  router.push('/')
}

const focusForFixInput = () => {
  if (Platform.is.ios) {
    window.scroll(0, 0)
    window.setTimeout(() => {
      window.scroll(0, 0)
    }, 100)
  }
}

const toLogin = () => {
  emits('toggleUserInfo', 'login')
}

const onSubmit = async () => {
  if (formModel.registerMethod) {
    generateRegisterInfo()
  } else {
    if (!formModel.captchaVerification) {
      const resVfyVfyRegisteAndLogin = await userStore.checkVfyRegisteAndLogin({loginName: formModel.loginName as string})
      if (resVfyVfyRegisteAndLogin && resVfyVfyRegisteAndLogin.code === 0 && resVfyVfyRegisteAndLogin.msg === false) {
        useVerify()
        return
      }
    }
    register()
  }
}

const handleRegisterMethodChange = (type: number) => {
  if (type) { // 手机号快速注册
    formModel.registerMethod = 1
    formModel.mobile = ''
    formModel.mobileCaptchareg = ''
  } else {
    formModel.registerMethod = 0
    formModel.loginName = ''
    formModel.loginPwd = ''
  }
}

const sendMobileCaptcha = () => {
  return new Promise((resolve, reject) => {
    userStore.checkIsMobileRegistered(formModel)
      .then((isRegistered) => {
        if (isRegistered) {
          Notify.create(lang('手机号不支持重复注册，请更换手机号码！'))
          reject()
        } else {
          apiSendCaptcha({
            fetchUrl: 'sendMobCodeReg',
            formModel: {
              mobile: formModel.mobile,
              mobileAreaCode: sysStore.mobileAreaCode,
              captchaVerification: mobileVerityCode.value,
            },
          })
            .then(() => {
              captchaOk.value = true
              resolve(true)
            })
            .catch(() => {
              captchaOk.value = true
              smsCaptchaKey.value = Date.now()
              reject(false)
            })
        }
      })
  })
}

const getRegisterSetting = () => {
  console.log('login')
  userStore.getRegisterSetting()
    .then((data) => {
      registerSetting.value = data
      handleRegisterMethodChange(0)
    })
}

const register = () => {
  const params = JSON.parse(JSON.stringify(formModel))
  isLoading.value = true
  userStore.register({
    ...params,
    ...registerOrigin.value,
    mobileAreaCode: sysStore.mobileAreaCode,
  })
    .then(() => {
      userStore.closeSignDialog()
      emits('success')
      LocalStorage.set('showDownloadbar', '')
    })
    .catch((e) => {
      console.log(e)
      captchaKey.value = Date.now()
      formModel.captchaVerification = ''
    })
    .finally(() => {
      isLoading.value = false
    })
}

const generateRegisterInfo = () => {
  userStore.generateRegisterInfo(formModel)
    .then(({ loginName, loginPwd }) => {
      router.push({
        path: '/register/confirm',
        query: {
          ...formModel,
          ...registerOrigin.value,
          loginName,
          loginPwd,
        } as any
      })
    })
}

const useVerify = () => {
  verifyRef.value?.show()
}

const success = (params: any) => {
  formModel.captchaVerification = params.captchaVerification
  register()
}

const mobileSuccess = (params: any) => {
  mobileVerityCode.value = params.captchaVerification
}

const openMobileVerify = () => {
  mbVerifyRef.value?.show()
}
</script>

<style lang="scss">
.signup {
  &-form {
    @include overflow();
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>