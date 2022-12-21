import { defineStore } from 'pinia'
import { axios, CancelToken } from 'boot/axios'
import { Canceler } from 'axios'
import { useUserStore, useEnvStore } from 'src/stores'
import { LocalStorage, SessionStorage, Notify } from 'quasar'
import { XMMatch, XmMenu, IXmBetData, IXmBetType } from 'src/types/sports'
import { MENU_MAP } from 'components/obty/utils/constants'
import { i18n } from 'boot/i18n'

const { t: lang } = i18n.global

const PREFIX = 'splive/panda/XM'
let sportsMenuCancel: Canceler | null = null
let matchCancel: Canceler | null = null
let getcateCancel: Canceler | null = null

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
  activeBetData: IXmBetData[];
  betPanelShowActive: boolean;
  isGetMax: boolean;
  oldOdd: number | string;
  sericeList: string[];
  betTypeList: Record<number, IXmBetType[]>
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
    betPanelShowActive: false,
    isGetMax: false,
    oldOdd: '',
    sericeList: ['2001', '3004', '40011', '50026', '60057', '700120', '800247', '900502', '10001013'],
    betTypeList: {
      2: [
        {
          name: '2串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        }
      ],
      3: [
        {
          name: '2串1',
          Number: '3',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '3串4',
          Number: '4',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3004
        }
      ],
      4: [
        {
          name: '2串1',
          Number: '6',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '4',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '4串11',
          Number: '11',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 40011
        }
      ],
      5: [
        {
          name: '2串1',
          Number: '10',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '10',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '5',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '5串26',
          Number: '26',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 50026
        }
      ],
      6: [
        {
          name: '2串1',
          Number: '15',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '20',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '15',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '6',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '6串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 6001
        },
        {
          name: '6串57',
          Number: '57',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 60057
        }
      ],
      7: [
        {
          name: '2串1',
          Number: '21',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '35',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '35',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '21',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '6串1',
          Number: '7',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 6001
        },
        {
          name: '7串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 7001
        },
        {
          name: '7串120',
          Number: '120',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 700120
        }
      ],
      8: [
        {
          name: '2串1',
          Number: '28',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '56',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '70',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '56',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '6串1',
          Number: '28',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 6001
        },
        {
          name: '7串1',
          Number: '8',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 7001
        },
        {
          name: '8串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 8001
        },
        {
          name: '8串247',
          Number: '247',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 800247
        }
      ],
      9: [
        {
          name: '2串1',
          Number: '36',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '84',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '126',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '126',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '6串1',
          Number: '84',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 6001
        },
        {
          name: '7串1',
          Number: '36',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 7001
        },
        {
          name: '8串1',
          Number: '9',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 8001
        },
        {
          name: '9串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 9001
        },
        {
          name: '9串502',
          Number: '502',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 900502
        }
      ],
      10: [
        {
          name: '2串1',
          Number: '45',
          mon: 0,
          winMon: 0,
          maxMon: 0,
          allMon: 0,
          id: 2001
        },
        {
          name: '3串1',
          Number: '120',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 3001
        },
        {
          name: '4串1',
          Number: '210',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 4001
        },
        {
          name: '5串1',
          Number: '252',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 5001
        },
        {
          name: '6串1',
          Number: '210',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 6001
        },
        {
          name: '7串1',
          Number: '120',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 7001
        },
        {
          name: '8串1',
          Number: '45',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 8001
        },
        {
          name: '9串1',
          Number: '10',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 9001
        },
        {
          name: '10串1',
          Number: '1',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 10001
        },
        {
          name: '10串1013',
          Number: '1013',
          mon: 0,
          maxMon: 0,
          allMon: 0,
          winMon: 0,
          id: 10001013
        }
      ]
    },
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
    setBetInfo(list: any[]) {
      this.$patch(state => state.oldOdd = '')
      list.forEach(item => {
        this.activeBetData.some(betData => {
          const flag = betData.match.mid === item.mid
          if (flag) {
            const hpid = betData.play.topKey || betData.play.hpid
            const hp = item.hpsData[0].hps.find((hp: any) => hp.hpid === hpid)
            if (hp && hp.hl && hp.hl.hid) {
              betData.market.hid = hp.hl.hid
              betData.market.hn = hp.hl.hn
              let hasOts = false
              if (hp.hl.ol && hp.hl.ol.map((item: any) => item.ots).join('') !== '') {
                hasOts = true
              }
              const odd = hp.hl.ol && hp.hl.ol.filter((ol: any) => ((hasOts && ol.ots === betData.playOpts.ots) || Number(ol.oid) === Number(betData.playOpts.oid)))[0]
              if (odd) {
                if (!this.isGetMax && Number(odd.ov) !== Number(betData.playOpts.ov)) this.oldOdd = betData.playOpts.ov
                betData.playOpts = odd
              }
            }
          }
          return flag
        })
      })
      this.$patch(state => state.isGetMax = false)
    },
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
    getMatchDetail(mids: string) {
      if (!mids) return Promise.reject()
      return axios
      .post(`${PREFIX}/getMatchesByMids`, {
          cuid: this.userId,
          ...getCommonParams(),
          mids,
          fg: 1,
        })
        .then(({ data }) => data.data)
    },
    // 查询最新盘口数据
    queryLatestMarketInfo(isMult?: boolean) {
      const idList = this.activeBetData.map(item => {
        const {playOpts, market, match, play} = item
        return {
          marketId: market.hid,
          matchInfoId: match.mid,
          oddsId: playOpts.oid,
          playId: play.hpid,
        }
      })
      return axios
        .post(`${PREFIX}/queryLatestMarketInfo`, {
          ...getCommonParams(),
          idList: JSON.stringify(idList)
        })
        .then(({data}) => {
          const result = this.activeBetData.map((item, index) => {
            const temp = data.data[index]
            const market = temp.marketOddsList[0]
            const { oddsStatus, oddsValue } = market
            return {
              ...item,
              ...{ playOpts: {...item.playOpts, os: oddsStatus, vo: oddsValue} }
            }
          })
          this.$patch(state => state.activeBetData = result)
          this.queryMarketMaxMinBetMoney(!!isMult)
        })
    },
    // 查询投注限额
    queryMarketMaxMinBetMoney(isMultip: boolean) {
      let sNo: number | string = 1
      if (isMultip) {
        const aNo = this.activeBetData.length
        sNo = this.sericeList[aNo - 2]
      } else {
        sNo = 1
      }
      const orderMaxBetMoney = this.activeBetData.map((item) => {
        const { playOpts, market, play, match } = item
        let matchType = ''
        market.hmt === 0 && (matchType = '2') // 早盘
        market.hmt === 1 && (matchType = '1') // 滚球
        return {
          deviceType: '1',
          marketId: market.hid,
          matchType,
          oddsFinally: playOpts.ov / 100000,
          playId: play.hpid,
          playOptionId: playOpts.oid,
          seriesType: sNo,
          matchId: match.mid
        }
      })
      if (!orderMaxBetMoney.length) return Promise.reject()
      if (getcateCancel) {
        getcateCancel()
      }
      return axios
        .post(`${PREFIX}/queryMarketMaxMinBetMoney`, {
          ...getCommonParams(),
          orderMaxBetMoney: JSON.stringify(orderMaxBetMoney)
        }, {
          cancelToken: new CancelToken((c) => {
            getcateCancel = c
          })
        })
        .then(({ data }) => {
          if (data.code === 500 || data.code === 2000) {
            return Notify.create(lang('所选投注项的赔率，盘口及有效性发生变化'))
          }
          try {
            if (isMultip) {
              const aNo = this.activeBetData.length
              const btl = JSON.parse(JSON.stringify(this.betTypeList))
              btl[aNo].map((item: IXmBetType, index1: number) => {
                item.maxMon = Math.floor(data.data[index1].orderMaxPay / item.Number)
                item.minMon = Math.ceil(Number(data.data[index1].minBet))
              })
              this.$patch(state => state.betTypeList = btl)
            } else {
              const result = this.activeBetData.map((item, index) => {
                const temp = data.data[0]
                const quota = {
                  min: +temp.minBet || 0,
                  max: +temp.orderMaxPay || 0
                }
                return {
                  ...item, quota
                }
              })
              this.$patch(state => state.activeBetData = result)
            }
          } catch (e) { }
        })
    },
    handleBet(params: {data: IXmBetData[], isMultiple?: boolean}) {
      this.$patch(state => state.activeBetData = params.data)
      if (params.isMultiple) {
        this.$patch(state => {
          state.betCountShowActive = true
          if (!params.data.length) state.changeBetToMultiple = false
        })
      } else {
        this.$patch(state => state.betPanelShowActive = true)
        this.getMatchDetail(this.activeBetData.map(item => item.match.mid).join(','))
          .then(res => {
            const arr: XMMatch[] = res.data
            this.$patch(state => state.isGetMax = true)
            this.setBetInfo(arr)
          })
          .finally(() => {
            this.queryLatestMarketInfo(false)
          })
      }
    },
  }
})
