interface IFormModel {
  loginName: string;
  password: string;
  captchaVerification: string;
  smsCaptcha?: string;
}

interface IUserInfo {
  username: string;
}