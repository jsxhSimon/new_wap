import { axios } from 'boot/axios';

// 获取网站 stoken
export const apiStoken = (domain: string) => {
  return axios.get('sys/getSiteCode', { params: { url: domain } });
};

// 获取区号列表
export const apimobileAreaCodes = () => {
  return axios.get('sys/mobileAreaCodes');
};

// 获取用户余额
export const apiCheckBalance = () => {
  return axios.post('pay/checkBalance');
};

// 获取首页游戏分类
export const apiCatList = () => {
  return axios.get('sys/siteCatList').then(({ data }) => data.tGmCats);
};

// 获取主页电子游戏列表
export const apiElecDepotList = () => {
  return axios.get('sys/elecDepotList').then(({ data }) =>
    data.tGmDepots.map((item: any) => ({
      ...item,
      catId: 5,
      catName: '电子',
      logoMb: item.mbPicUrl,
    }))
  );
};

// 获取棋牌列表数据
export const apiChessDepotList = () => {
  return axios
    .get('sys/chessDepotList', { params: { catId: 6 } })
    .then(({ data }) =>
      data.tGmDepots.map((item: any) => ({
        ...item,
        catId: 6,
        catName: '棋牌',
        logoMb: item.mbPicUrl,
      }))
    );
};

// 获取彩票数据
export const apiLotteryDepotList = () => {
  return axios.get('sys/lotteryDepotList').then(({ data }) =>
    data.tGmDepots.map((item: any) => ({
      ...item,
      catId: 12,
      catName: '彩票',
      logoMb: item.mbPicUrl,
    }))
  );
};

// 获取捕鱼数据
export const apiFishDepotList = () => {
  return axios
    .get('sys/gameFishList', { params: { pageNo: 1, pageSize: 1000 } })
    .then(({ data }) =>
      data.page.list.map((item: any) => ({
        ...item,
        catId: 8,
        catName: '捕鱼',
        logoMb: item.logo,
      }))
    );
};

// 获取游戏数据
export const apiCatDepotList = (catId: number) => {
  return axios
    .get('sys/catDepotList', { params: { catId } })
    .then(({ data }) => data.catDepots);
};

// 游戏登陆
export const apiGameLogin = (gameId: number, isTry?: boolean) => {
  return axios.get(!isTry ? 'sys/transit' : 'sys/tryPlayGame', {
    params: { gameId },
  });
};

// 获取banner图 消息数据
export const apiIndexNoticeAndAdv = (params: IIndexNoticeAndAdvParams) => {
  return axios.get('sys/indexNoticeAndAdv', {params})
}
