<template>
  <div class="img-box" :style="style">
    <img :src="imgSrc || defaultImg || defaultTeam"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import defaultTeam from 'src/assets/images/common/icon-no-data@2x.png'

interface Props {
  src: string;
  defaultImg?: string;
  width?: number;
  height?: number;
}

const props = defineProps<Props>()

const imgSrc = ref('')
const img = ref<HTMLImageElement | null>(null)

const style = computed(() => {
  const style: Record<string, string> = {}
  const temp = document.documentElement.clientWidth / 750
  if (props.width) style.width = `${props.width * temp}px`
  if (props.height) style.height = `${props.height * temp}px`
  return style
})

onMounted(() => {
  img.value = new Image()
  img.value.src = props.src
  img.value.addEventListener('load', loaded)
})

onBeforeUnmount(() => {
  img.value?.removeEventListener('load', loaded)
})

const loaded = () => {
  imgSrc.value = props.src
}
</script>

<style lang="scss" scoped>
  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
