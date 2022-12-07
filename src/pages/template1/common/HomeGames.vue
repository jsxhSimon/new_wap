<template>
  <div class="home-games">
    <div class="home-game-title sports">
      {{ $t('体育游戏') }}
      <div class="swiper-control">
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange('sportsSwiper', 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange('sportsSwiper', 1)"></span>
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
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange('realSwiper', 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange('realSwiper', 1)"></span>
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
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange('esportSwiper', 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange('esportSwiper', 1)"></span>
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
        <span class="pre iconfont icon-xiangzuo1" @click="swiperChange('betSwiper', 0)"></span>
        <span class="next iconfont icon-xiangzuo1 rotate" @click="swiperChange('betSwiper', 1)"></span>
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
        <swiper-slide v-for="(t, i) in new Array(Math.ceil(betList.length / 4))" :key="i">
          <div class="item" v-for="(item, idx) in betList.slice(i*4, (i+1)*4)" :key="item.name + idx">
            <span>{{item.name}}</span>
            <span>{{item.username}}</span>
            <span>{{item.win}}</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSysStore } from 'src/stores/sys'
import { Swiper, SwiperSlide } from 'swiper/vue'

const sysStore = useSysStore()
const sportsSwiper = ref<any>(null)
const sportsList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 1)?.depots || []
})
const realList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 3)?.depots || []
})
const esportList = computed(() => {
  return sysStore.mainGameList.find(item => item.catId === 9)?.depots || []
})
const realNameMap = {
  DG: 'DG CASION'
}
const esportNameMap = {
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
</script>
