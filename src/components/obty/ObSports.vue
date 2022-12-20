<template>
  <div class="ob-sports" v-show="!showFilter">
    <div v-show="modelShow" class="sticky">
      <div class="match-tabs new-match-tabs" :class="{'click-disabled': disabledMenu}">
        <div class="tabs flex align-center">
          <template v-for="(tab, idx) in tabs" :key="tab.menuName">
            <div
              class="tab"
              :class="{active: tabIndex === idx}"
              @click="handleChangeTab(idx)"
            >
              <span class="tab-cnt">
                {{ $t(tab.menuName as string) }}
                <i class="count">{{ tab.count }}</i>
              </span>
            </div>
          </template>
        </div>
        <sport-menu :activeIndex="subIndex" :list="activeMenu ? activeMenu.subList.filter((item) => (item.count > 0 || item.menuName === '全部' || item.count === undefined)) : []" @change="handleChangeMenu" />
      </div>
      <div class="utils flex justify-between">
        <div class="flex align-center" @click="handleToggle()">
          <span class="iconfont mr-4 icon-shuangyoujiantou-" :class="openAll ? 'sdy-icon-up' : 'sdy-icon-down'"/>
          {{ openAll ? $t('收起') : $t('展开') }}
        </div>
        <div v-if="activeSubMenu && activeSubMenu.menuName !== '足球'" class="flex flex-center sort-buttons">
          <div
            v-for="item in sortButtons"
            :key="item.type"
            class="sort-button"
            :class="item.type === sortType ? 'active' : ''"
            @click="handleMatchesSortClick(item.type)"
          >
            {{item.label}}
          </div>
        </div>
        <div v-if="activeSubMenu && activeSubMenu.menuName === '足球'" class="flex flex-center sort-buttons">
          <div
            v-for="item in sortsButtons"
            :key="item.type"
            class="sort-button"
            :class="item.type === sortType ? 'active' : ''"
            @click="handleMatchesSortClick(item.type)"
          >
            {{item.label}}
          </div>
        </div>
        <div class="flex flex-center">
          <span class="iconfont icon-rili mr-10" v-if="xmStore.isZaoPan" @click="showCalendar = !showCalendar"/>
          <span class="_filter flex align-center" @click="show"><i class="iconfont icon-wangdianquanxihuaxiangICON-06"></i>{{ $t('筛选') }}</span>
        </div>
        <div class="sdy-calendar" v-show="showCalendar">
          <div class="sdy-calendar-item" v-for="(date, idx) in dateList" :key="date.value">
            <div class="item" :class="{active: (idx === 0 && range.length === 0) || range.includes(date.value)}" @click="onConfirm(date.value)">
              <span>{{date.text}}</span>
              <span>{{date.week}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="match-list-container" v-show="!showFilter">
      <div class="matches-wrapper" ref="matchModel">
        <Skeleton v-show="showSkeleton" />
        <div class="sport-group-container" :style="sportGroupStyle">
          <div class="sport-group" v-for="c in resultData" :key="c.csna" v-show="!showSkeleton">
            <sdy-collapse
              v-for="t in c.list"
              :key="t.groupKey"
              v-show="t.list.length"
              :close="foldList.includes(t.groupKey)"
              :tid="t.tid"
            >
              <template #header>
                <div class="match-header flex" @click="matchFold(t.groupKey)">
                  <div class="league-title flex">
                    <sdy-image class="mr-10" :src="t.list[0] ? imgPrefix + t.list[0].lurl : ''" :height="32" />
                    <div class="league-name">{{ t.name }}</div>
                  </div>
                  <div class="flex flex-center">
                    <span class="mr-10">{{t.list.length}}</span>
                    <span class="iconfont icon-xiangyou1  sdy-icon-unfold"></span>
                  </div>
                </div>
              </template>
              <template #content>
                <div class="match-item" v-for="item in t.list" :key="item.mid">
                  <div class="match-item-wrapper">
                    <div class="match-item-bx">
                      <div class="match-item-bx-left">
                        <div class="match-item-bx-left-top" :class="{'has-img': getIcon(item)}" >
                          <span class="_flex icon_item">
                            <div v-if="getIcon(item)" class="game-icon" @click="showFullPlay(item, !xmStore.isZaoPan)" :class="getIcon(item)"></div>
                            {{ item.mmp === '0' ? formatMgtDate(item) : $t(formatMmp(item,1))}}
                          </span>
                          <span v-if="showTime(item)" class="_flex">
                            <van-icon name="underway-o" class="m-r-2" />
                            <span v-if="item.mess === 0">{{formatMgtTime(item)}}</span>
                            <CountDown v-else :key="`${item.mid}-${hideCount}`" :reverse="item.csid === '2'" :time="item.mst"></CountDown>
                          </span>
                        </div>
                        <div class="match-item-bx-left-bottom">
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.mhlu && imgPrefix + item.mhlu[0]" :height="36" />
                            <div class="team-name">{{item.mhn}}</div>
                            <div class="score-value" v-if="item && item.msc && infoOptimization(item.msc, '全场比分')">{{infoOptimization(item.msc, '全场比分').split(':')[0]}}</div>
                          </div>
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.malu && imgPrefix + item.malu[0]" :height="36" />
                            <div class="team-name">{{item.man}}</div>
                            <div class="score-value" v-if="item && item.msc && infoOptimization(item.msc, '全场比分')">{{infoOptimization(item.msc, '全场比分').split(':')[1]}}</div>
                          </div>
                          <div class="collect flex">
                            <span class="fs-12">{{item.mc > 0 ? `${item.mc}+` : 0}}</span>
                            <div class="match-item-top-right" v-if="!xmStore.isZaoPan">
                              <div class="jiao-qiu" v-if="item && item.msc && infoOptimization(item.msc, '角球数')">
                                <span class="jiao-qiu-icon"></span>
                                {{infoOptimization(item.msc, '角球数')}}
                              </div>
                              <div class="half-score"  v-if="item && item.msc && infoOptimization(item.msc, '半场比分', item.mmp === '0' ? formatMgtDate(item) : formatMmp(item))">
                                <span class="half-score-ht">HT</span>
                                {{infoOptimization(item.msc, '半场比分', item.mmp === '0' ? formatMgtDate(item) : formatMmp(item))}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </sdy-collapse>
          </div>
        </div>
      </div>
    </div>
    <SquareGuideModel :isShow="guideModelShow" @close="closeGuideModel" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { SessionStorage, LocalStorage } from 'quasar';
import { ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { XmMenu, XMMatch, ILeagueFollow, IXmResultData, XMPlay, XMPlayOpts } from 'src/types/sports';
import { MENU_MAP } from './utils/constants'
import { useUserStore, useXmStore } from 'src/stores'
import SportMenu from './components/SportMenu.vue'
import Skeleton from 'components/Skeleton/index.vue'
import SdyCollapse from '../SdyCollapse.vue';
import { transformScore, imgPrefix, formatMgtTime } from 'components/obty/utils/common'
import { MATCH_STAGE } from 'components/obty/utils/constants'
import { groupBy, groupByKey } from 'src/utils'
import SquareGuideModel from '../SquareGuideModel.vue'
import SdyImage from 'components/SdyImage.vue'
import CountDown from '../CountDown.vue';

const { t: lang } = useI18n()

interface Props {
  gameType: number;
  isHideChange: boolean;
}

const props = defineProps<Props>()
const emits = defineEmits(['changeIsHideChange', 'scroll'])

const xmStore = useXmStore()
const userStore = useUserStore()
const showFilter = ref(false)
const menus = ref<XmMenu[]>([])
const tabIndex = ref(0)
const subIndex = ref(0)
const openAll = ref(true)
const resetTabInfo = ref(false)
const showCalendar = ref(false)
const range = ref<string[]>([])
const selectLeagues = ref<string[]>([])
const menuChangeCount = ref(0)
const list = ref<XMMatch[] | null>(null)
const showSkeleton = ref(false)
const showCoun = ref(false)
const gotoLeagueId = ref('')
const reloadCount = ref(0)
const hideCount = ref(0)
const canShowEmpty = ref(false)
const _euid = ref<string | number>('')
const sortType = ref(0)
const isOpen = ref(false)
const lfList = ref<ILeagueFollow[]>([])
const checkbox = ref<string[]>([])
const searchwd = ref('')
const modelShow = ref(true)
const matchModel = ref<any>(null)
const sportGroupStyle = ref('')
const resultData = ref<IXmResultData[]>([])
const page = ref(1)
const pageSize = ref(15)
const finished = ref(false)
const foldList = ref<string[]>([])
const guideModelShow = ref(false)
const loading = ref(false)
const fullMatch = ref<null | XMMatch>(null)

const intervalTime = 8000
let matchTimer: any = null
let findLeagueToast: any = null
let btimer: any = null
let timer: any = null

const sortButtons = [
  { label: lang('时间'), type: 0 },
  { label: lang('联赛'), type: 1 },
]
const sortsButtons = [
  { label: lang('时间'), type: 0 },
  { label: lang('联赛'), type: 1 },
  { label: lang('概率'), type: 2 },
]
const weekMap: Record<number, string> = {
  0: lang('周日'),
  1: lang('周一'),
  2: lang('周二'),
  3: lang('周三'),
  4: lang('周四'),
  5: lang('周五'),
  6: lang('周六'),
}

const disabledMenu = computed(() => {
  return Object.keys(menus.value[0] || {}).length <= 2
})

const tabs = computed(() => {
  const showMenus = Object.values(MENU_MAP)
  let arr: any = menus.value.filter(item => showMenus.includes(item.menuType))
  if (!arr.length) {
    arr = [
      {
        menuName: '滚球',
        subList: [
          { menuName: '全部' },
          { menuName: '足球' },
          { menuName: '篮球' },
          { menuName: '乒乓球' },
          { menuName: '冰球' },
          { menuName: '棒球' },
        ]
      },
      {
        menuName: '今日',
      },
      {
        menuName: '早盘',
      },
      {
        menuName: '串关',
      },
    ]
  }
  return arr
})

const activeMenu = computed(() => {
  return tabs.value[tabIndex.value] as XmMenu
})

const activeSubMenu = computed(() => {
  return activeMenu.value.subList.filter(item => (item.count > 0 || item.menuName === '全部' || item.count === undefined))[subIndex.value]
})

const leagueFollowIds = computed(() => {
  return (lfList.value || []).map(item => item.leagueId.toString())
})

const filterData = computed(() => {
  let arr = list.value
  if (selectLeagues.value.length) {
    arr = arr?.filter(item => selectLeagues.value.includes(item.tn)) ?? null
  }
  if (leagueFollowIds.value) {
    arr?.forEach((item, idx) => {
      if (idx !== 0 && leagueFollowIds.value.includes(item.tid)) {
        arr?.unshift(arr.splice(idx, 1)[0])
      }
    })
  }
  if (sortType.value === 0) {
    arr?.sort((a, b) => Number(a.mgt) - Number(b.mgt))
  } else if (sortType.value === 1) {
    arr?.sort((a, b) => b.leagueSort - a.leagueSort)
  } else {
    arr?.sort((a, b) => b.prob - a.prob)
  }
  if (range.value.length) {
    arr = arr?.filter(item => range.value.includes(dayjs(Number(item.mgt)).format('YYYY-MM-DD'))) ?? null
  }
  return arr
})

const leagueList = computed(() => {
  const leagues: Record<string, {name: string; logo: string; index: string; id: string;}> = {}
  list.value?.forEach(item => {
    if (leagues[item.tn] && item.tn.includes(searchwd.value)) {
      leagues[item.tn] = {
        name: item.tn,
        logo: item.lurl,
        index: item.leagueInitials,
        id: item.tid
      }
    }
  })
  return Object.values(leagues)
})

const dateList = computed(() => {
  let arr: {value: string; text: string; week: string;}[] = []
  if (xmStore.isZaoPan) {
    arr = [
      {
        value: '',
        text: '全部',
        week: activeMenu.value.subList.filter(item => (item.count > 0 || item.menuName === '全部' || item.count === undefined))[subIndex.value].count.toString(),
      }
    ]
    for (let i = 1; i < 8; i++) {
      const date = dayjs().add(i, 'day')
      arr[i] = {
        value: date.format('YYYY-MM-DD'),
        text: date.format('MM月DD日'),
        week: weekMap[date.day()],
      }
    }
  }
  return arr
})

watch(
  () => activeMenu.value,
  (val) => {
    xmStore.$patch(state => state.activeMenuModel = val)
  }
)

watch(
  () => filterData.value,
  (dat) => {
    xmStore.activeBetData.forEach((_) => {
      const { hpIndex, hlIndex, oIndex } = _
      const item = JSON.parse(JSON.stringify(dat?.find(i => i.mid === _.match.mid)))
      if (item && hpIndex >= 0) {
        if (item.hps[hpIndex].hpid === '1' && item.hps[hpIndex].hl[0] && item.hps[hpIndex].hl[0].ol.length === 3) {
          const allOl = item.hps[hpIndex].hl[0].ol
          const [o1, o2, o3] = allOl
          const al = [o1, o3, o2]
          item.hps[hpIndex].hl[0].ol = al
        }
        const po = item.hps[hpIndex].hl[hlIndex].ol[oIndex]
        _.lb = po.on || po.onb
        _.playOpts = { ...po }
      }
    })
    nextTick(() => {
      handleListChange(dat)
    })
  },
  {
    immediate: true
  }
)

onBeforeMount(() => {
  menus.value = xmStore.menuCache
})

onMounted(() => {
  handleChangeMenu()
})

onBeforeUnmount(() => {
  clearInterval(matchTimer)
})

const handleChangeTab = (idx: number) => {
  window.shakeApp()
  tabIndex.value = idx
  subIndex.value = 0
}

const handleChangeMenu = (euid?: number | string, sIdx?: number) => {
  openAll.value = true
  if (resetTabInfo.value && SessionStorage.getItem('sportsTabInfo')) {
    const temp = (SessionStorage.getItem('sportsTabInfo') as string).split(' ')
    const [t1, t2] = temp
    const [arr0, arr1] = t1.split(',')
    tabIndex.value = Number(arr0)
    sIdx = Number(arr1 || 0)
    if (tabIndex.value === 4) sIdx = 0
    euid = t2
    SessionStorage.remove('sportsTabInfo')
    resetTabInfo.value = false
  }
  showCalendar.value = false
  range.value = []
  selectLeagues.value = []
  if (euid) subIndex.value = sIdx ?? 0
  else subIndex.value = 0
  if (matchTimer) {
    clearInterval(matchTimer)
    matchTimer = 0
  }
  menuChangeCount.value += 1
  let menuIds = ''
  const key = tabs.value[tabIndex.value].subList.filter((item: any) => (item.count > 0 || item.menuName === '全部' || item.count === undefined))[subIndex.value].menuId
  if (tabs.value.length && xmStore.matchCache[key]) {
    const tempArr = xmStore.matchCache[key].list!
    if (tempArr.length > 0) list.value = tempArr
    else showSkeleton.value = true
  } else {
    showSkeleton.value = true
  }
  if (!euid) {
    if (activeMenu.value.subList[0].menuName === '全部') {
      menuIds = activeMenu.value.subList.filter(item => item.menuName !== '全部').map(item => item.menuId).join(',')
    } else {
      menuIds = activeMenu.value.subList[0].menuId.toString()
    }
  }
  const params = {
    type: activeMenu.value.menuType,
    euid: euid || menuIds,
    md: activeMenu.value.field2,
    subMenuId: activeMenu.value.subList.filter(item => item.count > 0 || item.menuName === '全部' || item.count === undefined)[subIndex.value].menuId,
  }
  if (!xmStore.isMultiple) {
    showCoun.value = false
    xmStore.setBetCountShowActive(false)
  }
  getMs(params)
  matchTimer = setInterval(() => {
    setTimeout(() => {
      getMs(params, true)
    }, 0)
  }, intervalTime)
  _euid.value = euid || menuIds
  SessionStorage.set('sportsTabInfo', `${tabIndex.value},${subIndex.value} ${_euid.value}`)
}

const getMs = (params: any, sync?: boolean) => {
  SessionStorage.set('matchTabData', `${props.gameType},${tabIndex.value}${subIndex.value}`)
  SessionStorage.set('getMatchParams', JSON.stringify(params))
  getSportsMenu()
  if (!activeSubMenu.value) return
  if (activeMenu.value && activeMenu.value.subList.length) {
    params.menuName = activeMenu.value.subList.filter(item => !!item.count)[subIndex.value]?.menuName
  }
  xmStore.getMatches(params)
    .then(data => {
      if (data !== undefined) list.value = data || []
      if (gotoLeagueId.value) {
        nextTick(() => {
          scrollByLeagueId(gotoLeagueId.value)
        })
      }
      if (!sync) menuChangeCount.value += 1
      reloadCount.value += 1
      if (!sync && !xmStore.isMultiple) xmStore.$patch(state => state.activeBetData = [])
      if (props.isHideChange) {
        emits('changeIsHideChange', false)
        nextTick(() => {
          hideCount.value++
        })
      }
    })
    .finally(() => {
      canShowEmpty.value = true
      showSkeleton.value = false
    })
}

const getSportsMenu = () => {
  xmStore.getMenu()
    .then(res => {
      if (res && Array.isArray(res)) {
        menus.value = res
      }
    })
}

const scrollByLeagueId = (tid: number | string) => {
  showSkeleton.value = false
  nextTick(() => {
    const el = document.querySelector(`.tid-${tid}`)
    if (el) {
      const bh = (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight
      const sh = (document.querySelector('.sticky') as HTMLDivElement).offsetHeight
      const t = el.getBoundingClientRect().top + (document.querySelector('#q-app') as HTMLDivElement).scrollTop;
      (document.querySelector('#q-app') as HTMLDivElement).scrollTop = t - sh - bh
    }
    gotoLeagueId.value = ''
    if (findLeagueToast) findLeagueToast.clear()
  })
}

const handleToggle = () => {
  window.shakeApp()
  openAll.value = !openAll.value
}

const handleMatchesSortClick = (type: number, sync?: boolean) => {
  window.shakeApp()
  sortType.value = type
}

const show = () => {
  window.shakeApp()
  showFilter.value = true
  if (!selectLeagues.value.length) {
    checkbox.value = leagueList.value.map(item => item.name)
  } else {
    checkbox.value = selectLeagues.value
  }
}

const onConfirm = (date: string) => {
  openAll.value = true
  range.value = date ? [date] : []
  showCalendar.value = false
}

const handleListChange = (dat: XMMatch[] | null, isLoad?: boolean) => {
  if (!dat) return
  if (dat.length <= page.value * pageSize.value) finished.value = true
  else finished.value = false
  const val = dat.slice(0, page.value * pageSize.value)
  const cc = (page.value - 1) * pageSize.value
  val.forEach((item, index) => {
    if (sortType.value === 0) {
      item.groupKey = item.tn + item.mgt
    } else if (sortType.value === 2) {
      if (item.prob) {
        item.groupKey = item.tn + item.prob
      } else {
        item.groupKey = `${item.tn}0`
      }
    } else {
      item.groupKey = item.tn
    }
    if (isLoad && !openAll.value && index >= cc && !foldList.value.includes(item.groupKey)) {
      foldList.value.push(item.groupKey)
    }
    transformScore(item)
  })
  // 以赛事类别进行分组
  const groupArr = groupBy(val, (item: XMMatch) => item.csna, 'csna')
  const arr = groupArr.map(item => {
    let result: Partial<IXmResultData> = {}
    const idList = item.list.map((temp: any) => temp.mid)
    if (xmStore.isZaoPan) {
      const nList: XMMatch[] = JSON.parse(JSON.stringify(item.list))
      let a = 0
      const newArrl: XMMatch[] = []
      nList.forEach(match => {
        a++
        if (match.hps.length > 0) {
          match.hps.forEach(hp => {
            if (hp.hl && JSON.stringify(hp.hl[0]) === '{}') {
              hp.hl = []
            } else if (hp.hpid === '1' && hp.hl[0] && hp.hl[0].ol && hp.hl[0].ol.length === 3) {
              const al1 = hp.hl[0].ol
              const [a1, b1, c1] = al1
              const al = [a1, c1, b1]
              hp.hl[0].ol = al
            }
          })
        }
        newArrl.push(match)
      })
      const newArrls: XMMatch[] = []
      newArrl.forEach(matches => {
        if (matches.hps.length > 0) {
          const cArr = []
          matches.hps.forEach(hpd => {
            if (hpd.hpid === '1' && hpd.hl[0]) {
              for (let i = 0; i < 3; i++) {
                const lt = filterWinLose(hpd, i)
                matches.hps.push(lt)
              }
            }
          })
        }
        newArrls.push(matches)
      })
      const number = a
      const list: any = groupByKey(newArrls, (temp: any) => ({groupkey: temp.groupKey, name: temp.tn}))
      result = {
        ...item,
        list,
        idList,
        number
      }
    } else {
      const number = item.list.length
      const tp = JSON.parse(JSON.stringify(item.list))
      const newArr: XMMatch[] = []
      tp.forEach((match: XMMatch) => {
        if (match.hps.length > 0) {
          match.hps.forEach((hp, hpIdx) => {
            if (hp.hl && JSON.stringify(hp.hl[0]) === '{}') {
              hp.hl = []
            } else if (hp.hpid === '1' && hp.hl[0] && hp.hl[0].ol && hp.hl[0].ol.length === 3) {
              const al1 = hp.hl[0].ol
              const [a1, b1, c1] = al1
              const al = [a1, c1, b1]
              hp.hl[0].ol = al
            }
          })
        }
        newArr.push(match)
      })
      const newArrs: XMMatch[] = []
      newArr.forEach((matchs, idx) => {
        if (matchs.hps.length > 0) {
          matchs.hps.forEach((hpd, hpIdx) => {
            if (hpd.hpid === '1' && hpd.hl[0]) {
              for (let i = 0; i < 3; i++) {
                const lt = filterWinLose(hpd, i)
                matchs.hps.push(lt)
              }
            }
          })
        }
        newArrs.push(matchs)
      })
      const list: any = groupByKey(newArrs, (temp: any) => ({ groupKey: temp.groupKey, name: temp.tn }))
      result = {
        ...item,
        list,
        idList,
        number,
      }
    }
    return result
  })
  const newData = arr
  newData.forEach((r) => {
    r.list?.forEach((l) => {
      l.collect = !l.list.some(t => !t.mf)
      l.tid = l.list[0].tid
    })
  })
  resultData.value = newData as IXmResultData[]
  const showSquare = LocalStorage.getItem('showRules')
  if (showSquare !== true) {
    closeModel(false)
    userStore.$patch(state => state.showGuide = false)
    guideModelShow.value = true
  }
}

const filterWinLose = (ids: XMPlay, id: number) => {
  const newDs = JSON.parse(JSON.stringify(ids))
  const arrs = newDs.hl[0].ol
  const arrz = newDs.hl[0]

  if (id === 0) {
    arrs.forEach((ols: XMPlayOpts) => {
      if (ols.on === '主胜' || ols.onb === '主胜') {
        newDs.hpnb = '主胜'
        arrz.ol = [ols]
        newDs.hl[0] = arrz
      }
    })
  }
  if (id === 1) {
    arrs.forEach((ols: XMPlayOpts) => {
      if (ols.on === '平局' || ols.onb === '平局') {
        newDs.hpnb = '平局'
        arrz.ol = [ols]
        newDs.hl[0] = arrz
      }
    })
  }
  if (id === 2) {
    arrs.forEach((ols: XMPlayOpts) => {
      if (ols.on === '客胜' || ols.onb === '客胜') {
        newDs.hpnb = '客胜'
        arrz.ol = [ols]
        newDs.hl[0] = arrz
      }
    })
  }
  return newDs
}

const closeModel = (tf: boolean) => {
  modelShow.value = tf
}

const matchFold = (tn: string) => {
  const index = foldList.value.indexOf(tn)
  if (index !== -1) {
    foldList.value.splice(index, 1)
  } else {
    foldList.value.push(tn)
    onLoad()
  }
  handleMatchesScroll()
}

const onLoad = () => {
  setTimeout(() => {
    page.value++
    loading.value = true
    if ((filterData.value ?? []).length <= page.value * pageSize.value) finished.value = true
    else finished.value = false
    if (!finished.value) {
      nextTick(() => {
        const lh = (document.querySelector('.match-list-container') as HTMLDivElement).offsetHeight
        const ch = window.screen.height - (document.querySelector('.sticky') as HTMLDivElement).offsetHeight - (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight
        if (lh <= ch) {
          onLoad()
        }
      })
    }
  })
}

const handleMatchesScroll = () => {
  emits('scroll')
  if (!finished.value) {
    clearTimeout(btimer)
    btimer = setTimeout(() => {
      const el = document.querySelector('.sdy-spinner') as HTMLDivElement
      if (el) {
        if (!isElementNotInViewport(el)) onLoad()
      }
    }, 30)
  }
  nextTick(() => {
    if (timer) clearTimeout(timer)
    const elarr = document.querySelectorAll('.sdy-collapse')
    elarr.forEach((ele, idx) => {
      if (isElementNotInViewport(ele as HTMLDivElement)) {
        ele.classList.add('not-in-view')
      } else {
        ele.classList.remove('not-in-view')
      }
    })
  })
}

const isElementNotInViewport = (el: HTMLDivElement) => {
  const rect = el.getBoundingClientRect()
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0
}

const closeGuideModel = () => {
  closeModel(true)
  guideModelShow.value = false
}

const getIcon = (match: XMMatch) => {
  const { play, mmp } = match
  const icons: any = { 1: ['vid', 'vida'], '0,1': ['ain', 'aina'] }
  return play && (icons[play.slice(2, 3)] || icons[play.slice(2, 5)] || [])[+mmp > 0 ? 1 : 0]
}

const showFullPlay = (match: XMMatch, isicon?: boolean) => {
  isicon ? (+match.mmp > 0 && saveTabInfo(match)) : saveTabInfo(match)
}

const saveTabInfo = (match: XMMatch) => {
  LocalStorage.set('sportsTabInfo', `${tabIndex.value},${subIndex.value} ${_euid.value}`)
  isOpen.value = true
  fullMatch.value = match
  clearInterval(matchTimer)
}

const formatMgtDate = (match: XMMatch) => {
  return dayjs(Number(match.mgt)).format('MM-DD HH:mm')
}

const formatMmp = (match: XMMatch, tg?: number) => {
  const { csid, mmp } = match
  const rslt = (MATCH_STAGE as any)[csid][mmp] || ''
  return (tg && getIcon(match) && rslt.length > 3) ? '' : rslt
}

const showTime = (match: XMMatch) => {
  const mmp = +match.mmp
  const mst = +match.mst
  const csid = +match.csid
  console.log(mmp, mst, csid)
  let s = [0]
  if (mst > 0) {
    switch (csid) {
      case 1:
        s = [6, 7, 41, 42, 50]
        return s.includes(mmp)
      case 4:
        s = [1, 2, 3, 40, 50]
        return s.includes(mmp)
      case 2:
        s = [1, 2, 13, 14, 15, 16, 40]
        return s.includes(mmp)
      case 6:
        s = [13, 14, 15, 16, 40]
        return s.includes(mmp)
      default:
        break
    }
  }
  return false
}
/*
  * 原生投注 游戏列表 信息展示优化 - 对应需求869
  * item {Array} 判断是否需要显示，显示结果的数据
  * type {String} 角球数 半场比分 全场比分
  * name {String} 上半场 / 下半场 名字
  * @result {false | '11-1'} 不应该显示，返回 false / 应该显示，返回对应比分；
  */
const infoOptimization = (item: string[], type: string, name = '') => {
  let result = ''
  if (!(item instanceof Array)) {
    return ''
  }
  if (item.length === 0) {
    return ''
  }
  if (type === '角球数') {
    for (let i = 0, len = item.length; i < len; i++) {
      if (item[i].indexOf('S5|') > -1) {
        const [sName, scoreVal] = item[i].split('|')
        result = scoreVal
        if (result.indexOf(':') > -1) {
          result = result.replace(':', '-')
        }
        return result
      }
    }
  }
  if (type === '半场比分') {
    let searchName = ''
    if (name.indexOf('上半场') === -1 && name.indexOf('下半场') === -1 && name.indexOf('中场休息') === -1) return ''
    searchName = 'S2|'
    for (let i = 0, len = item.length; i < len; i++) {
      if (item[i].indexOf(searchName) > -1) {
        const [sName, scoreVal] = item[i].split('|')
        result = scoreVal
        if (result.indexOf(':') > -1) {
          result = result.replace(':', '-')
        }
        return result
      }
    }
  }
  if (type === '全场比分') {
    for (let i = 0, len = item.length; i < len; i++) {
      if (item[i].indexOf('S1|') > -1) {
        const [sName, scoreVal] = item[i].split('|')
        result = scoreVal
        return result
      }
    }
  }
  return result
}
</script>
