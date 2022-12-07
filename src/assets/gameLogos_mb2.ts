import {
  SPORT_GAMES_CATID,
  REALITY_GAMES_CATID,
  VIDEO_GAMES_CATID,
  CARD_GAMES_CATID,
  LOTTERY_GAMES_CATID,
  E_SPORTS_GAMES_CATID,
  FISH_GAMES_CATID,
} from './gameCategories';

export class deportLocalDataFactory {
  static deortData = [
    {
      catName: '体育',
      catCode: 'sport',
      catId: SPORT_GAMES_CATID,
      depotsCodes: ['M8', 'PLSP', 'FBOB'],
    },
    {
      catName: '电竞',
      catCode: 'eSport',
      catId: E_SPORTS_GAMES_CATID,
      depotsCodes: ['TF'],
    },
    {
      catName: '真人',
      catCode: 'reality',
      catId: REALITY_GAMES_CATID,
      depotsCodes: ['WM', 'DG'],
    },
    {
      catName: '彩票',
      catCode: 'lottery',
      catId: LOTTERY_GAMES_CATID,
      depotsCodes: [],
    },
    {
      catName: '棋牌',
      catCode: 'card',
      catId: CARD_GAMES_CATID,
      depotsCodes: [],
    },
    {
      catName: '电子',
      catCode: 'electron',
      catId: VIDEO_GAMES_CATID,
      depotsCodes: ['JDB', 'GR'],
    },
    {
      catName: '捕鱼',
      catCode: 'fish',
      catId: FISH_GAMES_CATID,
      depotsCodes: [],
    },
  ];
  static deportData1 = [
    {
      catName: '体育',
      catCode: 'sport',
      catId: SPORT_GAMES_CATID,
      depotsCodes: ['M8', 'PLSP', 'FBOB'],
    },
    {
      catName: '电竞',
      catCode: 'eSport',
      catId: E_SPORTS_GAMES_CATID,
      depotsCodes: ['TF'],
    },
    {
      catName: '真人',
      catCode: 'reality',
      catId: REALITY_GAMES_CATID,
      depotsCodes: ['WM', 'DG'],
    },
    {
      catName: '彩票',
      catCode: 'lottery',
      catId: LOTTERY_GAMES_CATID,
      depotsCodes: [],
    },
    {
      catName: '棋牌',
      catCode: 'card',
      catId: CARD_GAMES_CATID,
      depotsCodes: [],
    },
    {
      catName: '电子',
      catCode: 'electron',
      catId: VIDEO_GAMES_CATID,
      depotsCodes: ['JDB', 'GR'],
    },
    {
      catName: '捕鱼',
      catCode: 'fish',
      catId: FISH_GAMES_CATID,
      depotsCodes: [],
    },
  ];

  static create() {
    return this.deportData1.map((item) => ({
      ...item,
      depots: item.depotsCodes.map((dt) => ({
        depotCode: dt,
      })),
    }));
  }

  static create1() {
    return this.deortData.map((item) => ({
      ...item,
      depots: item.depotsCodes.map((dt) => ({
        depotCode: dt,
      })),
    }));
  }
}
