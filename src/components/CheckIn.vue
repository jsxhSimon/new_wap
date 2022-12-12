<template>
  <div class="checkInBox">
    <div class="checkInCenter">
      <div class="checkInList">

        <div class="line" :class="`sing-${signDays.filter(item => item.signStatus).length}`"></div>
        <div class="checkInItem"
              v-for="(item, index) in signDays"
              :key="index">
          <span class="score">+{{ item.signStatus ? item.bonusAmount : '0' }}</span>
          <span class="sign-icon" :class="item.signStatus ? 'signTxtSigned':''"></span>
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
    .go-rule {
      font-size: 12px;
      line-height: 38px;
      color: var(--t6);
    }
  }
  toSign {

  }
}
</style>
