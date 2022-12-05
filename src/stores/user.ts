import { defineStore } from 'pinia'
import { LocalStorage, Notify, Platform } from 'quasar'
import { apiCheckVfyRegisterAndLogin, apiLogin } from 'src/http/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: LocalStorage.getItem('userInfo') ?? {},
    token: LocalStorage.getItem('token') ?? null,
    useFingerprintLogin: LocalStorage.getItem('useFingerprintLogin') ?? false,
  }),
  getters: {
    isLogin(state) {
      return !! state.token
    }
  },
  actions: {
    login(params: any) {
      if (Platform.is.cordova) {
        params.loginType = Platform.is.ios ? 2 : 3
      } else {
        params.loginType = 1
      }
      return apiLogin(params)
        .then(({ data }) => {
          if (data.code === 10086) {
            return {
              loginLocked: true,
            }
          }
          this.$patch(state => {
            state.token = data.token
            state.userInfo = data.userInfo
          })
        })
    },
  }
})