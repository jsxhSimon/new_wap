<template>
  <div class="shab-sports">
    <div class="sticky" v-show="!showFilter">
      <div class="match-tabs new-match-tabs sdy-border-bottom" :class="{'click-disabled': disabledMenu}">
        <div class="tabs flex flex-center">
          <div class="tabs-wrap">
            <template v-for="(tab, idx) in tabs" :key="tab.name">
              <div
                class="tab"
                :class="{active: tabIndex === idx}"
                @click="handleChangeTab(idx)"
              >
                <span class="tab-cnt">
                  {{ $t(tab.name) }}
                  <i class="count">{{ tab.count }}</i>
                </span>
              </div>
            </template>
          </div>
        </div>
        <div class="sport-menu">
          <swiper
            slides-per-view="auto"
            class="sport-menu-swiper"
            v-if="activeMenu.menuL2s"
            :key="activeMenu.name && (activeMenu.menuL2s || []).length"
          >
            <swiper-slide
              v-for="(item, idx) in activeMenu.menuL2s.filter((item: any) => item.count > 0 || item.count === undefined)"
              :key="item.sportName"
            >
              <div @click="handleClick(idx)">
                <!-- <div class="sdy-icon" :class="[getIconCls(item.sportName || item.gameName), {active: idx === subIndex}]">
                  <span class="count">{{ item.count }}</span>
                </div> -->
                <div class="sport-name" :class="{'act': idx === subIndex}">
                  {{ (item.sportName || item.gameName) === 'Others' ? $t('其他') : $t(item.sportName || item.gameName) }}({{item.count||0}})
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
    <div class="match-list-container" v-show="!showFilter">
      <div class="matches-wrapper" ref="matchModel">
        <div class="is-empty" v-show="canShowEmpty && !resultData.length"></div>
        <Skeleton v-show="showSkeleton" />
        <div class="sport-group-container" :style="sportGroupStyle">
          <template v-if="sbStore.isYsgj">
            <div class="sport-group is-ysgj" :class="{'is-closed': foldList.includes(ysgj.sportName)}" v-for="ysgj in ysgjList" :key="ysgj.sportType" v-show="!showSkeleton">
              <div class="sport-header">
                <div class="left">{{$t(ysgj.sportName)}}({{ysgj.count}})</div>
                <div class="right" @click="matchFold(ysgj.sportName)">{{foldList.includes(ysgj.sportName) ? $t('展开') : $t('收起')}}</div>
              </div>
              <div class="sport-content">
                <sdy-collapse
                  v-for="t in ysgj.outrights"
                  :key="t.leagueId"
                  v-show="t.teams && t.teams.length"
                  :close="foldList.includes(t.leagueName)"
                >
                  <template #header>
                    <div class="match-header flex" @click="matchFold(t.leagueName)">
                      <div class="league-title flex">
                        <sdy-image class="m-r-10" src="" :height="32" />
                        <div class="league-name">{{ t.leagueName }}</div>
                      </div>
                      <div class="flex flex-center">
                        <span class="m-r-10">{{t.teams.length}}</span>
                        <span class="sdy-icon sdy-icon-unfold"></span>
                      </div>
                    </div>
                  </template>
                  <template #content>
                    <div class="sport-game" v-for="sport in t.teams" :key="sport.orid">
                      <div class="sport-name">
                        {{ sport.teamName }}
                      </div>
                      <div v-if="sport.oddsStatus === 'running'" class="sport-odd" :class="sport.className" @click="selectYsgj(t, sport)">
                        {{ sport.price }}
                      </div>
                      <div v-else class="sport-odd">
                        <van-icon name="lock" />
                      </div>
                    </div>
                  </template>
                </sdy-collapse>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="sport-group" v-for="c in resultData" :key="c.sportName" v-show="!showSkeleton">
              <sdy-collapse
                v-for="t in c.list"
                :key="t.groupKey"
                v-show="t.list.length"
                :close="foldList.includes(t.groupKey)"
                :tid="t.leagueId.toString()"
              >
                <template #header>
                  <div class="match-header flex" @click="matchFold(t.groupKey)">
                    <div class="league-title flex">
                      <sdy-image class="m-r-10" src="" :height="32" />
                      <div class="league-name">{{ t.name }}</div>
                    </div>
                    <div class="flex flex-center">
                      <span class="m-r-10">{{t.list.length}}</span>
                      <span class="sdy-icon sdy-icon-unfold"></span>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="match-item" v-for="item in t.list" :key="item.evnetId">
                    <div class="match-item-wrapper">
                      <div class="match-item-hd">
                        <div class="match-item-hd-left" v-if="sbStore.isZaoPan">
                          <span class="m-r-10 zaopan">
                            <span v-if="item.globalShowTime2 || item.globalShowTime">{{formatMgtDate(item)}}</span>
                          </span>
                        </div>
                        <div class="match-item-hd-left" :class="{'has-img': getIcon(item)}" v-if="!isZaoPan">
                          <div class="m-r-10 item_flex icon_item">
                            <div v-if="getIcon(item)" class="game-icon" @click="showFullPlay(item, !isZaoPan)" :class="getIcon(item)"></div>
                            <span>
                              {{ showTime(item) ? formatMmp(item) : formatMgtDate(item) }}
                            </span>
                          </div>
                          <span v-if="showTime(item) && canShowTime && !['中场休息', '延迟开赛'].includes(formatMmp(item))" class="m-r-15 item_flex">
                            <van-icon name="underway-o" class="m-r-2" />
                            <span v-if="formatMmp(item) === '中场休息'">{{formatTime(item)}}</span>
                            <CountDown v-else :key="`${item.eventId}-${item.gameInfo.seconds}-${hideCount}`" :reverse="item.gameInfo.clockDirection === 'dec'" :time="item.gameInfo.seconds"></CountDown>
                          </span>
                        </div>
                        <div class="match-item-hd-right" v-if="isSbty === 2 && activeMenu.name === '滚球'">
                          <div v-for="betName in getRunnningIds(item)" :key="betName">
                            <p>{{ betName }}</p>
                          </div>
                        </div>
                        <div class="match-item-hd-right" v-else>
                          <div v-for="betName in betTypeNames" :key="betName">
                            <p>{{ betName }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="match-item-bd">
                        <div class="match-item-bd-left">
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.teamInfo.homeIconUrl" :key="item.eventId + item.teamInfo.homeName" :height="40" />
                            <div class="team-name">{{item.teamInfo.homeName}}</div>
                            <div class="score-value" v-if="showTime(item)">{{item.gameInfo.liveHomeScore}}</div>
                          </div>
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.teamInfo.awayIconUrl" :key="item.eventId + item.teamInfo.awayName" :height="40" />
                            <div class="team-name">{{item.teamInfo.awayName}}</div>
                            <div class="score-value" v-if="showTime(item)">{{item.gameInfo.liveAwayScore}}</div>
                          </div>
                          <div class="collect flex">
                            {{item.marketCount ? `${item.marketCount}+` : 0}}
                            <!--足球-->
                            <div class="match-item-top-right" v-if="!isZaoPan && item.sportName === '足球' && item.awayCorner != undefined">
                              <div class="jiao-qiu" v-if="item.awayCorner != undefined">
                                <span class="jiao-qiu-icon"></span>
                                {{ item.homeCorner }} - {{ item.awayCorner }}
                              </div>
                              <div class="half-score" v-if="item.awayHalfScore != undefined">
                                <span class="half-score-ht">HT</span>
                                {{ item.homeHalfScore }} - {{ item.awayHalfScore }}
                              </div>
                            </div>
                            <!--篮球-->
                            <div class="match-item-top-right" v-if="!isZaoPan && item.sportName === '篮球' && item.awayHalfScore != undefined">
                              <div class="half-score"  v-if="item.awayHalfScore != undefined">
                                <span class="half-score-ht">HT</span>
                                {{ item.homeHalfScore }} - {{ item.awayHalfScore }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="match-item-bd-right">
                          <div class="odd-column" v-for="(market, idx) in getMarkets(item)" :key="idx">
                            <template v-if="market && market.selections.length">
                              <template
                                v-for="odd in market.selections"
                              >
                                <div
                                  class="odd-column-item"
                                  :class="{'odd-column-item__active': getIsActive(market, odd), [odd.className]: !!odd.className}"
                                  :key="odd.key"
                                  @click="selectMatch(item, market, odd)"
                                  v-if="market.marketStatus === 'running'"
                                >
                                  <div>{{getOddName(odd, market.betTypeName, item)}}</div>
                                  <span>{{odd.oddsPrice.decimalPrice}}</span>
                                </div>
                                <div class="odd-column-item" :key="odd.key" v-else>
                                  <div>
                                    <van-icon name="lock" />
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <div class="odd-column-item">-</div>
                              <div class="odd-column-item">-</div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </sdy-collapse>
            </div>
          </template>
        </div>
        <div class="sdy-spinner" v-show="!showSkeleton && !finished">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        <div class="list-finished" v-show="!showSkeleton && finished">
          {{ $t('没有更多赛事了') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SbMenu, IResultData, SbMatch, SbYsgj, ISbYsgjBetData, ILeagueFollow } from 'src/types/sports'
import { useSbStore } from 'src/stores'
import { useI18n } from 'vue-i18n'
import Stomp from 'stompjs'
import cnchar from 'cnchar'
import { betTypeNameMap } from 'src/utils/sbtyBetType'

const weekMap: any = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}

const { t: lang} = useI18n()

const sbStore = useSbStore()
const showFilter = ref(false)
const menus = ref<SbMenu[]>([])
const tabIndex = ref(0)
const subIndex = ref(0)
const canShowEmpty = ref(false)
const showSkeleton = ref(false)
const resultData = ref<IResultData<SbMatch>[]>([])
const sportGroupStyle = ref('')
const foldList = ref<string[]>([])
const ysgjList = ref<SbYsgj[]>([])
const page = ref(1)
const pageSize = ref(15)
const loading = ref(false)
const list = ref<SbMatch[]>([])
const finished = ref(false)
const showCalendar = ref(false)
const openAll = ref(false)
const range = ref<string[]>([])
const betData = ref([])
const ysgjBetData = ref<ISbYsgjBetData | null>(null)
const orderStatus = ref('')
const betResult = ref({})
const showSucData = ref(false)
const betAmount = ref('')
const winMoney = ref('')
const stompClient = ref<any>(null)
const stompConnected = ref(false)
const stompList: any = reactive({
  sbob_event_add: null,
  sbob_event_remove: null,
  sbob_event_update: null,
  sbob_market_add: null,
  sbob_market_remove: null,
  sbob_market_update: null,
  sbob_selection_add: null,
  sbob_selection_remove: null,
  sbob_odds_update: null,
  sbob_outright_add: null,
  sbob_outright_update: null,
  sbob_outright_remove: null,
})
const selectLeagues = ref<string[]>([])
const checkbox = ref<string[]>([])
const sortButtons = [
  { label: lang('时间'), type: 0 },
  { label: lang('联赛'), type: 1 },
]
const sortType = ref(0)
const searchwd = ref('')
const hideCount = ref(0)
const checkboxListHeight = ref(0)
const checkboxItemHeight = ref(0)
const isFollow = ref(false)
const lfList = ref<ILeagueFollow[]>([])
const gotoLeagueId = ref('')
const findLeagueToast = ref<any>(null)

let scrollEl = null
let btimer: any = null
let timer: any = null
let oddUpdateClassTimer: any = null

const leagueList = computed(() => {
  const leagues: any = {}
  list.value.forEach(item => {
    if (!leagues[item.leagueName] && item.leagueName.includes(searchwd.value)) {
      leagues[item.leagueName] = {
        name: item.leagueName,
        index: item.leagueInitials || cnchar.spell(item.leagueName).slice(0, 1),
        id: item.leagueId,
      }
    }
  })
  return Object.values(leagues)
})

const leagueIndexBar = computed(() => {
  const data: any = {}
  leagueList.value.forEach((item: any) => {
    if (data[item.index]) {
      data[item.index].list.push(item)
    } else {
      data[item.index] = {
        list: [item],
      }
    }
  })
  return data
})

const legueIndexList = computed(() => {
  return Object.keys(leagueIndexBar.value).sort((a, b) => a.localeCompare(b))
})

const tabs = computed(() => {
  let arr: any = menus.value
  if (!arr.length) {
    arr = [
      {
        name: '滚球',
        menuL2s: [
          {
            sportName: '足球',
          },
        ],
      },
      { name: '今日' },
      { name: '早盘' },
      { name: '串关' },
    ]
  }
  return arr
})

const activeMenu = computed(() => {
  return tabs.value[tabIndex.value]
})

const activeSubMenu = computed(() => {
  return tabs.value[tabIndex.value].menuL2s[subIndex.value]
})

const marketIds = computed(() => {
  return sbStore.betData.map(item => item.market.marketId).join(',')
})

const disabledMenu = computed(() => {
  return Object.keys(menus.value[0] || {}).length <= 2
})

const selectOddStr = computed(() => {
  return sbStore.betData.map(item => `${item.market.eventId}-${item.market.marketId}-${item.odd.key}-`).join(',')
})

const betTypeIds = computed(() => {
  if (sbStore.gameType === 2) {
    if (activeMenu.value.name === '滚球') {
      return ['9001,1', '9001,2', '9001,3', '9001,4', '9001,5', '9001,6', '9001,7', '9001,8', '9001,9', '9001,10', '9001,11', '9001,12', '9001,13', '9001,14', '9001,15', '9001,16', '9001,17', '9001,18', '9001,19', '9001,20']
    }
    return [20, 1, 3]
  }
  if (activeSubMenu.value && activeSubMenu.value.sportType) {
    return getBetTypesBySportType(activeSubMenu.value.sportType)
  }
  return []
})

const betTypeNames = computed(() => {
  if (betTypeIds.value.length) {
    return betTypeIds.value.map((item: number) => betTypeNameMap[item])
  }
  return []
})

const canShowTime = computed(() => {
  if (activeSubMenu.value && '1,2,43'.indexOf(activeSubMenu.value.sportType) !== -1) {
    return true
  }
  return false
})

const dateList = computed(() => {
  let arr: {value: string; text: string; week: string;}[] = []
  if (sbStore.isZaoPan && activeSubMenu.value) {
    arr = [
      {
        value: '',
        text: '全部',
        week: activeSubMenu.value.count,
      },
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

const leagueFollowIds = computed(() => {
  return (lfList.value || []).map(item => item.leagueId.toString())
})

const filterData = () => {
  let arr: SbMatch[] = list.value.concat([])
  if (selectLeagues.value.length) {
    arr = arr.filter(item => selectLeagues.value.includes(item.leagueName))
  }
  if (range.value.length) {
    arr = arr.filter(item => range.value.includes(dayjs(item.globalShowTime2 || item.globalShowTime).format('YYYY-MM-DD')))
  }
  if (sortType.value === 0) {
    arr.sort((a, b) => a.globalShowTime2 - b.globalShowTime2)
  } else {
    arr.sort((a, b) => b.leagueSort - a.leagueSort)
  }
  if (leagueFollowIds.value.length) {
    arr.sort((a, b) => ((a.leagueId !== b.leagueId && leagueFollowIds.value.includes(a.leagueId.toString())) ? -1 : 0))
  }
  return arr
}

const checkboxListPaddingBottom = () => {
  const attr = Object.keys(leagueIndexBar.value).sort((a, b) => a.localeCompare(b)).slice(-1)[0]
  const h = checkboxItemHeight.value || 45
      return checkboxListHeight.value - Math.ceil(h * (leagueIndexBar.value[attr] ? leagueIndexBar.value[attr].list.length : 1)) + 3
}

watch(
  () => searchwd.value,
  () => {
    const el = document.querySelector('.checkbox-list')
    if (el) el.scrollTop = 0
  }
)

watch(
  () => sbStore.gameType,
  (val) => {
    if (val) {
      const attr = val === 2 ? 'esport' : 'shab'
      menus.value = val === 2 ? sbStore.esportMenuCache : sbStore.shabMenuCache
      if (!lfList.value) {
        sbStore.getListBetLeagueCollect({
          matchType: 11,
        }).then((data) => {
          this.lfList = data
        })
      }
    }
  }
)

const handleToggle = () => {
  window.shakeApp()
  openAll.value = !openAll.value
}

const getIcon = (item: SbMatch) => {
  const { play } = item
  const icons: any = { 1: ['anc', 'anca'], '0,1': ['vid', 'vida'], '0,0,1': ['ain', 'aina'] }
  return play && (icons[play[0]] || icons[play.slice(0, 3)] || icons[play] || [])[showTime(item) ? 1 : 0]
}

const handleMatchesSortClick = (type: number, sync?: boolean) => {
  window.shakeApp()
  handleMatchesSort(type, sync)
}

const handleMatchesSort = (type: number, sync?: boolean) => {
  sortType.value = type
  if (!sync) {
    openAll.value = true
  }
}

const createStomp = () => {
  const { brokerURL, login, passcode } = JSON.parse(process.env.APP_PRE_STOMP_CONFIG!)
  const prefix = window.location.origin.startsWith('htpp:') ? 'ws:' : 'wss:'
  stompClient.value = Stomp.client(`${prefix}${brokerURL}`)
  stompClient.value.debug = null
  stompClient.value.connect(login, passcode, stompOnConnect)
}

const stompOnConnect = () => {
  stompClient.value.subscribe(`/topic/sbob${sbStore.gameType === 2 ? '_es' : ''}_menu`, handleMessage)
  stompClient.value.subscribe(`/topic/betId_match_Result_${process.env.APP_CODE}`, handleMessage)
  stompConnected.value = true
  Object.keys(stompList).forEach((key) => {
    if (sbStore.gameType === 2 && key.indexOf('sbob_es_') === -1) key = key.replace('sbob_', 'sbob_es_')
    if (stompList[key] === 0) stompList[key] = stompClient.value.subscribe(`/topic/${key}_${tabIndex.value + 1}_${sbStore.gameType === 2 ? activeSubMenu.value.gameId : this.activeSubMenu.sportType}`, this.handleMessage)
  })
}

const handleChangeTab = (idx: number) => {
  window.shakeApp()
  tabIndex.value = idx
  subIndex.value = 0
  const type = idx === 0 ? 0 : 1
  sbStore.$patch(state => state.matchType = type)
}

const handleClick = (idx: number) => {
  window.shakeApp()
  subIndex.value = idx
}

const matchFold = (leagueName: string) => {
  const index = foldList.value.indexOf(leagueName)
  if (index !== -1) {
    foldList.value.splice(index, 1)
  } else {
    foldList.value.push(leagueName)
    onLoad(true)
  }
  handleMatchesScroll()
}

const onLoad = (deep?: boolean) => {
  setTimeout(() => {
    page.value++
    loading.value = false
    if (list.value.length <= page.value * pageSize.value) finished.value = true
    else finished.value = false
    handleListChange(list.value, true)
    if (deep && !finished.value) {
      nextTick(() => {
        const lh = (document.querySelector('.match-list-container') as HTMLDivElement).offsetHeight
        const ch = window.screen.height - (document.querySelector('.sticky') as HTMLDivElement).offsetHeight - (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight
        if (lh <= ch) {
          onLoad(true)
        }
      })
    }
  }, 0)
}

</script>
