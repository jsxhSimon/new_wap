<template>
  <div class="header-game-box">
    <div class="header-game">
      <div class="header-game-container">
        <swiper slides-per-view="auto">
          <swiper-slide>
            <div class="game-tab active" @click="show = false">
              {{ $t('首页') }}
            </div>
          </swiper-slide>
          <swiper-slide v-for="item in list" :key="item.catId">
            <div
              class="game-tab"
              :class="{ active: activeGame.catId === item.catId }"
              @click="setActiveGame(item)"
            >
              {{ $t(item.catName) }}
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <VanPopup
      class="header-game-popup"
      :class="{ 'has-download-bar': hasDownloadBar }"
      position="top"
      v-model:show="show"
      @close="activeGame = {}"
    >
      <div class="game-list" v-if="activeGame.depots">
        <div
          class="game-item"
          v-for="game in activeGame.depots"
          :key="game.depotCode"
          @click="handleGameClick(game)"
        >
          <div class="game-logo" :class="game.depotCode"></div>
          <span class="game-name">
            {{ game.depotCode === 'FBOB' ? envStore.envAppTitle : game.depotName }}
          </span>
        </div>
      </div>
    </VanPopup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Popup as VanPopup } from 'vant';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useSysStore } from 'src/stores/sys';
import { useEnvStore } from 'src/stores/env'

const sysStore = useSysStore();
const envStore = useEnvStore();
const show = ref(false);
const activeGame = ref<Partial<IMainList>>({});
const hasDownloadBar = ref(false);
const timer: any = null;
const list = computed(() => {
  return sysStore.mainGameList.filter((item) => item.depots?.length);
});

const setActiveGame = (game: IMainList) => {
  activeGame.value = game || {};
  const el = document.querySelector('.download-bar');
  if (el) hasDownloadBar.value = true;
  document.querySelector('.home-page')?.classList.add('header-game-open');
  if (game) {
    clearTimeout(timer);
    show.value = true;
  }
};

const handleGameClick = (game: IMainGame) => {
  sysStore.handleGameClick(game)
}
</script>

<style lang="scss">
.header-game-box {
  .header-game-popup {
    top: calc(env(safe-area-inset-top) + 80px);
    &.has-download-bar {
      top: calc(env(safe-area-inset-top) + 156px);
    }
  }
  .game-list {
    padding: 20px 0 10px 20px;
    display: flex;
    flex-wrap: wrap;
    background: var(--body-bg);
  }
  .game-item {
    width: 84px;
    margin-right: 5px;
    text-align: center;
    margin-bottom: 6px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .game-logo {
      height: 66px;
      background: url('images/home/games/headerGame/home-header-game-bg.png') no-repeat center center;
      background-size: 66px auto;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        width: 48px;
        height: 48px;
        top: 8px;
        left: 19px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }
      @each $code in FBOB, XM, M8, BBIN, JDB {
        &.#{$code} {
          &:after {
            background-image: url('images/home/games/headerGame/' + $code + '.png');
          }
        }
      }
    }
    .game-name {
      font-size: 12px;
      color: var(--t2);
      margin-top: 5px;
      height: 34px;
      line-height: 1.2;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
    }
  }
}
.header-game {
  font-size: 16px;
  background: var(--header-bg);
  padding-left: 14px;
  padding-top: 5px;
  position: relative;
  &-container {
    overflow: hidden;
  }
  .swiper-slide {
    width: auto;
  }
  .game-tab {
    margin-right: 34px;
    color: var(--t2);
    line-height: 22px;
    padding-bottom: 10px;
    &.active {
      color: var(--theme-text-color);
      font-weight: 600;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 20px;
        height: 1px;
        background: var(--theme-color);
      }
    }
  }
}
</style>
