import {
  // alpha,
  numeric,
  // between,
  minLength,
  maxLength,
  required,
  alphaNum,
} from 'vuelidate/lib/validators'

import { i18n } from 'boot/i18n'

const { t: lang } = i18n.global

// 中文
const chinese = value => /^[\u4e00-\u9fa5]+$/.test(value)

// 真实姓名
const realName = value => /^[A-Za-z\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u0020]{2,30}$/.test(value)
// 会员真实姓名不能为空，长度为2～30位
// const realName = value => /^[^\s]{2,30}$/.test(value)

const twNumber = value => /^(886)?09\d{8}$/.test(value)

export const rules = {
  loginName: [ // 6~16位字母或数字组合
    value => required(value) || lang('请输入账号'),
    value => (alphaNum(value) && minLength(6)(value) && maxLength(16)(value)) || lang('6~16位字母或数字组合'),
  ],
  registerName: [ // 6~10位字母或数字组合
    value => required(value) || lang('请输入账号'),
    value => (alphaNum(value) && minLength(6)(value) && maxLength(10)(value)) || lang('6~10位字母或数字组合'),
  ],
  password: [ // 6~18位数字或字母组合
    value => required(value) || lang('请输入密码'),
    value => (alphaNum(value) && minLength(6)(value) && maxLength(18)(value)) || lang('6~18位数字或字母组合'),
  ],
  captcha: [ // 图片验证码
    val => !!val || lang('请输入验证码'),
    val => val.length <= 4 || lang('验证码格式不正确'),
  ],
  mobileCaptcha: [ // 手机验证码
    val => required(val) || lang('请输入验证码'),
    val => (numeric(val) && (val.length === 5)) || lang('验证码格式不正确'),
  ],
  bankAddress: [ // 必须是中文
    value => required(value) || lang('请输入支行名称'),
    value => chinese(value) || lang('支行名称只能是中文'),
  ],
  bankCardNo: [ // 16-19位数字
    value => required(value) || lang('请输入银行卡号'),
    value => (numeric(value) && minLength(16)(value) && maxLength(19)(value)) || lang('银行卡号格式不正确'),
  ],
  mobile: { // 手机号
    az: () => [
      value => required(value) || lang('请输入手机号'),
      value => /^4\d{8}$/.test(value) || lang('手机号格式不正确'),
    ],
    dl: () => [ // 中国大陆
      value => required(value) || lang('请输入手机号'),
      value => (numeric(value) && minLength(11)(value) && maxLength(11)(value)) || twNumber(value) || lang('手机号格式不正确'),
    ],
    tw: () => [ // 中国台湾
      value => required(value) || lang('请输入手机号'),
      value => /^(886)?09\d{8}$/.test(value) || lang('手机号格式不正确'),
    ],
  },
  // mobile1: [ // 手机号
  //   value => required(value) || '请输入手机号',
  //   value => (numeric(value) && minLength(11)(value) && maxLength(11)(value)) || '手机号格式不正确',
  // ],
  allMobile: {
    CN: () => [ // 中国大陆
      value => required(value) || lang('请输入手机号'),
      value => (numeric(value) && minLength(11)(value) && maxLength(11)(value)) || twNumber(value) || lang('手机号格式不正确'),
    ],
    TW: () => [ // 中国台湾
      value => required(value) || lang('请输入手机号'),
      value => /^(886)?09\d{8}$/.test(value) || lang('手机号格式不正确'),
    ],
    AUD: () => [
      value => required(value) || lang('请输入手机号'),
      value => /^4\d{8}$/.test(value) || lang('手机号格式不正确'),
    ],
    VN: () => [
      value => required(value) || lang('请输入手机号'),
      value => (numeric(value) && (value.length === 10 || value.length === 9)) || lang('手机号格式不正确'),
    ],
    all: () => [
      value => required(value) || lang('请输入手机号'),
      value => (numeric(value) && minLength(1)(value) && maxLength(60)(value)) || lang('手机号格式不正确'),
    ],
  },
  realName: [ // 真实姓名
    value => required(value) || lang('请输入真实姓名'),
    value => realName(value) || lang('真实姓名不能为空，长度为2～30位'),
  ],
}
