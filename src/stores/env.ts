import { defineStore } from 'pinia'
import { i18n } from 'boot/i18n'
import axios from 'axios'
import qs from 'qs'

interface IEnvState {
  envConfig: Partial<IEnvConfig>;
}

interface IEnvConfig {
  APP_SITE: string;
  APP_TITLE: string;
  APP_TITLE_EN: string;
  APP_CURRENCY_ID: number;
  APP_CURRENCY_SYMBOL: string;
  APP_CURRENCY: string;
  APP_HAS_SPORTS: string;
  APP_LANGUAGE: string;
}

export const useEnvStore = defineStore('env', {
  state: (): IEnvState => ({
    envConfig: {},
  }),
  getters: {
    appSite(state) {
      return state.envConfig.APP_SITE ?? JSON.parse(process.env.SITE || '""')
    },
    envCurrencySymbol(state) {
      return state.envConfig.APP_CURRENCY_SYMBOL ?? JSON.parse(process.env.CURRENCY_SYMBOL || '""')
    },
    envCurrencyId(state) {
      return Number(state.envConfig.APP_CURRENCY_ID ?? JSON.parse(process.env.APP_CURRENCY_ID || '""'))
    },
    envHasSports(state) {
      return state.envConfig.APP_HAS_SPORTS ?? JSON.parse(process.env.APP_HAS_SPORTS || '""')
    },
    envAppTitle(state) {
      return i18n.global.locale.value === 'zh' ? state.envConfig.APP_TITLE : state.envConfig.APP_TITLE_EN
    }
  },
  actions: {
    getEnvConfig() {
      console.log(process.env.SITE)
      console.log(process.env.APP_CODE)
      const query = qs.stringify({
        filters: {
          APP_SITE: JSON.parse(process.env.SITE as string),
          APP_ENV: JSON.parse(process.env.APP_CODE as string),
        },
      })
      axios.get(`http://localhost:1337/api/app-configs?${query}`)
        .then((data) => {
          console.log(data)
          const config = data.data.data[0]
          if (config) {
            this.$patch(state => {
              state.envConfig = config.attributes
            })
          }
        })
    },
  }
})