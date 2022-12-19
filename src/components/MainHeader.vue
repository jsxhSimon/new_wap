<template>
    <q-header
    class="headerCommon"
    id="headerCommon"
    unelevated
    v-if="pagePath !== ''"
  >
    <q-toolbar>
      <!--左边区域-->
      <div class="row col-4 justify-start">
        <div v-if="isMine" class="msgBox goDown"  @click="$router.push('/mine/message-center')" style="display:inline-block">
          <q-badge v-if="messageUnreadCount" class="msgNum" floating>{{messageUnreadCount}}</q-badge>
          <i class="iconfont icon-email "></i>
        </div>
        <div
          v-else
          @click="checkPath"
          class="backBox"
        >
          <span class="iconfont icon-xiangzuo1 fs-20"></span>
        </div>
      </div>

      <!--中部文案标题-->
      <div class="row col-4 justify-center">
        <div class="text-center">
          <img
            alt=""
            class="proLogo"
            src="~site_theme_images/logo.png"
            v-if="pagePath == ''"
          />
          <span class="titleText">{{$t(title)}}</span>
        </div>
      </div>

      <!--右边 icon-->
      <div v-if="!hideRight" class="row col-4 justify-end">
        <div
          v-if="showKf"
          class="myIcons"
        >
          <div class="kefu-box goDown" @click="openCustomerService">
          </div>
        </div>

        <div
          v-if="hideChat"
          class="msgBox"
          @click="$router.push('/mine/message-center')"
          style="display:inline-block"
        >
          <q-badge v-if="messageUnreadCount" class="msgNum" floating>{{messageUnreadCount}}</q-badge>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEnvStore, useUserStore } from 'src/stores'

const route = useRoute()
const router = useRouter()
const envStore = useEnvStore()
const userStore = useUserStore()

const pagePath = computed(() => {
  let path = ''
  const name = route.path.slice(1)
  if (!(name.startsWith('vide-games') || name.startsWith('reset'))) {
    path = name
  }
  return path
})

const isMine = computed(() => {
  const temp = route.path === '/minePage'
  if (route.path === '/activity' && envStore.envHasSports === false) return true
  return temp
})

const messageUnreadCount = computed(() => {
  return userStore.messageUnreadCount
})

const title = computed(() => {
  if (typeof route.meta.title === 'function') {
    return route.meta.title(route)
  }
  return route.meta.title
})

const hideRight = computed(() => {
  return route.meta.hideRight
})

const showKf = computed(() => {
  return route.meta.showKf
})

const hideChat = computed(() => {
  if (typeof route.meta.hideChat === 'function') {
    return route.meta.hideChat(route)
  }
  if (route.path === '/activity' && envStore.envHasSports === false) return false
  return route.meta.hideChat
})

const checkPath = () => {
  const { path } = route
  if (route.query.isBack) {
    router.push('/')
  } else if (path === '/payhtml') {
    router.replace('/wallet/deposit')
  } else if (path === '/wallet/deposit' || path === '/wallet/withdraw' || path === '/mine/transaction-records' || path === '/mine/bank-cards') {
    if (userStore.isLiveInPay) {
      userStore.$patch(state => state.isLiveInPay = false)
      router.push('/sports')
    } else {
      router.push('/')
    }
  } else {
    router.go(-1)
  }
}

const openCustomerService = () => {
  router.push('/customerService')
}

</script>

<style lang="scss" scoped>
.iconkefu {
  width: 24px;
  height: 24px;
}
/* 面板左下角圆角 */
.headerCommon {
  /*height: 44px;*/
  /*line-height: 44px;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  color: #323232;
  &.q-layout__section--marginal {
    background: #fff;
  }
  font-size: 17px;
  .goDown{
    margin-top: 5px;
  }
  .kefu-box {
    display: inline-block;
    position: relative;
    margin-left: 2px;
    margin-right: 2px;
    width: 24px;
    height: 24px;
    background: url('images/common/kefu.png') no-repeat center center;
    background-size: contain;
  }
  img {
    display: block;
  }
  .header-logo {
    width: 30px;
    height: 30px;
    border-radius: 30px;
  }
  .proLogo {
    width: 90px;
    height: 22px;
  }
  .titleText {
    font-size: 18px;
  }
  .msgBox {
    position: relative;
    width: 24px;
    height: 24px;
    background-size: contain;
    .iconfont {
      color: var(--t2);
      font-size: 20px;
    }
    .msgNum {
      background: var(--bg5);
      color: var(--t5);
      bottom: 2.66667vw;
      z-index: 1;
      right: -1.86667vw;
      top: initial;
      left: initial;
      border-radius: 50%;
      transform: scale(0.7);
      line-height: 15px;
    }
  }
}
</style>
