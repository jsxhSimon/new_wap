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

const route = useRoute()
const payStrore = usePayStore()
const envStore = useEnvStore()
const vipLevel = ref(0)
const dataList = ref([])
const getVipInfoData = ref<Partial<IVipInfoData>>({})
const content = ref('')
const gift = ref('')
const title = ref<string[]>([])
const dataList2 = ref<any>([])
const dataList3 = ref<any>([])
const gameLists = ref<any[]>([])

const fs = computed(() => {
  return dataList.value[vipLevel.value]
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
  dataList2.value = getVipInfoData.value.activityLevelList?.filter(f => f.accountLevel > 0)
    .map(item => [
      {
        name: item.tierName,
      }, {
        name: item.depositMin > 0 ? `≥${formatData(item.depositMin)}` : 0,
      }, {
        name: item.validbetMin > 0 ? `≥${formatData(item.validbetMin)}` : 0,
      }, {
        name: item.downgradeBet > 0 ? `≥${formatData(item.downgradeBet)}` : 0,
      },
    ])

  const levels = getVipInfoData.value.activityLevelList?.filter(item => item.accountLevel > 0)
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

const formatData = (data: number) {
  if (data > 9999) {
    return `${data / 10000}w`
  }
  return data
}
</script>