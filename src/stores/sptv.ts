import { defineStore } from 'pinia'
import { axios } from 'boot/axios'

export const useSptvStore = defineStore('sptv', {
  state: () => ({
    outsideLink: 0,
    sensitiveWords: []
  }),
  actions: {
    getOutsideLinkAllowReq() {
      return axios
        .post('splive/app/getOutsideLinkAllow')
        .then(({ data }) => {
          this.$patch(state => state.outsideLink = data && data.data || 0)
          return data
        })
    },
    getSensitiveWordsReq() {
      return axios
        .post('splive/app/getSensitiveWords')
        .then(({ data }) => {
          // eslint-disable-next-line no-mixed-operators
          this.$patch(state => state.sensitiveWords = data && data.data || 0)
          return data
        })
    },
    getAnimationByBetMatchId(mid: string, csid: string) {
      return axios
        .post(`splive/app/getAnimationByBetMatchId?betMatchId=${mid}${Number(csid) < 3 ? `&type=${Number(csid) - 1}` : ''}`)
    },
    newGetLiveUrl(params: {id: string; matchType?: number}) {
      const isSb = typeof params === 'object'
      const id = isSb ? params.id : params
      return axios.get(`splive/app/getMatchScheduleByMatchId?matchId=${id}&type=2&matchType=${isSb ? params.matchType || 11 : 10}`)
    },
    listMiqAnchorEventByAnchorId(id: number | string) {
      return axios.get(`splive/app/listMiqAnchorEventByAnchorId?anchorId=${id}`)
    },
    getMatchScheduleByUserId(id: string | number) {
      return axios.get(`splive/app/getMatchScheduleByUserId?userId=${id}`)
    },
    listMoreAnchors(data: {pageNo: number; pageSize: number; catId?: number | string}) {
      return axios.post('splive/app/listMoreAnchors', data)
    },
    // 更新直播间人数
    updateAnchorTotal(params: {userId: number; matchScheduleId: number;}) {
      return axios.post('splive/app/updateAnchorTotal', null, { params })
    },
    getScheduleBas(params: any) {
      return axios
        .get('splive/feijing/getSchedule', {
          params: {
            ...params,
          },
        })
        .then(res => res.data.data || [])
    },
    getScheduleFoot(params: any) {
      return axios
        .get('splive/feijing/getSchedule', {
          params: {
            ...params,
          },
        })
        .then(res => res.data.data || [])
    },
    getTime() {
      return axios.get('splive/feijing/getTime').then(res => res.data.date || [])
    },
    /**
     *  获取关注联赛列表
     *  matchType 10 XM  11 SBOD  12 FBOD
     * */
    getListBetLeagueCollect(params: {matchType: number;}) {
      return axios.get('splive/app/listBetLeagueCollect', { params })
        .then(res => res.data.data)
    },
    FollowBetLeague(params: {matchType: number; leagueName?: string; leagueId?: number;}) {
      return axios.post('splive/app/followBetLeague', params)
    },
    cancelFollowLeague(params: {matchType: number; leagueId: string | number;}) {
      return axios.post('splive/app/cancelFollowBetLeague', params)
    },
    // 推荐投注
    listRecommendBetMatches() {
      return axios.get('splive/app/recommendBet/listRecommendBetMatches')
        .then(res => res.data.data)
    },
  }
})
