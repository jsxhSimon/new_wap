<template>
  <div class="shab-sports">
    <div class="sticky" v-show="!showFilter">
      <div class="match-tabs new-match-tabs sdy-border-bottom" :class="{'click-disabled': disabledMenu}">
        <div class="tabs flex align-center">
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
                  {{ (item.sportName || item.gameName) === 'Others' ? $t('其他') : (item.sportName || item.gameName) }}({{item.count||0}})
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="utils flex justify-between" v-show="!sbStore.isYsgj">
        <div class="flex align-center" @click="handleToggle()">
          <span class="iconfont mr-4 icon-shuangyoujiantou-" :class="openAll ? 'sdy-icon-up' : 'sdy-icon-down'"/>
          {{ openAll ? '收起' : '展开' }}
        </div>
        <div class="flex align-center sort-buttons">
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
        <div class="flex align-center" v-if="!sbStore.isYsgj">
          <span class="iconfont icon-rili mr-10" v-if="sbStore.isZaoPan" @click="showCalendar = !showCalendar"/>
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
                        <sdy-image class="mr-10" src="" :height="32" />
                        <div class="league-name">{{ t.leagueName }}</div>
                      </div>
                      <div class="flex align-center">
                        <span class="mr-10">{{t.teams.length}}</span>
                        <span class="iconfont icon-xiangyou1  sdy-icon-unfold"></span>
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
                      <sdy-image class="mr-10" src="" :height="32" />
                      <div class="league-name">{{ t.name }}</div>
                    </div>
                    <div class="flex align-center">
                      <span class="mr-10">{{t.list.length}}</span>
                      <span class="iconfont icon-xiangyou1  sdy-icon-unfold"></span>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="match-item" v-for="item in t.list" :key="item.eventId">
                    <div class="match-item-wrapper">
                      <div class="match-item-hd">
                        <div class="match-item-hd-left" v-if="sbStore.isZaoPan">
                          <span class="mr-10 zaopan">
                            <span v-if="item.globalShowTime2 || item.globalShowTime">{{formatMgtDate(item)}}</span>
                          </span>
                        </div>
                        <div class="match-item-hd-left" :class="{'has-img': getIcon(item)}" v-if="!sbStore.isZaoPan">
                          <div class="mr-10 item_flex icon_item">
                            <div v-if="getIcon(item)" class="game-icon" @click="showFullPlay(item)" :class="getIcon(item)"></div>
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
                        <div class="match-item-hd-right" v-if="sbStore.gameType === 2 && activeMenu.name === '滚球'">
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
                            <div class="match-item-top-right" v-if="!sbStore.isZaoPan && item.sportName === '足球' && item.awayCorner != undefined">
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
                            <div class="match-item-top-right" v-if="!sbStore.isZaoPan && item.sportName === '篮球' && item.awayHalfScore != undefined">
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
                                <div class="odd-column-item" v-else :key="odd.key">
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
    <div class="sports-league-filter" v-show="showFilter || gotoLeagueId">
      <template v-if="!isFollow">
        <div class="title flex">
          <span class="iconfont icon-xiangzuo1 sdy-icon-left" @click="showFilter = false"></span>
          联赛{{checkbox.length}}/{{leagueList.length}}
          <span class="follow-btn" @click="isFollow = true">关注</span>
        </div>
        <div class="search"><img src="~pages/sports/images/search.png"><input type="text" v-model="searchwd" placeholder="请输入联赛名称"><i @click="saveSelect">搜索</i></div>
        <div class="btn-list">
          <div>
            <span class="mr-10" @click="selectAll">全选</span>
            <span @click="closeAll">反选</span>
          </div>
          <span class="save" :class="{active: checkbox.length > 0}" @click="saveSelect">完成</span>
        </div>
        <div class="checkbox-list">
          <van-index-bar :index-list="legueIndexList" :style="{paddingBottom: `${checkboxListPaddingBottom}px`}">
            <div class="index-bar-view" v-for="key in legueIndexList" :key="key">
              <van-index-anchor :index="key" />
              <div class="checkbox-item" v-for="league in leagueIndexBar[key].list" :key="league.name" @click="handleCheckboxClick(league)">
                <div class="league-name flex">
                  <sdy-image src="" :height="32" />
                  <span class="ml-10">{{ league.name }}</span>
                </div>
                <div class="action">
                  <van-icon :name="(leagueFollowIds || []).includes(league.id.toString()) ? 'star' : 'star-o'" @click.stop="followLeague(league)" />
                  <span class="iconfont icon-xuanze" :class="{'sdy-icon icon-xuanze1': checkbox.includes(league.name)}"></span>
                </div>
              </div>
            </div>
          </van-index-bar>
        </div>
      </template>
      <template v-else>
        <div class="follow-list">
          <div class="title flex">
            <span class="sdy-icon sdy-icon-left" @click="isFollow = false"></span>
            <span class="follow-title">关注</span>
          </div>
          <div class="checkbox-list">
            <div class="checkbox-item" v-for="league in lfList" :key="league.leagueName" @click="goFollowLeague(league)">
              <div class="league-name flex">
                <sdy-image src="" :height="32" />
                <span class="m-l-10">{{ league.leagueName }}</span>
              </div>
              <div class="action">
                <van-icon :name="leagueFollowIds.includes(league.leagueId.toString()) ? 'star' : 'star-o'" @click.stop="followLeague(league)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, computed, reactive, onBeforeMount, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SbMenu, IResultData, SbMatch, SbYsgj, ISbYsgjBetData, ILeagueFollow, SbSubMenu, ISbBetData, ISbMarket, SbYsgjOutright, ISbYsgjTeam, ISbOdd } from 'src/types/sports'
import { useSbStore, useSptvStore, usePayStore } from 'src/stores'
import { useI18n } from 'vue-i18n'
import Stomp from 'stompjs'
import cnchar from 'cnchar'
import { betTypeNameMap, getBetTypesBySportType, formatMmp } from 'src/utils/sbtyBetType'
import { cloneDeep, groupBy, groupByKey } from 'src/utils'
import { SessionStorage, Notify } from 'quasar'
import bus from 'boot/bus'
import { Toast, Icon as VanIcon } from 'vant'
import { useRouter } from 'vue-router'
import Skeleton from 'components/Skeleton/index.vue'
import SdyCollapse from '../SdyCollapse.vue'
import SdyImage from 'components/SdyImage.vue'
import CountDown from '../CountDown.vue'

interface Props {
  scrollFixed: boolean;
  isOpenDetail: boolean;
  openMatch: SbMatch | null;
}

const props = defineProps<Props>()
const emit = defineEmits(['open', 'scroll'])

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
const sptvStore = useSptvStore()
const router = useRouter()
const payStore = usePayStore()
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
const betData = ref<ISbBetData[]>([])
const ysgjBetData = ref<ISbYsgjBetData | null>(null)
const orderStatus = ref<string | number>('')
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
const gotoLeagueId = ref<number | string>('')
const findLeagueToast = ref<any>(null)

let scrollEl: HTMLDivElement | null = null
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

const activeMenu = computed<SbMenu>(() => {
  return tabs.value[tabIndex.value]
})

const activeSubMenu = computed<SbSubMenu>(() => {
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
    return betTypeIds.value.map((item: any) => betTypeNameMap[item])
  }
  return []
})

const canShowTime = computed(() => {
  if (activeSubMenu.value && '1,2,43'.indexOf(activeSubMenu.value.sportType.toString()) !== -1) {
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
        week: activeSubMenu.value.count.toString(),
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

const filterData = computed(() => {
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
})

const checkboxListPaddingBottom = computed(() => {
  const attr = Object.keys(leagueIndexBar.value).sort((a, b) => a.localeCompare(b)).slice(-1)[0]
  const h = checkboxItemHeight.value || 45
      return checkboxListHeight.value - Math.ceil(h * (leagueIndexBar.value[attr] ? leagueIndexBar.value[attr].list.length : 1)) + 3
})

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
        sptvStore.getListBetLeagueCollect({
          matchType: 11,
        }).then((data) => {
          lfList.value = data
        })
      }
    }
  },
  {
    immediate: true
  }
)

watch(
  () => showFilter.value,
  (val) => {
    nextTick(() => {
      if (!checkboxListHeight.value) checkboxListHeight.value = (document.querySelector('.sports-league-filter .checkbox-list') as HTMLDivElement).offsetHeight
      if (!checkboxItemHeight.value) {
        const elArr: any = document.querySelectorAll('.sports-league-filter .checkbox-list .checkbox-item')
        if (elArr.length > 1) {
          const [a, b] = elArr
          checkboxItemHeight.value = Math.abs(a.getBoundingClientRect().top - b.getBoundingClientRect().top)
        }
      }
      setTimeout(() => {
        (document.querySelector('.checkbox-list') as HTMLDivElement).scrollTop = 4
      }, 200)
    })
  }
)

watch(
  () => openAll.value,
  (val) => {
    if (val) {
      foldList.value = []
    } else {
      const arr: string[] = []
      resultData.value.forEach(item => {
        item.list.forEach(t => {
          arr.push(t.groupKey)
        })
      })
      foldList.value = arr
      onLoad(true)
    }
  }
)

watch(
  () => marketIds.value,
  (val) => {
    const len = val.split(',').length
    sbStore.$patch(state => {
      state.betTypes = len >= 2 ? cloneDeep(sbStore.betTypeList[len]) : []
    })
  }
)

watch(
  () => activeSubMenu.value,
  (val, old) => {
    if (val && val.parentId !== undefined) {
      SessionStorage.set('matchTabData', `${sbStore.gameType},${tabIndex.value},${subIndex.value}`)
      if (!old || (old && (val.parentId !== old.parentId || val.sportType !== old.sportType || val.gameId !== old.gameId || val.menuLevel !== old.menuLevel))) {
        foldList.value = []
        range.value = []
        selectLeagues.value = []
        openAll.value = true
        Object.keys(stompList).forEach((key) => {
          if (sbStore.gameType === 2 && key.indexOf('sbob_es_') === -1) key = key.replace('sbob_', 'sbob_es_')
          if (stompList[key]) {
            stompList[key].unsubscribe()
            stompList[key] = null
          }
          if (val && val.parentId) {
            if (stompConnected.value) {
              if ((sbStore.isYsgj && key.indexOf('outright') !== -1) || (!sbStore.isYsgj && key.indexOf('outright') === -1)) {
                stompList[key] = stompClient.value.subscribe(`/topic/${key}_${tabIndex.value + 1}_${sbStore.gameType === 2 ? activeSubMenu.value.gameId : activeSubMenu.value.sportType}`, handleMessage)
              }
            } else if ((sbStore.isYsgj && key.indexOf('outright') !== -1) || (!sbStore.isYsgj && key.indexOf('outright') === -1)) {
              stompList[key] = 0
            }
          }
        })
        const scrollH = Math.ceil((document.querySelector('#q-app') as HTMLDivElement).scrollTop)
        const flag = props.scrollFixed
        nextTick(() => {
          const h = (document.querySelector('.tabs-wrap') as HTMLDivElement).getBoundingClientRect().top - (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight;
          (document.querySelector('#q-app') as HTMLDivElement).scrollTop = flag ? h : scrollH
          getMatches()
        })
      }
    } else {
      Object.keys(stompList).forEach((key) => {
        if (sbStore.gameType === 2 && key.indexOf('sbob_es_') === -1) key = key.replace('sbob_', 'sbob_es_')
        if (stompList[key]) {
          stompList[key].unsubscribe()
          stompList[key] = null
        }
      })
      lfList.value = []
      list.value = []
      foldList.value = []
      canShowEmpty.value = true
      finished.value = true
    }
    sbStore.$patch(state => state.activeSubMenu = val || {})
  },
  {
    immediate: true
  }
)

watch(
  () => betData.value,
  (val) => {
    sbStore.$patch(state => {
      if (sbStore.isMultiple && val.length) state.showBetPanel = true
      state.betData = val
    })
  }
)

watch(
  () => ysgjBetData.value,
  (val) => {
    sbStore.$patch(state => {
      if (val) state.showBetPanel = true
      state.ysgjBetData = val
    })
  }
)

watch(
  () => sbStore.showBetPanel,
  (val) => {
    if (val) {
      if (sbStore.isYsgj) {
        doYsgjTicket()
      } else if (sbStore.isMultiple) {
        doParlayTickets()
      } else {
        doSingleTicket()
      }
    } else {
      sbStore.$patch(state => state.ysgjBetData = null)
    }
  }
)

watch(
  () => activeMenu.value,
  (val) => {
    sbStore.$patch(state => state.activeMenu = val)
  }
)

watch(
  () => sbStore.isMultiple,
  (val, old) => {
    if (val !== old) {
      betData.value = []
    }
  }
)

watch(
  () => filterData.value,
  (val) => {
    handleListChange(val ?? [])
  }
)

onBeforeMount(() => {
  const tabArr = (SessionStorage.getItem('matchTabData') as string || '').split(',')
  if (tabArr.length === 3 && Number(tabArr[0]) === sbStore.gameType) {
    tabIndex.value = Number(tabArr[1] || 0)
    subIndex.value = Number(tabArr[2] || 0)
  }
  sbStore.transfer()
    .then(() => {
      if (!sbStore.token) sbStore.getToken()
    })
    sbStore.getSbMenus()
    .then(list => {
      menus.value = list
    })
  })
  
  onMounted(() => {
    bus.on('clearBetData', clearBetData)
    bus.on('sb-bet', sbBet)
    bus.on('set-bet-data', handleSetBetData)
    bus.on('full-play', handleFullPlay)
    bus.on('cancel-bet', handleCancelBet)
    bus.on('isHideChange', handleIsHideChange)
    scrollEl = document.querySelector('#q-app') as HTMLDivElement
    scrollEl.addEventListener('scroll', handleMatchesScroll)
    createStomp()
    clearOddsUpdateClass()
    setTimeout(() => {
      setFilterHieght()
    }, 200)
    setSportGroupHeight()
})

onBeforeUnmount(() => {
  bus.off('clearBetData', clearBetData)
  bus.off('sb-bet', sbBet)
  bus.off('set-bet-data', handleSetBetData)
  bus.off('full-play', handleFullPlay)
  bus.off('cancel-bet', handleCancelBet)
  bus.off('isHideChanget', handleIsHideChange)
  clearBetData()
  clearInterval(oddUpdateClassTimer)
  scrollEl?.removeEventListener('scroll', handleMatchesScroll)
  stompClient.value.disconnect()
})

const handleIsHideChange = () => {
  if (activeSubMenu.value) {
    getMatches(true)
  }
}

const handleSetBetData = (data: any) => {
  betData.value = data
}

const handleFullPlay = (params: any) => {
  const {match, market, odd} = params
  selectMatch(match, market, odd)
}

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
    if (stompList[key] === 0) stompList[key] = stompClient.value.subscribe(`/topic/${key}_${tabIndex.value + 1}_${sbStore.gameType === 2 ? activeSubMenu.value.gameId : activeSubMenu.value.sportType}`, handleMessage)
  })
}

const handleMessage = (message: any) => {
  if (message && message.body) {
    const msg = JSON.parse(message.body)
    const { data } = msg
    if (msg.SBOD && list.value.length) {
      list.value.forEach((match) => {
        const play = []
        const mid = match.eventId.toString()
        const { anc, vid, sco } = msg.SBOD
        play.push(anc.includes(mid) ? 1 : 0)
        play.push(vid.includes(mid) ? 1 : 0)
        play.push(sco.includes(mid) ? 1 : 0)
        match.play = play.join(',')
      })
      return
    }
    // this.menus = JSON.parse(message.body).data.menuL1s
    switch (msg.code) {
      case 'sbob_menu':
      case 'sbob_es_menu':
        sbobMenuChange(data.menuL1s)
        break
      case 'sbob_event_add':
      case 'sbob_es_event_add':
        addMatch(data)
        nextTick(() => {
          handleMatchesScroll()
        })
        break
      case 'sbob_event_remove':
      case 'sbob_es_event_remove':
        removeMatch(data)
        nextTick(() => {
          handleMatchesScroll()
        })
        break
      case 'sbob_event_update':
      case 'sbob_es_event_update':
        updateMatch(data)
        break
      case 'sbob_market_add':
      case 'sbob_es_market_add':
        addMarket(data)
        break
      case 'sbob_market_update':
      case 'sbob_es_market_update':
        updateMarket(data)
        break
      case 'sbob_selection_add':
      case 'sbob_es_selection_add':
        addSelection(data)
        break
      case 'sbob_selection_remove':
      case 'sbob_es_selection_remove':
        removeSelection(data)
        break
      case 'sbob_odds_update':
      case 'sbob_es_odds_update':
        updateOdds(data)
        break
      case 'sbob_outright_add':
        addOutright(data)
        break
      case 'sbob_outright_update':
        updateOutright(data)
        break
      case 'sbob_outright_remove':
        removeOutright(data)
        break
      default: ''
    }
  }
}

const sbobMenuChange = (list: SbMenu[]) => {
  menus.value = list
}

const addMatch = (data: SbMatch) => {
  let index = null
  const arr = list.value.some((item, idx) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      index = idx
    }
    return flag
  })
  if (index !== null) {
    list.value.splice(index, 1, data)
  } else {
    list.value.push(data)
  }
}

const removeMatch = (data: SbMatch) => {
  list.value = list.value.filter(item => item.eventId !== data.eventId)
}

const updateMatch = (data: SbMatch) => {
  if (props.isOpenDetail && props.openMatch.eventId === data.eventId) {
    const newData = JSON.parse(JSON.stringify(props.openMatch))
    if (data.eventStatus !== undefined) newData.eventStatus = data.eventStatus
    if (data.gameInfo) newData.gameInfo = { ...newData.gameInfo, ...data.gameInfo }
    emit('open', newData)
  }
  list.value.some((item, index) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item = data
    }
    return flag
  })
  betData.value.some(item => {
    const flag = item.match.eventId === data.eventId
    if (flag) {
      item.match = data
    }
    return flag
  })
}

const addMarket = (data: ISbMarket) => {
  list.value.some((item, index) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      if (!item.markets) item.markets = []
      item.markets.push(data)
    }
    return flag
  })
}

const updateMarket = (data: ISbMarket) => {
  list.value.some(item => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item.markets.some((market) => {
        const flag2 = market.marketId === data.marketId
        if (flag2) market = data
        return flag2
      })
    }
    return flag
  })
}

const removeMarket = (data: ISbMarket) => {
  list.value.some(item => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item.markets.some((market) => {
        const flag2 = market.marketId === data.marketId
        if (flag2) {
          market.marketStatus = 'closed'
        }
        return flag2
      })
    }
    return flag
  })
}

const addSelection = (data: any) => {
  list.value.some((item) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item.markets.some((market) => {
        const flag2 = market.marketId === data.marketId
        if (flag2) {
          market.selections = market.selections.concat([data.selectionInfo])
        }
        return flag2
      })
    }
    return flag
  })
}

const removeSelection = (data: any) => {
  list.value.some((item) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item.markets.some((market) => {
        const flag2 = market.marketId === data.marketId
        if (flag2) {
          market.selections = market.selections.filter(selection => selection.key !== data.key)
        }
        return flag2
      })
    }
    return flag
  })
}

const updateOdds = (data: any) => {
  list.value.some((item, index) => {
    const flag = item.eventId === data.eventId
    if (flag) {
      item.markets.some((market) => {
        const flag2 = market.marketId === data.marketId
        if (flag2) {
          market.selections.some((slt) => {
            const flag3 = slt.key === data.key
            if (flag3) {
              const oldPrice = slt.oddsPrice.decimalPrice
              if (oldPrice !== data.decimalPrice) {
                const cls = oldPrice < data.decimalPrice ? 'big' : 'small'
                slt.className = cls
              }
              slt.oddsPrice.decimalPrice = data.decimalPrice
              if (data.point !== undefined) {
                slt.point = data.point
                slt.new_point = data.point
              }
            }
            return flag3
          })
        }
        return flag2
      })
    }
  })
  betData.value.some((bd, index) => {
    const flag = bd.market.eventId === data.eventId && bd.market.marketId === data.marketId && bd.odd.key === data.key
    if (flag) {
      if (bd.odd.oddsPrice.decimalPrice !== data.decimalPrice) {
        const cls = bd.odd.oddsPrice.decimalPrice < data.decimalPrice ? 'big' : 'small'
        bd.odd.className = cls
        bd.odd.oddsPrice.decimalPrice = data.decimalPrice
        if (data.point !== undefined) {
          bd.odd.point = data.point
          bd.odd.new_point = data.point
        }
      }
    }
    return flag
  })
}

const addOutright = (data: any) => {
  const isOldData = ysgjList.value.some((item) => {
    const flag = item.sportType === data.sportType
    if (flag) {
      const c = item.outrights.some((outright, index) => {
        const flag2 = outright.leagueId === data.leagueId
        if (flag2) {
          outright = data
        }
        return flag2
      })
      if (!c) {
        item.outrights = item.outrights.concat([data])
        item.count += 1
      }
    }
    return flag
  })
  if (!isOldData) {
    ysgjList.value.push({
      count: 1,
      outrights: [
        data,
      ],
      sportName: data.sportName,
      sportType: data.sportType,
    })
  }
}

const removeOutright = (data: any) => {
  ysgjList.value.some((item) => {
    const flag = item.outrights.some((outright, index) => {
      const flag2 = outright.leagueId === data.legueId
      if (flag2) {
        item.outrights.splice(index, 1)
      }
      return flag2
    })
    return flag
  })
}

const updateOutright = (data: any) => {
  ysgjList.value.some((item) => {
    const flag = item.sportType === data.sportType
    if (flag) {
      item.outrights.some((outright) => {
        const flag2 = outright.leagueId.toString() === data.leagueId.toString()
        if (flag2) {
          const teamsMap: any = {}
          data.teams.forEach((t: any) => {
            teamsMap[t.orid] = t
          })
          outright.teams.some((team, index) => {
            const flag3 = teamsMap[team.orid]
            if (flag3) {
              team = flag3
              if (team.price > flag3.price) {
                team.className = 'small'
              } else if (team.price < flag3.price) {
                team.className = 'big'
              } else {
                team.className = ''
              }
            }
            return !!flag3
          })
        }
        return flag2
      })
    }
    return flag
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

const getMatches = (countReload?: boolean) => {
  const matchCache = sbStore.gameType === 2 ? sbStore.esportMatchCache : sbStore.shabMatchCache
  if (matchCache[activeMenu.value.name] && matchCache[activeMenu.value.name][activeSubMenu.value.gameId || activeSubMenu.value.sportType]) {
    list.value = matchCache[activeMenu.value.name][activeSubMenu.value.gameId || activeSubMenu.value.sportType]
    if (!list.value.length) showSkeleton.value = true
  } else {
    list.value = []
    showSkeleton.value = true
  }
  const params: any = {
    menuLevel: activeSubMenu.value.menuLevel,
    parentId: activeSubMenu.value.parentId,
  }
  if (sbStore.gameType === 2) {
    params.gameId = activeSubMenu.value.gameId
  } else {
    params.sportType = activeSubMenu.value.sportType
  }
  sbStore[sbStore.isYsgj ? 'getYsgjList' : 'getMatchList'](params).then((data) => {
    if (sbStore.isYsgj) ysgjList.value = data.data
    else list.value = data
    if (countReload) {
      nextTick(() => {
        hideCount.value++
      })
    }
    if (gotoLeagueId.value) {
      nextTick(() => {
        setPage()
      })
    }
  }).catch((err) => {
    console.log(err)
    finished.value = true
  }).finally(() => {
    canShowEmpty.value = true
    showSkeleton.value = false
  })
}

const handleListChange = (dat: SbMatch[], isLoad?: boolean) => {
  dat = filterData.value
  finished.value = dat.length <= page.value * pageSize.value
  const val = dat.slice(0, page.value * pageSize.value)
  const cc = (page.value - 1) * pageSize.value
  val.forEach((item, index) => {
    if (sortType.value === 0) {
      item.groupKey = item.leagueName + item.globalShowTime2
    } else {
      item.groupKey = item.leagueName
    }
    if (isLoad && !openAll.value && index >= cc && !foldList.value.includes(item.groupKey)) {
      foldList.value.push(item.groupKey)
    }
  })
  const groupArr = groupBy(val, (item: SbMatch) => item.sportName, 'sportName')
  const arr = groupArr.map((item) => {
    const idList = item.list.map((temp: SbMatch) => temp.eventId)
    const number = item.list.length
    const tp = item.list
    // console.log(tp)
    const list = groupByKey(tp, (temp: SbMatch) => ({ groupKey: temp.groupKey, name: temp.leagueName, leagueId: temp.leagueId }))
    return {
      ...item,
      list,
      idList,
      number,
    }
  })
  // console.log(arr)
  resultData.value = arr
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

const handleMatchesScroll = () => {
  emit('scroll')
  if (!finished.value) {
    clearTimeout(btimer)
    btimer = setTimeout(() => {
      const el = document.querySelector('.sdy-spinner')
      if (el) {
        if (!isElementNotInViewport(el as HTMLDivElement)) {
          onLoad()
        }
      }
    }, 0)
  }
}

const isElementNotInViewport = (el: HTMLDivElement) => {
  const rect = el.getBoundingClientRect()
  return rect.top >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0
}

const formatMgtDate = (value: SbMatch) => {
  return dayjs(value.globalShowTime2 || value.globalShowTime).format('MM-DD HH:mm')
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

const showTime = (value: SbMatch) => {
  return dayjs(value.globalShowTime2 || value.globalShowTime).valueOf() <= dayjs().valueOf() && value.eventStatus === 'running'
}

const formatTime = (item: SbMatch) => {
  const timeValue = +item.gameInfo.seconds
  let min: string | number = Math.floor(timeValue / 60)
  let sec: string | number = Math.floor(timeValue - min * 60)
  if (!min) {
    min = 0
  }
  if (!sec) {
    sec = 0
  }
  if (sec < 0) {
    sec = 0
  }
  if (min < 0) {
    min = 0
  }
  if (min < 10) {
    min = `0${min}`
  }
  if (sec < 10) {
    sec = `0${sec}`
  }
  return `${min}:${sec}`
}

const getRunnningIds = (match: SbMatch) => {
  const arr: any = []
  let nameArr: any = []
  if (sbStore.gameType === 2) {
    if (activeMenu.value.name === '滚球') {
      let s = 0
      let flag = false
      betTypeIds.value.forEach((betType, idx) => {
        const [bt, map] = betType.toString().split(',')
        match.markets.forEach((market, ids) => {
          if (market.betType === 9001) {
            if (market.gameMap === Number(map)) {
              const index = arr.indexOf(Number(map))
              if (index === -1) {
                arr.push(Number(map))
                nameArr.push(betType)
              }
              if (market.marketStatus === 'running') {
                if (!flag) {
                  s = arr.length
                  flag = true
                }
              }
            }
          }
        })
      })
      const a = arr.length
      if (a > 3) {
        if (a - s >= 2) {
          nameArr = nameArr.slice(s - 1, s + 2)
        }
        if (a - s === 1) {
          nameArr = nameArr.slice(s - 2, s + 1)
        }
        if (a === s) {
          nameArr = nameArr.slice(s - 3, s)
        }
      } else {
        const ids: any = betTypeIds.value
        if (a === 2) {
          if (a === s) {
            nameArr = nameArr.slice(1, 2)
            nameArr.push(ids[arr[1]])
            nameArr.push(ids[arr[1] + 1])
          } else {
            nameArr.push(ids[arr[1]])
          }
        }
        if (a === 1) {
          nameArr.push(ids[arr[0]])
          nameArr.push(ids[arr[0] + 1])
        }
        if (a === 0) {
          nameArr = ['9001,1', '9001,2', '9001,3']
        }
      }
    }
  }
  return nameArr.map((item: string) => betTypeNameMap[item])
}

const getMarkets = (match: SbMatch) => {
  let arr: any = []
  const matArr: any = []
  if (sbStore.gameType === 2 && activeMenu.value.name === '滚球') {
    let s = 0
    let flag = false
    betTypeIds.value.forEach((betType, idx) => {
      const [bt, map] = betType.toString().split(',')
      match.markets.forEach((market, ids) => {
        if (market.betType === 9001) {
          if (market.gameMap === Number(map)) {
            const index = arr.indexOf(market)
            if (index === -1) {
              arr.push(market)
            }
            if (market.marketStatus === 'running') {
              if (!flag) {
                s = arr.length
                flag = true
              }
              const index1 = matArr.indexOf(market)
              if (index1 === -1) {
                matArr.push(market)
              }
            }
          }
        }
      })
    })
    const a = arr.length
    if (a > 3) {
      if (a - s >= 2) {
        arr = arr.slice(s - 1, s + 2)
      }
      if (a - s === 1) {
        arr = arr.slice(s - 2, s + 1)
      }
      if (a === s) {
        arr = arr.slice(s - 3, s)
      }
    } else {
      if (a === 2) {
        if (a === s) {
          arr = arr.slice(1, 2)
          arr.push(null)
          arr.push(null)
        } else {
          arr.push(null)
        }
      }
      if (a === 1) {
        arr.push(null)
        arr.push(null)
      }
      if (a === 0) {
        arr = [null, null, null]
      }
    }
  } else {
    arr = [null, null, null]
    betTypeIds.value.forEach((betType, idx) => {
      const [bt, map] = betType.toString().split(',')
      match.markets.some((market) => {
        let flag = market.betType === Number(bt)
        if (map !== undefined) flag = flag && market.gameMap === Number(map)
        if (flag) {
          arr[idx] = market
        }
        return flag
      })
    })
  }
  return arr
}

const getOddName = (odd: ISbOdd, betTypeName: string, match: SbMatch) => {
  let oddName: any = ''
  let betkey = odd.keyName
  if (betTypeName.indexOf('让球') !== -1) {
    oddName = odd.point! > 0 ? `+${odd.point}` : odd.point
    return oddName
  }
  if (betkey === match.teamInfo.homeName) betkey = '主胜'
  if (betkey === match.teamInfo.awayName) betkey = '客胜'
  oddName = betkey + (odd.point === null || odd.point === undefined ? '' : odd.point)
  return oddName
}

const showFullPlay = (item: SbMatch) => {
  emit('open', item)
}

// 选择优胜冠军
const selectYsgj = (match: SbYsgjOutright, team: ISbYsgjTeam) => {
  ysgjBetData.value = {
    match,
    team,
  }
}

// 选择投注赛事
const selectMatch = (match: SbMatch, market: ISbMarket, odd: ISbOdd) => {
  window.shakeApp()
  if (betData.value.length >= 10) {
    Notify.create('投注数量已达上限')
    return
  }
  if (sbStore.isMultiple && !match.isParlay) {
    Notify.create('该赛事不支持串关')
  } else {
    const a = {
      match,
      market,
      odd,
    }
    if (!sbStore.isMultiple) {
      betData.value = [a]
    } else {
      const idx = selectOddStr.value.split(',').indexOf(`${market.eventId}-${market.marketId}-${odd.key}-`)
      const mIdx = betData.value.map(item => item.market.eventId).indexOf(market.eventId)
      if (idx !== -1) {
        betData.value.splice(idx, 1)
      } else if (mIdx !== -1) {
        betData.value.splice(mIdx, 1, a)
      } else {
        betData.value.push(a)
      }
    }
  }
}

const clearBetData = () => {
  betData.value = []
}

const doSingleTicket = (callback?: () => void) => {
  sbStore.oldOdd = ''
  sbStore.getSingleTicket({
    sportType: betData.value[0].match.sportType,
    marketId: betData.value[0].market.marketId,
    key: betData.value[0].odd.key,
    oddsType: 3,
  }).then((data) => {
    if (!betData.value[0]) return
    betData.value[0].market.marketStatus = data.status
    betData.value[0].market.maxBet = data.maxBet
    betData.value[0].market.minBet = data.minBet
    betData.value[0].odd.new_point = data.point
    const oldPrice = betData.value[0].odd.oddsPrice.decimalPrice
    betData.value[0].odd.oddsPrice.decimalPrice = data.price
    if (sbStore.gameType === 1) {
      betData.value[0].match.gameInfo.liveHomeScore = data.liveHomeScore
      betData.value[0].match.gameInfo.liveAwayScore = data.liveAwayScore
    }
    if (typeof callback === 'function') {
      if (oldPrice !== data.price) {
        sbStore.oldOdd = oldPrice
        bus.emit('oldOdds-change')
      } else {
        callback()
      }
    }
  }).catch(() => {
    Toast.clear()
  }).finally(() => {
    if (sbStore.oldOdd) Toast.clear()
  })
}
const doYsgjTicket = (callback?: () => void) => {
  sbStore.oldOdd = ''
  if (ysgjBetData.value?.team.oddsStatus !== 'running') return
  const oldPrice = ysgjBetData.value.team.price
  sbStore.getYsgjTicket({
    sportType: ysgjBetData.value.match.sportType,
    orid: ysgjBetData.value.team.orid,
  }).then((data: any) => {
    if (!ysgjBetData.value) return
    ysgjBetData.value.team.maxBet = data.maxBet
    ysgjBetData.value.team.minBet = data.minBet
    ysgjBetData.value.team.price = data.price
    if (typeof callback === 'function') {
      if (oldPrice !== data.price) {
        sbStore.oldOdd = oldPrice
        bus.emit('oldOdds-change')
      } else {
        callback()
      }
    }
  }).catch(() => {
    Toast.clear()
  }).finally(() => {
    if (sbStore.oldOdd) Toast.clear()
  })
}
const doParlayTickets: (callback?: () => void) => void = (callback) => {
  if (betData.value.length < 2) return
  const minLen = betData.value.map(item => item.market.combo).sort((a, b) => b - a)[0]
  if (betData.value.length < minLen) {
    Notify.create(`下注时最少需要选${minLen}种组合`)
    return
  }
  sbStore.oldOdd = ''
  sbStore.getParlayTickets({
    parlayTickets: betData.value.map(item => ({
      sportType: item.match.sportType,
      marketId: item.market.marketId,
      point: item.odd.point,
      key: item.odd.key,
    })),
  }).then((data) => {
    const maps: any = {}
    betData.value.forEach((item) => {
      maps[item.market.marketId] = item
    })
    data.priceInfo.forEach((item: any, idx: number) => {
      betData.value[idx].market.marketStatus = item.status
      betData.value[idx].match.gameInfo.liveHomeScore = item.liveHomeScore
      betData.value[idx].match.gameInfo.liveAwayScore = item.liveAwayScore
      betData.value[idx].odd.oddsPrice.decimalPrice = item.currentPrice
    })
    sbStore.betTypes.forEach((item) => {
      maps[item.id] = item
    })
    data.combos.forEach((item: any) => {
      const combo = maps[item.comboType]
      if (combo) {
        combo.oldPrice = ''
        const {
          betCount,
          comboType,
          maxBet,
          minBet,
          price,
        } = item
        combo.betCount = betCount
        combo.id = comboType
        combo.maxBet = maxBet
        combo.minBet = minBet
        const oldPrice = combo.price
        if (callback && combo.mon > 0 && oldPrice !== price) {
          sbStore.oldOdd = price
          combo.oldPrice = oldPrice
          bus.emit('oldOdds-change')
        }
        combo.price = price
      }
    })
    if (typeof callback === 'function' && !sbStore.oldOdd) {
      callback()
    }
  }).catch(() => {
    Toast.clear()
  }).finally(() => {
    if (sbStore.oldOdd) Toast.clear()
  })
}
const sbBet = (betAmount: any) => {
  Toast.loading({
    message: '正在获取提交结果',
    overlay: true,
    duration: 0,
  })
  const rondom = Math.random().toString().split('.')[1]
  betAmount.value = betAmount
  if (sbStore.isYsgj) {
    doYsgjTicket(() => {
      sbStore.ysgjBet({
        vendorTransId: rondom,
        sportType: ysgjBetData.value?.match.sportType,
        orid: ysgjBetData.value?.team.orid,
        price: ysgjBetData.value?.team.price,
        stake: betAmount.value,
      }).then((data) => {
        winMoney.value = (betAmount.value * (ysgjBetData.value!.team.price - 1)).toFixed(2)
        orderStatus.value = data.ticketStatus === 'running' ? 1 : 3
        if (data.betStatus === 1 || data.ticketStatus === 'reject') {
          Toast.clear()
          Notify.create('下注失败，请稍后再试')
        } else {
          betResult.value = {
            matchInfo: ysgjBetData.value?.match.leagueName,
            playName: '优胜冠军',
            playOptionName: ysgjBetData.value?.team.teamName,
            orderNo: data.transId,
          }
          doCheckOrderStatus(data)
          sbStore.ysgjBetData = null
        }
      }).catch(() => {
        Toast.clear()
      })
    })
  } else if (sbStore.isMultiple) {
    doParlayTickets(() => {
      sbStore.parlayBet({
        betInfo: {
          vendorTransId: rondom,
          priceOption: 1,
          tickets: betData.value.map(item => ({
            sportType: item.match.sportType,
            marketId: item.market.marketId,
            point: item.odd.new_point || item.odd.point,
            key: item.odd.key,
            price: item.odd.oddsPrice.decimalPrice,
          })),
          combos: sbStore.betTypes.filter(item => !!item.mon).map(item => ({
            combotype: item.id,
            stake: item.mon,
          })),
        },
      }).then((data: any) => {
        orderStatus.value = data.parlayTicketStatus === 'running' ? 1 : 3
        if (data.betStatus === 1 || data.parlayTicketStatus === 'reject') {
          Toast.clear()
          Notify.create('下注失败，请稍后再试')
        } else {
          let allBet = 0
          let allWin: any = 0
          sbStore.betTypes.forEach((item) => {
            allBet += (Number(item.mon) * item.betCount)
            allWin += Number((item.mon * (item.price ? item.price - item.betCount : 0)).toFixed(2))
          })
          allWin = allWin.toFixed(2)
          betResult.value = {
            playName: '投注内容',
            playOptionName: sbStore.betTypes.filter(item => item.mon > 0).map(item => item.name).join(','),
            orderNo: data.transId,
            allBet,
            allWin,
            sysTransId: data.sysTransId,
          }
          doCheckOrderStatus(data)
          clearBetData()
        }
      }).catch(() => {
        Toast.clear()
      })
    })
  } else {
    doSingleTicket(() => {
      const singleData = betData.value[0]
      winMoney.value = (betAmount.value * (singleData.odd.oddsPrice.decimalPrice - 1)).toFixed(2)
      sbStore.singleBet({
        vendorTransId: rondom,
        sportType: singleData.match.sportType,
        marketId: singleData.market.marketId,
        price: singleData.odd.oddsPrice.decimalPrice,
        point: singleData.odd.new_point || singleData.odd.point,
        key: singleData.odd.key,
        stake: Number(betAmount),
        oddsOption: 1,
        oddsType: 3,
      }).then((data) => {
        orderStatus.value = data.ticketStatus === 'running' ? 1 : 3
        if (data.betStatus === 1 || data.ticketStatus === 'reject') {
          Toast.clear()
          Notify.create('下注失败，请稍后再试')
        } else {
          betResult.value = {
            matchInfo: `${singleData.match.teamInfo.homeName} VS ${singleData.match.teamInfo.awayName}`,
            playName: singleData.market.betTypeName,
            playOptionName: singleData.odd.keyName + ([null, undefined].includes(singleData.odd.point as any) ? '' : ` ${singleData.odd.point}`),
            orderNo: data.transId,
          }
          doCheckOrderStatus(data)
          clearBetData()
        }
      }).catch(() => {
        Toast.clear()
      })
    })
  }
}
const doCheckOrderStatus = (data: any) => {
  if (orderStatus.value === 1) {
    Toast.clear()
    showSucData.value = true
  } else {
    setTimeout(() => {
      sbStore.checkOrderStatus({
        transId: data.transId || data.sysTransId,
      }).then((status) => {
        orderStatus.value === 'running' ? 1 : 3
        if (status === 'reject') {
          Notify.create('下注失败，请稍后再试')
        } else {
          showSucData.value = true
        }
      }).finally(() => {
        Toast.clear()
      })
    }, 1500)
  }
  payStore.getBalance()
}
const handleCloseBetPopup = () => {
  showSucData.value = false
  if (!sbStore.isMultiple) {
    sbStore.betData = []
  }
  sbStore.showBetPanel = false
}
const goDetail = () => {
  showSucData.value = false
  sbStore.betData = []
  sbStore.showBetPanel = false
  router.push('/mine/betting-records')
}

const handleCancelBet = (index: any) => {
  betData.value[index].odd.active = false
  betData.value.splice(index, 1)
  if (!betData.value.length) {
    sbStore.showBetPanel = false
  } else if (sbStore.isMultiple && betData.value.length > 1) {
    doParlayTickets()
  }
}

const clearOddsUpdateClass = () => {
  oddUpdateClassTimer = setInterval(() => {
    list.value.forEach((match, index) => {
      match.markets.forEach((market) => {
        market.selections.forEach((selection) => {
          if (selection.className) {
            selection.className = ''
            list.value[index] = match
          }
        })
      })
    })
    betData.value.forEach((bd, index) => {
      bd.odd.className = ''
      betData.value[index] = bd
    })
  }, 8000)
}
const show = () => {
  window.shakeApp()
  showFilter.value = true
  if (!selectLeagues.value.length) {
    checkbox.value = leagueList.value.map((item: any) => item.name)
  } else {
    checkbox.value = selectLeagues.value
  }
}

const selectAll = () => {
  checkbox.value = leagueList.value.map((item: any) => item.name)
}
const closeAll = () => {
  checkbox.value = leagueList.value.filter((item: any) => !checkbox.value.includes(item.name)).map((item: any) => item.name)
}
const handleCheckboxClick = (league: any) => {
  const index = checkbox.value.indexOf(league.name)
  if (index !== -1) {
    checkbox.value.splice(index, 1)
  } else {
    checkbox.value.push(league.name)
  }
}
const saveSelect = () => {
  checkbox.value = checkbox.value.filter(_ => _.includes(searchwd.value))
  if (!checkbox.value.length) {
    Notify.create('选中联赛不能为空')
  } else {
    showFilter.value = false
    selectLeagues.value = checkbox.value
    setTimeout(() => (document.querySelector('#q-app') as HTMLDivElement).scrollTo({ top: 1 }), 150)
  }
}
const setFilterHieght = () => {
  (document.querySelector('.shab-sports .sports-league-filter') as HTMLDivElement).style.height = (document.querySelector('.sports-page') as HTMLDivElement).style.minHeight
}

const getIsActive = (market: ISbMarket, odd: ISbOdd) => {
  if (selectOddStr.value) {
    return selectOddStr.value.indexOf(`${market.eventId}-${market.marketId}-${odd.key}-`) !== -1
  }
  return false
}
const onConfirm = (date: string) => {
  openAll.value = true
  range.value = date ? [date] : []
  showCalendar.value = false
}
const setSportGroupHeight = () => {
  const pageH = (document.querySelector('#q-app') as HTMLDivElement).offsetHeight
  const h = (document.querySelector('.sticky') as HTMLDivElement).offsetHeight
  const hh = (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight
  const lh = (document.querySelector('.list-finished') as HTMLDivElement).offsetHeight
  const fh = (document.querySelector('.q-footer') as HTMLDivElement).offsetHeight
  sportGroupStyle.value = `min-height: ${pageH - h - hh - lh - fh}px;`
}
const followLeague = (league: any) => {
  if (league.lock) return
  league.lock = true
  const leagueId = (league.leagueId || league.id).toString()
  if (leagueFollowIds.value.includes(leagueId)) {
    sptvStore.cancelFollowLeague({
      leagueId,
      matchType: 11,
    }).then(() => {
      const idx = leagueFollowIds.value.indexOf(leagueId)
      lfList.value.splice(idx, 1)
      Notify.create('取消关注联赛成功')
    }).finally(() => {
      league.lock = false
    })
  } else {
    if (leagueFollowIds.value.length >= 5) {
      Notify.create('关注联赛达到5个，无法关注')
      return
    }
    sptvStore.FollowBetLeague({
      leagueId: league.id,
      leagueName: league.name,
      matchType: 11,
    }).then(() => {
      lfList.value.push({
        leagueId: league.id,
        leagueName: league.name,
      })
      Notify.create('关注联赛成功')
    }).finally(() => {
      league.lock = false
    })
  }
}
const goFollowLeague = (league: any) => {
  findLeagueToast.value = Toast.loading({
    message: '数据查找中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0,
  })
  sbStore.queryMenuByLeague({ leagueId: league.leagueId })
    .then((data: any) => {
      if (!data) {
        findLeagueToast.value.clear()
        Notify.create('当前无赛事')
      } else {
        const { index, sportType } = data
        let tbi
        let sbi
        tabs.value.some((item: any, idx: number) => {
          const menuFlag = idx === index
          if (menuFlag) {
            tbi = idx
            item.menuL2s.filter((i: any) => (i.count > 0 || i.sportType === '全部' || i.count === undefined)).some((subItem: any, subIdx: any) => {
              const subFlag = subItem.sportType === sportType
              if (subFlag) sbi = subIdx
              return subFlag
            })
          }
          return menuFlag
        })
        if (tbi === undefined || sbi === undefined) {
          findLeagueToast.value.clear()
          Notify.create('当前无赛事')
          return
        }
        showFilter.value = false
        isFollow.value = false
        gotoLeagueId.value = league.leagueId
        if (tabIndex.value === tbi && subIndex.value === sbi) {
          setPage()
        } else {
          tabIndex.value = tbi
          subIndex.value = sbi
        }
      }
    }).catch(() => {
      findLeagueToast.value.clear()
      gotoLeagueId.value = ''
    })
}
const scrollByLeagueId = (tid: number | string) => {
  showSkeleton.value = false
  nextTick(() => {
    const el = document.querySelector(`.tid-${tid}`)
    if (el) {
      const bh = (document.querySelector('.balance-header') as HTMLDivElement).offsetHeight
      const sh = (document.querySelector('.sticky') as HTMLDivElement).offsetHeight
      const th = el.getBoundingClientRect().top + (document.querySelector('#q-app') as HTMLDivElement).scrollTop;
      (document.querySelector('#q-app') as HTMLDivElement).scrollTop = th - sh - bh
    }
    gotoLeagueId.value = ''
    if (findLeagueToast.value) findLeagueToast.value.clear()
  })
}
const setPage = () => {
  filterData.value.some((item, idx) => {
    const flag = item.leagueId === gotoLeagueId.value
    if (flag) {
      page.value = Math.ceil(idx / pageSize.value) || 1
    }
    return flag
  })
  setTimeout(() => scrollByLeagueId(gotoLeagueId.value), 500)
}
</script>
