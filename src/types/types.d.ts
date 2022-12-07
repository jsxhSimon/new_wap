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
}

interface ICategory {
  id: number;
  catName: string;
}
