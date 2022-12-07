interface IFormModel {
  loginName: string;
  password: string;
  captchaVerification: string;
  smsCaptcha?: string;
}

interface IUserInfo {
  username: string;
  freeWalletSwitch: number;
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
