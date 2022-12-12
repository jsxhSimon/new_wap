import { axios } from 'boot/axios'
import { SessionStorage } from 'quasar'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  actions: {
    getAccountSignInfo() { // 上上签到 - 获取接口
      return axios
        .get('sdyactivity/accountSignInfo')
        .then(({ data }) => data.data)
    },
    clickRate(params: {configId: number}) { // 统计点击量
      return axios
        .get('task/clickRate', { params })
    },
    clickSignBtn(params: {configId: number; terminal: number;}) { // 上上签到 - 点击签到按钮
      return axios
        .get('task/getTask', { params })
        .then(({ data }) => data.data)
    },
  },
})
