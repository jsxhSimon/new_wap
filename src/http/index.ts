import { axios } from 'boot/axios'

// 获取区号列表
export const apimobileAreaCodes = () => {
  return axios.get('sys/mobileAreaCodes')
}