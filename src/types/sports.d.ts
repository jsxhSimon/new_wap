// 沙巴体育
export enum EventStatus {
  running = 'running',
  closed = 'closed',
  postponed = 'postponed',
  deleted = 'deleted'
}

interface SbMatch {
  sportType: number;
  sportName: string;
  leagueId: number;
  /** 联赛首字母 */ 
  leagueInitials: string;
  leagueName: string;
  leagueSort: number;
  /** 赛事id */
  eventId: number;
  /** running/ closed/ postponed/ deleted */
  eventStatus: EventStatus;
  /** 开赛时间戳 */
  globalShowTime2: number;
  /** 是否是滚球赛事 */
  isLive: boolean;
  isParlay: boolean;
  marketCount: number;
  play: string;
  playFlag: boolean;
  /** 足球红黄牌数据 */
  soccerInfo: SoccerInfo;
  gameInfo: GameInfo;
  teamInfo: TeamInfo;
  markets: SbMarket[];
  tennisInfo: {
    homeGameScore: number[];
    awayGameScore: number[];
    homePointScore: string;
    awayPointScore: string;
    currentSet: number;
    currentServe: number;
  }
}

interface GameInfo {
  livePeriod: number;
  /** inc 从0开始计数 dec 倒记时 */
  clockDirection: string;
  seconds: number;
  /** 是否为中场休息 */
  ht: boolean;
  /** 是否中断（休息时间） */
  break: boolean;
  /** 赛事是否关闭 */
  closed: boolean;
  /** 赛事是否延迟 */
  delayLive: boolean;
  liveHomeScore: number;
  liveAwayScore: number;
}
interface SoccerInfo {
  homeRedCard: number;
  awayRedCard: number;
  homeYellowCard: number;
  awayYellowCard: number;
}
interface TeamInfo {
  awayIconUrl: string;
  awayId: number;
  awayName: string;
  homeIconUrl: string;
  homeId: number;
  homeName: string;
}
interface SbMarket {
  betType: number;
  betTypeName: string;
  category: number;
  combo: number;
  eventId: number;
  marketId: number;
  marketStatus: EventStatus;
  maxBet: number;
  selections: {
    key: string;
    keyName: string;
    oddsPrice: {
      decimalPrice: number;
    },
  }[]
}
// 原生体育 tab 对象
interface IGameType {
  label: string;
  depotCode: string;
  type: number;
}
