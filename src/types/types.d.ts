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
  codeSign?: string;
}

interface ISettingItemFormModel {
  captcha: string;
  lastPwd: string;
  pwd: string;
  mobile: string;
  realName: string;
  gender: string;
  email: string;
  birthday: string;
  confirmPwd: string;
  codeSign: string;
  code: string;
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

interface IAIData {
  depotId: number;
  gameType: number;
  totalBet: number;
}

interface IBirthdayBonus {
  accountLevel: number;
  actLevelId: number;
  depositAmount: number;
  depositMin: number;
  donateAmount: number;
  multipleWater: number;
  tierName: string;
  validBet: number;
  validbetMin: number;
}

interface IAccountVipPrivilegesData {
  id: number;
  buttonShow: number;
  rules: IAccountVipRules;
  depotCatDtoList: IDepotCatDto[];
}

interface IDepotCatDto {
  catCode: string;
  catId: number;
  catName: string;
  depotCode: string;
  depotId: number;
  depotName: string;
}

interface IAccountVipRules {
  ruleScopeDtos: IRuleScopeDto[];
  scope: number;
}

interface IRuleScopeDto {
  accountLevel: number;
  actLevelId: number;
  activityRuleDtos: {
    amountMin: number;
    donateAmount: number;
    donateAmountMax: number;
    donateType: number;
    multipleWater: number;
  };
  auditCats: {
    catId: number;
    depots: {
      depotId: number;
    }[];
  }[];
  drawNumber: number;
  drawType: number;
  formulaMode: number;
  isBank: boolean;
  isMail: boolean;
  isMobile: boolean;
  isName: boolean;
  tierName: string;
}

interface IUpgradeBonusLevelDto {
  accountLevel: number;
  actLevelId: number;
  donateAmount: number;
  multipleWater: number;
  tierName: string;
}

interface IMonthlyBonu extends IBirthdayBonus {
  validBetType: number;
  lastDepositMin: number;
  lastDepositMinTimes: number;
  lastValidBetMin: number;
}

interface IActivityLevelCatDto {
  accountLevelId: number;
  catName: string;
  donateRatio: number;
  tierName: string;
}

interface IActivityLevel {
  accountLevel: number;
  depositMin: number;
  downgradeBet: number;
  feeAvailable: number;
  id: number;
  promoteSign: number;
  tierName: string;
  validbetMin: number;
  withDrawalQuota: number;
  withDrawalTimes: number;
}
interface IVipInfoData {
  accountLevel: number;
  activityLevelCatDtos: IActivityLevelCatDto[];
  activityLevelList: IActivityLevel[];
  birthday: string;
  birthdayBonusList: IBirthdayBonus[];
  depositAmount: number;
  downgradePromotion: number;
  downgradePromotionDay: number;
  loginName: string;
  tierName: string;
  validbet: number;
  upgradeBonusLevelDtos: IUpgradeBonusLevelDto[];
  hdgz: string;
  hlzs: string;
}

interface ISwiperData {
  actId: number;
  activityId: number;
  advType: number;
  clientShow: number;
  picMbPath: string;
  picTarget: number;
}