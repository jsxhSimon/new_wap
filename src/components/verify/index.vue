<template>
  <div v-show="showBox" class="verify-box" :class="mode === 'pop' ? 'verify-mask' : ''">
    <div :class="mode === 'pop' ? 'verifybox' : ''" :style="{'max-width': parseInt(imgSize.width) + 10 + 'px'}">
      <div v-if="mode === 'pop'" class="verifybox-top">
        {{ $t('请完成安全验证') }}
        <img class="verifybox-close" :src="closeImg" alt="" @click="closeBox">
      </div>
      <div class="verifybox-bottom">
        <component
          :is="componentType"
          v-if="componentType"
          ref="instanceRef"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain || $t('向右滑动完成验证')"
          :img-size="imgSize"
          :block-size="blockSize" 
          :bar-size="barSize"
          :default-img="defaultImg"
          :click-show="clickShow"
          @changeClickShow="onChangeClickShow"
          @close="closeBox"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import VerifySlide from './components/VerifySlide.vue'
import VerifyPoints from './components/VerifyPoints.vue'
import defaultImg from './imgs/default.png'
import closeImg from './imgs/close.png'

interface Props {
  captchaType: string;
  figure?: number;
  arith?: number;
  mode?: string;
  vSpace?: number;
  explain?: string;
  imgSize?: {
    width: string;
    height: string;
  },
  blockSize?: any;
  barSize?: any;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'pop',
  imgSize: () => ({
    width: '290px',
    height: '155px',
  })
})

const clickShow = ref(false)
const verifyType = ref('')
const componentType = ref<any>(null)
const instanceRef = ref<any>(null)

const instance = computed(() => {
  return instanceRef.value || {}
})
const showBox = computed(() => {
  if (props.mode === 'pop') {
    return clickShow.value
  }
  return true
})

watch(
  () => props.captchaType,
  (val) => {
    console.log(123123123123123)
    switch (val.toString()) {
      case 'blockPuzzle':
        verifyType.value = '2'
        componentType.value = VerifySlide
        break
      case 'clickWord':
        verifyType.value = ''
        componentType.value = VerifyPoints
        break
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  uuid()
})

const uuid = () => {
  const s: any = []
  const hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var slider = 'slider' + '-' + s.join('');
  var point = 'point' + '-' + s.join('');
  // 判断下是否存在 slider
  console.log(localStorage.getItem('slider'));
  if (!localStorage.getItem('slider')) {
    localStorage.setItem('slider', slider);
  }
  if (!localStorage.getItem('point')) {
    localStorage.setItem('point', point);
  }
}

const refresh = () => {
  if (instance.value.refresh) {
    instance.value.refresh()
  }
}

const closeBox = () => {
  clickShow.value = false
  refresh()
}

const show = () => {
  if (props.mode === 'pop') {
    clickShow.value = true
  }
}

const onChangeClickShow = (flag: boolean) => {
  clickShow.value = flag
}

defineExpose({
  show,
})

</script>

<style lang="scss">
.verifybox {
  position: absolute;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: var(--verify-box-bg);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.verifybox .err-img-txt {
  position: absolute;
  left: 10%;
  top: 106px;
  color: #fff;
  width: 80%;
  text-align: center;
}
.verifybox-top {
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 14px;
  color: var(--t2);
  box-sizing: border-box;
}
.verifybox-bottom {
  padding: 5px;
  box-sizing: border-box;
}
.verifybox-close {
  position: absolute;
  top: 10px;
  right: 9px;
  width: 16px;
  /* height: 24px; */
  text-align: center;
  cursor: pointer;
  color: #7e7e7f;
}
.verify-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  width: 100vw;
  min-width: 320PX;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  /* display: none; */
  transition: all 0.5s;
}
.verify-tips {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  z-index: 9;
}
.suc-bg {
  background-color: rgba(92, 184, 92, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}
.err-bg {
  background-color: rgba(217, 83, 79, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}
.tips-enter,
.tips-leave-to {
  bottom: -30px;
}
.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.5s;
}
/* ---------------------------- */
/*常规验证码*/
.verify-code {
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  border: 1px solid #ddd;
}

.cerify-code-panel {
  height: 100%;
  overflow: hidden;
}

.verify-code-area {
  float: left;
}

.verify-input-area {
  float: left;
  width: 60%;
  padding-right: 10px;
}

.verify-change-area {
  line-height: 30px;
  float: left;
}

.varify-input-code {
  display: inline-block;
  width: 100%;
  height: 25px;
}

.verify-change-code {
  color: #337ab7;
  cursor: pointer;
}

.verify-btn {
  width: 200px;
  height: 30px;
  background-color: #337ab7;
  color: #ffffff;
  border: none;
  margin-top: 10px;
}

/*滑动验证码*/
.verify-bar-area {
  position: relative;
  /* background: #ffffff; */
  text-align: center;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  /* border: 1px solid #303030; */
  -webkit-border-radius: 4px;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  background: var(--form-submit-btn-bg);
  cursor: pointer;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  -webkit-border-radius: 1px;
  color: #fff;
  border-radius: 4px;
}

.verify-bar-area .verify-move-block:hover {
  background-color: #337ab7;
  color: #ffffff;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: 1px;
  left: 1px;
  background: var(--verify-bar-bg);
  cursor: pointer;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 1px solid var(--verify-bar-bg);
}

.verify-img-panel {
  margin: 0;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border-radius: 3px;
  position: relative;
}

.verify-img-panel .verify-refresh {
  width: 25px;
  height: 25px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.verify-img-panel .icon-refresh {
  font-size: 20px;
  color: #fff;
}

.verify-img-panel .verify-gap {
  background-color: #fff;
  position: relative;
  z-index: 2;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  text-align: center;
  z-index: 3;
  /* border: 1px solid #fff; */
  transform: translateY(-2px);
}

.verify-bar-area .verify-move-block .verify-icon {
  /* font-size: 18px; */
  width: 20px;
}

.verify-bar-area .verify-move-block .verify-icon-arrow {
  font-size: 18px;
  /* width: 20px; */
}

.verify-bar-area .verify-msg {
  z-index: 3;
  color: var(--t1);
  font-size: 14px;
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-refresh:before {
  content: " ";
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-image: url('./imgs/verify-refresh.png');
  background-size: contain;
}
.verify-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index: 9;
}
</style>