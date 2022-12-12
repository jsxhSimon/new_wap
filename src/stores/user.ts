import { axios } from 'boot/axios'
import { defineStore } from 'pinia';
import { LocalStorage, Notify, Platform } from 'quasar';
import { apiCheckIsMobileRegistered, apiNicknameInfoForSptv } from 'src/http';
import { apiCheckVfyRegisterAndLogin, apiGenerateRegInfo, apiLogin, apiMessageInfo, apiRegister, apiRegistSetting, apiResetPasswordValidCode, apiResetPasswordWithMoble } from 'src/http/user';
import { Router } from 'src/router'
import { useEnvStore } from './env'

interface IUser {
  userInfo: Partial<IUserInfo>;
  nickNameInfo: Partial<IUserNicknameInfo>;
  token: string;
  useFingerprintLogin: boolean;
  signMode: string;
  equipmentId: string;
  messageUnreadCount: number;
}

export const useUserStore = defineStore('user', {
  state: (): IUser => ({
    userInfo: LocalStorage.getItem('userInfo') ?? {},
    nickNameInfo: LocalStorage.getItem('nickNameInfo') ?? {},
    token: LocalStorage.getItem('token') ?? '',
    useFingerprintLogin: LocalStorage.getItem('useFingerprintLogin') ?? false,
    signMode: '',
    equipmentId: LocalStorage.getItem('eq_uuid') ?? '',
    messageUnreadCount: 0,
  }),
  getters: {
    isLogin(state) {
      return !!state.token;
    },
  },
  actions: {
    login(params: Partial<IFormModel>) {
      if (Platform.is.cordova) {
        params.loginType = Platform.is.ios ? 2 : 3;
      } else {
        params.loginType = 1;
      }
      return apiLogin(params).then(({ data }) => {
        if (data.code === 10086) {
          return {
            loginLocked: true,
          }
        }
        this.$patch((state) => {
          state.token = data.token;
          state.userInfo = data.userInfo;
        });
        LocalStorage.set('token', data.token)
        LocalStorage.set('userInfo', data.userInfo)
        this.getNicknameInfoForSptv()
        const envStore = useEnvStore()
        Router.push(envStore.envHasSports === false ? '/' : '/sports')
        return {
          loginLocked: false,
        };
      });
    },
    register(params: Partial<IFormModel>) {
      if (Platform.is.cordova) {
        params.loginType = Platform.is.ios? 2 : 3;
      } else {
        params.loginType = 1;
      }
      params.registerDevice = this.equipmentId
      const headers: {
        dev: string;
        domain?: string;
      } = {
        dev: 'WAP'
      }
      if (Platform.is.cordova) {
        headers.dev = 'H5'
        if (params.mainDomain) {
          headers.domain = params.mainDomain
        }
      }
      return apiRegister(params, headers)
        .then(({ data }) => {
          this.$patch(state => {
            state.token = data.token
            state.userInfo = data.userInfo
            this.getNicknameInfoForSptv()
            Router.push('/')
          })
        })
    },
    // 获取注册规则
    getRegisterSetting() {
      return apiRegistSetting()
        .then(({data}) => data.regSetting)
    },
    generateRegisterInfo(params: Partial<IFormModel>) {
      return apiGenerateRegInfo(params)
        .then(({data}) => data.data)
    },
    // 我的管家信息
    getButlerMessageList(params: Partial<IMessageInfoParams>) {
      return apiMessageInfo({
        pageSize: 30,
        ...params,
      }).then(({ data }) => data.data)
    },
    checkIsMobileRegistered(params: any) {
      return apiCheckIsMobileRegistered(params)
        .then(({ data }) => !!data.msg)
    },
    closeSignDialog() {
      this.$patch(state => state.signMode = '')
    },
    getNicknameInfoForSptv() {
      return apiNicknameInfoForSptv()
        .then(({ data }) => {
          this.$patch(state => state.nickNameInfo = data.data)
          LocalStorage.set('nickNameInfo', data.data)
        })
    },
    checkVfyRegisteAndLogin(params: {loginName: string}) {
      return apiCheckVfyRegisterAndLogin(params)
        .then(({data}) => {
          console.log(data)
          return data
        })
    },
    clearUserInfo() {
      this.$patch(state => {
        state.userInfo = {}
        state.nickNameInfo = {}
        state.token = ''
        LocalStorage.remove('token')
      })
    },
    resetPasswordValidCode(params: Partial<IFormModel>) {
      return apiResetPasswordValidCode(params)
        .then(({data}) => data.token)
    },
    resetPasswordWithMobile(params: Partial<IFormModel>) {
      return apiResetPasswordWithMoble(params).then(({data}) => data.token)
    },
    getMessageUnread(params: Partial<{msgType: number}>) { // 查询会员是否有未读消息
      const msgType = params.msgType || 0
      return axios
        .get('user/messageUnread', {
          params: {
            msgType: 0,
            ...params,
          },
        })
        .then(({ data }) => {
          if (msgType === 0) {
            // 设置用户未读消息
            this.$patch(state => state.messageUnreadCount = data.count)
          }
          return { count: data.count, hasUnread: data.data }
        }) // 几条未读消息  是否有未读消息
    },
  },
});
