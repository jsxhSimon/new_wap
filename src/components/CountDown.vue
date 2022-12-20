<template>
  <span class="count-time">{{countDownTime}}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'

interface Props {
  time: number | string;
  reverse?: boolean;
}

const props = defineProps<Props>()

const countDownTime = ref('')
let timer: any = null
const timeValue = ref(0)

onMounted(() => {
  timeValue.value = +props.time
  countDownFun()
  countDown()
})

onBeforeMount(() => {
  clearInterval(timer)
})

const countDown = () => {
  if (timer) window.clearInterval(timer)
  if (timeValue.value <= 0) {
    countDownTime.value = '00:00'
  } else {
    timer = setInterval(countDownFun, 1000)
  }
}

const countDownFun = () => {
  const step = props.reverse ? -1 : 1
  if (timeValue.value < 1) {
    clearInterval(timer)
  }
  timeValue.value += step
  let min: string | number = Math.floor(timeValue.value / 60)
  let sec: string | number = Math.floor(timeValue.value - min * 60)
  if (min < 10) {
    min = `0${min}`
  }
  if (sec < 10) {
    sec = `0${sec}`
  }
  countDownTime.value = `${min}:${sec}`
}
</script>

<style scoped>
  .count-time {
    display: inline-block;
    width: 33px;
  }
</style>