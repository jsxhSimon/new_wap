<template>
  <div class="checkInBox">
    <div class="checkInCenter">
      <div class="checkInList">

        <div class="line" :class="`sing-${signDays.filter(item => item.signStatus).length}`"></div>
        <div class="checkInItem"
              v-for="(item, index) in signDays"
              :key="index">
          <span class="score">+{{ item.signStatus ? item.bonusAmount : '0' }}</span>
          <span class="sign-icon" :class="item.signStatus ? 'signTxtSigned':''">
            <i class="iconfont icon-duigou1"></i>
          </span>
        </div>
      </div>
      <div class="text-box">
        <span class="checkInTitle">{{isOut ?  $t('签满7日另送礼金28元') : $t('签满7日另送礼金28元或者88元+额外礼金100元')}}</span>
        <span v-if="isOut" class="go-rule has-right active" @click="$router.push('/activity/CheckIn')">{{ $t('上上签到规则') }}</span>
      </div>

    </div>
    <q-btn  class="toSign" :class="isAvailable ? '':'btnSigned'" :label="isAvailable ? $t('点击签到'): $t('已签到')" :disable="!isAvailable" @click="handleSignClick"  />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore } from 'src/stores'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'

interface Props {
  signDays?: {
    signStatus: number;
    bonusAmount: number;
  }[];
  isAvailable?: boolean;
  signBonusId: number;
  bonuseAmount: number;
  isOut?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  signDays: () => [],
  isAvailable: false,
  isOut: false,
})

const emits = defineEmits(['resolveSignInfo'])
const { t: lang } = useI18n()
const taskStore = useTaskStore()

onMounted(() => {
  getMySignInfo()
})

const handleSignClick = () => {
  taskStore.clickRate({configId: props.signBonusId})
  taskStore.clickSignBtn({ configId: props.signBonusId, terminal: 1 })
    .then(() => {
      // 领取的金额再getAccountSignInfo接口的taskBonuses中,所以领取成功后需要先重新拉下接口,然后再提示
      getMySignInfo().then(() => {
        Notify.create(`+${props.bonuseAmount} ${lang('领取成功')}`)
      })
    })
}
const getMySignInfo = () => {
  return taskStore.getAccountSignInfo()
    .then((x) => {
      emits('resolveSignInfo', x)
    })
}
</script>

<style lang="scss">
.checkInBox {
  padding: 0 10px;
  .text-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--t7);
    .go-rule {
      line-height: 38px;
      color: var(--t8);
    }
  }
  .toSign,
  .btnSigned {
    display: block;
    width: 180px;
    height:28px;
    text-align:center;
    font-size:14px;
    border-radius: 14px;
    background: var(--lg2);
    color: var(--t5);
    margin: 0 auto 20px;
    box-sizing: border-box;
    min-height: auto;
    padding-top: 2px;
    &.btnSigned {
      background: var(--btn-disabled-bg);
      color: var(--t2);
    }
  }
  .checkInList{
    height: 48px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    position: relative;
    .line{
        height: 2px;
        width: 100%;
        position:absolute;
        border-radius:10px;
        top: 32px;
        background: var(--check-in-line-bg);
        overflow: hidden;
        &:after {
          content: "";
          width: 0;
          height: 100%;
          float: left;
          background: var(--theme-color);
        }
        &.sing-2:after {
          width: 16.67%;
        }
        &.sing-3:after {
          width: 33.34%;
        }
        &.sing-4:after {
          width: 50%;
        }
        &.sing-5:after {
          width: 66.67%;
        }
        &.sing-6:after {
          width: 83.34%;
        }
        &.sing-7:after {
          width: 100%;
        }
      }
  }
  .checkInItem{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    position:relative;
    color: var(--t7);
    .sign-icon {
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 1px solid var(--check-in-line-bg);
      margin-top: 2px;
      background: var(--body-bg);
      .iconfont {
        display: none;
      }
      &.signTxtSigned {
        border: none;
        background: var(--theme-color);
        position: relative;
        .iconfont {
          display: block;
          color: #fff;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .days{
      font-size:12px;
    }
  }
}
</style>
