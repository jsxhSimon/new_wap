<template>
  <div class="balance-header-box">
    <SideMenu :sideShow="sideShow" @close="sideShow = false" />
    <div class="balance-header">
      <swiper
        v-if="scrollFixed"
        slides-per-view="auto"
        class="balance-header-gameType"
      >
        <swiper-slide
          v-for="item in gameTypeList"
          :key="item.type"
          :class="{active: gameType === item.type}"
        >
          <span @click="$emit('changeGameType', item.type)">{{item.label}}</span>
        </swiper-slide>
      </swiper>
      <div v-else class="logo-box">
        <img src="~site_theme_images/logo.png" alt="">
      </div>
      <div class="flex flex-center flex-center-img">
        <div class="balance flex flex-center">
          <template v-if="!userStore.isLogin && type==='user'">
            <span @click="$router.push('/login')">{{ $t('登录') }}</span>
            <span class="mlr-4">/</span>
            <span @click="$router.push('/login/register')">{{ $t('注册') }}</span>
          </template>

          <template v-else>
            {{ envStore.envCurrencySymbol }} {{ payStore.balance }}
            <i class="sdy-icon sdy-icon-refresh" :class="{'a-round': loading}" @click="handleLoading"></i>
          </template>
        </div>

        <div class="balance-header—right" :class="((!userStore.isLogin && type==='user')||`${payStore.balance}`.length<4) && 'balance-header—right-menu'">
          <span v-if="rightButton === 'service'" class="iconfont iconkefu3" @click="openCustomerService"></span>
          <span v-else  class="sdy-icon sdy-icon-menu" @click.stop="sideShow = true"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from 'components/SideMenu.vue'
import { IGameType } from 'src/@types/sports'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useUserStore } from 'src/stores/user'
import { usePayStore } from 'src/stores/pay'
import { useEnvStore } from 'src/stores/env'
import { useRouter } from 'vue-router'

interface Props {
  scrollFixed?: boolean;
  gameTypeList?: IGameType[];
  gameType?: number;
  type?: string;
  rightButton?: string;
}

const props = withDefaults(defineProps<Props>(), {
  scrollFixed: false,
  gameTypeList: () => [],
  gameType: 0,
  type: 'user',
  rightButton: 'side'
})

const userStore = useUserStore()
const payStore = usePayStore()
const envStore = useEnvStore()
const sideShow = ref(false)
const loading = ref(false)
const router = useRouter()
let timer: any = null

const handleLoading = () => {
  clearInterval(timer)
  loading.value = true
  let a = 0
  timer.value = setInterval(() => {
    if (a === 2) {
      loading.value = false
      clearInterval(timer)
    } else if (a === 1) {
      a += 1
    }
  }, 700)
  payStore.getBalance()
    .finally(() => {
      a = 1
    })
}

const openCustomerService = () => {
  router.push('/customerService')
}

</script>

<style lang="scss">
.balance-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 20px;
  background-color: var(--header-bg);
  .logo-box {
    img {
      height: 22px;
    }
  }
}
</style>
