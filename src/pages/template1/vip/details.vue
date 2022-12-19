<template>
  <div class="vip-details">
    <div class="vip-bg" :class="`vip-level-${vipLevel}`">
      <div class="vip-pre"></div>
      <div class="vip-act"></div>
      <div class="vip-next"></div>
      <span class="vip-change-icon" @click="reduce"></span>
      <span class="vip-change-icon right" @click="add"></span>
    </div>
    <div class="vip-main">
      <div class="vip-info">
        <template v-if="fs && fs.length">
          <div class="info-title title1"></div>
          <div class="v-list">
            <template  v-for="(item, index) in fs">
              <span class="list-item" v-if="index !== 0" :key="item.catName">
                {{item.catName}} {{ item.donateRatio }}
              </span>
            </template>
          </div>
        </template>
        <template v-if="gz.length">
          <div class="info-title title2"></div>
          <div class="v-list">
            <template  v-for="(item, index) in gz">
              <span class="list-item" v-if="index !== 0" :key="item.catName">
                {{title2[index]}}{{ item.name }}
              </span>
            </template>
          </div>
        </template>
        <template v-if="upgradeBouns && mouthlyBouns && birthdayBonus">
          <div class="info-title title3"></div>
          <div class="v-list">
            <span class="list-item">{{ $t('升级礼金') }} {{upgradeBouns.donateAmount || $t('无')}}</span>
            <span class="list-item">{{ $t('每月红包') }} {{mouthlyBouns.donateAmount || $t('无')}}</span>
            <span class="list-item">{{ $t('生日礼盒') }} {{birthdayBonus.donateAmount || $t('无')}}</span>
            <span class="list-item" v-if="gift">{{ $t('豪礼赠送') }} {{gift}}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="btn-wrap">
      <div
        class="btn venues"
        :class="{active: unfoldedCouponId === '1'}"
        @click="toggleCouponDetail('1')"
      >{{ $t('活动规则与条款') }}</div>
      <div
        class="btn venues"
        :class="{active: unfoldedCouponId === '2'}"
        @click="toggleCouponDetail('2')"
      >
        {{ $t('不返水游戏列表') }}
      </div>
      <div
        class="txt"
        v-if="unfoldedCouponId === '1'"
      >
        <p class="content-wrapper" v-if="content" v-html="content"></p>
      </div>
      <div class="game-detail text-mark" v-if="unfoldedCouponId === '2'">
        <p>{{ $t('不返水游戏同时也不计入升级流水') }}</p>
        <table
          class="game"
        >
          <tr>
            <th>{{ $t('游戏平台') }}</th>
            <th>{{ $t('游戏') }}</th>
          </tr>
          <tr v-for="(item, index) in gameLists" :key="index">
            <td>{{ item.depotName }}</td>
            <td style="text-align:left;">{{ item.list.toString() }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEnvStore, usePayStore } from 'src/stores'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface IData {
  catName: string;
  donateRatio: string;
}

const { t: lang } = useI18n()
const route = useRoute()
const payStrore = usePayStore()
const envStore = useEnvStore()
const vipLevel = ref(0)
const dataList = ref<IData[][]>([])
const getVipInfoData = ref<Partial<IVipInfoData>>({})
const content = ref('')
const gift = ref('')
const title = ref<string[]>([])
const dataList2 = ref<any[]>([])
const dataList3 = ref<any[]>([])
const gameLists = ref<{
  depotName: string;
  gameList: IMainGame[];
  list: string[];
}[]>([])
const title2 = [lang('会员等级'), lang('累计存款'), lang('累计有效流水'), lang('保级有效流水')]
const title3 = [lang('会员等级'), lang('升级礼金'), lang('每月红包'), lang('生日礼金'), lang('豪礼赠送')]
const unfoldedCouponId = ref('1')

const fs = computed(() => {
  return dataList.value[vipLevel.value]
})

const gz = computed(() => {
  if (vipLevel.value === 0) return []
  return dataList2.value[vipLevel.value - 1]
})

const upgradeBouns = computed(() => {
  if (vipLevel.value === 0) return null
  return getVipInfoData.value.upgradeBonusLevelDtos && getVipInfoData.value.upgradeBonusLevelDtos[vipLevel.value - 1]
})

const mouthlyBouns = computed(() => {
  if (vipLevel.value === 0) return null
  return getVipInfoData.value.monthlyBonus && getVipInfoData.value.monthlyBonus.ruleScopeDtoList[vipLevel.value - 1]
})

const birthdayBonus = computed(() => {
  if (vipLevel.value === 0) return null
  return getVipInfoData.value.birthdayBonusList && getVipInfoData.value.birthdayBonusList[vipLevel.value - 1]
})

onMounted(async () => {
  const data = route.query.getVipInfoData as string
  if (data) {
    getVipInfoData.value = JSON.parse(data)
  } else {
    const res = await payStrore.getVipInfo()
    getVipInfoData.value = res.data.data || {}
  }
  vipLevel.value = getVipInfoData.value.accountLevel ?? 0
  const dataListItems: any = []
  const titles = ['VIP等级']

  if (getVipInfoData.value.hdgz) {
    const hdgz = JSON.parse(getVipInfoData.value.hdgz)
    content.value = hdgz.content
  }
  if (getVipInfoData.value.hlzs) {
    const hlzs = JSON.parse(getVipInfoData.value.hlzs)
    const itemArr = hlzs.rules.filter((item: any) => parseInt(item.level.replace(/[^\d]/g, ''), 0) === vipLevel.value)
    gift.value = itemArr.length > 0 ? itemArr[0].gift : ''
  }
  getVipInfoData.value.activityLevelCatDtos?.forEach((item) => {
    if (titles.indexOf(item.catName) === -1) {
      titles.push(item.catName)
    }
  })

  getVipInfoData.value.activityLevelCatDtos?.forEach((item) => {
    if (!dataListItems[item.accountLevelId]) {
      dataListItems[item.accountLevelId] = [item]
    } else {
      dataListItems[item.accountLevelId].push(item)
    }
  })

  const datasArr = dataListItems
    .map((item: any) => {
      const arr: any = []
      titles.forEach((itemIn) => {
        let donateRatios = '0%'
        let tierNames = ''
        item.forEach((itemIIn: any) => {
          if (itemIIn.catName === itemIn) {
            donateRatios = `${itemIIn.donateRatio}%`
            tierNames = itemIIn.tierName
          }
        })

        if (itemIn === 'VIP等级') {
          donateRatios = item[0].tierName
        }

        arr.push({
          catName: itemIn,
          donateRatio: donateRatios,
        })
        if (!arr[0].donateRatio && tierNames) {
          arr[0].donateRatio = tierNames
        }
      })
      return arr
    })
  dataList.value = handlerTable1(datasArr, titles)
  // this.title = titles

  // dataList2
  // 累计存款  累计有效流水 保级有效流水
  dataList2.value = getVipInfoData.value.activityLevelList!.filter(f => f.accountLevel > 0)
    .map(item => [
      {
        name: item.tierName,
      }, {
        name: item.depositMin > 0 ? `≥${formatData(item.depositMin)}` : '0',
      }, {
        name: item.validbetMin > 0 ? `≥${formatData(item.validbetMin)}` : '0',
      }, {
        name: item.downgradeBet > 0 ? `≥${formatData(item.downgradeBet)}` : '0',
      },
    ])

  const levels = getVipInfoData.value.activityLevelList!.filter(item => item.accountLevel > 0)
  dataList3.value = levels


  // 不反水游戏列表
  payStrore.getGameListWithoutRebate().then((res) => {
    if (res.data.code === 0) {
      gameLists.value = res.data.data.map((item: any) => {
        item.list = item.gameList.map((itemIn: any) => ` ${itemIn.gameName}`)
        return item
      })
    }
  })
})

const add = () => {
  vipLevel.value += 1
  if (vipLevel.value > envStore.envMaxLevel) vipLevel.value = envStore.envMaxLevel
}

const reduce = () => {
  vipLevel.value -= 1
  if (vipLevel.value < 0) vipLevel.value = 0
}

const handlerTable1 = (arr: any, titles: any) => {
  arr = arr.filter((f: any) => f)

  let needDelColArr: any = []
  // 全部是0的列去除
  arr[0].map((currentValue: any, index: number) => {
    // 每一列都为0 则要清空
    const needDelCol =  arr.every((e: any) => e[index].donateRatio && e[index].donateRatio === '0%')
    if (needDelCol) needDelColArr.push(currentValue.catName)
  })

  for (let i = 0; i < arr.length; i++) {
    var newArr = arr[i].filter((f: any) => !needDelColArr.includes(f.catName))
    arr[i]= newArr
  }

  //相应表头清空
  title.value = titles.filter((x: string) => !needDelColArr.includes(x))

  return arr
}

const toggleCouponDetail = (id: string) => {
  unfoldedCouponId.value = id
}

const formatData = (data: number) => {
  if (data > 9999) {
    return `${data / 10000}w`
  }
  return data
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  white-space: pre-wrap;
}
.vip-details {
  padding-bottom: 20px;
  .icon-kefu {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 22px;
    top: 10px;
    background: url('images/common/kefu.png') no-repeat center center;
    background-size: contain;
  }
  .top-img {
    margin-bottom: 10px;
  }
  .details-tab {
    position: relative;
    display: flex;
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    overflow: hidden;
    div {
      z-index: 9;
      flex: 1;
      img {
        display: block;
        width: 80%;
        margin: 0 auto;
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 25px;
      width: 100%;
      height: 1pt;
      background: #ff9036ff;
    }
  }
  .data-table {
    padding: 0 10pt;
  }
  table {
    width: 100%;
    font-size: 11px;
    text-align: center;
    border-collapse: separate;
    border-spacing: 0;
    // border-radius: 8px;
    tr {
      &:first-child {
        background: #fba002ff;
      }
      &:last-child {
        // border-radius: 0 0 8px 8px;
        td {
          border-bottom: 1px solid #CACDDB;
          &:nth-child(1) {
            // border-radius: 0 0 0 8px;
          }
          &:nth-child(2) {
            // border-radius: 0 0 8px 0;
          }
        }
      }
    }
    th {
      padding: 5px 0;
      color: #fff;
      height: 40px;
      font-size: 12px;
    }
    td {
      padding: 5px 0;
      border: 1px solid #CACDDB;
      border-bottom: none;
      border-right: 1px solid #CACDDB;
      border-left: none;
      color: var(--t2);
      &:last-child {
        border-right: none;
        // border-right: 1px solid #CCCCCC;
      }
      .up {
        color: var(--theme-color);
        .iconfont {
          position: relative;
          top: 2px;
          color: var(--theme-color);
        }
      }
    }
  }
  .game {
    border-radius: 8px;
    tr:first-child {
      background: linear-gradient(90deg, #61B2F9 0%, #98D7FB 100%);
      th {
        // border: 1px solid #F3F0ED;
        color: #fff;
        border-bottom: none;
        font-weight: normal;
        &:nth-child(1) {
          width: 108px;
          border-radius: 8px 0 0 0;
        }
        &:nth-child(2) {
          border-radius: 0 8px 0 0;
        }
      }
    }
    tr:last-child {
      td {
        &:nth-child(1) {
          border-radius: 0 0 0 8px;
        }
        &:nth-child(2) {
          border-radius: 0 0 8px 0;
        }
      }
    }
    tr:nth-child(2){
      th {
        border-radius: 0 0;
        color: white;
      }
    }
    td {
      padding: 5px;
      height: 36px;
    }
  }
  .btn-wrap {
    margin-top: 25px;
    padding: 0 10pt;
    .btn {
      display: inline-block;
      width: 158px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid var(--theme-color);
      color: var(--theme-text-color);
      border-radius: 6px;
      &:first-child {
        margin-left: 10px;
        margin-right: 12px;
      }
      &.active {
        color: #fff;
        background-color: var(--theme-color);
      }
    }
    .txt {
      margin-top: 15px;
      width: 100%;
      height: auto;
      margin-bottom: 30px;
      font-size: 12px;
      p {
        color: var(--t2);
        font-size: 12px;
      }
    }
  }

  .tab3 {
    .th0,
    .th1,
    .th2,
    .th3 {
      width: 15%;
    }
  }
}
.sdy-header {
  z-index: 10;
}
.vip-bg {
  padding-top: calc(env(safe-area-inset-top));
  height: 208px;
  background: url('images/mine/vip/detail/vip-detail-bg.png') no-repeat;
  background-size: 100% auto;
  background-position: left calc(-45px + env(safe-area-inset-top));
  position: relative;
  box-sizing: content-box;
  .vip-change-icon {
    bottom: 64px;
    top: auto;
    width: 22px;
    height: 22px;
    background: url('images/mine/vip/detail/vip-detail-left.png') no-repeat;
    background-size: contain;
    position: absolute;
    // top: 198px;
    &:not(.right) {
      left: 10px;
    }
    &.right {
      transform: rotate(180deg);
      right: 10px;
    }
      // top: 174px;
    // &:not(.right) {
    //   left: 12px;
    // }
    // &.right {
    //   right: 12px;
    // }
  }
  .vip-pre,
  .vip-next {
    width: 68px;
    height: 80px;
    position: absolute;
    bottom: 32px;
    &.vip-pre {
      left: 46px;
    }
    &.vip-next {
      right: 46px;
    }
  }
  .vip-act {
    width: 122px;
    height: 144px;
    position: absolute;
    left: 126.5px;
    bottom: 0px;
  }
  .vip-pre,
  .vip-next,
  .vip-act {
    background-repeat: no-repeat;
    background-size: contain;
  }
  &.vip-level-0 {
    .vip-act {
      background-image: url('images/mine/vip/detail/VIP-live-0-pre.png');
    }
    .vip-next {
      background-image: url('images/mine/vip/detail/VIP-live-1-pre-1.png');
    }
  }
  &.vip-level-10 {
    .vip-act {
      background-image: url('images/mine/vip/detail/VIP-live-10-pre.png');
    }
    .vip-pre {
      background-image: url('images/mine/vip/detail/VIP-live-9-pre-1.png');
    }
  }
  $vipLevelList: 1, 2, 3, 4, 5, 6, 7, 8, 9;
  @each $level in $vipLevelList {
    &.vip-level-#{$level} {
      .vip-pre {
        background-image: url('images/mine/vip/detail/VIP-live-' + ($level - 1)  + '-pre-1.png');
      }
      .vip-act {
        background-image: url('images/mine/vip/detail/VIP-live-' + $level + '-pre.png');
      }
      .vip-next {
        background-image: url('images/mine/vip/detail/VIP-live-' + ($level + 1) + '-pre-1.png');
      }
    }
  }
}
.vip-info {
  background: var(--bg1);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 20px 10px;
  .v-list {
    overflow: hidden;
    .list-item {
      width: 102px;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .title2 ~ .v-list .list-item {
    width: 158px;
    margin-right: 9px;
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
  .list-item {
    float: left;
    background: var(--body-bg);
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 6px;
    color: var(--t2);
    margin-right: 9px;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    padding: 0 6px;
    font-size: 13px;
  }
  .info-title {
    height: 31px;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: center center;
    margin-bottom: 15px;
    &.title1 {
      background-image: url('images/mine/vip/detail/vip-detail-title1.png');
    }
    &.title2 {
      background-image: url('images/mine/vip/detail/vip-detail-title2.png');
    }
    &.title3 {
      background-image: url('images/mine/vip/detail/vip-detail-title3.png');
    }
  }
}
.vip-main {
  padding: 20px 14px;
}
.game-detail {
  font-size: 12px;
  > p {
    line-height: 40px;
    margin: 0;
    text-align: center;
    color: var(--t2);
  }
}

</style>
