import { defineStore } from 'pinia';
import { LocalStorage, Notify, Platform } from 'quasar';
import { apiCheckVfyRegisterAndLogin, apiLogin, apiMessageInfo } from 'src/http/user';

interface IUser {
  userInfo: Partial<IUserInfo>;
  token: string;
  useFingerprintLogin: boolean;
  signMode: string;
}

export const useUserStore = defineStore('user', {
  state: (): IUser => ({
    userInfo: LocalStorage.getItem('userInfo') ?? {},
    token: LocalStorage.getItem('token') ?? '',
    useFingerprintLogin: LocalStorage.getItem('useFingerprintLogin') ?? false,
    signMode: '',
  }),
  getters: {
    isLogin(state) {
      return !!state.token;
    },
  },
  actions: {
    login(params: any) {
      if (Platform.is.cordova) {
        params.loginType = Platform.is.ios ? 2 : 3;
      } else {
        params.loginType = 1;
      }
      return apiLogin(params).then(({ data }) => {
        if (data.code === 10086) {
          return {
            loginLocked: true,
          };
        }
        this.$patch((state) => {
          state.token = data.token;
          state.userInfo = data.userInfo;
        });
      });
    },
    // 我的管家信息
    getButlerMessageList(params: Partial<IMessageInfoParams>) {
      return apiMessageInfo({
        pageSize: 30,
        ...params,
      }).then(({ data }) => data.data)
    },
  },
});
