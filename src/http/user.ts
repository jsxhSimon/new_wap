import { axios } from 'boot/axios'

export const apiCheckVfyRegisterAndLogin = (params: { loginName: string }) => {
  return axios.post('user/vfyRegisteAndLogin', params)
}

export const apiLogin = (params: any) => {
  return axios.post('user/login', params)
}

export const apiRegister = (params: Partial<IFormModel>, headers: any) => {
  return axios.post('user/register', params, { headers })
}

export const apiGenerateRegInfo = (params: Partial<IFormModel>) => {
  return axios.post('user/generateRegInfo', params)
}

// 获取注册项
export const apiRegistSetting = () => {
  return axios.get('user/getRegistSetting')
}

export const apiMessageInfo = (params: Partial<IMessageInfoParams>) => {
  return axios.get('user/messageInfo', {params})
}

// 获取中奖名单
export const apiWinList = () => {
  return axios.get('user/getWinUserList')
}

// 重置密码验证码
export const apiResetPasswordValidCode = (params: Partial<IFormModel>) => {
  return axios.get('retrvpwd/validCode', {
    params
  })
}

// 使用手机号重置密码
export const apiResetPasswordWithMoble = (params: Partial<IFormModel>) => {
  return axios.get('retrvpwd/retrvwayEx')
}
