interface IFormModel {
  loginName: string;
  password: string;
  captchaVerification?: string;
  smsCaptcha?: string;
  mobile?: string;
  mobileCaptcha?: string;
  mobileAreaCode?: string;
  loginType?: number;
  loginPwd?: string;
  registerMethod?: number;
  reLoginPwd?: string;
  mobileCaptchareg?: string;
  registerDevice?: string;
  mainDomain?: string;
  code?: string;
  token?: string;
}

interface IUserInfo {
  gender: string;
  available: number;
  balance: number;
  birthday: string;
  email: string;
  loginName: string;
  levelName: string;
  mbrLevel: number;
  mobile: string;
  nickName: string;
  realName: string;
  registerTime: string;
  password: string;
  username: string;
  /** !=0 为自动转账 */
  freeWalletSwitch: number;
  userId: number;
}

interface IUserNicknameInfo {
  nickName: string;
}

interface IMainList {
  catCode: string;
  catHasTry?: boolean;
  catId: number;
  catName: string;
  depots?: IMainGame[];
  depotsCodes: string[];
}

interface IMainGame {
  id: number;
  availableWh: number;
  depotCode: string;
  catName: string;
  depotName: string;
  catId: number;
  depotId: number;
  gameTag: string;
  isHall: number;
  isTry: number;
  gameName: string;
  titleTag: string;
  orientation: number;
}

interface ICategory {
  id: number;
  catName: string;
}

interface INotice {
  id: number;
  createTime: string;
  noticeTitle: string;
  /** 公告管理的弹窗 */
  noticeContent: string;
  mbPath: string;
  showType: string;
  title: string;
}

interface IAreaCode {
  id: number;
    countryName: string;
    englishName: string;
    countryCode: string;
    mobileAreaCode: string;
}

interface IWin {
  gameName: string;
  username: string;
  betAmount: number;
  odds: number;
  time: string;
  winAmount: number;
}

interface IStation {
  configCodeMb: string;
  configSkype: string;
  configTelegram: string;
  titleSkype: string;
  titleTelegram: string;
  usdtBuyUrl: string;
}
