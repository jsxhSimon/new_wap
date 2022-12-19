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


interface FBMatch {
  groupKey?: string;
  id: number;
  bt: number;
  fid: number;
  fmt: number;
  leagueSort: number;
  lg: {
    id: number;
    lurl: string;
    na: string;
    rnm: string;
  };
  mc: {
    pe: number;
    r: boolean;
    s: number;
    tp: number;
  };
  mg: {
    mty: number;
    nm: string;
    pe: number;
    mks: {
      au: number;
      id: number;
      li: string;
      ss: number;
      op: {
        li: string;
        na: string;
        nm: string;
        ty: number;
        od: number;
      }[];
    }[];
  }[];
  ms: number;
  ne: number;
  nm: string;
  nsg: {
    pe: number;
    tyg: number;
    sc: number[];
  }[];
  play: string;
  sid: number;
  tms: number;
  ts: {
    id: number;
    lurl: string;
    na: string;
  }[];
  ty: number;
}

interface XMPlay {
  hids: number;
  hnm: number;
  hpid: string;
  hpn: string;
  hpnb: string;
  hpon: number;
  hpt: number;
  hshow: string;
  hsw: string;
  mid: string;
  hl: XMMarket[];
}

interface XMPlayOpts {
  cds: string;
    oid: string;
    on: string;
    onb: string;
    os: number;
    ot: string;
    otd: number;
    ots: string;
    ov: number;
    prob: string;
}

interface XMMarket {
  hid: string;
  hmta: number;
  hn: number;
  hs: number;
  hv: string;
  ol: XMPlayOpts[];
}

interface XMMatch {
  csid: string;
  csna: string;
  hps: XMPlay[];
  leagueInitials: string;
  leagueSort: number;
  lurl: string;
  lvs: number;
  maid: string;
  malu: string[];
  man: string;
  mat: string;
  mbmty: number;
  mc: number;
  mcg: number;
  mcid: string;
  mct: number;
  mess: number;
  mf: boolean;
  mft: number;
  mgt: string;
  mhid: string;
  mhlu: string[];
  mhn: string;
  mhs: number;
  mid: string;
  mmp: string;
  mms: number;
  mng: number;
  mo: number;
  mp: number;
  mprmc: string;
  ms: number;
  msc: string[];
  mst: string;
  mvs: number;
  play: string;
  prob: number;
  regionIdSort: number;
  seid: string;
  srid: string;
  tf: boolean;
  th: number;
  tid: string;
  tn: string;
  tnjc: string;
  groupKey?: string;
  scopes: Record<string, {awayScore: string; homeScore: string;}>;
}

interface IFBMenu1 {
  count: number;
  menuLevel: number;
  name: string;
  menu2: IFBMenu2[];
}

interface IFBMenu2 {
  count: number;
  menuLevel: number;
  parentId: number;
  sportId: number;
  sportName: string;
}

interface XmMenu {
  count: number;
  menuId: number;
  menuType: number;
  menuName: string;
  grade: number;
  field1: string;
  field2?: string;
  subList: XmSubMenu[];
}

interface XmSubMenu {
  count: number;
  field1: string;
  grade: number;
  menuId: number;
  menuName: string;
  menuType: number;
  parentId: number;
}

interface ILeagueFollow {
  createTime: string;
  id: number;
  leagueId: number;
  leagueName: string;
  /** matchType: 10 xm 11 sb 12 fb */
  matchType: number;
}

interface IXmResultData {
  csna: string;
  idList: string[];
  list: {
    collect: boolean;
    groupKey: string;
    leagueId: number;
    name: string;
    tid: string;
    list: XMMatch[];
  }[],
  number?: number;
}
