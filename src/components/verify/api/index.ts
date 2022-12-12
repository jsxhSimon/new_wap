import { axios } from 'boot/axios'

export const reqGet = (params: any) => axios.post('user/captcha/new/get', params, { timeout: 15000 }).then(({ data }) => data)

export const reqCheck = (params: any) => axios.post('user/captcha/new/check', params).then(({ data }) => data)
