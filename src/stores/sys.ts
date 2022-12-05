import { defineStore } from 'pinia';
import { LocalStorage, Platform } from 'quasar';
import { apimobileAreaCodes } from 'src/http'

interface SysState {
  areaCodes: {
    id: number;
    countryName: string;
    englishName: string;
    countryCode: string;
    mobileAreaCode: string;
  }[];
  reqQueue: string[];
  hasPrefixUrl: boolean;
  SToken: string;
}

const { DEFAULT_STOKEN } = process.env

export const useSysStore = defineStore('sys', {
  state: (): SysState => ({
    areaCodes: [],
    reqQueue: [],
    hasPrefixUrl: false,
    SToken: LocalStorage.getItem('SToken') ?? JSON.parse(DEFAULT_STOKEN as string),
  }),
  actions: {
    getMobileAreaCodes() {
      apimobileAreaCodes()
        .then(({ data }) => {
          this.$patch(state => {
            state.areaCodes = data.mobileAreaCodes
          })
        })
    },
    
  }
});
