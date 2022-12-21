<template>
  <div class="shab-sports">
    <div class="sticky" v-show="!showFilter">
      <div class="match-tabs new-match-tabs sdy-border-bottom" :class="{'click-disabled': disabledMenu}">
        <div class="tabs flex flex-center">
          <div class="tabs-wrap">
            <template v-for="(tab, idx) in tabs" :key="tab.name">
              <div
                class="tab"
                :class="{active: tabIndex === idx}"
                @click="handleChangeTab(idx)"
              >
                <span class="tab-cnt">
                  {{ $t(tab.name) }}
                  <i class="count">{{ tab.count }}</i>
                </span>
              </div>
            </template>
          </div>
        </div>
        <div class="sport-menu">
          <swiper
            slides-per-view="auto"
            class="sport-menu-swiper"
            v-if="activeMenu.menuL2s"
            :key="activeMenu.name && (activeMenu.menuL2s || []).length"
          >
            <swiper-slide
              v-for="(item, idx) in activeMenu.menuL2s.filter((item: any) => item.count > 0 || item.count === undefined)"
              :key="item.sportName"
            >
              <div @click="handleClick(idx)">
                <!-- <div class="sdy-icon" :class="[getIconCls(item.sportName || item.gameName), {active: idx === subIndex}]">
                  <span class="count">{{ item.count }}</span>
                </div> -->
                <div class="sport-name" :class="{'act': idx === subIndex}">
                  {{ (item.sportName || item.gameName) === 'Others' ? $t('其他') : $t(item.sportName || item.gameName) }}({{item.count||0}})
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
    <div class="match-list-container" v-show="!showFilter">
      <div class="matches-wrapper" ref="matchModel">
        <div class="is-empty" v-show="canShowEmpty && !resultData.length"></div>
        <Skeleton v-show="showSkeleton" />
        <div class="sport-group-container" :style="sportGroupStyle">
          <template v-if="isYsgj">
            <div class="sport-group is-ysgj" :class="{'is-closed': foldList.includes(ysgj.sportName)}" v-for="ysgj in ysgjList" :key="ysgj.sportType" v-show="!showSkeleton">
              <div class="sport-header">
                <div class="left">{{$t(ysgj.sportName)}}({{ysgj.count}})</div>
                <div class="right" @click="matchFold(ysgj.sportName)">{{foldList.includes(ysgj.sportName) ? $t('展开') : $t('收起')}}</div>
              </div>
              <div class="sport-content">
                <sdy-collapse
                  v-for="t in ysgj.outrights"
                  :key="t.leagueId"
                  v-show="t.teams && t.teams.length"
                  :close="foldList.includes(t.leagueName)"
                >
                  <template #header>
                    <div class="match-header flex" @click="matchFold(t.leagueName)">
                      <div class="league-title flex">
                        <sdy-image class="m-r-10" src="" :height="32" />
                        <div class="league-name">{{ t.leagueName }}</div>
                      </div>
                      <div class="flex flex-center">
                        <span class="m-r-10">{{t.teams.length}}</span>
                        <span class="sdy-icon sdy-icon-unfold"></span>
                      </div>
                    </div>
                  </template>
                  <template #content>
                    <div class="sport-game" v-for="sport in t.teams" :key="sport.orid">
                      <div class="sport-name">
                        {{ sport.teamName }}
                      </div>
                      <div v-if="sport.oddsStatus === 'running'" class="sport-odd" :class="sport.className" @click="selectYsgj(t, sport)">
                        {{ sport.price }}
                      </div>
                      <div v-else class="sport-odd">
                        <van-icon name="lock" />
                      </div>
                    </div>
                  </template>
                </sdy-collapse>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="sport-group" v-for="c in resultData" :key="c.sportName" v-show="!showSkeleton">
              <sdy-collapse
                v-for="t in c.list"
                :key="t.groupKey"
                v-show="t.list.length"
                :close="foldList.includes(t.groupKey)"
                :tid="t.leagueId.toString()"
              >
                <template #header>
                  <div class="match-header flex" @click="matchFold(t.groupKey)">
                    <div class="league-title flex">
                      <sdy-image class="m-r-10" src="" :height="32" />
                      <div class="league-name">{{ t.name }}</div>
                    </div>
                    <div class="flex flex-center">
                      <span class="m-r-10">{{t.list.length}}</span>
                      <span class="sdy-icon sdy-icon-unfold"></span>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="match-item" v-for="item in t.list" :key="item.evnetId">
                    <div class="match-item-wrapper">
                      <div class="match-item-hd">
                        <div class="match-item-hd-left" v-if="isZaoPan">
                          <span class="m-r-10 zaopan">
                            <span v-if="item.globalShowTime2 || item.globalShowTime">{{formatMgtDate(item)}}</span>
                          </span>
                        </div>
                        <div class="match-item-hd-left" :class="{'has-img': getIcon(item)}" v-if="!isZaoPan">
                          <div class="m-r-10 item_flex icon_item">
                            <div v-if="getIcon(item)" class="game-icon" @click="showFullPlay(item, !isZaoPan)" :class="getIcon(item)"></div>
                            <span>
                              {{ showTime(item) ? formatMmp(item) : formatMgtDate(item) }}
                            </span>
                          </div>
                          <span v-if="showTime(item) && canShowTime && !['中场休息', '延迟开赛'].includes(formatMmp(item))" class="m-r-15 item_flex">
                            <van-icon name="underway-o" class="m-r-2" />
                            <span v-if="formatMmp(item) === '中场休息'">{{formatTime(item)}}</span>
                            <CountDown v-else :key="`${item.eventId}-${item.gameInfo.seconds}-${hideCount}`" :reverse="item.gameInfo.clockDirection === 'dec'" :time="item.gameInfo.seconds"></CountDown>
                          </span>
                        </div>
                        <div class="match-item-hd-right" v-if="isSbty === 2 && activeMenu.name === '滚球'">
                          <div v-for="betName in getRunnningIds(item)" :key="betName">
                            <p>{{ betName }}</p>
                          </div>
                        </div>
                        <div class="match-item-hd-right" v-else>
                          <div v-for="betName in betTypeNames" :key="betName">
                            <p>{{ betName }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="match-item-bd">
                        <div class="match-item-bd-left">
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.teamInfo.homeIconUrl" :key="item.eventId + item.teamInfo.homeName" :height="40" />
                            <div class="team-name">{{item.teamInfo.homeName}}</div>
                            <div class="score-value" v-if="showTime(item)">{{item.gameInfo.liveHomeScore}}</div>
                          </div>
                          <div class="team-info" @click="showFullPlay(item)">
                            <sdy-image :src="item.teamInfo.awayIconUrl" :key="item.eventId + item.teamInfo.awayName" :height="40" />
                            <div class="team-name">{{item.teamInfo.awayName}}</div>
                            <div class="score-value" v-if="showTime(item)">{{item.gameInfo.liveAwayScore}}</div>
                          </div>
                          <div class="collect flex">
                            {{item.marketCount ? `${item.marketCount}+` : 0}}
                            <!--足球-->
                            <div class="match-item-top-right" v-if="!isZaoPan && item.sportName === '足球' && item.awayCorner != undefined">
                              <div class="jiao-qiu" v-if="item.awayCorner != undefined">
                                <span class="jiao-qiu-icon"></span>
                                {{ item.homeCorner }} - {{ item.awayCorner }}
                              </div>
                              <div class="half-score" v-if="item.awayHalfScore != undefined">
                                <span class="half-score-ht">HT</span>
                                {{ item.homeHalfScore }} - {{ item.awayHalfScore }}
                              </div>
                            </div>
                            <!--篮球-->
                            <div class="match-item-top-right" v-if="!isZaoPan && item.sportName === '篮球' && item.awayHalfScore != undefined">
                              <div class="half-score"  v-if="item.awayHalfScore != undefined">
                                <span class="half-score-ht">HT</span>
                                {{ item.homeHalfScore }} - {{ item.awayHalfScore }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="match-item-bd-right">
                          <div class="odd-column" v-for="(market, idx) in getMarkets(item)" :key="idx">
                            <template v-if="market && market.selections.length">
                              <template
                                v-for="odd in market.selections"
                              >
                                <div
                                  class="odd-column-item"
                                  :class="{'odd-column-item__active': getIsActive(market, odd), [odd.className]: !!odd.className}"
                                  :key="odd.key"
                                  @click="selectMatch(item, market, odd)"
                                  v-if="market.marketStatus === 'running'"
                                >
                                  <div>{{getOddName(odd, market.betTypeName, item)}}</div>
                                  <span>{{odd.oddsPrice.decimalPrice}}</span>
                                </div>
                                <div class="odd-column-item" :key="odd.key" v-else>
                                  <div>
                                    <van-icon name="lock" />
                                  </div>
                                </div>
                              </template>
                            </template>
                            <template v-else>
                              <div class="odd-column-item">-</div>
                              <div class="odd-column-item">-</div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </sdy-collapse>
            </div>
          </template>
        </div>
        <div class="sdy-spinner" v-show="!showSkeleton && !finished">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        <div class="list-finished" v-show="!showSkeleton && finished">
          {{ $t('没有更多赛事了') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SbMenu, IResultData, SbMatch } from 'src/types/sports'
import { useSbStore } from 'src/stores'

const sbStore = useSbStore()
const showFilter = ref(false)
const menus = ref<SbMenu[]>([])
const tabIndex = ref(0)
const subIndex = ref(0)
const canShowEmpty = ref(false)
const showSkeleton = ref(false)
const resultData = ref<IResultData<SbMatch>[]>([])
const sportGroupStyle = ref('')

const tabs = computed(() => {
  let arr: any = menus.value
  if (!arr.length) {
    arr = [
      {
        name: '滚球',
        menuL2s: [
          {
            sportName: '足球',
          },
        ],
      },
      { name: '今日' },
      { name: '早盘' },
      { name: '串关' },
    ]
  }
  return arr
})

const activeMenu = computed(() => {
  return tabs.value[tabIndex.value]
})

const disabledMenu = computed(() => {
  return Object.keys(menus.value[0] || {}).length <= 2
})

const handleChangeTab = (idx: number) => {
  window.shakeApp()
  tabIndex.value = idx
  subIndex.value = 0
  const type = idx === 0 ? 0 : 1
  sbStore.$patch(state => state.matchType = type)
}

const handleClick = (idx: number) => {
  window.shakeApp()
  subIndex.value = idx
}

</script>
