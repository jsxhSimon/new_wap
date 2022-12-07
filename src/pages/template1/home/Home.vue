<template>
  <q-page class="home-page">
    <DownloadBar v-if="!Platform.is.cordova && sysStore.isShowDownloadBar" />
    <q-pull-to-refresh>
      <BalanceHeader type="user" rightButton="menu" />
      <HeaderGame />
      <SwiperLocal class="mt-15" :swiperList="swiperArr" :noticeList="noticeArr" :emptyNoticeList="emptyNoticeList" />
      <template v-if="message.textContent">
        <div v-if="getPTime(message.textContent) <= 1" @click="handleToMessageCenter" ref="ios_rewardMsg" :class="fixedMsg ? 'rewardMsg fixed' : 'rewardMsg'" v-html="message.textContent"></div>
        <div v-else @click="handleToMessageCenter" ref="ios_rewardMsg" :class="fixedMsg ? 'rewardMsg fixed' : 'rewardMsg'">
          <div class="msg-content" v-html="message.textContent"></div>
        </div>
      </template>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
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
let timer: any = null

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
};

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
    if (message.value && message.value.textCotnent) {
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
</script>

<style lang="scss">
.home-page {
  .download-bar,
  .balance-header-box,
  .header-game {
    z-index: 9999;
  }
  .balance-header-box {
    position: relative;
  }
}
</style>
