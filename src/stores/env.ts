import { defineStore } from 'pinia';
import { i18n } from 'boot/i18n';
import axios from 'axios';
import qs from 'qs';

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
  APP_VERSION: string;
  DEFAULT_DOMAIN: string;
  DEFAULT_STOKEN: string;
  APP_ENV: string;
  APP_HAS_OPENINSTALL: boolean;
  APP_MOBILE_AREA_CODE: string;
  APP_MAX_LEVEL: number;
  APP_THEME: string;

}

export const useEnvStore = defineStore('env', {
  state: (): IEnvState => ({
    envConfig: {},
  }),
  getters: {
    appSite(state) {
      return state.envConfig.APP_SITE ?? JSON.parse(process.env.SITE || '""');
    },
    appEnv(state) {
      return state.envConfig.APP_ENV ?? JSON.parse(process.env.APP_CODE || '""');
    },
    envCurrencySymbol(state) {
      return (
        state.envConfig.APP_CURRENCY_SYMBOL ?? 'CNY'
      );
    },
    envCurrencyId(state) {
      return Number(
        state.envConfig.APP_CURRENCY_ID ?? 1
      );
    },
    envHasSports(state) {
      return (
        state.envConfig.APP_HAS_SPORTS ?? true
      );
    },
    envAppTitle(state) {
      return i18n.global.locale.value === 'zh'
        ? state.envConfig.APP_TITLE
        : state.envConfig.APP_TITLE_EN;
    },
    envTheme(state) {
      return state.envConfig.APP_THEME ?? 'blue';
    },
    envAppVersion(state) {
      return (
        state.envConfig.APP_VERSION ??
        JSON.parse(process.env.APP_VERSION || '""')
      );
    },
    envDefaultDomain(state) {
      return (
        state.envConfig.DEFAULT_DOMAIN ??
        JSON.parse(process.env.DEFAULT_DOMAIN || '""')
      );
    },
    envDefaultStoken(state) {
      return (
        state.envConfig.DEFAULT_STOKEN ??
        JSON.parse(process.env.DEFAULT_STOKEN || '""')
      );
    },
    envHasOpeninstall(state) {
      return state.envConfig.APP_HAS_OPENINSTALL ?? true
    },
    envMobileAreaCode(state) {
      return state.envConfig.APP_MOBILE_AREA_CODE || '86'
    },
    envMaxLevel(state) {
      return state.envConfig.APP_MAX_LEVEL || 10
    },
  },
  actions: {
    getEnvConfig() {
      const query = qs.stringify({
        filters: {
          APP_SITE: JSON.parse(process.env.SITE as string),
          APP_ENV: JSON.parse(process.env.APP_CODE as string),
        },
      });
      axios
        .get(`http://localhost:1337/api/app-configs?${query}`)
        .then((data) => {
          console.log('99????????????============:', data)
          const config = data.data.data[0];
          if (config) {
            this.$patch((state) => {
              state.envConfig = config.attributes;
            });
          }
        });
    },
  },
});
