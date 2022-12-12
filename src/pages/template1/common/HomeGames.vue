<template>
  <div class="home-games" ref="scrollWrapper">
    <div class="home-game-title sports">
      {{ $t('体育游戏') }}
      <div class="swiper-control">
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange(sportsSwiper, 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange(sportsSwiper, 1)"></span>
      </div>
    </div>
    <div class="sports-content mb-16">
      <swiper
        ref="sportsSwiper"
        :space-between="15"
      >
        <swiper-slide v-for="(item, index) in new Array(Math.ceil(sportsList.length / 2) || 1)" :key="index">
          <div class="sports-item">
            <div class="left" :class="sportsList[index * 2] ? sportsList[index * 2].depotCode : 'no-data'" @click="handleGameClick(sportsList[index * 2])">
              <template v-if="sportsList[index * 2]">
                <div class="logo">{{sportsList[index * 2].depotName}}</div>
                <div class="enter">{{ $t('进入游戏') }}</div>
              </template>
              <span class="empty" v-else>{{ $t('敬请期待....') }}</span>
            </div>
            <div class="right" :class="sportsList[index * 2 + 1] ? sportsList[index * 2 + 1].depotCode : 'no-data'" @click="handleGameClick(sportsList[index * 2 + 1])">
              <template v-if="sportsList[index * 2 + 1]">
                <div class="logo">{{sportsList[index * 2 + 1].depotName}}</div>
                <div class="enter">{{ $t('进入游戏') }}</div>
              </template>
              <span class="empty" v-else>{{ $t('敬请期待....') }}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="home-game-title real" v-if="realList.length">
      真人游戏
      <div class="swiper-control">
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange(realSwiper, 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange(realSwiper, 1)"></span>
      </div>
    </div>

    <div class="real-content mb-16">
      <swiper
        ref="realSwiper"
        slides-per-view="auto"
        :space-between="15"
      >
        <swiper-slide v-for="item in realList" :key="item.id" @click="handleGameClick(item)">
          <div class="real-item" :class="item.depotCode">
            <div class="bottom">
              <p>{{item.depotName}}</p>
              <span>{{realNameMap[item.depotCode]}}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="home-game-title esport" v-if="esportList.length">
      电子竞技
      <div class="swiper-control">
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange(esportSwiper, 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange(esportSwiper, 1)"></span>
      </div>
    </div>

    <div class="esport-content mb-16">
      <swiper
        ref="esportSwiper"
        slides-per-view="auto"
        :space-between="15"
      >
        <swiper-slide v-for="item in esportList" :key="item.id" @click="handleGameClick(item)">
          <div class="esport-item" :class="item.depotCode">
            <div class="bottom">
              <p>{{item.depotName}}</p>
              <span>{{esportNameMap[item.depotCode]}}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="home-game-title bet">
      实时投注
      <div class="swiper-control">
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange(betSwiper, 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange(betSwiper, 1)"></span>
      </div>
    </div>

    <div class="bet-content mb-16">
      <div class="item title">
        <span>游戏名</span>
        <span>用户名</span>
        <span>盈利</span>
      </div>
      <swiper
        ref="betSwiper"
        slides-per-view="auto"
        :space-between="15"
      >
        <swiper-slide v-for="(t, i) in new Array(Math.ceil(sysStore.winList.length / 4))" :key="i">
          <div class="item" v-for="(item, idx) in sysStore.winList.slice(i*4, (i+1)*4)" :key="idx">
            <span>{{item.gameName}}</span>
            <span>{{item.username}}</span>
            <span>{{item.winAmount}}</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useSysStore } from 'src/stores/sys'
import { Swiper, SwiperSlide } from 'swiper/vue'
import useMainGame from 'src/hooks/useMainGame'

const emits = defineEmits(['scroll'])

const sysStore = useSysStore()
const sportsSwiper = ref<any>(null)
const realSwiper = ref<any>(null)
const esportSwiper = ref<any>(null)
const betSwiper = ref<any>(null)
const scrollWrapper = ref<any>(null)
const { handleGameClick } = useMainGame()
const sportsList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 1)?.depots || []
})
const realList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 3)?.depots || []
})
const esportList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 9)?.depots || []
})
const realNameMap: any = {
  DG: 'DG CASION'
}
const esportNameMap: any = {
  TF: 'TF GAMING'
}
const betList = [
  {
    name: '百家乐',
    username: '***tyb1',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb2',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb3',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb4',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb5',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb6',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb7',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb8',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb9',
    win: 22836,
  },
  {
    name: '百家乐',
    username: '***tyb10',
    win: 22836,
  },
]

watch(
  () => sysStore.isShowDownloadBar,
  () => {
    nextTick(() => {
      setScrollWrapperHeight()
    })
  }
)

onMounted(() => {
  setScrollWrapperHeight()
  scrollWrapper.value.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', onScroll)
})

const onScroll = () => {
  emits('scroll', scrollWrapper.value.scrollTop)
}

const setScrollWrapperHeight = () => {
  if (scrollWrapper.value) {
    const top = scrollWrapper.value.getBoundingClientRect().top || 0
    const windowHeight = document.documentElement.clientHeight || 0
    const footerHeight = document.querySelector('.footerTabs')?.clientHeight || 0
    const height = windowHeight - top - footerHeight
    scrollWrapper.value.style.height = `${Math.floor(height)}px`
  }
}

const swiperChange = (swiperEl: any, type: number) => {
  if (type) swiperEl.$el.swiper.slideNext()
  else swiperEl.$el.swiper.slidePrev()
}

</script>

<style lang="scss">
.home-games {
  width: 347px;
  margin: 10px auto 0;
  color: var(--t2);
  font-size: 13px;
  @include overflow();
  .home-game-title {
    padding-left: 26px;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 16px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    &.bet {
      color: var(--t1);
      padding-left: 0;
    }
    @each $icon in sports real esport {
      &.#{$icon} {
        background-image: url('images/home/home-game-title-' + $icon + '.png');
      }
    }
  }
  .sports-item {
    height: 100px;
  }
  .sports-item {
    height: 100px;
    position: relative;
    display: flex;
    justify-content: space-between;
    &:after,
    &:before {
      content: "";
      position: absolute;
      bottom: 0;
      width: 190px;
      height: 108px;
      background-repeat: no-repeat;
      background-size: auto 100%;
      background-position: center center;
      pointer-events: none;
    }
    &:before {
      left: 0;
      background-image: url('images/home/home-game-left.png');
    }
    &:after {
      right: 0;
      background-image: url('images/home/home-game-right.png');
    }
    .left,
    .right {
      margin-top: 3px;
      width: 150px;
      height: 96px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      position: relative;
      z-index: 3;
      font-weight: 500;
      .logo {
        background-repeat: no-repeat;
        background-size: auto 16px;
        font-size: 12px;
        font-weight: 400;
      }
      &.M8 {
        background-image: url('images/home/homegames/m8.png');
        .logo {
          background-image: url('images/home/homegames/m8-logo.png');
        }
      }
      &.right {
        background-image: url('images/home/homegames/FBOB.png');
      }
    }
    .no-data {
      .empty {
        font-size: 20px;
        line-height: 90px;
        color: var(--t3);
      }
      &.left,
      &.right {
        padding-left: 30px;
      }
    }
    .left {
      .enter {
        left: 0;
      }
      .logo {
        margin-left: 10px;
        padding-left: 21px;
        background-position: left center;
      }
    }
    .right {
      .enter {
        right: 10px;
      }
      .logo {
        margin-right: 10px;
        padding-right: 21px;
        background-position: right center;
        text-align: right;
      }
    }
  }
  .swiper-control {
    display: flex;
    width: 48px;
    align-items: center;
    justify-content: space-between;
    .iconfont {
      color: var(--t4);
    }
  }
  .icon-xiangzuo1.rotate {
    transform: rotate(180deg);
  }
  .enter {
    position: absolute;
    bottom: 15px;
    background: var(--lg2);
    border-radius: 8px;
    min-width: 82px;
    height: 20px;
    padding: 0 8px;
    text-align: center;
    line-height: 20px;
    color: var(--t5);
    display: inline-block;
    margin: 40px 0 0 8px;
    box-sizing: border-box;
    font-size: 12px;
  }
  .real-content {
    .swiper-slide {
      width: auto;
    }
    .real-item {
      width: 105px;
      height: 146px;
      border-radius: 10px;
      text-align: center;
      padding-top: 118px;
      box-sizing: border-box;
      font-size: 11px;
      background: url('images/home/real-bg.png') no-repeat center 6px;
      background-size: 95px auto;
      background-color: var(--bg1);
      position: relative;
      overflow: hidden;
      &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 112px;
        height: 135px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }
      &.DG {
        &:after {
          background-image: url('images/home/homegames/real-DG.png');
        }
      }
      .bottom {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 28px;
        border-radius: 0 0 10px 10px;
        background: var(--bg1);
        z-index: 3;
        display: flex;
        flex-direction: column;
        p {
          line-height: 15px;
          margin: 0;
          padding: 0;
        }
        span {
          font-size: 8px;
          color: var(--t4);
        }
      }
    }
  }
  .esport-item {
    height: 150px;
    border-radius: 10px;
    position: relative;
    background: url('images/home/homegames/esport-IM.png') no-repeat center center;
    background-size: contain;
    background-color: var(--bg1);
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--t4);
      font-size: 8px;
      background: var(--bg1);
      border-radius: 0 0 10px 10px;
      z-index: 2;
      p {
        margin: 0;
        margin-right: 10px;
        font-size: 11px;
        color: var(--t2);
      }
    }
  }
  .bet-content {
    background: var(--bg1);
    border-radius: 10px;
    padding-top: 15px;
    .item {
      display: flex;
      margin-bottom: 15px;
      span {
        flex: 1;
        text-align: center;
      }
    }
  }
}
</style>
