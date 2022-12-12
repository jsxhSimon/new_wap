<template>
  <q-page class="home-page" :class="{'game-open': gameOpen}">
    <DownloadBar v-if="!Platform.is.cordova && sysStore.isShowDownloadBar" />
    <q-pull-to-refresh @refresh="refreshHomePage">
      <BalanceHeader type="user" rightButton="menu" />
      <HeaderGame ref="hGameRef" />
      <SwiperLocal class="mt-15" :swiperList="swiperArr" :noticeList="noticeArr" :emptyNoticeList="emptyNoticeList" />
    </q-pull-to-refresh>
    <template v-if="message.textContent">
      <div v-if="getPTime(message.textContent) <= 1" @click="handleToMessageCenter" ref="ios_rewardMsg" :class="fixedMsg ? 'rewardMsg fixed' : 'rewardMsg'" v-html="message.textContent"></div>
      <div v-else @click="handleToMessageCenter" ref="ios_rewardMsg" :class="fixedMsg ? 'rewardMsg fixed' : 'rewardMsg'">
        <div class="msg-content" v-html="message.textContent"></div>
      </div>
    </template>
    <HomeGames @scroll="onScroll" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { Platform } from 'quasar';
import { useRouter } from 'vue-router'
import DownloadBar from 'components/DownloadBar.vue';
import BalanceHeader from 'src/components/BalanceHeader.vue';
import HeaderGame from 'src/components/HeaderGame.vue';
import { useUserStore } from 'src/stores/user';
import { useSysStore } from 'src/stores/sys';
import { usePayStore } from 'src/stores/pay'
import { useI18n } from 'vue-i18n'
import safeAreaInsets from 'safe-area-insets'
import SwiperLocal from 'src/components/Swiper.vue';
import HomeGames from '../common/HomeGames.vue';

const { t: lang } = useI18n()

const router = useRouter()
const sysStore = useSysStore();
const userStore = useUserStore()
const payStore = usePayStore()
const message = ref<any>({})
const ios_rewardMsg = ref<any>(null)
const fixedMsg = ref(false)
const popList = ref<any>([])
const noticeArr = ref<any>([])
const swiperArr = ref<any>([{}])
const emptyNoticeList = ref(false)
const showRecommendBet = ref(false)
const hGameRef = ref<any>({})
const gameOpen = ref(false)
let timer: any = null
let gTimer: any = null

watch(
  () => hGameRef.value.show,
  (val) => {
    clearTimeout(gTimer)
    if (val) gameOpen.value = true
    else {
      gTimer = setTimeout(() => {
        gameOpen.value = false
      }, 500)
    }
  }
)

onBeforeMount(() => {
  if (userStore.isLogin) {
    payStore.getBalance()
    getButlerMessageListData()
  }
  setBannerList()
})
onMounted(() => {
  init();
});

const init = () => {
  sysStore.getGameCenterData();
  sysStore.initDomain().then(() => {
    sysStore.getSToken()
    sysStore.setSToken()
  })
  sysStore.getWinList()
};

const refreshHomePage = (done: () => void) => {
  init()
  setBannerList()
  refreshBalance(done)
}

const refreshBalance = (done: () => void) => {
  if (!userStore.isLogin) {
    done()
    return
  }
  payStore.recoverBalance()
    .then(() => {
      payStore.getBalance()
    }).finally(() => {
      done()
    })
}

const getButlerMessageListData = () => {
  const obj = {
    msgType: 0,
    pageNo: 1,
    pageSize: 3,
    isRead: 1,
    mbrIsRead: 1,
  }
  userStore.getButlerMessageList(obj).then(data => {
    const { list } = data
    message.value = list.find((item: any) => item.isRead === 0) || {}
    if (message.value && message.value.textContent) {
      const regExp = /<img.*?\/>/g
      let result = message.value.textContent.replace(regExp, '')
      if (result === '<p></p>') {
        result = lang('您有新消息！')
      }
      message.value.textContent = result
      timer = window.setTimeout(() => {
        fixedMsg.value = true
        ios_rewardMsg.value?.style.setProperty('--translateYVal', -(safeAreaInsets.bottom + 60) + 'px')
      }, 50)
    }
  })
}

const setBannerList = () => {
  sysStore.indexNoticeAndAdv()
    .then(({swiperList, popUpList, noticeList}) => {
      const noticeAd = noticeList.filter((item: any) => parseInt(item.showType, 10) === 1 || parseInt(item.showType, 10) === 2).map((item: any) => {
        item.title = item.noticeTitle
        item.title = item.noticeContent
        item.isNotice = true
        return item
      })
      const popAd = popUpList.map((item: any) => {
        item.noticeTitle = item.title
        item.isNotice = false
        return item
      })
      popList.value = [...popAd, ...noticeAd]
      if (swiperList?.length) {
        swiperArr.value = swiperList
      }
      noticeArr.value = noticeList
      if (!noticeList || !noticeList.length) {
        emptyNoticeList.value = true
      }
      if (!popList.value.length) {
        showRecommendBet.value = true
      }
    })
}

const getPTime = (text: string) => {
  const len = text.length
  const len2 = text.replace(/<p/g, '').length
  console.log('ptime:', (len - len2) / 2)
  return (len - len2) / 2
}

const handleToMessageCenter = () => {
  const { isSign } = message.value
  const temp: any = {
    0: 1,
    1: 1,
    2: 2,
  }
  router.push({name: 'messageCenter', params: { msgType: temp[isSign] }})
}

const onScroll = (y: number) => {
  if (y <= 0) {
    fixedMsg.value = true
    ios_rewardMsg.value?.style.setProperty('--translateYVal', -(safeAreaInsets.bottom + 60) + 'px')
  } else {
    ios_rewardMsg.value?.style.setProperty('--translateYVal', (safeAreaInsets.bottom + 60) + 'px')
    fixedMsg.value = false
  }
}
</script>

<style lang="scss">
.home-page {
  &.game-open {
    .download-bar,
    .balance-header-box,
    .header-game {
      z-index: 6999;
    }
  }
  .balance-header-box {
    position: relative;
  }
  .rewardMsg {
    position: fixed;
    width: 306px;
    height: 42px;
    background: url('images/home/game-icon-live@2x.png') no-repeat;
    background-size: 100% 100%;
    left: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 25px;
    bottom: 20px;
    transform: translateY(var(--translateYVal));
    transition: all 0.5s;
    z-index: 9;
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: none;
      color: var(--t2);
      font-size: 12px;
    }
  }
}
</style>
