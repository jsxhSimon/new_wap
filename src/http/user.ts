import { axios } from 'boot/axios'

export const apiCheckVfyRegisterAndLogin = (params: { loginName: string }) => {
  return axios.post('user/vfyRegisteAndLogin', params)
    .then(({ data }) => data)
}

export const apiLogin = (params: any) => {
  return axios.post('user/login', params)
}