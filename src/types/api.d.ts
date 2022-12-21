interface IMessageInfoParams {
  msgType: number;
  pageNo: number;
  pageSize: number;
  isRead: number;
  mbrIsRead: number;
}
interface IIndexNoticeAndAdvParams {
  pageNo: number;
  pageSize: number;
  advType: number;
  evebNum: number;
}

interface ISbMatchListParams {
  menuLevel: number;
  parentId: number;
  gameId?: number;
  sportType?: number;
}

interface ISbMatchDetailParams {
  sportType: number;
  eventId: number;
}

interface ISbSingleTicketParams {
  sportType: number;
  marketId: number;
  key: string;
  oddsType: number;
}

interface ISbYsgjTicketParams {
  sportType: number;
  orid: number;
}

interface IParlayTicketsParams {
  sportType: number;
  marketId: number;
  point: number;
  key: string;
}
