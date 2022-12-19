<template>
  <div class="sport-menu">
    <swiper
      slides-per-view="auto"
      :space-between="34"
      class="sport-menu-swiper"
    >
      <swiper-slide
        v-for="(item, idx) in list"
        :key="item.menuId"
      >
        <div @click="handleClick(item, idx)">
          <div :class="['sport-name',idx === activeIndex&&'act']">
            {{ $t(item.menuName) }}({{item.count||0}})
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { XmSubMenu } from 'src/types/sports'

interface Props {
  list: XmSubMenu[];
  activeIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  activeIndex: 0,
})
const emits = defineEmits(['changeColletType', 'change'])

const handleClick = (item: XmSubMenu, idx: number) => {
  window.shakeApp()
  let ids: number | string = item.menuId
  // 判断是否是 -> 关注
  if (item.menuName === '全部') ids = props.list.filter(temp => temp.menuName !== '全部').map(temp => temp.menuId).join(',')
  emits('change', ids, idx)
}
</script>