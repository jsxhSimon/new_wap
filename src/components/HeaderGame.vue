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
      v-model="show"
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
          <span class="game-name">{{
            game.depotCode === 'FBOB' ? envAppTitle : game.depotName
          }}</span>
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

const sysStore = useSysStore();
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
</script>
