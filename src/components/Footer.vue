<template>
  <q-footer class="footerTabs" id="layoutFooter">
    <template v-for="(item, idx) in footerTabs" :key="item.path">
      <component
        @click="clickBtn"
        :is="'router-link'"
        :to="item.path"
        tag="div"
        class="f-tab-item"
        :class="{ active: activeTabIndex === idx }"
      >
        <div
          class="sdy-icon"
          :class="item.iconCls + (activeTabIndex === idx ? ' active' : '')"
        ></div>
        <div class="tab-name">{{ item.label }}</div>
      </component>
    </template>
  </q-footer>
</template>

<script setup lang="ts">
import { LocalStorage, Platform } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useEnvStore } from 'src/stores/env'
import { useRoute } from 'vue-router'
import router from 'src/router'

const envStore = useEnvStore()
const route = useRoute()
const { t: lang } = useI18n()
const footerTabs = computed(() => {
  const arr = [
    {
      path: '/',
      label: lang('游戏'),
      cls: 'icon-f-live',
      iconCls: 'icon-home',
    },
    {
      path: '/mine/betting-records',
      label: lang('注单'),
      cls: 'icon-f-activity',
      iconCls: 'icon-order',
    },
    {
      path: '/sports',
      label: lang('体育'),
      cls: 'icon-f-home',
      iconCls: 'icon-sports',
    },
    {
      path: '/wallet/deposit',
      label: lang('充值 '),
      cls: 'icon-f-service',
      iconCls: 'icon-topup',
    },
    {
      path: '/minePage',
      label: lang('我的'),
      cls: 'icon-f-sponsor',
      iconCls: 'icon-mine',
    },
  ]
  if (!envStore.envHasSports) {
    arr.splice(2, 1, {
      path: '/activity',
      label: lang('优惠 '),
      cls: 'icon-f-home',
      iconCls: 'icon-discount',
    })
  }
  return arr
})

const activeTabIndex = computed(() => {
  switch (route.path) {
    case '/':
      return 0
    case '/mine/betting-records':
      return 1
    case '/wallet/deposit':
    case '/mine/transaction-records':
    case '/mine/bank-cards':
    case '/wallet/withdraw':
      return 3
    case '/minePage':
    case '/activity':
      if (route.path === '/activity' && envStore.envHasSports === false) return 2
      return 4
    default:
      return 2
  } 
})

const clickBtn = () => {
  try {
    if (Platform.is.cordova && Platform.is.ios && window.testModel?.appshakemethod && !(LocalStorage.getItem('vibrationVal') === 'off')) {
      const SuccessCallBack = function (msg: string) {
        // alert('sucess-:', msg)
      }
      // eslint-disable-next-line func-names
      const FailCallBack = function (msg: string) {
        // alert('fail-:', msg)
      }
      window.testModel.appshakemethod(SuccessCallBack, FailCallBack)
    }
  } catch(e) {}
}

</script>

<style lang="scss">
.footerTabs {
  display: flex;
  align-items: center;
  height: 64px;
  background: var(--footer-bg);
  border-radius: var(--footer-border-radius);
  .f-tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--footer-text-color);
    text-decoration: none;
    &.active {
      color: var(--theme-text-color);
    }
  }
  .sdy-icon {
    width: 24px;
    height: 24px;
    @each $icon in home order sports topup mine {
      &.icon-#{$icon} {
        background-image: url('images/footer/' + $icon + '.png');
        &.active {
          background-image: url('images/footer/' + $icon + '_a.png');
        }
      }
    }
  }
}
</style>