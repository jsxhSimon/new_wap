<template>
  <div class="pg-vip">
    <q-page class="vip">
      <q-pull-to-refresh @refresh="refresh" color="yellow-9" bg-color="white-10" icon="refresh">
        <div class="vip-container box-shadow">
          <span class="theme-color go-vip-btn fs-12" @click="checkVipDetails">{{$t('查看VIP详情')}}</span>
          <div class="flex align-center level-info">
            <div class="vip-bg mr-10">{{userStore.userInfo.mbrLevel}}</div>
            <div class="text-black fs-20 fw-500">{{$t('当前等级')}}: VIP{{userStore.userInfo.mbrLevel}}</div>
          </div>
          <div class="urgrade-box">
            <div class="flex justify-between fs-14 text-black mb-6">
              <span>VIP{{ userStore.userInfo.mbrLevel }}</span>
              <span>VIP{{userStore.userInfo.mbrLevel! + 1}}</span>
            </div>
            <div class="percent-box">
              <VanProgress :percentage="percentVal" color="linear-gradient(135deg, #33D6FC 0%, #127DFE 100%)" />
            </div>
            <div class="explain fs-12 text-mark mt-10">
              <template v-if="upgradeValidbet && upgradeDeposit">
                {{ $t('还需x有效投注额和x充值金额晋级为VIPx', [upgradeValidbet.toFixed(0), upgradeDeposit.toFixed(0), userStore.userInfo.mbrLevel!+1]) }}
              </template>
              <template v-else-if="upgradeValidbet">
                {{ $t('还需x有效投注额晋级为VIPx', [upgradeValidbet.toFixed(0), userStore.userInfo.mbrLevel!+1]) }}
              </template>
              <template v-else-if="upgradeDeposit">
                {{ $t('还需x充值金额晋级为VIPx', [upgradeDeposit.toFixed(0), userStore.userInfo.mbrLevel!+1]) }}
              </template>
            </div>
          </div>
        </div>
      </q-pull-to-refresh>
      <div class="my-walfare mt-16 box-shadow">
        <div class="walfare-header">
          <p class="text-black fs-16">{{ $t('我的福利') }}</p>
          <span class="fs-12 text-mark">{{ $t('从VIP2开始享有') }}</span>
        </div>
        <div class="gif-list">
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('生日礼金') }}</p>
            <template v-if="birthdayBonusLeveal === null">
              <span class="theme-color">{{ $t('敬请期待') }}</span>
            </template>
            <template v-else>
              <span class="theme-color" v-if="getVipInfoData && (activeVipIndex || 0) >= birthdayBonusLeveal">{{activeBirthdayBouns?.donateAmount || $t('无')}}</span>
              <span class="theme-color" v-else>VIP {{(activeVipIndex || 0) > birthdayBonusLeveal ? activeVipIndex : birthdayBonusLeveal}} {{ $t('尊享') }}</span>
            </template>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('升级礼金') }}</p>
            <span :class="activeBouns?.donateAmount ? 'theme-color': 'text-mark'">{{activeBouns?.donateAmount || $t('无')}}</span>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('每月红包') }}</p>
            <span :class="activeMothBouns?.donateAmount ? 'theme-color' : 'text-mark'">{{activeMothBouns?.donateAmount || '0'}}</span>
          </div>
          <!-- <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title">日提款额</p>
            <span>{{activityLevel.withDrawalQuota || 0}}</span>
          </div> -->
          <div class="gif-item" :class="getStatus">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('专属优惠') }}</p>
            <template v-if="getAccountVipPrivilegesData.buttonShow === 0 || getAccountVipPrivilegesData.buttonShow === null">
              <span class="fc-9 text-mark">{{ $t('已失效') }}</span>
            </template>
            <template v-else>
              <span class="btn theme-btn fs-8" @click="show = true" v-if="getVipInfoData && (getVipInfoData.accountLevel === activeVipIndex)">{{statusMap[getStatus]}}</span>
              <span class="fc-9 text-mark" v-else>{{ $t('等级不符') }}</span>
            </template>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('专属豪礼') }}</p>
            <span class="btn theme-btn fs-8" @click="showGif = true" v-if="getVipInfoData && getVipInfoData.accountLevel >= 6 && (getVipInfoData.accountLevel === activeVipIndex)">{{ $t('立即领取') }}</span>
            <span class="theme-color" v-else>VIP{{activeVipIndex! > 6 ? activeVipIndex : 6}}{{ $t('尊享') }}</span>
          </div>
        </div>
      </div>
      <div class="rebate-container box-shadow mt-15">
        <div class="fs-16 theme-black rebate-header">{{ $t('洗码比例') }}</div>
        <table>
          <thead>
            <tr>
              <th v-for="item in titles" :key="item">{{item}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in new Array(envStore.envMaxLevel)" :key="index">
              <td>VIP{{index + 1}}</td>
              <td v-for="t in titles.slice(1)" :key="`td-${t}`">
                {{ getCatDto(index + 1, t) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="fuli mt-15">
        <div class="fs-13 text-black mb-10">{{$t('高级福利')}}</div>
        <div class="fuli-item holiday">
          <div class="info">
            <div class="text-black fs-14">VIP5{{$t('享有')}}</div>
            <div class="gold fs-30 fw-700">
              <span>{{$t('节日礼金')}}</span>
            </div>
            <div class="gold fs-10">
              <span>HOLIDAY GIFT</span>
            </div>
          </div>
        </div>
        <div class="fuli-item senior">
          <div class="info">
            <div class="text-black fs-14">VIP6{{$t('享有')}}</div>
            <div class="gold fs-30 fw-700">
              <span>{{$t('高级秘书')}}</span>
            </div>
            <div class="gold fs-10">
              <span>SENIOR SECRETARY</span>
            </div>
          </div>
        </div>
        <div class="fuli-item travel">
          <div class="info">
            <div class="text-black fs-14">VIP7{{$t('享有')}}</div>
            <div class="gold fs-30 fw-700">
              <span>{{$t('豪华旅游')}}</span>
            </div>
            <div class="gold fs-10">
              <span>LUXURY TRAVEL</span>
            </div>
          </div>
        </div>
      </div>

        <van-dialog
          v-model:show="show"
          :title="$t('提示')"
          className="sdy-modal vip"
          :close-on-click-overlay="false"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <span class="iconfont icon-yuyinguanbi sdy-icon-close" @click="show = false"></span>
          <div class="w-195">
            <!-- <div class="gif-logo discount"></div> -->
            <p class="vip-title">{{ $t('晋级优惠') }}</p>
            <div class="w-135">
              <p class="flex-item">
                <span class="label">{{ $t('最低余额') }}：</span>
                <span>{{ activityRuleDto.amountMin }}</span>
              </p>
              <p class="flex-item">
                <span class="label">{{ $t('红利比例') }}：</span>
                <span>{{ activityRuleDto.donateAmount }}</span>
              </p>
              <p class="flex-item">
                <span class="label">{{ $t('最高彩金') }}：</span>
                <span>{{ activityRuleDto.donateAmountMax }}</span>
              </p>
              <p class="flex-item">
                <span class="label">{{ $t('流水倍数') }}：</span>
                <span>{{ activityRuleDto.multipleWater }}</span>
              </p>
              <p class="flex-item">
                <span class="label">{{ $t('领取次数') }}：</span>
                <span>{{upgradeBonusCycle}}{{ activityRuleDto.drawNumber }}</span>
              </p>
            </div>
            <SdySelect :list="mapSelectData" :value="activeCatId" @change="handleSelectCat" />
            <div class="sdy-btn mt-10" @click="handleToGet">{{ $t('立即领取') }}</div>
            <div class="sdy-btn cancel mt-10" @click="show = false">{{ $t('返回') }}</div>
          </div>
        </van-dialog>

        <van-dialog
          v-model:show="showGif"
          :title="$t('提示')"
          className="sdy-modal vip zs"
          :close-on-click-overlay="false"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <span class="iconfont icon-yuyinguanbi sdy-icon-close" @click="showGif = false"></span>
          <!-- <div class="gif-logo zshl"></div> -->
          <p class="vip-title">{{ $t('专属豪礼') }}</p>
          <div class="explain text-center m-b-20">{{ $t('请填写寄送信息') }}</div>
          <div class="sdy-form">
            <div class="sdy-input">
              <span class="label">{{ $t('用户名') }}：</span>
              <input v-model="userStore.userInfo.loginName" readonly type="text">
            </div>
            <div class="sdy-input">
              <span class="label">{{ $t('收件人') }}：</span>
              <input v-model="receiveName" type="text" maxlength="10">
            </div>
            <div class="sdy-input">
              <span class="label">{{ $t('手机号码') }}：</span>
              <input v-model="phone" type="tel" maxlength="20">
            </div>
            <div class="sdy-input">
              <span class="label">{{ $t('所在区域') }}：</span>
              <input v-model="region" type="text" maxlength="200">
            </div>
            <div class="sdy-input">
              <span class="label">{{ $t('详细地址') }}：</span>
              <input v-model="adreess" type="text" maxlength="200">
            </div>
            <div class="explain">
              {{ $t('先点击【复制以上信息】后点击【联系客服领取】到客服页面后双击输入框进行粘贴信息后发送给客服进行领取。') }}
            </div>
          </div>
          <div class="w-195">
            <div class="sdy-btn mt-10" @click="toCopy">{{ $t('复制以上信息') }}</div>
            <div class="sdy-btn mt-10" @click="$router.push('/customerService')">{{ $t('联系客服领取') }}</div>
            <div class="sdy-btn cancel mt-10" @click="showGif = false">{{ $t('返回') }}</div>
          </div>
        </van-dialog>
        <van-dialog
          v-model:show="showBirthdayDialog"
          :title="$t('提示')"
          className="sdy-modal birthday zs"
          :close-on-click-overlay="false"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <div class="awardText">
            {{ $t('尊敬的') }}<span class="theme-color">{{ userStore.userInfo.mbrLevel }}{{ $t('级VIP') }}</span>{{ $t('会员') }} {{ userStore.userInfo.loginName }} <span class="theme-color">{{ $t('生日快乐') }}</span>，
            {{ $t('特为您奉上生日礼金') }}<span class="theme-color"> {{ birthdayBonusAmount || 0 }}</span> {{ $t('元') }}，
            {{birthdayBonusMultipleWater}}{{ $t('倍流水即可提现') }}。
            <div>
              <span class="yellowLight">{{ $t('祝您顺心顺意，一本万利！') }}</span>
            </div>
          </div>
          <div class="actions mt-10">
            <div class="cancel theme-color theme-border" @click="showBirthdayDialog = false">{{ $t('取消') }}</div>
            <div class="sdy-btn" @click="togetAwardBtn">{{ $t('立即领取') }}</div>
          </div>
        </van-dialog>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { Dialog as VanDialog, Progress as VanProgress } from 'vant'
import SdySelect from 'components/SdySelect.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore, usePayStore, useEnvStore } from 'src/stores'
import useClipboard from 'vue-clipboard3'
import crypto from 'src/utils/crypto'

const { t: lang } = useI18n()
const router = useRouter()

const { toClipboard } = useClipboard()
const userStore = useUserStore()
const payStore = usePayStore()
const envStore = useEnvStore()
const getVipInfoData = ref<IVipInfoData | null>(null)
const upgradeValidbet = ref(0)
const percentVal = ref(0)
const getAccountVipPrivilegesData = ref<Partial<IAccountVipPrivilegesData>>({})
const depotCatDtoList = ref<IDepotCatDto[]>([])
const upgradeDeposit = ref(0)
const rules = ref<IAccountVipRules | null>(null)
const birthdayBonusList = ref<IBirthdayBonus[]>([])
const activeVipIndex = ref<number | null>(null)
const swiperVipIndex = ref<number | null>(null)
const upgradeBonusList = ref<IUpgradeBonusLevelDto[]>([])
const monthlyBonus = ref<IMonthlyBonu[]>([])
const activityLevelCatDtos = ref<IActivityLevelCatDto[]>([])
const activityLevelList = ref<IActivityLevel[]>([])
const show = ref(false)
const showGif = ref(false)
const vipCount = ref<Partial<{
  amountMin: number;
  donateAmount: number;
  donateAmountMax: number;
  multipleWater: number;
  drawNumber: number;
  drawType: number;
}>>({})
const activeCatId = ref<number | null>(null)
const activeCat = ref<
{
  title: string;
  catId: number;
  list: IDepotCatDto[];
} | null
>(null)
const showBirthdayDialog = ref(false)
const birthdayBonusAmount = ref(0)
const birthdayBonusMultipleWater = ref(0)
const bonusActivityId = ref<number | null>(null)
const receiveName = ref('')
const phone = ref('')
const region = ref('')
const adreess = ref('')


const statusMap: Record<string, string> = {
  level: lang('等级不符'),
  getted: lang('已领取'),
  toGet: lang('立即领取'),
  auditFailed: lang('立即领取'),
  substandard: lang('立即存款'),
}

const titles = computed(() => {
  const arr = ['等级']
  activityLevelCatDtos.value.forEach((item) => {
    if (item.donateRatio && !arr.includes(item.catName)) arr.push(item.catName)
  })
  return arr
})

const birthdayBonusLeveal = computed(() => {
  let leveal = 0
  birthdayBonusList.value.some((item, index) => {
    if (item.donateAmount > 0) {
      leveal = index + 1
      return true
    }
    return false
  })
  return leveal
})

const activeBirthdayBouns = computed(() => {
  return birthdayBonusList.value.find(item => item.accountLevel === activeVipIndex.value)
})

const activeBouns = computed(() => {
  return upgradeBonusList.value.find(item => item.accountLevel === activeVipIndex.value)
})

const activeMothBouns = computed(() => {
  return monthlyBonus.value.find(item => item.accountLevel === activeVipIndex.value)
})

const getStatus = computed(() => {
  if (getVipInfoData.value?.accountLevel !== swiperVipIndex.value) {
    return 'levelLow'
  }
  if (getAccountVipPrivilegesData.value?.buttonShow === 1) {
    return 'toGet'
  }
  if (getAccountVipPrivilegesData.value?.buttonShow === 4) {
    return 'auditFailed'
  }
  if (getAccountVipPrivilegesData.value?.buttonShow === 3) {
    return 'getted'
  }
  return 'substandard'
})

const activityRuleDto = computed(() => {
  const obj: Partial<{
    amountMin: number;
    donateAmount: number;
    donateAmountMax: number;
    multipleWater: number;
    drawNumber: number;
  }> = {}
  if (rules.value) {
    const temp = rules.value.ruleScopeDtos.find(item => item.accountLevel === activeVipIndex.value!)
    const rdt = temp?.activityRuleDtos
    obj.drawNumber = temp?.drawNumber
    if (rdt) {
      const {
        amountMin,
        donateAmount,
        donateAmountMax,
        multipleWater
      } = rdt
      obj.amountMin = amountMin
      obj.donateAmountMax = donateAmountMax
      obj.donateAmount = donateAmount
      obj.multipleWater = multipleWater
    }
  }
  return obj
})

const upgradeBonusCycle = computed(() => {
  let type = ''
  switch (vipCount.value.drawType) {
    case 0:
      type = lang('每日')
      break
    case 1:
      type = lang('每周')
      break
    case 2:
      type = lang('近7日')
      break
    case 3:
      type = lang('仅')
      break
    case 4:
      type = lang('每月')
      break
    default:
      type = ''
  }
  return type
})

const adAlertVipList = computed(() => {
  const ruleScopeDtos = rules.value?.ruleScopeDtos ?? []
  const activeRule = ruleScopeDtos.find(item => item.accountLevel === swiperVipIndex.value)
  const auditCats = activeRule?.auditCats ?? []
  return auditCats.map(itemOuter => {
    const audObj: {
      title: string;
      catId: number;
      list: IDepotCatDto[];
    } = {
      title: '',
      catId: itemOuter.catId,
      list: [],
    }
    const depotIdList = itemOuter.depots.map(item => item.depotId)
    depotCatDtoList.value.forEach(itemInner => {
      if (itemOuter.catId === itemInner.catId && depotIdList.includes(itemInner.depotId)) {
        audObj.list.push(itemInner)
        audObj.title = itemInner.catName
      }
    })
    return audObj
  })
})

const mapSelectData = computed(() => {
  return adAlertVipList.value.map(item => ({
    value: item.catId,
    label: item.title,
  }))
})

onMounted(async () => {
  await getAccountVipPrivilegesList()
  payStore.getVipInfo()
    .then((res) => {
      const {
        activityLevelList: al, activityLevelCatDtos: alc, birthdayBonusList, upgradeBonusLevelDtos,
      } = res.data.data
      getVipInfoData.value = res.data.data
      activityLevelList.value = al
      upgradeBonusList.value = upgradeBonusLevelDtos || []
      monthlyBonus.value = res.data.data.monthlyBonus?.ruleScopeDtoList || []
      activityLevelCatDtos.value = alc
      const depositAmount = getVipInfoData.value!.depositAmount <= getValidbet('top')! ? getVipInfoData.value?.depositAmount : getValidbet('top')
      const validbet = getVipInfoData.value!.validbet <= getValidbet('bottom')! ? getVipInfoData.value!.validbet : getValidbet('bottom')
      upgradeDeposit.value = getValidbet('top')! - depositAmount!
      upgradeValidbet.value = getValidbet('bottom')! - validbet!
      percentVal.value = getVipInfoData.value ? Math.floor((depositAmount! + validbet!) / (getValidbet('top')! + getValidbet('bottom')!) * 100) : 0
    })

  getBirthStatus()
})

const refresh = () => {
  router.replace('/refresh')
}

const checkVipDetails = () => {
  const str = JSON.stringify(getVipInfoData.value)
  router.push({path: '/vipDetails', query: { getVipInfoData: str } })
}

const getCatDto = (level: number, catName: string) => {
  return activityLevelCatDtos.value.find(item => item.accountLevelId === level && item.catName === catName)?.donateRatio
}

const getAccountVipPrivilegesList = () => {
  return new Promise((resolve, reject) => {
    payStore.getAccountVipPrivileges()
      .then((res) => {
        if (res.data.code === 0) {
          getAccountVipPrivilegesData.value = res.data.data
          const { depotCatDtoList: dt, rule } = res.data.data
          depotCatDtoList.value = dt || []
          rules.value = JSON.parse(rule)
          resolve(true)
        }
        reject()
      })
  })
}

const handleSelectCat = (catId: number) => {
  const temp = adAlertVipList.value.find(item => item.catId === catId) ?? null
  activeCat.value = temp
  activeCatId.value = catId
}

const handleToGet = () => {
  togetAward('toGet')
}

const togetAwardBtn = () => {
  togetAward('toGet', true)
}

const togetAward = (status: string, formBirth?: boolean) => {
  if (status === 'toGet') {
    if (!activeCat.value && !formBirth) return Notify.create(lang('请选择场馆！'))
    let params: any = {}
    if (formBirth) {
      params.activityId = bonusActivityId.value
    } else {
      params.activityId = getAccountVipPrivilegesData.value.id
      params.catId = activeCat.value?.catId
    }
    payStore.getActApply(params)
      .then(res => {
        if (res.data.code === 0) {
          showBirthdayDialog.value = false
          if (formBirth) {
            Notify.create(`+${birthdayBonusAmount.value} ${lang('领取成功')}`)
          } else {
            Notify.create(lang('领取成功'))
          }
          getAccountVipPrivilegesList()
        }
      })
  }
}

const getBirthStatus = () => {
  payStore.getAccountBirthday()
    .then(res => {
      if (res.data.code === 0) {
        showBirthdayDialog.value = res.data.data.isBirthday
        birthdayBonusAmount.value = res.data.data.donateAmount
        birthdayBonusMultipleWater.value = res.data.data.multipleWater
        bonusActivityId.value = res.data.data.activityId
      }
    })
}

const toCopy = () => {
  let errorText = ''
  if (!receiveName.value.trim()) errorText = lang('请输入收件人信息')
  if (!phone.value.trim()) errorText = lang('请输入收件人手机号')
  if (!region.value.trim()) errorText = lang('请输入收件地址所在区域')
  if (!adreess.value.trim()) errorText = lang('请输入收件人详细地址')
  toClipboard
  if (errorText) {
    Notify.create(errorText)
  } else {
    toClipboard(`${lang('收件人')}：${receiveName.value}\n${lang('手机号码')}：${phone.value}\n${lang('所在地区')}：${region.value}\n${lang('详细地址')}：${adreess.value}；`)
      .then(() => {
        Notify.create(lang('复制成功'))
      })
      .catch(() => {
        Notify.create(lang('复制失败'))
      })
  }
}

const getValidbet = (type: string, fromRate?: boolean) => {
  if (getVipInfoData.value) {
    let filterVal: IActivityLevel | null = null
    if (getVipInfoData.value.accountLevel === activityLevelList.value.length - 1) {
      filterVal = getVipInfoData.value.activityLevelList[activityLevelList.value.length - 1]
    } else {
      [filterVal] = getVipInfoData.value.activityLevelList.filter((item) => {
        if (item.accountLevel === getVipInfoData.value!.accountLevel + 1) {
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
</script>

<style lang="scss">
.adAlertVip{
  width:98%;
  .c-color{
    color: var(--theme-color);
  }

  .adAlertTitle{
    text-align:center;
    display:block;
    font-weight:bold;
    margin-bottom:4px;
  }
  .adAlertVipList{
    margin-bottom:5px;
  }
}
</style>
<style lang="scss" scoped>
.pg-vip {
  position: relative;
}
.sdy-header {
  border: none;
  z-index: 9;
}
.explain {
  font-size: 11px;
  font-weight: 400; 
  color: var(--t2);
  line-height: 16px;
}
.vip {
  /*padding: 0 10pt 10pt;*/
  background-size: 76.5% auto;
  background-position: 50% calc(env(safe-area-inset-top) + 8.5%);
  .active-level-detail {
    display: flex;
    color: var(--t2);
    font-size: 12px;
    padding: 25px 14px 20px;
    .title {
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 6px;
      color: var(--theme-color);
    }
    span {
      color: var(--theme-color);
    }
    .item {
      flex: 1;
      text-align: center;
    }
  }
  .p-header {
    height: calc(env(safe-area-inset-top) + 44px);
  }
  .user-info {
    padding: 0 20px;
    width: 100%;
    height: auto;
    padding-top: 44px;
    overflow: hidden;
    .user-img {
      float: left;
      width: 60px;
      height: 60px;
      img {
        width: 100%;
      }
    }
  }
  .vip-details {
    padding: 0 10px;
  }

  .title {
    margin-bottom: 10px;
    font-size: 12px;
    color: var(--t1);
    font-weight: bold;
  }

  .btn {
    width: 172px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 5pt;
    font-size: 16px;
  }
  .c-color {
    color: var(--t2);
    font-size: 14px;
    font-weight: 700;
  }
}

.gif-list {
  display: flex;
  flex-wrap: wrap;
  .gif-item {
    width: 102px;
    text-align: center;
    margin-right: 2px;
    margin-top: 30px;
    box-sizing: border-box;
    padding: 0 10px;
    .btn {
      display: block;
      width: 60px;
      margin: 0 auto;
      color: var(--t5);
      font-size: 10px;
      height: 18px;
      line-height: 18px;
      background: var(--lg2);
      // box-shadow: 0px 0px 10px 0px rgba(18, 18, 18, 0.6);
      // padding: 3px 0;
      border-radius: 7px;
      margin-top: 6px;
    }
    &.getted,
    &.levelLow,
    &.auditFailed,
    &.substandard {
      pointer-events: none;
      .btn {
        opacity: .5;
      }
    }
    p {
      margin-bottom: 0;
    }
    span {
      font-size: 11px;
    }
    .gif-logo {
      height: 60px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center top;
    }
    .gif-title {
      font-size: 12px;
      color: var(--theme-color);
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:nth-child(1) .gif-logo {
      background-image: url('images/mine/vip/birthday-cake@2x.png');
    }
    &:nth-child(2) .gif-logo {
      background-image: url('images/mine/vip/live-up-icon@2x.png');
    }
    &:nth-child(3) .gif-logo {
      background-image: url('images/mine/vip/_Red-envelope@2x.png');
    }
    &:nth-child(4) .gif-logo {
      background-image: url('images/mine/vip/Withdrawal-limit@2x.png');
    }
    &:nth-child(5) .gif-logo {
      background-image: url('images/mine/vip/mine-discount@2x.png');
    }
    &:nth-child(6) .gif-logo {
      background-image: url('images/mine/vip/Howe-gift@2x.png');
    }
  }
}
.vip-container {
  width: 347px;
  background: var(--bg1);
  border-radius: 10px;
  margin: 10px auto 15px;
  position: relative;
  .go-vip-btn {
    position: absolute;
    right: 14px;
    top: 15px;
  }
  .level-info {
    padding: 20px 20px 22px;
    height: 51px;
    box-sizing: content-box;
    .vip-bg {
      width: 50px;
      height: 48px;
      background: url('images/mine/vip/vip-bg.png') no-repeat center center;
      background-size: contain;
      text-align: center;
      padding-top: 8px;
      box-sizing: border-box;
      color: var(--t9);
      font-weight: 600;
      font-size: 18px;
    }
  }
  .urgrade-box {
    padding: 20px 15px;
    background: var(--bg2);
    border-radius: 0 0 10px 10px;
  }
}
.my-walfare {
  width: 347px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px 15px 32px;
  background: var(--bg1);
  border-radius: 10px;
  line-height: 1;
  .walfare-header {
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color2);
    p {
      margin-bottom: 5px;
    }
  }
}
.rebate-container {
  width: 347px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px 15px;
  background: var(--bg1);
  border-radius: 10px;
  .rebate-header {
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color2);
  }
  table {
    width: 100%;
    text-align: center;
    font-size: 11px;
    line-height: 25px;
    margin-top: 10px;
    color: var(--t2);
    th {
      color: var(--t1);
    }
  }
}
.fuli {
  width: 347px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 20px;
  .fuli-item {
    height: 120px;
    background-color: var(--bg1);
    border-radius: 10px;
    margin-bottom: 10px;
    background-repeat: no-repeat;
    background-position: 186px center;
    &.holiday {
      background-size: 139px auto;
      background-image: url('images/mine/vip/vip-holiday.png');
    }
    &.senior {
      background-position: 209px center;
      background-size: 104px auto;
      background-image: url('images/mine/vip/vip-senior.png');
    }
    &.travel {
      background-position: 192px 0;
      background-size: 112px auto;
      background-image: url('images/mine/vip/vip-travel.png');
    }
    .info {
      height: 100%;
      width: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .gold {
        background-image: var(--lg3);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
  }
}
.sdy-modal.birthday {
  width: 315px!important;
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 122px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .canenl {
      border: 1px solid 
    }
  }
  :deept(.van-dialog__footer),
  :deep(.van-dialog__content:after) {
    display: none;
  }
  
}
.sdy-select {
  margin-top: 20px;
}
.text-mark {
  color: var(--t7);
}
</style>
