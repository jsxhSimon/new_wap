import { defineStore } from 'pinia'
import { axios, CancelToken } from 'boot/axios'
import { Canceler } from 'axios'
import { useEnvStore, useUserStore } from 'src/stores'
import { FBMatch, IFBMenu1, IFBMenu2 } from 'src/types/sports'
import { SessionStorage } from 'quasar'

let matchCancel: Canceler | null = null

const fbPrefix = 'splive/fbob/fbob'
const getCommonParams = () => {
  const userStore = useUserStore()
  const envStore = useEnvStore()
  return {
    siteCode: envStore.appEnv,
    userName: userStore.userInfo.loginName,
    languageType: 'CMN',
  }
}

export const playTypeMap = {
  '滚球': 1,
  '今日': 3,
  '早盘': 4,
  '串关': 2,
  '冠军赛事': 7,
}

const getTypeNameById = (id: number) => {
  return Object.keys(playTypeMap).find(item => (playTypeMap as any)[item] === id)
}

interface IFbtyStore {
  menuCache: IFBMenu1[];
  matchCache: {[prop: string]: {[prop: number]: FBMatch[]}};
  activeMenu: Partial<IFBMenu1>;
  activeSubMenu: Partial<IFBMenu2>;
}

export const useFbtyStore = defineStore('fbty', {
  state: (): IFbtyStore => ({
    menuCache: SessionStorage.getItem('fbMenuCache') ?? [],
    matchCache: {},
    activeMenu: {},
    activeSubMenu: {},
  }),
  actions: {
    getMenus() {
      return axios.post(`${fbPrefix}/getSportsMenu`, {
        ...getCommonParams(),
      }).then(({ data }) => {
        this.$patch(state => state.menuCache = data.message.menu1)
        SessionStorage.set('fbMenuCache', this.menuCache)
        return data.message
      })
    },
    getMatchList(params: {type: number; sportId: number;}) {
      if (matchCancel) {
        matchCancel()
        matchCancel = null
      }
      return axios.post(`${fbPrefix}/matches`, {
        ...getCommonParams(),
        ...params,
      }, {
        cancelToken: new CancelToken((c) => {
          matchCancel = c
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.setMatchCache(data.data, params)
          return data.data
        }
        return Promise.reject()
      })
    },
    setMatchCache(list: FBMatch[], params: {type: number; sportId: number;}) {
      if (list?.length) {
        const arr = list.splice(0, 10)
        const typeName = getTypeNameById(params.type)!
        if (!this.matchCache[typeName]) {
          this.$patch(state => state.matchCache[typeName] = {
            [params.sportId]: arr
          })
        } else {
          this.$patch(state => state.matchCache[typeName][params.sportId] = arr)
        }
        SessionStorage.set('fbMatchCache', this.matchCache)
      }
    },
  }
})
