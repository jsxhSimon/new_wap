<template>
  <div class="guide-model-wrap" v-show="isShow" @click.stop>
    <div class="guide-model-mask" :class="{ 'guide-model-mask__show': isShow }"></div>
    <div v-if="step === 2" @click.stop="closeStep" class="guide-model-step-popover-button"></div>
    <div class="guide-model-step guide-model-step1 guide-model-step__show">
      <div class="match-item">
        <div class="header">
          <div class="live-icon mr-4">{{$t('直播')}}</div>
          <div class="time">{{dayjs().format('MM-DD HH:')}}00</div>
        </div>
      </div>
      <div v-if="step === 1" class="guide-model-step-highlightedElem">
        <i>{{$t('向左滑动，查看更多投注')}}</i>
      </div>
      <div class="guide-model-step-popover">
        <div @touchmove="changeStep" @click="changeStep" class="guide-model-step-popover-arrow" :style="styleVar">
          <!-- <img src="./images/Mask1.png" class="step1">
          <img src="./images/Mask2.png" class="step2"> -->
        </div>
        <div v-if="step === 1" class="guide-model-step-popover-desc">
          <i></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores';
import { ref, computed, watch, nextTick } from 'vue'
import { LocalStorage } from 'quasar'
import dayjs from 'dayjs'

interface Props {
  isShow: boolean;
}
const props = defineProps<Props>()

const emits = defineEmits(['changeSiteShow', 'close'])

const userStore = useUserStore()
const step = ref(-1)
const leftNumber = ref(27)
let timer: any = null

const styleVar = computed(() => {
  return {
    '--box-height': `${leftNumber.value}vw`,
  }
})

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      nextTick(() => {
        step.value = 1
      })
    }
  },
  {
    immediate: true
  }
)

const changeStep = () => {
  step.value = step.value
  if (step.value === 1) {
    step.value = -1
    emits('changeSiteShow', true)
    setTimeout(() => {
      step.value = 2
    }, 500)
    clearInterval(timer)
    timer = setInterval(() => {
      leftNumber.value -= 1
      if (leftNumber.value <= -27) {
        clearInterval(timer)
      }
    }, 10)
  }
  if (step.value === 2) {
    step.value = -1
    emits('changeSiteShow', true)
    setTimeout(() => {
      step.value = 1
    }, 500)
    clearInterval(timer)
    timer = setInterval(() => {
      leftNumber.value += 1
      if (leftNumber.value >= 27) {
        clearInterval(timer)
      }
    }, 10)
  }
}

const closeStep = () => {
  step.value = -1
  userStore.$patch(state => state.showGuide = true)
  emits('changeSiteShow', false)
  emits('close')
  LocalStorage.set('showRules', true)
}
</script>

<style lang="scss">
.guide-model-wrap {
  .guide-model-step-popover-button {
    position: fixed;
    top: 460px;
    left: 116px;
    z-index: 9999;
    width: 159px;
    height: 34px;
    background: url("images/sports/game-sport-button.png") no-repeat center center;
    background-size: 100% auto;
  }
  .guide-model-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: var(--mask-bg);
    z-index: 9999;
    transition: all 0.5s;
    opacity: 0;
    visibility: hidden;
    &.guide-model-mask__show {
      opacity: 1;
      visibility: visible;
    }
  }
  .guide-model-step {
    position:fixed;
    font-size: 16px;
    font-weight: 500;
    color: var(--t2);
    z-index: 9999;
    width: 350px;
    height: 124px;
    top: 300px;
    right: 10px;
    // background: url("images/sports/step1.png") no-repeat center center;
    background: var(--sport-content-bg);
    background-size: 100% 100%;
    transition: all 0.5s;
    opacity: 0;
    visibility: hidden;
    border-radius: 10px;
    .header {

    }
    &.guide-model-step__show {
      opacity: 1;
      visibility: visible;
    }
    &.guide-model-step1 {
      .guide-model-step-highlightedElem {
        position:fixed;
        top: 235px;
        right: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 275px;
        height: 47px;
        i {
          display: block;
          width: 275px;
          height: 47px;
          line-height: 47px;
          text-align: center;
          color: var(--t5);
          font-size: 16px;
          font-style: normal;
          background: url("images/sports/guide-tip-bg.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    &.guide-model-step2 {
      position:fixed;
      top: 285px;
      right: 15px;
      .guide-model-step-highlightedElem {
        width: 200px;
        height: 120px;
        // background: url("./images/Mask2.png") no-repeat center center;
        background-size: 100% 100%;
      }
      .guide-model-step-popover-arrow {
        margin-top: 12px;
        margin-bottom: 5px;
        background: url("images/sports/guide-model-step2-arrow.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
    .guide-model-step-popover {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      left: 41%;
      top: 0px;
      width: 200px;
      height: 117px;
      overflow: hidden;
      .guide-model-step-popover-arrow {
        width: 400px;
        height: 117px;
        position: relative;
        left: var(--box-height);
        top: 0px;
        img {
          display: inline-block;
          width: 200px;
          height: 117px;
        }
        .step1 {
        }
        .step2 {
        }
      }
      .guide-model-step-popover-desc {
        i {
          position:fixed;
          top: 370px;
          display: block;
          width: 60px;
          height: 60px;
          background: url("images/sports/moveact.gif") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
