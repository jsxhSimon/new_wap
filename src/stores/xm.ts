import { defineStore } from 'pinia'
import { axios, CancelToken } from 'boot/axios'
import { Canceler } from 'axios'
import { useUserStore, useEnvStore } from 'src/stores'
import { LocalStorage, SessionStorage } from 'quasar'
import { XMMatch, XmMenu } from 'src/types/sports'

const PREFIX = 'splive/panda/XM'
let sportsMenuCancel: Canceler | null = null
let matchCancel: Canceler | null = null


const getCommonParams = () => {
  const userStore = useUserStore()
  const envStore = useEnvStore()
  return {
    siteCode: envStore.appEnv,
    userName: userStore.userInfo.loginName,
  }
}

interface IXmStore {
  userId: number | null,
  menuCache: XmMenu[];
  pandaLogin: boolean;
  matchCache: Partial<{
    type: number;
    subMenuId: number;
    list: XMMatch[];
  }>;
}

export const useXmStore = defineStore('xm', {
  state: (): IXmStore => ({
    userId: LocalStorage.getItem('pandaUserId') ?? null,
    menuCache: SessionStorage.getItem('menuCache') ?? [],
    pandaLogin: false,
    matchCache: SessionStorage.getItem('matchCache') ?? {},
  }),
  actions: {
    getMenu() {
      if (sportsMenuCancel) {
        sportsMenuCancel()
        sportsMenuCancel = null
      }
      return axios
        .post(`${PREFIX}/getSportsMenu`, {
          origin: 'H5',
          sys: '3',
          cuid: this.userId,
          ...getCommonParams(),
        }, {
          cancelToken: new CancelToken((c) => {
            sportsMenuCancel = c
          })
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.$patch(state => state.menuCache = data.data)
            SessionStorage.set('menuCache', this.menuCache)
            return data.data
          }
          return Promise.reject()
        })
    },
    getMatches(params: {euid: string; menuName: string; subMenuId: number; type: number}) {
      const apiUrl = this.pandaLogin ? 'matches' : 'matchesNoLogin'
      if (matchCancel) {
        matchCancel()
        matchCancel = null
      }
      return axios
        .post(`${PREFIX}/${apiUrl}`, {
          cuid: this.userId,
          sort: 2,
          ...getCommonParams(),
          ...params
        }, {
          cancelToken: new CancelToken((c) => {
            matchCancel = c
          })
        })
        .then(({ data }) => {
          if (data.code !== 0) return Promise.reject()
          if (data && data.data) {
            this.$patch(state => state.matchCache = {
              type: params.type,
              subMenuId: params.subMenuId,
              list: data.data.slice(0, 10),
            })
            return data.data
          }
        })
    }
  }
})
