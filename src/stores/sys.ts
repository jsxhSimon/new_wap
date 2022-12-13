import { defineStore } from 'pinia';
import { axios } from 'boot/axios'
import { LocalStorage, Notify, Platform, Dialog, SessionStorage } from 'quasar';
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
  apiIndexNoticeAndAdv,
  apiQueryStationSet,
} from 'src/http';
import {
  getDomain,
  checkURL,
  openAppBrowser,
  openWindowAsync,
  switchOrientation,
} from 'src/utils';
import { useEnvStore, usePayStore, useUserStore } from 'src/stores'
import { deportLocalDataFactory } from 'game_data';
import { i18n } from 'boot/i18n';
import DialogPrimary from 'pages/common/DialogPrimary.vue';
import { Router } from 'src/router'
import { apiWinList } from 'src/http/user';

const { t: lang } = i18n.global;
interface SysState {
  areaCodes: IAreaCode[];
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
  winList: IWin[];
  mobileAreaCode: string;
  stationSetting: Partial<IStation>;
}

const { DEFAULT_STOKEN } = process.env;

export const useSysStore = defineStore('sys', {
  state: (): SysState => ({
    mobileAreaCode: '86',
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
    recoveringBalanceStatus: false,
    winList: [],
    stationSetting: SessionStorage.getItem('stationSetting') ?? {},
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
      const envStore = useEnvStore();
      const payStore = usePayStore();
      const { isTry, availableWh } = game;
      const isAutoTransfer = userStore.userInfo.freeWalletSwitch !== 0;
      if (availableWh === 2) {
        Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'));
        return;
      }

      const openDialog = () => {
        window.transferBackDialog = Dialog.create({
          componentProps: {
            okLabel: lang('一键转回'),
            message: lang('您的余额已转入x，是否结束游戏并一键转回至中心钱包？', [game.titleTag || game.depotName || game.gameName]),
            title: lang('转账提示'),
            contentClass: 'dialog-primary-content--pre-line',
          },
          component: DialogPrimary,
        }).onOk(() => {
          this.recoverBalanceAction()
        })
      };

      const req = () => {
        this.$patch(state => state.enterGameLoading = true)
        return apiGameLogin(game.id, !userStore.isLogin)
          .then(({ data: {msg, tryPlayFlag} }) => {
            if (userStore.isLogin && isTry && !tryPlayFlag) {
              Notify.create(lang('试玩线路维护中'))
              return Promise.reject()
            }
            if (msg.indexOf('http') === -1) {
              Notify.create(lang('该场馆正在维护，请先娱乐其他场馆游戏'))
              return Promise.reject()
            }
            // 博冠 欧博手动转账不执行余额回收相关操作
            if (userStore.isLogin && (!['bog2', 'hbx'].includes(envStore.appSite) || isAutoTransfer)) {
              payStore.getBalance()
              if (!Platform.is.cordova) {
                openDialog()
              }
            }
            return Promise.resolve(msg)
          }).finally(() => {
            this.$patch(state => state.enterGameLoading = false)
          })
      }

      if (userStore.isLogin || isTry) {
        if (Platform.is.cordova) {
          const cb = () => {
            req()
              .then((url) => {
                if (!checkURL(url)) {
                  Notify.create(`${userStore.isLogin ? 'transit' : 'tryPlayGame'}${lang('返回的不是游戏链接')}: ${url}`)
                  return
                }
                const title = game.gameName || game.depotName
                const orientation = switchOrientation(game.orientation);
                (document.querySelector('html') as any).style.background = 'transparent';
                (document.querySelector('body') as any).style.background = 'transparent';
                const isFullScreen = (game.catId === 6 || game.catName === '棋牌') ? '1' : '0';
                openAppBrowser(
                  url,
                  title,
                  orientation,
                  () => {
                    // 博冠 欧博手动转账不执行余额回收相关操作
                    (!['bog2', 'ob8'].includes(envStore.appSite) || isAutoTransfer) && this.recoverBalanceAction();
                    (document.querySelector('html') as any).style.background = '';
                    (document.querySelector('body') as any).style.background = '';
                  }
                ),
                undefined,
                isFullScreen
              })
          }
          if (this.recoveringBalanceStatus) {
            this.$patch(state => {
              state.enterGameLoading = true
              state.waitOpenGameList = [cb, () => this.$patch(state => state.enterGameLoading = false)]
            })
          } else {
            cb()
          }
        } else {
          openWindowAsync((resolve: (url: string, callback: () => void) => void, reject: () => void) => {
            const cb = () => {
              req()
                .then((url) => {
                  resolve(url, () => (!['bog2', 'ob8'].includes(envStore.appSite) || isAutoTransfer) && this.recoverBalanceAction())
                })
                .catch(e => {
                  console.log(e)
                  reject()
                })
            }
            if (this.recoveringBalanceStatus) {
              this.$patch(state => state.waitOpenGameList = state.waitOpenGameList.concat([cb]))
            } else {
              cb()
            }
          }, envStore.appSite)
        }
      } else {
        userStore.$patch(state => state.signMode = 'signIn')
        Router.push('/login')
      }
    },
    recoverBalanceAction() {
      this.recoverBalanceNoticeShow()

    },
    recoverBalanceNoticeShow() {
      window.transferBackDialog?.hide()
    },
    indexNoticeAndAdv(isSport?: boolean) {
      return apiIndexNoticeAndAdv(
        {
          pageNo: 1,
          pageSize: 100,
          advType: isSport ? 4 : 1,
          evebNum: 1,
        }
      )
        .then(({data: { page, popUpList = [], noticeList }}) => ({
          swiperList: page.filter((item: any) => item.clientShow > 0),
          popUpList: popUpList.filter((item: any) => item.clientShow > 0),
          noticeList: noticeList.list,
        }))
    },
    getWinList() {
      return apiWinList().then(({data}) => {
        this.$patch(state => state.winList = data.page)
        return data.page
      })
    },
    hanldeAdClick(params: any) {
      const { picTarget, actId, activityId, outStation } = params
      if (picTarget) {
        if (Platform.is.cordova && Platform.is.ios) {
          (cordova as any).InAppBrowser.open(outStation, '_system', {})
        } else {
          window.open(outStation)
        }
      } else if (actId) {
        Router.push({
          path: '/activity',
          query: {
            activityId: activityId || undefined,
            activityCatId: actId || undefined,
          }
        })
      }
    },
    queryStationSet() {
      return apiQueryStationSet().then(({data}) => {
        this.$patch(state => state.stationSetting = data)
        SessionStorage.set('stationSetting', data)
        return data
      })
    },
    getAiGameList(params: any) {
      if (+params.gameType === 1) {
        if (params.type === 'FB体育') {
          return params.getList({ type: params.parentId, sportId: params.sportId })
        }
        return params.mth({ ...params.i1, menuName: '足球' }).then((res: any) => {
          const fres = res.slice(0, 1)
          if (fres.length > 0) {
            fres.sport = 1
          }
          return fres
        })
      }
      // eslint-disable-next-line object-curly-newline
      const url = ({ 12: 'gameLotteryList', 3: 'getGameByTrunmanShowCategory', 5: 'gameList', 6: 'gameChessList' } as any)[params.catId] // , 12: 'gameLotteryList'
      return axios.get(`/sys/${url}`, { params: { depotId: params.depotId, pageSize: 4, pageNo: 1 } }).then(({ data }) => (data.page ? data.page.list : data.games.list))
    },
  },
});
