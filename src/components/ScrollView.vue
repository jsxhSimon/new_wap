<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)

interface Props {
  probeType?: number;
  click?: boolean;
  scrollX?: boolean;
  listenScroll?: boolean;
  listenTouchend?: boolean;
  beforeScroll?: boolean;
  data?: any[];
  refreshDelay?: number;
  bounce?: boolean;
  pullUpLoad?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  probeType: 3,
  click: true,
  scrollX: false,
  listenScroll: true,
  listenTouchend: false,
  beforeScroll: false,
  data: () => [],
  refreshDelay: 20,
  bounce: true,
  pullUpLoad: false
})

const emits = defineEmits(['scroll', 'touchend', 'beforeScroll', 'pullingUp'])

const scroll = ref<BScroll | null>(null)
const wrapper = ref<any>(null)

onMounted(() => {
  setTimeout(() => {
    initScroll()
  }, 20)
})

const initScroll = () => {
  scroll.value = new BScroll(wrapper.value, {
    probeType: props.probeType,
    click: props.click,
    scrollX: props.scrollX,
    bounce: props.bounce,
    pullUpLoad: props.puuUpLoad,
  } as any)

  if (props.listenScroll) {
    scroll.value.on('scroll', (pos: any) => {
      emits('scroll', pos)
    })
  }

  if (props.listenTouchend) {
    scroll.value.on('touchEnd', (pos: any) => {
      emits('touchend', pos)
    })
  }

  if (props.beforeScroll) {
    scroll.value.on('beforeScrollStart', () => {
      emits('beforeScroll')
    })
  }

  if (props.pullUpLoad) {
    scroll.value.on('pullingUp', () => {
      emits('pullingUp')
    })
  }
}

const disable = () => {
  scroll.value?.disable()
}

const enable = () => {
  scroll.value?.enable()
}

const refresh = () => {
  scroll.value?.refresh()
}

const scrollTo = (x: number, y: number) => {
  scroll.value?.scrollTo(x, y)
}

const finishPullUp = () => {
  scroll.value?.finishPullUp()
}

defineExpose({
  disable,
  enable,
  refresh,
  scrollTo,
  finishPullUp,
})
</script>
