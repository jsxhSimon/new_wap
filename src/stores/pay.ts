import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { SessionStorage } from 'quasar'
import { apiCheckBalance, apiRecoverBalance } from 'src/http'
import { format } from 'src/utils/tool'
import { useLoading } from 'src/utils'

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
    getTransactionRecords(field: string, params: { pageNo: number }) {
      const urlMapper: Record<string, string> = {
        deposit: 'OnlinePay/pzPay/getFundDepositList',
        withdraw: 'user/wdApplyList',
        coupons: 'user/bonusAndTaskList',
        bonus: 'OnlinePay/pzPay/getFundDepositList',
        washcode: 'user/depotWaterDetailList',
      }

      const defaultParams: any = {
        orderBy: '',
        pageSize: 15,
        startTime: '',
        entTime: '',
      }

      if (field === 'deposit') {
        defaultParams.mark = 0
      }

      if (field === 'bonus') {
        defaultParams.mark = 2
      }
      if (['coupons', 'washcode'].includes(field)) {
        defaultParams.startTime = `${format(new Date(), 30)} 00:00:00`
        defaultParams.entTime = `${format(new Date())} 23:59:59`
      }
      const closeLoading = useLoading()
      return axios
        .get(urlMapper[field], {
          params: {
            ...defaultParams,
            ...params,
          },
        })
        .then(({ data }) => {
          switch (field) {
            case 'withdraw':
              return data
            case 'coupons':
              return data.page
            case 'washcode':
              return data.data
            default:
              return data.res
          }
        }).finally(() => {
          closeLoading()
        })
    }
  }
})
