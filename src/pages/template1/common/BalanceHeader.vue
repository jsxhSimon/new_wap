<template>
  <div>
    <div class="balance-header">
      <swiper
        v-if="scrollFixed"
        :options="{ slidesPerView: 'auto',spaceBetween: 0, }"
        class="balance-header-gameType"
      >
        <swiper-slide
          v-for="item in gameTypeList"
          :key="item.type"
          :class="{active: gameType === item.type}"
        >
          <span @click="$emit('changeGameType', item.type)">{{item.label}}</span>
        </swiper-slide>
      </swiper>
      <div v-else class="sdy-icon sdy-icon-logo"></div>
      <div class="flex flex-center">
        <div class="balance flex flex-center">
          <template v-if="!isLogin && type==='user'">
            <span @click="$router.push('/login')">登录</span>
            <span @click="$router.push('/login/register')">/注册</span>
          </template>

          <template v-else>
            ¥ {{ bal }}
            <i class="sdy-icon sdy-icon-refresh" :class="{'a-round': loading}" @click="handleLoading"></i>
          </template>
        </div>

        <div class="balance-header—right">
          <span v-if="rightButton === 'service'" class="iconfont iconkefu3" @click="openCustomerService"></span>
          <span v-else  class="sdy-icon sdy-icon-menu" @click.stop="sideShow = true"></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage, SessionStorage } from 'quasar'
interface Props {
  scrollFixed?: boolean;
  gameTypeList?: IGameType[];
}

</script>