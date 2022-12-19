<template>
  <q-page class="sports-page" :class="{'sports-page__fixed': keepScrollFixed || scrollFixed}">
    <BalanceHeader
      v-if="!showFilter"
      :scrollFixed="keepScrollFixed || scrollFixed"
      :gameTypeList="gameTypeList"
      :gameType="gameType"
      @changeGameType="changeGameType"
      type="sports"
      rightButton="menu"
    />
    <div class="wrap">
      <q-pull-to-refresh @refresh="refresh" icon="refresh">
        <div v-if="showTopBox" id="top-box" class="mt-10 mb-10" :class="onlyNoticeListEnable ? 'flex align-center justify-between no-wrap' : ''">
          <SwiperLocal :style="{ width: onlyNoticeListEnable ? '94%' : 'auto' }" ref="swiperLocal" :swiperListEnable="swiperListEnable" :noticeListEnable="noticeListEnable" :swiperList="swiperList" :noticeList='noticeList' :emptyNoticeList="emptyNoticeList" :key="swiperList.length"/>
          <span v-if="onlyNoticeListEnable" class="iconfont icon-yuyinguanbi icon-close tc-2"  @click="showTopBox = false"></span>
        </div>
      </q-pull-to-refresh>
    </div>
    <div class="container" v-show="!showFilter">
      <div class="match-container">
        <div v-if="!keepScrollFixed" id="game-type-list" class="title sdy-border-top">
            <span
              v-for="item in gameTypeList"
              :key="item.type"
              :class="{active: gameType === item.type}"
              @click="changeGameType(item.type)"
            >
            {{item.label}}
          </span>
        </div>
        <ObSports v-if="gameType === 0" :game-type="gameType" :is-hide-change="isHideChange" @change-is-hide-change="changeIsHideChange"  />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { Notify, SessionStorage } from 'quasar'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSysStore, useEnvStore } from 'src/stores'
import BalanceHeader from 'src/components/BalanceHeader.vue'
import SwiperLocal from 'src/components/Swiper.vue'
import ObSports from 'src/components/obty/ObSports.vue'

const map: Record<number, string> = {
  0: 'XM',
  1: 'SBOD',
  2: 'SBOD',
  3: 'FBOB'
}

interface IGameType {
  depotCode: string;
  label: string;
  type: number;
  availableWh?: number;
}

const { t: lang } = useI18n()
const router = useRouter()
const sysStore = useSysStore()
const envStore = useEnvStore()
const scrollFixed = ref(false)
const showFilter = ref(false)
const swiperListEnable = ref(false)
const noticeListEnable = ref(false)
const gameTypeList = ref<IGameType[]>([])
const gameType = ref(3)
const isRefresh = ref(false)
const showTopBox = ref(true)
const swiperList = ref<Partial<ISwiperData>[]>([{}])
const noticeList = ref<INotice[]>([])
const emptyNoticeList = ref(false)
const topBoxLoadingFinnish = ref(false)
const isHideChange = ref(false)
const isMaintain = ref(false)

const keepScrollFixed = computed(() => {
  if (swiperListEnable.value && !noticeListEnable.value) {
    return true
  }
  return !swiperListEnable.value && noticeListEnable.value
})

const onlyNoticeListEnable = computed(() => {
  return !swiperListEnable.value && noticeListEnable.value
})

watch(
  () => gameType.value,
  (val) => {
    // 清空各个体育数据
    sysStore.getGameDepotsByCatId(1)
      .then(videoGames => {
        const sportData = videoGames.filter((item: IMainGame) => ['SBOD', 'XM', 'FBOB'].includes(item.depotCode)).map((item: IMainGame) => ({ depotCode: item.depotCode, availableWh: item.availableWh }))
        SessionStorage.set('_sportAvailableWh', sportData)
        if (!sportData.length) {
          Notify.create(lang('游戏场馆已关闭'))
          router.push('/')
          return
        }
        const gameTypeListMap: IGameType[] = [
          { label: envStore.envAppTitle as string, depotCode: 'FBOB', type: 3 },
          { label: lang('OB体育'), depotCode: 'XM', type: 0 },
          { label: lang('沙巴体育'), depotCode: 'SBOD', type: 1 },
        ]

        gameTypeList.value = gameTypeListMap.filter((item) => {
          const result = sportData.find((v: IMainGame) => v.depotCode === item.depotCode)
          if (result) {
            item.availableWh = result.availableWh
          }
          return result
        })

        const activeGameTypeData = gameTypeList.value.find(item => item.type === val)
        if (!activeGameTypeData) {
          gameType.value = gameTypeList.value[0]?.type
          return
        }

        if (activeGameTypeData?.availableWh === 2) {
          isMaintain.value = false
          const toast = Toast.fail({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            className: 'toastCustomer__contain',
            closeOnClickOverlay: false,
            closeOnClick: false,
            message: lang('平台维护中 (xS)', [3]),
          })
          let second = 3
          const timer = setInterval(() => {
            second--
            if (second) {
              toast.message = lang('平台维护中 (xS)', [second])
            } else {
              clearInterval(timer)
              Toast.clear()
              router.push('/')
            }
          }, 1000)
        } else {
          isMaintain.value = true
        }
      })
    const scrollH = Math.ceil(document.querySelector('#q-app')!.scrollTop)
    nextTick(() => {
      const topBox = document.querySelector('#top-box')
      const gameTypeEl = document.querySelector('#game-type-list')
      const topBoxHeight = (topBox && topBox.getBoundingClientRect().height) || 0
      const gameTypeHeight = (gameTypeEl && gameTypeEl.getBoundingClientRect().height) || 0
      const h = Math.ceil(topBoxHeight + gameTypeHeight)
      document.querySelector('#q-app')!.scrollTop = scrollFixed.value ? h : scrollH
    })
  },
  {
    immediate: true
  }
)

onMounted(() => {
  const tabArr = (SessionStorage.getItem('matchTabData') as string || '').split(',')
  if (tabArr.length === 3) {
    gameType.value = Number(tabArr[0] || 0)
  }
  setBannerList()
  document.addEventListener('visibilitychange', hideOrShowPage)
})

onBeforeUnmount(() => {
  if (!isRefresh.value) {
    sysStore.recoverBalanceAction()
  }
  document.removeEventListener('visibilitychange', hideOrShowPage)
})

const refresh = () => {
  isRefresh.value = true
  router.replace('/refresh')
}

const changeGameType = (type: number) => {
  window.shakeApp()
  const sptArr: IMainGame[] = SessionStorage.getItem('_sportAvailableWh') ?? []
  const attr = map[type]
  const obj = sptArr.find(item => !!(item.depotCode === attr))
  if (obj?.availableWh === 2) {
    Notify.create(lang('该平台正在维护中'))
  } else {
    gameType.value = type
  }
}

const setBannerList = async () => {
  try {
    const { data } = await sysStore.getIndexNoticeAndAdvSwitch()
    swiperListEnable.value = !!+data.isPopUp
    noticeListEnable.value = !!+data.isNotice
  } catch (e) {
    console.log(e)
  }
  try {
    const res: {
      swiperList: ISwiperData[];
      noticeList: INotice[];
    } = await sysStore.indexNoticeAndAdv(true)
    if (swiperList.value.length) swiperList.value = res.swiperList
    noticeList.value = res.noticeList
    if (!noticeList.value || !noticeList.value.length) emptyNoticeList.value
  } catch (e) {
    console.log(e)
  } finally {
    topBoxLoadingFinnish.value = true
    handleScroll()
  }
}

const handleScroll = () => {
  const sticky = document.querySelector('.sticky')
  const header = document.querySelector('.balance-header')
  if (sticky && header) {
    const { top } = sticky.getBoundingClientRect()
    const { height } = header.getBoundingClientRect()
    scrollFixed.value = Math.floor(top) - Math.floor(height) <= 5
  }
}

const hideOrShowPage = () => {
  if (document.visibilityState !== 'hidden') {
    isHideChange.value = true
  }
  const style = document.visibilityState === 'hidden' ? 'hidden' : '';
  (document.querySelector('.sports-page') as HTMLDivElement).style.visibility = style
}

const changeIsHideChange = (type: boolean) => {
  isHideChange.value = type
}

</script>

<style lang="scss">
.sports-page {
  .balance-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 8;
  }
  .wrap {
    padding: calc(env(safe-area-inset-top) + 44px) 14px 0;
    .icon-close {
      background: var(--body-bg);
    }
    .home-swiper {
      overflow: hidden;
    }
  }
  .swiperAs {
    background: transparent;
    .marquee-box {
      color: var(--t2);
    }
    .marquee-icon {
      background: none;
      color: var(--theme-color);
      justify-content: flex-start;
      width: auto;
    }
  }
}
</style>
