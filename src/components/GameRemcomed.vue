<template>
  <div class="rcmd mb-15" v-if="hasdata">
    <h5 class="fxi"><img src="~images/mine/recomed-game-title-icon.png">{{ $t('猜你喜欢') }}</h5>
    <van-swipe :autoplay="0" :show-indicators='false' :stop-propagation='false'>
      <van-swipe-item v-for="(_, i) in gamelist" :key="i">
        <ul class="item fxi"><li v-for="(_i,j) in _" :key="j" @click="sysStore.enterGame(_i)"><img :src="_i.logo"><p>{{_i.gameName}}</p></li></ul>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in sportlistFb" :key="10+i">
        <div class="sport" @click="entergameFb(_)">
          <p class="tt fxi"><i>{{fmtFb(_)}}</i><span>{{_.name}}</span></p>
          <div class="tm fxi">
            <p class="fxi">
              <i>{{_.list[0].ts[0].na}}</i>
              <span><img :src="_.list[0].ts[0].lurl"></span></p>
            <i>VS</i>
            <p class="fxi">
              <span><img :src="_.list[0].ts[1].lurl">></span>
              <i>{{_.list[0].ts[1].na}}</i>
            </p>
          </div>
          <i class="line"></i><p class="bt">{{ $t('前往投注') }}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in sportlist" :key="100+i">
        <div class="sport" @click="entergame(_)">
          <p class="tt fxi"><i>{{fmt(_)}}</i><span>{{_.tn}}</span></p>
          <div class="tm fxi">
            <p class="fxi"><i>{{_.mhn}}</i><span><img :src="imgPrefix + _.mhlu[0]"></span></p>
            <i>VS</i>
            <p class="fxi"><span><img :src="imgPrefix + _.malu[0]"></span><i>{{_.man}}</i></p>
          </div>
          <i class="line"></i><p class="bt">{{ $t('前往投注') }}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in gamelistl" :key="1000+i">
        <ul class="item fxi"><li v-for="(_i,j) in _" :key="j" @click="sysStore.enterGame(_i)"><img :src="_i.logo"><p>{{_i.gameName}}</p></li></ul>
      </van-swipe-item>
    </van-swipe>
    <div class="loading" v-if="loading"><q-spinner-dots color="primary" size="40px" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import {Swipe as VanSwipe, SwipeItem as VanSwipeItem} from 'vant'
import { imgPrefix } from 'src/utils/sports'
import { LocalStorage, SessionStorage } from 'quasar'
import { SUB_LEVEL_ID } from 'src/assets/gameCategories'
import { groupBy, groupByKey } from 'src/utils'
import { useUserStore, useFbtyStore, useXmStore, useSysStore } from 'src/stores'
import { FBMatch, IFBMenu1, XMMatch, XmMenu, XmSubMenu } from 'src/types/sports'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const fbtyStore = useFbtyStore()
const xmStore = useXmStore()
const sysStore = useSysStore()
const gamelist = ref<any>([])
const gamelistl = ref<any>([])
const sportlist = ref<any>([])
const sportlistFb = ref<any>([])
const hasdata = ref(true)
const loading = ref(true)

onBeforeMount(() => {
  userStore.aiRecommendSeven()
    .then(res => {
      hasdata.value = !!res.length
      if (res.length) {
        Promise.all(res.map((_: IAIData) => getsort(_))).then(res1 => {
          let result = res1.flat().map(_ => (res.find((i: any) => i.depotId === _.depotId || _.gameType === 1) ? _ : '')).filter(_ => _).slice(0, 3)
          const isFbType = result.some(sportTypeItem => sportTypeItem.type === 'FB体育')
          if ([1, 2].includes(result.length)) {
            const stg = (LocalStorage.getItem('_games') as any[] || []).map(_ => ({ ..._, depotId: _.depotId || _.id })).filter(_ => SUB_LEVEL_ID.includes(_.catId) && res.every((i: any) => i.depotId !== _.depotId))
            result = [...result, ...stg.splice(Math.floor(Math.random() * stg.length), 1), ...stg.splice(Math.floor(Math.random() * stg.length), 1)].slice(0, 3)
          }
          Promise.all(result.map(_ => sysStore.getAiGameList(_))).then((res2) => {
            const filt = res2.filter(_ => _.length)
            hasdata.value = !!filt.length
            const spidx = filt.findIndex(_ => _.sport)
            const fbidx = filt.findIndex(_ => (_[0].lg && _[0].bt))
            if (spidx !== -1) {
              sportlist.value = filt[spidx]
              gamelist.value = filt.slice(0, spidx)
              gamelistl.value = filt.slice(spidx + 1)
            }
            if (fbidx !== -1) {
              sportlistFb.value = formatFbSport(filt[fbidx])
              gamelist.value = filt.slice(0, fbidx)
              gamelistl.value = filt.slice(fbidx + 1)
            }
            if ((spidx === -1) && (fbidx === -1)) {
              gamelist.value = filt.slice(0, 3)
            }
          }).finally(() => { loading.value = false })
        })
      }
    })
})

const getsort = (item: IAIData, catId = item.gameType) => {
  let returnRes
  if (+catId === 1) {
    if (item.depotId === 55 || item.depotId === 50) {
      returnRes = fbtyStore.getMenus()
        .then((res) => {
          const its: IFBMenu1 = res.menu1.find((item: IFBMenu1) => item.name === '今日')
          let it: any = ''
          its.menu2.sort((a, b) => {
            return a.sportId - b.sportId
          })
          its.menu2.some((i) => {
            if (i?.count) {
              it = i
              it.type = 'FB体育'
              it.gameType = 1
              it.getList = fbtyStore.getMatchList
              return true
            }
            return false
          })
          return [it]
        })
    } else {
      returnRes = xmStore.getMenu().then((res) => {
        const its = res.find((_: XmMenu) => _.menuName === '今日')
        let it: any = ''
        its.subList.some((i: XmSubMenu) => {
          if (i.count > 0) it = { i, i1: { subMenuId: i.menuId, euid: i.menuId, type: its.menuType, md: its.field2 }, ...item, mth: xmStore.getMatches }
          return i.count > 0
        })
        return [it]
      })
    }
  } else {
    returnRes = sysStore.getGameDepotsByCatId(catId)
  }
  return returnRes
}

const formatFbSport = (resFb: FBMatch[]) => {
  let res: any = []
  resFb.forEach(fbItem => {
    fbItem.groupKey = fbItem.lg.na + fbItem.bt
  })
  let arr = []
  const groupArr = groupBy(resFb, (itemTmp: FBMatch) => itemTmp.sid, 'sid')
  arr = groupArr.map(itemFbData => {
    const idList = itemFbData.list.map((temp: FBMatch) => temp.id)
    const number = itemFbData.list.length
    let list = []
    const tp = itemFbData.list
    list = groupByKey(tp, (temp: FBMatch) => ({ groupKey: temp.groupKey, name: temp.lg.na }))
    return {
      ...itemFbData,
      list,
      idList,
      number,
    }
  })
  if (arr && arr[0] && arr[0].list) {
    res = arr[0].list.slice(0, 1)
    res[0].type = 'FB体育'
  }
  return res
}

const entergameFb = (i: any) => {
  sessionStorage.setItem('matchTabData', '3,0,0')
  SessionStorage.set('_tjgames', i.list[0])
  router.push('/sports')
}

const entergame = (i: any) => {
  sessionStorage.setItem('matchTabData', '0,0,0')
  SessionStorage.set('_tjgames', i)
  router.push('/sports')
}

const fmt = (value: XMMatch) => {
  return dayjs(Number(value.mgt)).format('MM-DD HH:mm')
}

const fmtFb = (value: any) => {
  return dayjs(Number(value.list[0].bt)).format('MM-DD HH:mm')
}

</script>

<style lang="scss" scoped>
.rcmd {
  padding: 0;
  height: 138px;
  box-sizing: border-box;
  margin: -6px 0 14px;
  position: relative;
  .van-swipe {
    height: 119px;
  }
  .loading {
    position: absolute;
    left: calc(50% - 20px);
    top: 56px;
  }
  .sport {
    width: 99%;
    margin-left: 2px;
    margin-top: 5px;
    padding-top: 10px;
    color: var(--t8);
    background: #FFFFFF;
    box-shadow: 0px 2px 5px rgba(136, 136, 136, 0.302);
    border-radius: 12px;
    .line {
      display: block;
      height: 1px;
      background: rgba(32, 32, 33, 0.08);
      margin: 0 12px;
      margin-top: 15px;
    }
    .bt {
      line-height: 32px;
      text-align: center;
      font-size: 13px;
      color: var(--theme-color);
      font-weight: 500;
    }
    .tm {
      justify-content: space-between;
      margin: 10px 0;
      >i {
        font-size: 18px;
        color: var(--theme-color);
      }
      p {
        width: 120px;
        background: var(--theme-color);
        height: 28px;
        position: relative;
        >span {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          box-sizing: border-box;
          border: 2px solid var(--theme-color);
        }
        i {
          line-height: 28px;
          width: 98px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }
        &:first-child {
          padding-left: 5px;
          span {
            right: -10px;
          }
          i {
            text-align: right;
            padding-right: 8px;
          }
        }
        &:last-child {
          padding-left: 18px;
          box-sizing: border-box;
          span {
            left: -10px;
          }
          i {
            padding-left: 8px;
          }
        }
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .tt {
      justify-content: space-between;
      padding: 0 10px;
      span {
        max-width: 139px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .item {
    height: 114px;
    justify-content: space-around;
    li {
      background: #FFFFFF;
      box-shadow: 0px 0px 10px rgba(18, 18, 18, 0.1);
      border-radius: 4px;
      height: 98px;
      width: 74px;
      text-align: center;
      font-size: 12px;
      color: var(--t8);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      img {
        height: 58px;
        margin: 8px 0 5px 0;
        border-radius: 5px;
      }
    }
  }
  h5 {
    font-size: 13px;
    line-height: 20px;
    color: #222;
    margin: 0;
    padding: 0;
    img {
      height: 12px;
      margin-right: 5px;
    }
  }
}

h5,p {
  margin: 0;
  padding: 0;
}
.item li p {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
i {
  font-style: normal;
}
.fxi {
  display: flex;
  align-items: center;
}
</style>
