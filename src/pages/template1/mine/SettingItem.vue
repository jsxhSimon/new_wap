<template>
  <q-page class="settingItem">
    <ValidationForm
      error-absolute
      :rules="rules"
      :model="formModel"
    >
      <q-list>
        <!-- 真实姓名 -->
        <template v-if="field === 'realName'">
          <div class="cardList no-border realName pwditem">
            <q-item class="q-py-none">
              <q-item-section>
                <input v-model="formModel.realName" required tabindex="0" :placeholder="$t('请输入真实姓名')" type="text" minlength="2" maxlength="30" class="q-field__native q-placeholder text-title text-body2">
              </q-item-section>
            </q-item>
          </div>
          <div class="birthTips">
            <p>{{ $t('为了您的隐私安全，信息在提交后将无法修改。') }}</p>
            <p>{{ $t('请务必如实填写，以保护您的账户安全。') }}</p>
          </div>
        </template>

        <!-- 性别 -->
        <template v-if="field === 'gender'">
          <div class="cardList shadow-1">
            <q-item class="q-py-none">
              <q-item-section>
                <div
                  :class="formModel.gender=='男'?'genderItem active':'genderItem'"
                  @click="formModel.gender='男'"
                >
                  <q-item-label>{{ $t('男') }}</q-item-label>
                  <span class="slc iconfont" :class="formModel.gender==='男' ? 'icon-xuanze1' : 'icon-xuanze'"></span>
                </div>
              </q-item-section>
            </q-item>
          </div>
          <div class="cardList shadow-1">
            <q-item class="q-py-none">
              <q-item-section>
                <div
                  :class="formModel.gender=='女'?'genderItem active':'genderItem'"
                  @click="formModel.gender='女'"
                >
                  <q-item-label>{{ $t('女') }}</q-item-label>
                  <span class="slc iconfont" :class="formModel.gender==='女' ? 'icon-xuanze1' : 'icon-xuanze'"></span>
                </div>
              </q-item-section>
            </q-item>
          </div>

          <div class="birthTips">
            <p>{{ $t('为了您的隐私安全，信息在提交后将无法修改。') }}</p>
            <p>{{ $t('请务必如实填写，以保护您的账户安全。') }}</p>
          </div>
        </template>

        <!-- 手机号码 -->
        <template v-if="field === 'mobile'">
          <div class="cardList mobile no-border">
            <q-item class="q-py-none">
              <q-item-section
                side
                class="account-setting_item-label"
              >
                <div class="sdy-select" :class="{active: selectActive}" @click="selectActive = !selectActive">
                  <div class="label">{{sysStore.activeCode ? '+'+sysStore.activeCode.mobileAreaCode : $t('区号')}}</div>
                </div>
                <AreaCodePopup :show="selectActive" @change="areaCodeChange" @close="selectActive = false" />
              </q-item-section>

              <q-item-section>
                <q-input
                  v-model="formModel.mobile"
                  dense
                  borderless
                  :maxlength="sysStore.mobileMaxLen"
                  :rules="rules['mobile']"
                  :placeholder="$t('手机号码')"
                  input-class="text-title text-body2"
                />
              </q-item-section>
            </q-item>
          </div>


          <div class="cardList mobile no-border">
            <q-item class="q-py-none">
              <q-item-section>
                <q-input
                  class="fs-11"
                  :placeholder="$t('请输入验证码')"
                  v-model.trim="formModel.code"
                  dense
                  borderless
                  :rules="rules['code']"
                  maxlength="5"
                  input-class="text-title text-body2"
                />
              </q-item-section>

              <q-item-section side>
                <CaptchaButton
                  :disabled="!chack_mobile"
                  v-model:isCaptchaSend="isCaptchaSent"
                  :fetchMethod="sendCaptcha"
                  :needVerify="true"
                  :captchaVerification="(formModel.captcha as string)"
                  @openMobileVerify="openMobileVerify"
                />
              </q-item-section>
            </q-item>
            <Verify
              @success="mobileSuccess"
              mode="pop"
              captchaType="blockPuzzle"
              :imgSize="{ width: '310px', height: '155px' }"
              ref="mbVerify"
            />
          </div>

          <div class="birthTips">
            <p>{{ $t('为了您的隐私安全，信息在提交后将无法修改。') }}</p>
            <p>{{ $t('请务必如实填写，以保护您的账户安全。') }}</p>
          </div>
        </template>
        <!-- 电子邮箱 -->
        <template v-if="field === 'email'">
          <div class="cardList no-border email">
            <q-item class="q-py-none">
              <q-item-section>
                <q-input
                  v-model.trim="formModel.email"
                  dense
                  borderless
                  :rules="rules['email']"
                  :placeholder="$t('邮件地址')"
                  input-class="text-title text-body2"
                />
              </q-item-section>
            </q-item>
          </div>
          <div class="birthTips">
            <p>{{ $t('为了您的隐私安全，信息在提交后将无法修改。') }}</p>
            <p>{{ $t('请务必如实填写，以保护您的账户安全。') }}</p>
          </div>
        </template>
        <!-- 出生日期 -->
        <template v-if="field === 'birthday'">
          <div class="cardList shadow-1 datepick">
            <q-item class="q-py-none">
              <q-item-section>
                <q-date
                  v-model="formModel.birthday"
                  minimal
                  mask="YYYY-MM-DD"
                  class="no-box-shadow"
                />
              </q-item-section>
            </q-item>
          </div>
          <div class="birthTips">
            <p>{{ $t('为了您的隐私安全，信息在提交后将无法修改。') }}</p>
            <p>{{ $t('请务必如实填写，以保护您的账户安全。') }}</p>
          </div>
        </template>

        <!-- 修改密码 -->
        <template v-if="field === 'pwd'">
          <div class="cardList cardListBg shadow-1 pwditem" style="padding-top:20px">
            <span class="item-name">{{ $t('原密码') }}</span>
            <q-item class="q-py-none pw-input">
              <q-item-section>
                <q-input
                  v-model="formModel.lastPwd"
                  dense
                  borderless
                  :type="confirmPasswordVisible1 ? 'text' : 'password'"
                  :placeholder="$t('6~18位数字或字母组合')"
                  :rules="rules['lastPwd']"
                  input-class="text-title text-body2"
                />
              </q-item-section>
              <q-item-section side>
                <span
                  :class="!confirmPasswordVisible1?'iconfont iconyanjing_bi':'iconfont iconyanjing'"
                  @click="confirmPasswordVisible1 = !confirmPasswordVisible1"
                ></span>
              </q-item-section>
            </q-item>

            <span class="item-name">{{ $t('新密码') }}</span>
            <q-item class="q-py-none pw-input">
              <q-item-section>
                <q-input
                  v-model.trim="formModel.pwd"
                  dense
                  borderless
                  :placeholder="$t('6~18位数字或字母组合')"
                  :rules="rules['pwd']"
                  input-class="text-title text-body2"
                  :type="confirmPasswordVisible2 ? 'text' : 'password'"
                />
              </q-item-section>
              <q-item-section side>
                <span
                  :class="!confirmPasswordVisible2?'iconfont iconyanjing_bi':'iconfont iconyanjing'"
                  @click="confirmPasswordVisible2 = !confirmPasswordVisible2"
                ></span>
              </q-item-section>
            </q-item>

            <span class="item-name">{{ $t('确认密码') }}</span>
            <q-item class="q-py-none pw-input">
              <q-item-section>
                <q-input
                  v-model="formModel.confirmPwd"
                  dense
                  borderless
                  :rules="rules['confirmPwd']"
                  :type="confirmPasswordVisible3 ? 'text' : 'password'"
                  :placeholder="$t('请再次输入密码')"
                  input-class="text-title text-body2"
                />
              </q-item-section>
              <q-item-section side>
                <span
                  :class="!confirmPasswordVisible3?'iconfont iconyanjing_bi':'iconfont iconyanjing'"
                  @click="confirmPasswordVisible3 = !confirmPasswordVisible3"
                ></span>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-list>

      <template v-slot:bottom="{ valid }">
        <q-btn
          :label="$t('提 交')"
          :disable="!valid"
          :color="!valid?'unvalid-btn':'valid-btn'"
          :loading="isLoading"
          :class="['submit', !valid?'unvalid-btn':'valid-btn']"
          @click="handleSubmit"
        />
      </template>
    </ValidationForm>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { minLength, maxLength } from 'vuelidate/lib/validators'
import { alphaNum, rules as rl } from 'src/utils'
import { useSysStore, useUserStore } from 'src/stores'
import ValidationForm from 'components/ValidationForm.vue'
import Verify from 'components/verify/index.vue'
import AreaCodePopup from 'src/components/AreaCodePopup.vue'
import CaptchaButton from 'src/components/CaptchaButton.vue'
import { apiSendCaptcha } from 'src/http'

const { t: lang } = useI18n()
const route = useRoute()
const router = useRouter()
const sysStore = useSysStore()
const userStore = useUserStore()
const selectActive = ref(false)
const formModel: Partial<ISettingItemFormModel> = reactive({
  gender: '男',
  realName: '',
  birthday: '',
  mobile: '',
  code: '',
  email: '',
  pwd: '',
  confirmPwd: '',
  lastPwd: '',
})
const confirmPasswordVisible1 = ref(false)
const confirmPasswordVisible2 = ref(false)
const confirmPasswordVisible3 = ref(false)
const isLoading = ref(false)
const isCaptchaSent = ref(false)
const captchaOk = ref(true)
const captchaKey = ref(0)
const refreshNum = ref(0)
const mbVerify = ref<any>(null)

const field = computed(() => {
  return route.params.field as string
})

const chack_mobile = computed(() => {
  const mobileRules = rules.value.mobile
  const mobileRuleResult = mobileRules.every((rule: (str: string | undefined) => boolean) => rule(formModel.mobile) === true)
  return mobileRuleResult
})

const rules = computed(() => {
  const rulesMapper = {
    realName: {
      realName: [
        (value: string) => chack_name(value) || lang('真实姓名不得包含特殊字符'),
        (value: string) => (minLength(2)(value) && maxLength(30)(value)) || lang('2~30位字符'),
        (value: string) => !!value || lang('请输入真实姓名'),
      ],
    },
    gender: {
      gender: [
        (value: string) => !!value || lang('性别必填'),
      ],
    },
    birthday: {
      birthday: [
        (value: string) => !!value || lang('生日必填'),
      ],
    },
    mobile: () => ({
      mobile: sysStore.activeCode ? ((rl.allMobile as any)[sysStore.activeCode.countryCode] || rl.allMobile.all)() : rl.allMobile.all(),
      code: [
        () => !!formModel.captcha || lang('请先完成滑块验证'),
        () => isCaptchaSent.value || lang('请先获取验证码'),
        ...rl.mobileCaptcha,
      ],
    }),
    email: {
      email: [
        (value: string) => check_email(value) || lang('邮箱不合法'),
        (value: string) => !!value || lang('请输入邮箱地址'),
      ],
    },
    pwd: {
      pwd: [
        (value: string) => !!value || lang('请输入新密码'),
        (value: string) => value !== formModel.lastPwd || lang('新密码不能与旧密码相同'),
        (value: string) => (alphaNum(value) && minLength(6)(value) && maxLength(18)(value)) || lang('6~18位数字或字母组合'),
      ],
      confirmPwd: [
        (value: string) => !!value || lang('请再次输入密码'),
        (value: string) => value === formModel.pwd || lang('两次输入的密码不一致'),
        (value: string) => (alphaNum(value) && minLength(6)(value) && maxLength(18)(value)) || lang('6~18位数字或字母组合'),
      ],
      lastPwd: [
        (value: string) => !!value || lang('请输入旧密码'),
        (value: string) => (alphaNum(value) && minLength(6)(value) && maxLength(18)(value)) || lang('6~18位数字或字母组合'),
      ],
    },
  }
  if (field.value === 'mobile') return rulesMapper.mobile();
  return (rulesMapper as any)[field.value]
})

const chack_name = (str: string) => {
  return !new RegExp("[`~')}}#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？1234567890]").test(str)
}
const check_email = (email: string) => {
  return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)
}

const areaCodeChange = (areaCode: string) => {
  selectActive.value = false
  sysStore.$patch(state => state.mobileAreaCode = areaCode)
}

const sendCaptcha = () => {
  const { codeSign, mobile, captcha } = formModel
  return new Promise((resolve, reject) => {
    apiSendCaptcha({
      fetchUrl: 'sendMobCode',
      formModel: {
        mobile,
        codeSign,
        captchaVerification: captcha,
        mobileAreaCode: sysStore.mobileAreaCode
      }
    }).then(() => {
      captchaOk.value = true
      resolve(true)
    }).catch(() => {
      captchaOk.value = false
      captchaKey.value = Date.now()
      reject()
    })
  })
}

const handleSubmit = () => {
  isLoading.value = true
  userStore.modifyUserInfoItem(field.value, formModel)
    .then(() => {
      router.go(-1)
    })
    .finally(() => {
      refreshNum.value += 1
      isLoading.value = false
    })
}

const openMobileVerify = () => {
  mbVerify.value.show()
}
const mobileSuccess = (params: {captchaVerification: string}) => {
  formModel.captcha = params.captchaVerification
}

</script>

<style lang="scss">
.settingItem {
  .mobile, .email{
    .q-field__bottom{
      padding-top: 15px;
    }
  }
  .email{
    .material-icons {
      display: none;
    }
  }
  .item-name {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 20px;
  }
  .pw-input {
    background: var(--input-bg);
    border-radius: 4px;
    margin: 5px 0 18px 0;
  }
}
.birthTips {
  margin: 10px 0 0 0;
  p {
    text-align: left;
    margin: 4px 2px !important;
    font-size: 13px;
    font-weight: 400;
    color: var(--t2);
    line-height: 18px;
  }
}
.cardList.datepick {
  .q-item {
    padding: 0 !important;
    .q-date {
      background: #FFFFFF;
      color: var(--text-label);
      width: 100% !important;
    }
  }
  .q-date__calendar-item {
    .bg-primary {
      background: #D1BEAC !important;
      color: #000 !important;
    }
  }
}
.account-setting_item-label {
  min-width: 80px;
}
.genderItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  .iconfont {
    color: var(--t4);
  }
  &.active {
    .iconfont {
      color: var(--theme-color) !important;
    }
  }
}
.q-field__bottom {
  bottom: 10px!important;
}
.cardList {
  border-radius: 8px;
  margin-bottom: 20px !important;
  background: var(--bg1);
  box-shadow: var(--box-shadow);
  .sdy-select {
    background: var(--bg4);
    color: var(--t2);
  }
  &.cardListBg{
    background: var(--bg1);
  }
  &.shadow-1 {
    .q-field__bottom--animated{
      transform:translateY(140%)!important
    }
    .iconfont {
      color: var(--t4);
    }
    .q-field__native {
      color: var(--t1) !important;
      &::placeholder {
        color: var(--text-label2) !important;
      }
    }
    .q-item__section {
      .text-primary {
        color: var(--primary-text) !important;
      }
    }
    .q-field--error .q-field__bottom {
      color: #fd3a2e !important;
    }
    .q-field--error {
      .q-field__native {
        // color: #fd3a2e !important;
      }
      .q-anchor--skip {
        .material-icons {
          display: none;
        }
      }
    }
  }

  .q-item__label {
    font-size:14px;
    color: var(--primary-text);
  }
}
.pwditem {
  padding: 20px 20px 10px 20px;
  // height: 35px;
  // .column {
  //   height: 35px;
  // }
}
.mobile {
  // height: 35px;
  // .column {
  //   height: 35px;
  // }
  .qrCodeBtn {
    height: 20px;
    .q-btn__wrapper {
      height: 20px;
      min-height: 20px;
      line-height: 20px;
    }
  }
}
.settingItem {
  padding: 12px 10px 0 10px;
  border-radius: 10px;
  .tips {
    margin-top: 30px;
    span {
      display: block;
      color: #646464;
      text-align: center;
    }
  }
  .text-title {
    color: #505679 !important;
  }
}
.submit {
  width: 255px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  margin: 20px 0 0 50px;
  background: var(--lg2);
  color: var(--t5);
  border-radius: 20px;
  &.unvalid-btn{
    opacity: .5 !important;
  }
  &.valid-btn{
    opacity: 1 !important;
  }
}
.width100 {
  height: 35px;
  margin-top: 10px;
  line-height: 35px;
  font-size: 16px;
  .q-btn__wrapper {
    padding: 0;
    min-height: 35px;
  }
}
.settingItemCaptcha {
  height: 30px;
}
.mobileAreaCodeSelect {
  // width: 60px;
  height: auto;
  font-size: 12px;
  border-radius:4px;
  background: #F3F0ED;
  color: #666;
  border: 0px solid;
}
.settingItem .q-item {
  border: none;
}
.q-btn .q-icon, .q-btn .q-spinner{
  font-size: 2.5em;
}
</style>
