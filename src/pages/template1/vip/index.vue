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
              <template v-if="upgradeValidbet && this.upgradeDeposit">
                {{ $t('还需x有效投注额和x充值金额晋级为VIPx', [upgradeValidbet.toFixed(0), this.upgradeDeposit.toFixed(0), userStore.userInfo.mbrLevel+1]) }}
              </template>
              <template v-else-if="upgradeValidbet">
                {{ $t('还需x有效投注额晋级为VIPx', [upgradeValidbet.toFixed(0), userStore.userInfo.mbrLevel+1]) }}
              </template>
              <template v-else-if="this.upgradeDeposit">
                {{ $t('还需x充值金额晋级为VIPx', [this.upgradeDeposit.toFixed(0), userStore.userInfo.mbrLevel+1]) }}
              </template>
            </div>
          </div>
        </div>
      </q-pull-to-refresh>
      <div class="my-walfare mt-16 box-shadow">
        <div class="walfare-header">
          <p class="text-black fs-16">{{ $t('我的福利') }}</p>
          <span class="fs-12 text-mark">{{ $t('从VIP2享有') }}</span>
        </div>
        <div class="gif-list">
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('生日礼金') }}</p>
            <template v-if="birthdayBonusLeveal === null">
              <span class="theme-color">{{ $t('敬请期待') }}</span>
            </template>
            <template v-else>
              <span class="theme-color" v-if="getVipInfoData && activeVipIndex >= birthdayBonusLeveal">{{activeBirthdayBouns.donateAmount || $t('无')}}</span>
              <span class="theme-color" v-else>VIP {{activeVipIndex > birthdayBonusLeveal ? activeVipIndex : birthdayBonusLeveal}} {{ $t('尊享') }}</span>
            </template>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('升级礼金') }}</p>
            <span :class="activeBouns.donateAmount ? 'theme-color': 'text-mark'">{{activeBouns.donateAmount || $t('无')}}</span>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('每月红包') }}</p>
            <span :class="activeMothBouns.donateAmount ? 'theme-color' : 'text-mark'">{{activeMothBouns.donateAmount || '0'}}</span>
          </div>
          <!-- <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title">日提款额</p>
            <span>{{activityLevel.withDrawalQuota || 0}}</span>
          </div> -->
          <div class="gif-item" :class="getStatus">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('专属优惠') }}</p>
          <template v-if="getAccountVipPrivilegesData.buttonShow === 0 || getAccountVipPrivileges.buttonShow === null">
              <span class="fc-9">{{ $t('已失效') }}</span>
            </template>
            <template v-else>
              <span class="btn theme-btn fs-8" @click="show = true" v-if="getVipInfoData && (getVipInfoData.accountLevel === activeVipIndex)">{{statusMap[getStatus]}}</span>
              <span class="fc-9" v-else>{{ $t('等级不符') }}</span>
            </template>
          </div>
          <div class="gif-item">
            <div class="gif-logo"></div>
            <p class="gif-title text-black">{{ $t('专属豪礼') }}</p>
            <span class="btn theme-btn fs-8" @click="showGif = true" v-if="getVipInfoData && getVipInfoData.accountLevel >= 6 && (getVipInfoData.accountLevel === activeVipIndex)">{{ $t('立即领取') }}</span>
            <span class="theme-color" v-else>VIP{{activeVipIndex > 6 ? activeVipIndex : 6}}{{ $t('尊享') }}</span>
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
            <tr v-for="(item, index) in new Array(maxLevel)" :key="index">
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
          v-model="show"
          :title="$t('提示')"
          className="sdy-modal vip"
          :close-on-click-overlay="false"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <span class="sdy-icon sdy-icon-close" @click="show = false"></span>
          <div class="w-195">
            <div class="gif-logo discount"></div>
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
            <div class="sdy-btn m-t-10" @click="handleToGet">{{ $t('立即领取') }}</div>
            <div class="sdy-btn cancel m-t-10" @click="show = false">{{ $t('返回') }}</div>
          </div>
        </van-dialog>

        <van-dialog
          v-model="showGif"
          :title="$t('提示')"
          className="sdy-modal vip zs"
          :close-on-click-overlay="false"
          :showConfirmButton="false"
          :showCancelButton="false"
        >
          <span class="sdy-icon sdy-icon-close" @click="showGif = false"></span>
          <div class="gif-logo zshl"></div>
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
            <div class="sdy-btn m-t-10" @click="toCopy">{{ $t('复制以上信息') }}</div>
            <div class="sdy-btn m-t-10" @click="$router.push('/customerService')">{{ $t('联系客服领取') }}</div>
            <div class="sdy-btn cancel m-t-10" @click="showGif = false">{{ $t('返回') }}</div>
          </div>
        </van-dialog>
        <van-dialog
          v-model="showBirthdayDialog"
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
import { ref, onMounted } from 'vue'
import { Dialog as VanDialog, Progress as VanProgress } from 'vant'
import SdySelect from 'components/SdySelect.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore, usePayStore } from 'src/stores'

const { t: lang } = useI18n()
const router = useRouter()

const userStore = useUserStore()
const payStore = usePayStore()
const getVipInfoData = ref(null)
const upgradeValidbet = ref(0)
const percentVal = ref(0)
const getAccountVipPrivilegesData = ref({})
const depotCatDtoList = ref([])
const rules = ref(null)

onMounted(async () => {
  await getAccountVipPrivilegesList()
  payStore.getVipInfo()
    .then((res) => {
      const {
        activityLevelList, activityLevelCatDtos, birthdayBonusList, upgradeBonusLevelDtos,
      } = res.data.data
    })
})

const refresh = () => {
  router.replace('/refresh')
}

const checkVipDetails = () => {
  router.push({path: '/vipDetails', query: { getVipInfoData: JSON.stringify(getVipInfoData.value) } })
}

const getAccountVipPrivilegesList = () => {
  return new Promise((resolve, reject) => {
    payStore.getAccountVipPrivileges()
      .then((res) => {
        if (res.data.code === 0) {
          getAccountVipPrivilegesData.value = res.data.data
          const { depotCatDtoList, rule } = res.data.data
          depotCatDtoList.value = depotCatDtoList || []
          rules.value = JSON.parse(rule)
          resolve(true)
        }
        reject()
      })
  })
}
</script>
