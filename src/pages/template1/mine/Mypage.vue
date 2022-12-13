<template>
  <div class="mine-page">
    <q-pull-to-refresh @refresh="refresh">
      <Header :title="$t('我的')" :has-kf="true" />
      <div class="account-info mt-10 mb-15">
        <div class="flex align-center mb-10 plr-16">
          <div class="left">
            <q-img class="avatar"
              :src="userStore.userInfo.gender === '女'? headerFemaleImg : headerMaleImg"
              @click="$router.push('/mine/setting')"
            />
            <div class="vip-level">VIP{{userStore.userInfo.mbrLevel}}</div>
          </div>
          <div class="right">
            <p class="user-name">{{userStore.userInfo.loginName}}</p>
            <span class="joinDays">{{ $t(`加入x第x天`, [envStore.envAppTitle, daysDistance(userStore.userInfo.registerTime)]) }}</span>
          </div>
        </div>
        <div class="flex align-center plr-16">
          <div class="percent-box">
            <VanProgress :percentage="percentVal" color="linear-gradient(135deg, #33D6FC 0%, #127DFE 100%)" />
          </div>
          <span class="vip-text">VIP{{(userStore.userInfo.mbrLevel ?? 0)+1}}</span>
        </div>
        <div class="explain mb-10 plr-16">
          <template v-if="upgradeValidbet && upgradeDeposit">
            {{ $t('还需x有效投注额和x充值金额晋级为VIPx', [upgradeValidbet.toFixed(0), upgradeDeposit.toFixed(0), (userStore.userInfo.mbrLevel ?? 0)+1]) }}
          </template>
          <template v-else-if="upgradeValidbet">
            {{ $t('还需x有效投注额晋级为VIPx', [upgradeValidbet.toFixed(0), (userStore.userInfo.mbrLevel ?? 0)+1]) }}
          </template>
          <template v-else-if="upgradeDeposit">
            {{ $t('还需x充值金额晋级为VIPx', [upgradeDeposit.toFixed(0), (userStore.userInfo.mbrLevel ?? 0)+1]) }}
          </template>
        </div>
        <div class="wallet-box">
          <div class="item flex justify-between">
            <div class="flex align-center mb-10">
              <span class="m-r-10 wdqb" @click="$router.push('/wallet')">{{ $t('我的钱包') }}</span>
              <span class="balance" @click="handleLoading">
                <i class="sdy-icon sdy-icon-refresh" :class="{'a-round': loading}"></i>
              </span>
            </div>
            <div class="sdy-btn" @click="$router.push('/wallet/deposit')">{{ $t('存款') }}</div>
          </div>
          <div class="item flex justify-between align-center">
            <div class="balance fs-28">
              {{ payStore.balance.toFixed(2) }}
            </div>
            <div class="sdy-btn" @click="$router.push('/wallet/withdraw')">{{ $t('提现') }}</div>
          </div>
        </div>
      </div>
    </q-pull-to-refresh>
    <CheckIn :isOut="true" :signDays="signDays" :isAvailable="isAvailable" :signBonusId="signBonusId" :bonuseAmount="bonuseAmount" @resolveSignInfo="resolveSignInfo" />
    <GameRemcomed />
    <MySettinglist />
    <div class="login-out mt-15" @click="logout">{{ $t('退出') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Progress as VanProgress } from 'vant'
import { useUserStore, useEnvStore, usePayStore } from 'src/stores'
import { cloneDeep } from 'src/utils'
import Header from 'components/Header.vue'
import headerFemaleImg from 'images/common/headerFemale.png'
import headerMaleImg from 'images/common/headerMale.png'
import CheckIn from 'src/components/CheckIn.vue'
import MySettinglist from './MySettinglist.vue'
import GameRemcomed from 'src/components/GameRemcomed.vue'

const router = useRouter()
const userStore = useUserStore()
const envStore = useEnvStore()
const payStore = usePayStore()
const percentVal = ref(0)
const upgradeDeposit = ref(0)
const upgradeValidbet = ref(0)
const loading = ref(false)
const getVipInfoData = ref<any>(null)
const activityLevelList = ref([])
const signDays = ref([])
const isAvailable = ref(false)
const signBonusId = ref(0)
const bonuseAmount = ref(0)

let timer = 0

onBeforeMount(() => {
  payStore.getBalance()
  userStore.getMessageUnread()
})

onMounted(() => {
  payStore.getVipInfo()
    .then(res => {
      const { activityLevelList: al } = res.data.data
      if (res.data.data) {
        userStore.$patch(state => state.userInfo.mbrLevel = res.data.data.accountLevel)
      }
      getVipInfoData.value = res.data.data
      activityLevelList.value = al
      const depositAmount = getVipInfoData.value.depositAmount <= getValidbet('top') ? getVipInfoData.value.depositAmount : getValidbet('top')
      const validbet = getVipInfoData.value.validbet <= getValidbet('bottom') ? getVipInfoData.value.validbet : getValidbet('bottom')
      upgradeDeposit.value = getValidbet('top') - depositAmount
      upgradeValidbet.value = getValidbet('bottom') - validbet
      percentVal.value = getVipInfoData.value ? Math.floor((depositAmount + validbet) / (getValidbet('top') + getValidbet('bottom')) * 100) : 0
    })
})

const refresh = () => {
  router.replace({
    path: '/refresh',
  })
}

const getValidbet = (type: string, fromRate?: boolean) => {
  if (getVipInfoData.value) {
        let filterVal = null
        if (getVipInfoData.value.accountLevel === activityLevelList.value.length - 1) {
          // 最高级
          filterVal = getVipInfoData.value.activityLevelList[activityLevelList.value.length - 1]
        } else {
          // 非最高级
          [filterVal] = getVipInfoData.value.activityLevelList.filter((item) => {
            if (item.accountLevel === getVipInfoData.value.accountLevel + 1) {
              return item
            }
            return null
          })
        }

        if (type === 'top') {
          if (fromRate) {
            // 百分率
            return Math.min(getVipInfoData.value.depositAmount / filterVal.depositMin, 1)
          }
          return filterVal.depositMin
        }
        if (fromRate) {
          // 百分率
          return Math.min(getVipInfoData.value.validbet / filterVal.validbetMin, 1)
        }
        return filterVal.validbetMin
      }
      return null
}

const daysDistance = (date: undefined | string) => {
  if (!date) return ''
  const date1 = new Date().getTime()
  const date2 = Date.parse(date.slice(0, 10))
  const ms = date1 - date2
  const days = Math.floor(ms / (24 * 3600 * 1000)) + 1
  return days
}

const handleLoading = () => {
  window.clearInterval(timer)
  loading.value = true
  let a = 0
  timer = window.setInterval(() => {
    if (a === 2) {
      loading.value = false
      window.clearInterval(timer)
    }
    if (a === 1) {
      a += 1
    }
  }, 700)
  payStore.getBalance()
    .finally(() => a = 1)
}

const resolveSignInfo = (x: any) => {
  // 签到总天数
  const tmpSignDays = cloneDeep(x.taskConfigs[0].rewardDto.filesDtos[0].dayDtoList)
  // 我的签到数据
  const mysignInfo = x.taskConfigs[0].rewardDto.taskBonuses
  mysignInfo.sort((a: any, b: any) => {
    const val = new Date(a.time) > new Date(b.time) ? 1 : -1
    return val
  })
  // 今天是否已签到
  if (mysignInfo && mysignInfo.length > 0) {
    const lastSignInfo = mysignInfo[mysignInfo.length - 1]
    isAvailable.value = !isToday(lastSignInfo.time)
    bonuseAmount.value = lastSignInfo.bonusAmount
  } else {
    isAvailable.value = true // 没有签到记录 今天可以签到
  }

  const ruleRowsLength = tmpSignDays.length
  for (let i = 0; i < mysignInfo.length; i++) {
    if (i + 1 > ruleRowsLength) break
    tmpSignDays[i].signStatus = true
    tmpSignDays[i].bonusAmount = mysignInfo[i].bonusAmount
  }
  signDays.value = tmpSignDays
  // 点击签到按钮的要领取的id
  signBonusId.value = x.taskConfigs[0].id
}

const isToday = (str: string) => {
  const d = new Date(str.replace(/-/g, '/'))
  const todaysDate = new Date()
  if (d.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
    return true
  }
  return false
}

const logout = () => {
  userStore.logout()
}
</script>

<style lang="scss">
.mine-page {
  padding: calc(env(safe-area-inset-top) + 44px) 14px 0;
  .account-info {
    border-radius: 10px;
    background: var(--bg1);
    padding-top: 20px;
    .wallet-box {
      padding: 18px 16px 20px;
      background: var(--bg2);
      border-radius: 0 0 10px 10px;
    }
    .percent-box {
      width: 277px;
      margin-right: 7px;
    }
    .vip-text {
      font-size: 14px;
      font-weight: 500;
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        margin-bottom: 6px;
        font-size: 16px;
        line-height: 1;
      }
      span {
        color: var(--t2);
        font-size: 12px;
      }
    }
    .left {
      position: relative;
      padding-bottom: 6px;
      margin-right: 10px;
      .vip-level {
        width: 60px;
        height: 14px;
        line-height: 14px;
        border-radius: 7px;
        background: var(--lg);
        color: #fff;
        font-size: 11px;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .avatar {
      width: 60px;
      height: 60px;
      box-sizing: border-box;
      border: 2px solid #252A2E;
      border-radius: 30px;
    }
    .explain {
      color: var(--t2);
      font-size: 12px;
    }
  }
  .login-out {
    width: 347px;
    height: 40px;
    line-height: 40px;
    background: var(--bg1);
    border-radius: 10px;
    margin: 0 auto 20px;
    text-align: center;
    color: var(--t2);
    font-size: 14px;
  }
}
</style>
