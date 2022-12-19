<template>
  <div class="home-swiper">
    <swiper
      v-if="swiperListEnable"
      ref="homeSwiper"
      :modules="[Pagination]"
      :speed="1000"
      :autoplay="{
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      }"
      :space-between="15"
    >
      <swiper-slide
        v-for="item in swiperList"
        :key="item.picMbPath"
      >
        <van-image
          fit="cover"
          :src="item.picMbPath"
          @click="handleClick(item)"
        >
          <template v-slot:loading>
            <div class="default-banner">
              <div class="header-logo"></div>
            </div>
          </template>
          <template v-slot:error>
            <div class="default-banner">
              <div class="header-logo"></div>
            </div>
          </template>
        </van-image>
      </swiper-slide>
    </swiper>
    <Announcement v-if="noticeListEnable" class="sdy-ad" :empty-notice-list="emptyNoticeList" :notice-list="filterNoticeList" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Image as VanImage } from 'vant'
import Announcement from './Announcement.vue';
import { useSysStore } from 'src/stores/sys'

interface Props {
  swiperListEnable?: boolean;
  swiperList: Partial<ISwiperData>[];
  noticeList: any[];
  emptyNoticeList: boolean;
  noticeListEnable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  swiperListEnable: true,
  noticeListEnable: true,
})

const sysStore = useSysStore()
const homeSwiper = ref<any>(null)
const filterNoticeList = computed(() => {
  return props.noticeList.filter(item => item.showType !== '1')
})

const handleClick = (item: any) => {
  sysStore.hanldeAdClick(item)
}
</script>

<style lang="scss">
.home-swiper {
  .van-image {
    img {
      border-radius: 10px;
    }
  }
  .swiper {
    width: 347px;
    .van-image {
      width: 100%;
      height: 140px;
      border-radius: 10px;
      .van-image__loading {
        background-color: transparent;
        border-radius: 10px;
      }
    }
  }
  .default-banner {
    width: 100%;
    height: 140px;
    background: url('src/assets/images/common/banner-bg.png') no-repeat center center;
    background-size: 110% 110%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .header-logo {
      width: 140px;
      height: 50px;
      background: url('site_theme_images/logo.png') no-repeat center center;
      background-size: contain;
    }
  }
}
</style>
