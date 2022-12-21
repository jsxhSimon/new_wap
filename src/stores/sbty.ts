import { defineStore } from 'pinia'
import { SessionStorage, LocalStorage } from 'quasar'
import { SbMenu, SbSubMenu, ISbBetData, ISbYsgjBetData, ISbBetType, ISbTeamInfo, SbMatch } from 'src/types/sports'
import { axios, CancelToken } from 'boot/axios'
import { Canceler } from 'axios'
import { useUserStore, useEnvStore } from './index'
import dayjs from 'dayjs'

const sMap: Record<string, string | undefined> = {
  running: '投注成功',
  reject: '投注失败',
  waiting: '注单确认中',
}

const getCommonParams = () => {
  const userStore = useUserStore()
  const envStore = useEnvStore()
  return {
    siteCode: envStore.appEnv,
    userName: userStore.userInfo.loginName,
  }
}

let matchCancel: Canceler | null = null
interface ISbtyStore {
  betData: ISbBetData[];
  matchType: number;
  activeSubMenu: Partial<SbSubMenu>;
  showBetPanel: boolean;
  oldOdd: string | number;
  ysgjBetData: ISbYsgjBetData | null;
  changeBetToMultiple: boolean;
  activeMenu: Partial<SbMenu>;
  betCountShowActive: boolean;
  betTypeList: Record<number, ISbBetType[]>;
  betTypes: ISbBetType[];
  teamInfo: Partial<ISbTeamInfo>;
  token: string;
  shabMenuCache: SbMenu[];
  shabMatchCache: Record<string, Record<number, SbMatch[]>>;
  esportMenuCache: any,
  esportMatchCache: any;
  gameType: number;
}

export const useSbStore = defineStore('sbty', {
  state: (): ISbtyStore => ({
    betData: [],
    showBetPanel: false,
    matchType: 0,
    activeSubMenu: {},
    oldOdd: '',
    ysgjBetData: null,
    changeBetToMultiple: false,
    activeMenu: {},
    betCountShowActive: false,
    betTypes: [],
    teamInfo: {},
    token: '',
    shabMenuCache: SessionStorage.getItem('shabMenuCache') || [],
    shabMatchCache: SessionStorage.getItem('shabMatchCache') || {},
    esportMenuCache: SessionStorage.getItem('esportMenuCache') || [],
    esportMatchCache: SessionStorage.getItem('esportMatchCache') || {},
    betTypeList: {
      2: [
        {
          name: '2串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
      ],
      3: [
        {
          name: '2串1',
          betCount: 3,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '3串4',
          betCount: 4,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trixie',
          isSys: true,
        },
      ],
      4: [
        {
          name: '2串1',
          betCount: 6,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 4,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '4串11',
          betCount: 11,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Yankee',
          isSys: true,
        },
        // {
        //   name: '幸运 15',
        //   betCount: 15,
        //   mon: 0,
        //   maxBet: 0,
        //   allMon: 0,
        //   winMon: 0,
        //   id: 'Lucky15',
        // },
      ],
      5: [
        {
          name: '2串1',
          betCount: 10,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 10,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 5,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '5串26',
          betCount: 26,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Canadian',
          isSys: true,
        },
        // {
        //   name: '幸运 31',
        //   betCount: 31,
        //   mon: 0,
        //   maxBet: 0,
        //   allMon: 0,
        //   winMon: 0,
        //   id: 'Lucky31',
        // },
      ],
      6: [
        {
          name: '2串1',
          betCount: 15,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 20,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 15,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 6,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '6串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold6',
        },
        {
          name: '6串57',
          betCount: 57,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Heinz',
        },
        // {
        //   name: '幸运 63',
        //   betCount: 63,
        //   mon: 0,
        //   maxBet: 0,
        //   allMon: 0,
        //   winMon: 0,
        //   id: 'Lucky63',
        // },
      ],
      7: [
        {
          name: '2串1',
          betCount: 21,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 35,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 35,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 21,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '6串1',
          betCount: 7,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold6',
        },
        {
          name: '7串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold7',
        },
        {
          name: '7串120',
          betCount: 120,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'SuperHeinz',
        },
        // {
        //   name: '幸运 127',
        //   betCount: 127,
        //   mon: 0,
        //   maxBet: 0,
        //   allMon: 0,
        //   winMon: 0,
        //   id: 'Lucky127',
        // },
      ],
      8: [
        {
          name: '2串1',
          betCount: 28,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 56,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 70,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 56,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '6串1',
          betCount: 28,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold6',
        },
        {
          name: '7串1',
          betCount: 8,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold7',
        },
        {
          name: '8串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold8',
        },
        {
          name: '8串247',
          betCount: 247,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Goliath',
        },
        // {
        //   name: '幸运 255',
        //   betCount: 255,
        //   mon: 0,
        //   maxBet: 0,
        //   allMon: 0,
        //   winMon: 0,
        //   id: 'Lucky255',
        // },
      ],
      9: [
        {
          name: '2串1',
          betCount: 36,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 84,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 126,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 126,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '6串1',
          betCount: 84,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold6',
        },
        {
          name: '7串1',
          betCount: 36,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold7',
        },
        {
          name: '8串1',
          betCount: 9,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold8',
        },
        {
          name: '9串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold9',
        },
      ],
      10: [
        {
          name: '2串1',
          betCount: 45,
          mon: 0,
          winMon: 0,
          maxBet: 0,
          allMon: 0,
          id: 'Doubles',
        },
        {
          name: '3串1',
          betCount: 120,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Trebles',
        },
        {
          name: '4串1',
          betCount: 210,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold4',
        },
        {
          name: '5串1',
          betCount: 252,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold5',
        },
        {
          name: '6串1',
          betCount: 210,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold6',
        },
        {
          name: '7串1',
          betCount: 120,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold7',
        },
        {
          name: '8串1',
          betCount: 45,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold8',
        },
        {
          name: '9串1',
          betCount: 10,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold9',
        },
        {
          name: '10串1',
          betCount: 1,
          mon: 0,
          maxBet: 0,
          allMon: 0,
          winMon: 0,
          id: 'Fold10',
        },
      ],
    },
    gameType: 1,
  }),
  getters: {
    isZaoPan(state) {
      return state.activeMenu.name === '早盘'
    },
    isYsgj(state) {
      return state.activeSubMenu.sportName === '优胜冠军'
    },
    isMultiple(state) {
      return state.activeMenu.name === '串关' || state.changeBetToMultiple
    },
    liNo(state) {
      return state.betData.length
    },
  },
  actions: {
    setMenuCache(payload: any) {
      if (payload) {
        this.$patch(state => {
          if (state.gameType === 2) state.esportMenuCache = payload
          else state.shabMenuCache = payload
        })
        const attr = this.gameType === 2 ? 'esportMenuCache' : 'shabMenuCache'
        SessionStorage.set(attr, payload)
      }
    },
    setMatchCache(payload: any) {
      if (payload.length) {
        const arr = payload.concat([]).splice(0, 10)
        const attr = this.gameType === 2 ? 'esportMatchCache' : 'shabMatchCache'
        const idx = this.gameType === 2 ? this.activeSubMenu.gameId : arr[0].sportType
        if (!this[attr][this.activeMenu.name as string]) {
          this[attr][this.activeMenu.name as string] = {
            [idx]: arr,
          }
        } else {
          this[attr][this.activeMenu.name as string][idx] = arr
        }
        SessionStorage.set(attr, JSON.stringify(this[attr]))
      }
    },
    saveBetLog(params: any) {
      return axios
        .post('splive/app/saveBetLog', params)
        .then(res => res)
    },
    saveMatchInfoOfBetLog(params: any) {
      return axios
        .post('splive/app/saveMatchInfoOfBetLog', params)
    },
    transfer() {
      const userStore = useUserStore()
      const isLogin = userStore.isLogin
      if (!isLogin) {
        return new Promise((resolve, reject) => reject())
      }
      const userName = userStore.userInfo.loginName as string
      const list: string[] = LocalStorage.getItem('sbTransitList') ?? []
      if (list.includes(userName)) {
        return new Promise((resolve, reject) => resolve(true))
      }
      return axios
        .get('sys/transit', {
          params: {
            gameId: getCommonParams().siteCode === 'dcs' ? 25009 : 23782,
          },
        })
        .then(({ data }) => {
          list.push(userName)
          LocalStorage.set('sbTransitList', list)
          Promise.resolve(data.msg)
        })
    },
    getSbMenus() {
      return axios
        .post(`splive/sbod/sbod/${this.gameType === 2 ? 'queryESportMenu' : 'queryMenu'}`, {
          ...getCommonParams()
        })
        .then(({ data }) => {
          if (data.status) {
            this.setMenuCache(data.message.menuL1s)
            return data.message.menuL1s
          }
          return Promise.reject()
        })
    },
    getYsgjList(params: ISbMatchListParams) {
      if (matchCancel) {
        matchCancel()
        matchCancel = null
      }

      return axios
        .post('splive/sbod/sbod/queryOutrightEvents', {
          ...getCommonParams(),
          ...params,
        })
        .then(({ data }) => data.message)
    },
    getMatchList(params: ISbMatchListParams) {
      if (matchCancel) {
        matchCancel()
        matchCancel = null
      }
      return axios
        .post(`splive/sbod/sbod/${this.gameType === 2 ? 'queryESportEvents' : 'queryEvents'}`, {
          ...getCommonParams(),
          ...params,
        }, {
          cancelToken: new CancelToken((c) => {
            matchCancel = c
          }),
        })
        .then(({ data }) => {
          if (data.status) {
            this.setMatchCache(data.message.events || data.message.data)
            return data.message.events || data.message.data
          }
          return Promise.reject()
        })
    },
    getMatchDetail(params: ISbMatchDetailParams) {
      return axios
        .post(`splive/sbod/sbod/${this.gameType === 2 ? 'queryESportEvent' : 'queryEvent'}`, {
          ...getCommonParams(),
          ...params,
        })
        .then(({ data }) => {
          if (data.status) {
            return data.message
          }
          return Promise.reject()
        })
    },
    // 同步赔率信息
    getSingleTicket(params: ISbSingleTicketParams) {
      return axios
        .post('splive/sbod/sbod/getSingleTicket', {
          ...getCommonParams(),
          ...params,
        })
        .then(({ data }) => {
          if (data.status) {
            return data.message
          }
          return Promise.reject()
        })
    },
    // 同步优胜冠军赔率信息
    getYsgjTicket(params: ISbYsgjTicketParams) {
      return axios
        .post('splive/sbod/sbod/getOutrightTicket', {
          ...getCommonParams(),
          ...params,
        })
        .then(({ data }) => data.message)
    },
    getParlayTickets(params: IParlayTicketsParams) {
      return axios
        .post('splive/sbod/sbod/getParlayTickets', {
          ...getCommonParams(),
          ...params,
        }).then(({ data }) => data.message)
    },
    singleBet(params: any) {
      const {
        match,
        market,
        odd,
      } = this.betData[0]
      const { keyName } = odd
      const time = dayjs(match.globalShowTime2).format('YYYY-MM-DD HH:mm:ss')
      const matchType = dayjs(match.globalShowTime2).valueOf() <= dayjs().valueOf() && match.eventStatus === 'running' ? 0 : 1
      //   console.log(match)
      const saveParams: any = {
        matchId: match.eventId,
        platform: 'SBOD',
        oddsType: '欧洲盘',
        gameName: match.sportName,
        matchType,
        matchTime: time,
        gameType: match.sportType.toString(),
        gameCategory: 'Sport',
        betType: market.betType,
        leagueName: match.leagueName,
        odds: odd.oddsPrice.decimalPrice.toString(),
        playType: market.betTypeName,
        team: `${match.teamInfo.homeName} VS ${match.teamInfo.awayName}`,
        bet: params.stake.toString(),
        openResultDetail: JSON.stringify({
          resultMap: [{
            playType: market.betTypeName,
            betText: keyName + (odd.new_point || ([null, undefined].includes(odd.point as any) ? '' : ` ${odd.point}`)),
          }],
          type: 'sba_sport_detail',
          seriesValue: '单关',
        }),
        estimatedPayout: (params.stake * (odd.oddsPrice.decimalPrice - 1)).toFixed(2),
      }
      if (match.eventStatus === 'running' && dayjs(match.globalShowTime2 || match.globalShowTime).valueOf() <= dayjs().valueOf()) {
        saveParams.betScore = `${match.gameInfo.liveHomeScore}-${match.gameInfo.liveAwayScore}`
      }
      return axios
        .post('splive/sbod/sbod/newPlaceBet', {
          ...getCommonParams(),
          ...params,
          saveBetLogData: [saveParams],
        })
        .then(({ data }) => data.message)
    },
    ysgjBet(params: any) {
      return axios
        .post('splive/sbod/sbod/placeOutrightBet', {
          ...getCommonParams(),
          ...params,
        })
        .then(({ data }) => {
          const { match, team } = this.ysgjBetData!
          const saveParams = {
            bet: params.stake,
            betType: team.teamId,
            gameCategory: 'Sport',
            oddsType: '欧洲盘',
            matchType: 1,
            gameType: match.sportType.toString(),
            gameName: match.sportName,
            id: data.message.transId,
            leagueName: match.leagueName,
            odds: team.price,
            openResultDetail: JSON.stringify({
              resultMap: [{
                playType: '优胜冠军',
                betText: team.teamName,
              }],
              type: 'sba_sport_detail',
              seriesValue: '优胜冠军',
            }),
            platform: 'SBOD',
            playType: '优胜冠军',
            status: sMap[data.message.ticketStatus],
            estimatedPayout: Number(((data.message.currentPrice - 1) * params.stake).toFixed(2)),
          }
          this.saveBetLog([saveParams])
          return data.message
        })
    },
    parlayBet(params: any) {
      const btl = this.betTypes
      const endBetType = btl[btl.length - 1]
      const resultMap = [{
        playType: this.betData.map(item => item.market.betTypeName).join(','),
        betText: this.betData.map((item) => {
          const { keyName } = item.odd
          // if (keyName === '主胜') keyName = item.match.teamInfo.homeName
          // else if (keyName === '客胜') keyName = item.match.teamInfo.awayName
          return keyName + ([null, undefined].includes(item.odd.point as any) ? '' : ` ${item.odd.point}`)
        }).join(','),
      }]
      const saveParams = []
      const gameName = this.betData.map(item => item.match.sportName).join(',')
      const betType = this.betData.map(item => item.market.betType).join(',')
      const betScore = this.betData.map(item => `${item.match.gameInfo.liveHomeScore}-${item.match.gameInfo.liveAwayScore}`).join(',')
      const leagueName = this.betData.map(item => item.match.leagueName).join(',')
      const odds = this.betData.map(t => t.odd.oddsPrice.decimalPrice).join(',')
      // console.log(state.betData.map(t => t.match.bt))
      const time = this.betData.map(item => dayjs(item.match.globalShowTime2).format('YYYY-MM-DD HH:mm:ss')).join(',')
      // console.log()
      const team = this.betData.map(item => `${item.match.teamInfo.homeName} VS ${item.match.teamInfo.awayName}`).join(',')
      const matchType = this.betData.map(item => (dayjs(item.match.globalShowTime2).valueOf() <= dayjs().valueOf() && item.match.eventStatus === 'running' ? 0 : 1)).join(',')
      const matchId = this.betData.map(item => item.match.eventId).join(',')
      const platform = 'SBOD'
      const transArr = btl.slice(0, btl.length - 1).filter(item => item.mon > 0)
      if (transArr.length) {
        const tArr = this.betTypes.filter((item, index) => item.mon > 0 && (item.name !== endBetType.name || endBetType.name === '2串1'))
        const ids = tArr.map(item => item.id)
        saveParams.push({
          matchId,
          betScore,
          bet: transArr.reduce((pre, cur) => pre + Number((cur.mon * cur.betCount)), 0),
          betType,
          gameCategory: 'Sport',
          gameType: 'Combination',
          matchType,
          matchTime: time,
          leagueName,
          gameName,
          openResultDetail: JSON.stringify({
            resultMap,
            type: 'obsp_sports_detail',
            seriesValue: transArr.map(item => item.name).join(','),
          }),
          odds,
          oddsType: '欧洲盘',
          team,
          platform,
          estimatedPayout: Number(transArr.reduce((pre, cur) => pre + (cur.price! - cur.betCount) * cur.mon, 0).toFixed(2)),
          isSys: 0,
        })
      }
      if (endBetType && endBetType.mon > 0) {
        const endIdx = this.betTypes.length - 1
        saveParams.push({
          matchId,
          bet: Number((endBetType.mon * endBetType.betCount).toFixed(2)),
          betType,
          gameCategory: 'Sport',
          gameType: 'Combination',
          matchType,
          matchTime: time,
          leagueName,
          gameName,
          oddsType: '欧洲盘',
          openResultDetail: JSON.stringify({
            resultMap,
            type: 'obsp_sports_detail',
            seriesValue: this.betTypes[endIdx].name,
          }),
          odds,
          team,
          platform,
          estimatedPayout: Number(((endBetType.price! - endBetType.betCount) * endBetType.mon).toFixed(2)),
          isSys: endBetType.name.indexOf('串1') !== -1 ? 0 : 1,
        })
      }
      return axios
        .post('splive/sbod/sbod/newPlaceParlayBet', {
          ...getCommonParams(),
          ...params,
          saveBetLogData: saveParams,
        })
        .then(({ data }) => data.message)
    },
    checkOrderStatus(params: any) {
      return axios
        .post('splive/sbod/sbod/checkWaitingTicketStatus', {
          ...getCommonParams(),
          ...params,
        }).then(({ data }) => data.message)
    },
    getToken() {
      axios.post('splive/sbod/sbod/getToken', {
        ...getCommonParams(),
      }).then(({ data }) => {
        this.$patch(state => state.token = data.message.access_token)
      })
    },
    // 获取沙巴提前结算相关信息
    // https://github.com/Saba-sports/OddsDirectAPI_CN/wiki/GetCashoutPrice
    getSbSportPreSettleInfo(transIds: string) {
      return axios.post('splive/sbod/sbod/getCashoutPrice', {
        ...getCommonParams(),
        transIds,
      }).then(({ data }) => {
        const { status, message: { priceInfo } } = data
        if (status && Array.isArray(priceInfo) && priceInfo.length) {
          return priceInfo
        }
        return Promise.reject()
      })
    },
    sellBack(params: any) {
      return axios.post('splive/sbod/sbod/sellBack', {
        ...getCommonParams(),
        ...params,
      }).then(({ data }) => {
        const { status, message } = data
        if (status) {
          return message
        }
        return Promise.reject()
      })
    },
    async sellBackNewOffer(priceInfo: any) {
      try {
        if (priceInfo && priceInfo.cashoutStatus === 1) {
          const { transId, cashoutPrice } = priceInfo
          const res = await this.sellBack({ transId, cashoutPrice })
          if (res.sellingStatus === 1) {
            return Promise.resolve()
          }
          return Promise.reject()
        }
        return Promise.reject()
        // eslint-disable-next-line no-empty
      } catch (e) {
        return Promise.reject()
      }
    },
    // 沙巴提前结算
    async orderPreSettleForSbSport(id: string) {
      try {

        const res = await this.getSbSportPreSettleInfo(id)
        const { cashoutStatus, cashoutPrice, transId } = res[0]
        if (cashoutStatus === 1) {
          const { sellingStatus, newCashoutPriceInfo } = await this.sellBack({ transId, cashoutPrice })
          // sellingStatus 兑现票据的状态
          // 1：Waiting 2：Accept 3：Reject 5：New Offer
          if (sellingStatus === 1 || sellingStatus === 2) {
            return Promise.resolve(sellingStatus)
          }
          // newCashoutPriceInfo 当 sellingStatus 为 5 (NewOffer) 时,提供新的兑现资讯
          if (sellingStatus === 5) {
            return await this.sellBackNewOffer(newCashoutPriceInfo)
          }
          return Promise.reject()
        }
        return Promise.reject()
        // eslint-disable-next-line no-empty
      } catch (e) {
        return Promise.reject()
      }
    },
    queryMenuByLeague(params: any) {
      return axios.post(`splive/sbod/sbod/${this.gameType === 2 ? 'queryESportMenuByLeague' : 'queryMenuByLeague'}`, {
        ...getCommonParams(),
        ...params,
      }).then(({ data }) => data.data)
    },
    // 根据赛事ID获取比赛赛程
    getScheduleByMatchId(params: {matchId: number}) {
      return axios.get(`splive/feijing/getScheduleByMatchId?matchId=${params.matchId}`)
        .then(({ data }) => data.data)
    },
  }
})
