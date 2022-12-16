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
    getAccountBirthday() { // 查询生日礼金状态
      return axios
        .get('sdyactivity/accountBirthday?terminal=1')
    },
    getAccountVipPrivileges() { // 获取VIP晋级优惠(VIP特权存就送)信息查询
      return axios
        .get('sdyactivity/accountVipPrivileges?terminal=1')
    },
    getActApply(params: {activityId: number; catId?: number;}) { // 加密货币支付提单
      return axios
        .post('user/actApply', params)
    },
    getGameListWithoutRebate() {
      return axios
        .get('sys/getGameListWithoutRebate')
    },
  }
})
