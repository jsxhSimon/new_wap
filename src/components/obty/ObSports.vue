<template>
  <div class="ob-sports" v-show="!showFilter">
    <div class="match-tabs new-match-tabs mb-20" :class="{'click-disabled': disabledMenu}">
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
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { SessionStorage } from 'quasar';
import { ref, computed, watch, onBeforeMount, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { XmMenu, XMMatch, ILeagueFollow } from 'src/types/sports';
import { MENU_MAP } from './utils/constants'
import { useXmStore } from 'src/stores'
import SportMenu from './components/SportMenu.vue'

const { t: lang } = useI18n()

interface Props {
  gameType: number;
  isHideChange: boolean;
}

const props = defineProps<Props>()
const emits = defineEmits(['changeIsHideChange'])

const xmStore = useXmStore()
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

const intervalTime = 8000
let matchTimer: any = null
let findLeagueToast: any = null
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

onBeforeMount(() => {
  menus.value = xmStore.menuCache
})

onBeforeUnmount(() => {
  clearInterval(matchTimer)
})

const handleChangeTab = (idx: number) => {
  window.shakeApp()
  tabIndex.value = idx
  subIndex.value = 0
}

const handleChangeMenu = (euid: number | string, sIdx: number) => {
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
  if (euid) subIndex.value = sIdx
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
    params.menuName = activeMenu.value.subList.filter(item => !!item.count)[subIndex.value].menuName
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
</script>