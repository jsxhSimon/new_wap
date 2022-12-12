import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { SessionStorage } from 'quasar'
import { apiCheckBalance, apiRecoverBalance } from 'src/http'

export const usePayStore = defineStore('pay', {
  state: () => ({
    balance: 0,
    mtCode: '',
    payHtml: SessionStorage.getItem('payhtml') ?? '',
  }),
  actions: {
    getBalance() {
      return apiCheckBalance()
        .then(({ data }) => {
          this.$patch(state => state.balance = data.balance)
        })
    },
    recoverBalance() {
      return apiRecoverBalance()
    },
    getVipInfo() { // 获取VIP 信息
      return axios
        .get('sdyactivity/vipInfo?=1')
    },
  }
})
