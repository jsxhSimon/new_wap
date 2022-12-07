export const SPORT_GAMES_CATID = 1; // 体育游戏分类id
export const REALITY_GAMES_CATID = 3; // 真人游戏分类id
export const VIDEO_GAMES_CATID = 5; // 电子游戏分类id
export const CARD_GAMES_CATID = 6; // 棋牌游戏分类id
export const FISH_GAMES_CATID = 8; // 捕鱼游戏分类id
export const LOTTERY_GAMES_CATID = 12; // 彩票游戏分类id
export const COCKFIGHT_GAMES_CATID = 49; // 斗鸡游戏分类id
export const E_SPORTS_GAMES_CATID = 9; // 电竞游戏分类id

export const SUB_LEVEL_GAMES = [
  // 有二级分类的游戏
  { label: '开元棋牌', code: 'KY', id: 6 },
  { label: '凯旋棋牌', code: 'LC', id: 6 },
  { label: 'OB棋牌', code: 'OBQP', id: 6 },
  { label: '天成彩票', code: 'TC', id: 12 },
  { label: 'IG官方彩', code: 'IGGF', id: 12 },
  { label: 'IG传统彩', code: 'IGSS', id: 12 },
  { label: 'IG香港彩', code: 'IGHK', id: 12 },
  { label: 'OB彩票', code: 'OBCP', id: 12 },
  { label: '双赢彩票', code: 'SY', id: 12 },
  { label: 'CQ9', code: 'CQ9', id: 5 },
]; // 有二级分类的游戏
export const SUB_LEVEL_ID = [
  VIDEO_GAMES_CATID,
  CARD_GAMES_CATID,
  LOTTERY_GAMES_CATID,
];
