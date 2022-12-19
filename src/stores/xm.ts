import { defineStore } from 'pinia'
import { axios, CancelToken } from 'boot/axios'
import { Canceler } from 'axios'
import { useUserStore, useEnvStore } from 'src/stores'
import { LocalStorage, SessionStorage } from 'quasar'
import { XMMatch, XmMenu, XMMarket, XMPlay, XMPlayOpts } from 'src/types/sports'
import { MENU_MAP } from 'components/obty/utils/constants'

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
  matchCache: {
    [attr: number]: Partial<{
      type: number;
      subMenuId: number;
      list: XMMatch[];
    }>;
  }
  activeMenuModel: Partial<XmMenu>;
  changeBetToMultiple: boolean;
  betCountShowActive: boolean;
  activeBetData: {
    hlIndex: number;
    hpIndex: number;
    lb: string;
    market: XMMarket;
    match: XMMatch;
    oIndex: number;
    os: number;
    play: XMPlay;
    playOpts: XMPlayOpts;
    quota?: {
      max: number;
      min: number;
    }
  }[];
}

export const useXmStore = defineStore('xm', {
  state: (): IXmStore => ({
    userId: LocalStorage.getItem('pandaUserId') ?? null,
    menuCache: SessionStorage.getItem('menuCache') ?? [],
    pandaLogin: false,
    matchCache: SessionStorage.getItem('matchCache') ?? {},
    activeMenuModel: {},
    changeBetToMultiple: false,
    betCountShowActive: false,
    activeBetData: [],
  }),
  getters: {
    isMultiple(state) {
      return state.activeMenuModel.menuType === MENU_MAP.CHUAN_GUAN || state.changeBetToMultiple
    },
    isZaoPan(state) {
      return state.activeMenuModel.menuType === MENU_MAP.ZAO_PAN
    },
  },
  actions: {
    setBetCountShowActive(flag: boolean) {
      if (flag === false) {
        window.gendan = false
      }
      this.$patch(state => state.betCountShowActive = flag)
    },
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
            this.$patch(state => state.matchCache[params.subMenuId] = {
              type: params.type,
              subMenuId: params.subMenuId,
              list: data.data.slice(0, 10),
            })
            return data.data
          }
        })
    },
  }
})
