import { defineStore } from 'pinia';
import { LocalStorage, Notify, Platform, Dialog } from 'quasar';
import {
  apimobileAreaCodes,
  apiCatList,
  apiElecDepotList,
  apiChessDepotList,
  apiLotteryDepotList,
  apiFishDepotList,
  apiCatDepotList,
  apiStoken,
  apiGameLogin,
} from 'src/http';
import { getDomain } from 'src/utils';
import { useEnvStore } from './env';
import { deportLocalDataFactory } from 'game_data';
import { useUserStore } from './user';
import { i18n } from 'boot/i18n';
import DialogPrimary from 'pages/common/DialogPrimary.vue';

const { t: lang } = i18n.global;
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
  isShowDownloadBar: boolean;
  mainGameList: IMainList[];
  domain: string;
  lastSiteUrl: string;
  enterGameLoading: boolean;
  waitOpenGameList: (() => void)[];
  recoveringBalanceStatus: boolean;
}

const { DEFAULT_STOKEN } = process.env;

export const useSysStore = defineStore('sys', {
  state: (): SysState => ({
    areaCodes: [],
    reqQueue: [],
    hasPrefixUrl: false,
    SToken:
      LocalStorage.getItem('SToken') ?? JSON.parse(DEFAULT_STOKEN as string),
    isShowDownloadBar:
      !Platform.is.cordova &&
      LocalStorage.getItem('showDownloadbar') !==
        new Date().toLocaleDateString(),
    mainGameList: deportLocalDataFactory.create(),
    domain: '',
    lastSiteUrl: LocalStorage.getItem('lastSiteUrl') ?? '',
    enterGameLoading: false,
     // 等待回转余额完成后打开三方游戏的 function 列表
    waitOpenGameList: [],
     // 请求中api列表
    reqQueue: [],
    recoveringBalanceStatus: false,
  }),
  actions: {
    getMobileAreaCodes() {
      apimobileAreaCodes().then(({ data }) => {
        this.$patch((state) => {
          state.areaCodes = data.mobileAreaCodes;
        });
      });
    },
    closeDownloadBar() {
      this.$patch((state) => (state.isShowDownloadBar = false));
      LocalStorage.set('showDownloadbar', new Date().toLocaleDateString());
    },
    getGameCenterData() {
      const deportData1 = deportLocalDataFactory.create1();
      return new Promise((resolve, reject) => {
        apiCatList()
          .then((gameCategories) => {
            Promise.all(
              gameCategories.map((category: ICategory) =>
                this.getGameDepotsByCatId(category.id)
              )
            )
              .then((gameCenterData) => {
                LocalStorage.set(
                  '_games',
                  gameCenterData.reduce((a, b) => [...a, ...b], [])
                );
                const data = gameCenterData.filter((item) => item.length);
                const temp = data
                  .map((items) => {
                    const catId = (items?.length && items[0].catId) ?? null;
                    const activeCat = deportData1.find(
                      (cat: IMainList) => cat.catId === catId
                    );
                    if (!activeCat) return null;
                    // 本地平台数据和接口数据做关联
                    const depots = items
                      .map((item: any) => {
                        const findDepots = activeCat.depots.find(
                          (deport: IMainGame) =>
                            deport.depotCode === item.depotCode
                        );
                        if (!findDepots) return null;
                        return {
                          ...item,
                          ...findDepots,
                        };
                      })
                      .filter((v: any) => !!v);
                    const catHasTry = depots.some((s: IMainGame) => s.isTry);
                    return {
                      catHasTry,
                      ...activeCat,
                      depots,
                    };
                  })
                  .filter((v) => !!v);
                this.$patch((state) => (state.mainGameList = temp));
                resolve(this.mainGameList);
              })
              .catch(() => reject());
          })
          .catch(() => reject());
      });
    },
    getGameDepotsByCatId(catId: number) {
      switch (catId) {
        case 5:
          return apiElecDepotList();
        case 6:
          return apiChessDepotList();
        case 12:
          return apiLotteryDepotList();
        case 8:
          return apiFishDepotList();
        default:
          return apiCatDepotList(catId);
      }
    },
    initDomain() {
      if (this.domain) {
        return Promise.resolve();
      }
      return getDomain().then((d) =>
        this.$patch((state) => (state.domain = d))
      );
    },
    getSToken() {
      const { domain, SToken, lastSiteUrl } = this;
      if (SToken && lastSiteUrl === domain) {
        return Promise.resolve(SToken);
      }
      const envStore = useEnvStore();
      this.$patch((state) => {
        state.SToken = envStore.envDefaultStoken;
        state.lastSiteUrl = state.domain;
        LocalStorage.set('SToken', state.SToken);
        LocalStorage.set('lastSiteUrl', state.domain);
      });
    },
    setSToken() {
      apiStoken(this.domain).then(({ data }) => {
        this.$patch((state) => {
          state.SToken = data.SToken;
          state.lastSiteUrl = this.domain;
          LocalStorage.set('SToken', data.SToken);
          LocalStorage.set('lastSiteUrl', this.domain);
        });
        return data.SToken;
      });
    },
    enterGame(game: IMainGame) {
      const userStore = useUserStore();
      const { isTry, availableWh } = game;
      const isLogin = userStore.isLogin;
      const isAutoTransfer = userStore.userInfo.freeWalletSwitch !== 0;
      if (availableWh === 2) {
        Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'));
        return;
      }

      const openDialog = () => {
        window.transferBackDialog = Dialog.create({
          okLabel: lang('一键转回'),
          component: DialogPrimary,
          message: lang('您的余额已转入x，是否结束游戏并一键转回至中心钱包？', [game.titleTag || game.depotName || game.gameName]),
          title: lang('转账提示'),
          contentClass: 'dialog-primary-content--pre-line',
        }).onOk(() => {
          this.recoverBalanceAction()
        })
      };

      const req = () => {
        this.$patch(state => state.enterGameLoading = true)
        apiGameLogin(game.id, !userStore.isLogin)
          .then(({ data: {msg, tryPlayFlag} }) => {
            if (userStore.isLogin && isTry && !tryPlayFlag) {
              Notify.create(lang('试玩线路维护中'))
              return Promise.reject()
            }
            if (msg.includes('http') === -1) {
              Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'))
              return Promise.reject()
            }
            if ()
          })
      }
    },
    recoverBalanceAction() {
      this.recoverBalanceNoticeShow()

    },
    recoverBalanceNoticeShow() {
      window.transferBackDialog?.hide()
    },
  },
});
