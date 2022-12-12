<template>
  <div class="verify-slide" style="position: relative;">
    <div
      v-if="type === '2'"
      class="verify-img-out"
      :style="{height: (parseInt(setSize.imgHeight) + vSpace) + 'px'}"
    >
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight
        }"
      >
        <div class="verify-loading" v-show="loading">
          <img :src="loadingImg" />
        </div>
        <div class="img-box" :style="{backgroundImage: `url(${backImgBase?(backImgBase):defaultImg})`}"></div>
        <div class="err-img-txt" v-if="errorMessage">
          {{errorMessage}}
        </div>
        <div v-show="showRefresh" class="verify-refresh" @click="refresh"><i class="iconfont icon-refresh" />
        </div>
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ?'suc-bg':'err-bg'">{{ tipWords }}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        width: parseInt(setSize.imgWidth) - 2,
        height: barSize.height,
        'line-height':barSize.height
      }"
    >
      <span class="verify-msg" v-text="text" />
      <div
        class="verify-left-bar"
        :style="{width: (leftBarWidth!==undefined)?leftBarWidth: getNum(barSize.height) + 'px', height: getNum(barSize.height) - 4 + 'px', transaction: transitionWidth}"
      >
        <span class="verify-msg" v-text="finishText" />
        <div
          class="verify-move-block"
          :style="{width: getNum(barSize.height) + 'px', height: getNum(barSize.height) - 4 + 'px', 'background-color': moveBlockBackgroundColor, left: moveBlockLeft, transition: transitionLeft}"
          @touchstart="start($event)"
          @mousedown="start($event)"
        >
          <i v-if="authSuccessShow" class="iconfont icon-duigou"></i>
          <i v-else
            :class="['icon-shuangyoujiantou- iconfont fs-20', iconClass]"
          />
          
          <div
            v-if="type === '2' && blockBackImgBase"
            class="verify-sub-block"
            :style="{
              'width':Math.floor(parseInt(setSize.imgWidth)*47/310)+ 'px',
              'height': setSize.imgHeight,
              'top':'-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
              'pointer-events': 'none',
              'backgroundImage': `url(${blockBackImgBase})`,
              backgroundSize: '100% 100%',
            }"
          >
            <!-- <img :src="blockBackImgBase" alt="" style="width:100%;height:100%;display:block"> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { aesEncrypt } from './../utils/ase'
import { reqGet, reqCheck } from './../api/index'
import { useI18n } from 'vue-i18n'
import loadingImg from '../imgs/80-80.gif'
import errorImg from './../imgs/error.jpg'
import { reactive, toRefs, watch, computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { LocalStorage } from 'quasar'

interface Props {
  captchaType: string;
  type?: string;
  mode?: string;
  vSpace?: number;
  explain: string;
  imgSize?: {
    width: string;
    height: string;
  };
  blockSize?: {
    width: string;
    height: string;
  };
  barSize?: {
    width: string;
    height: string;
  };
  defaultImg?: string;
  clickShow: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: '1',
  mode: 'fixed',
  vSpace: 5,
  imgSize: () => ({
    width: '300px',
    height: '155px',
  }),
  blockSize: () => ({
    width: '38px',
    height: '38px'
  }),
  barSize: () => ({
    width: '310px',
    height: '38px'
  }),
  defaultImg: '',
  clickShow: false,
})

const emits = defineEmits(['changeClickShow', 'close'])
const { t: lang } = useI18n()
const currentInstance = getCurrentInstance()

const state = reactive({
  secretKey: '', // 后端返回的加密秘钥 字段
  passFlag: false, // 是否通过的标识
  backImgBase: '', // 验证码背景图片
  blockBackImgBase: '', // 验证滑块的背景图片
  backToken: '', // 后端返回的唯一token值
  startMoveTime: 0, // 移动开始的时间
  endMovetime: 0, // 移动结束的时间
  tipsBackColor: '', // 提示词的背景颜色
  tipWords: '',
  text: '',
  finishText: '',
  setSize: {
    imgHeight: '',
    imgWidth: '',
    barHeight: '',
    barWidth: ''
  },
  top: 0,
  left: 0,
  moveBlockLeft: '',
  leftBarWidth: '',
  // 移动中样式
  moveBlockBackgroundColor: '',
  leftBarBorderColor: '#ddd',
  iconColor: '',
  iconClass: 'icon-right',
  status: false, // 鼠标状态
  isEnd: false,		// 是够验证完成
  showRefresh: true,
  transitionLeft: '',
  transitionWidth: '',
  loading: false,
  loadingImg,
  authSuccessShow: false,
  errorMessage: '',
})

watch(
  () => props.clickShow,
  () => {
    if (props.clickShow) init()
  },
  {
    immediate: true
  }
)

onMounted(() => {
  document.querySelector('.verify-slide')?.addEventListener('selectstart', onSelectStart)
})

onBeforeUnmount(() => {
  removeListener()
  document.querySelector('.verify-slide')?.removeEventListener('selectstart', onSelectStart)
})

const onSelectStart = () => {
  return false
}

const init = () => {
  state.text = props.explain
  getPictrue()
  nextTick(() => {
    const setSize: any = resetSize()	// 重新设置宽度高度
    for (const key in setSize) {
      (state.setSize as any)[key] = setSize[key]
      console.log(setSize)
    }
  })
  removeListener()
  addListener()
}

const removeListener = () => {
  const box = document.querySelector('.verify-box')
  if (box) {
    box.removeEventListener('touchmove', move)
    box.removeEventListener('mousemove', move)
    box.removeEventListener('touchend', end)
    box.removeEventListener('mouseup', end)
  }
}
const addListener = () => {
  const box = document.querySelector('.verify-box')
  if (box) {
    box.addEventListener('touchmove', move, { passive: false })
    box.addEventListener('mousemove', move)
    box.addEventListener('touchend', end)
    box.addEventListener('mouseup', end)
  }
}

let startLeft = 0

const start = (e: any) => {
  e = e || window.event
  let x: any = null
  if (!e.touches) { // 兼容PC端
    x = e.clientX
  } else { // 兼容移动端
    x = e.touches[0].pageX
  }
  const barArea = document.querySelector('.verify-bar-area')
  if (barArea) startLeft = Math.floor(x - barArea.getBoundingClientRect().left)
  state.startMoveTime = +new Date() // 开始滑动的时间
  if (state.isEnd == false) {
    state.text = ''
    state.moveBlockBackgroundColor = '#c6ba9d'
    state.leftBarBorderColor = '#303030'
    state.iconColor = '#fff'
    e.stopPropagation()
    state.status = true
  }
}

// 鼠标移动
const move = (e: any) => {
  e = e || window.event
  if (state.status && state.isEnd == false) {
    let x: any = null
    if (!e.touches) { // 兼容PC端
      x = e.clientX
    } else { // 兼容移动端
      x = e.touches[0].pageX
    }
    const barArea = document.querySelector('.verify-bar-area')
    if (barArea) {
      var bar_area_left = barArea.getBoundingClientRect().left
      var move_block_left = x - bar_area_left // 小方块相对于父元素的left值
      if (move_block_left >= (barArea as any).offsetWidth - Math.floor(parseInt(props.blockSize.width) / 2) - 2) {
        move_block_left = (barArea as any).offsetWidth - Math.floor(parseInt(props.blockSize.width) / 2) - 2
      }
      if (move_block_left <= 0) {
        move_block_left = Math.floor(parseInt(props.blockSize.width) / 2)
      }
      console.log('bar_area_left:' + bar_area_left)
      console.log('pageX:' + x)
      console.log('move_block_left: ' + move_block_left)
      console.log('startLeft: ' + startLeft)
      // 拖动后小方块的left值
      state.moveBlockLeft = (move_block_left - startLeft) + 'px'
      state.leftBarWidth = (move_block_left - startLeft) + 'px'
    }
  }
  e.preventDefault()
}

// 鼠标松开
const end = () => {
  state.endMovetime = +new Date()
  // 判断是否重合
  if (state.status && state.isEnd == false) {
    var moveLeftDistance = parseInt((state.moveBlockLeft || '').replace('px', ''))
    moveLeftDistance = moveLeftDistance * 310 / parseInt(state.setSize.imgWidth)
    const data = {
      captchaType: props.captchaType,
      'pointJson': state.secretKey ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), state.secretKey) : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
      'token': state.backToken
    }
    reqCheck(data).then(res => {
      if (res.repCode == '0000') {
        state.authSuccessShow = true
        state.moveBlockBackgroundColor = '#5cb85c'
        state.leftBarBorderColor = '#5cb85c'
        state.iconColor = '#fff'
        state.iconClass = 'icon-check'
        state.showRefresh = false
        state.isEnd = true
        if (props.mode == 'pop') {
          setTimeout(() => {
            emits('changeClickShow', false)
            refresh()
          }, 1500)
        }
        state.passFlag = true
        state.tipWords = `${((state.endMovetime - state.startMoveTime) / 1000).toFixed(2)}s${lang('验证成功')}`
        var captchaVerification = state.secretKey ? aesEncrypt(state.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 }), state.secretKey) : state.backToken + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 })
        setTimeout(() => {
          state.tipWords = ''
          emits('close')
          currentInstance?.parent?.emit('success', { captchaVerification })
        }, 1000)
      } else {
        state.moveBlockBackgroundColor = '#d9534f'
        state.leftBarBorderColor = '#5cb85c'
        state.iconColor = '#fff'
        state.iconClass = 'icon-yuyinguanbi'
        state.passFlag = false
        setTimeout(function() {
          refresh()
        }, 1000)
        state.tipWords = lang('验证失败，请重试')
        setTimeout(() => {
          state.tipWords = ''
        }, 1000)
      }
    })
    state.status = false
  }
}

const refresh = () => {
  state.showRefresh = true
  state.authSuccessShow = false
  state.finishText = ''

  state.transitionLeft = 'left .3s'
  state.moveBlockLeft = ''

  state.leftBarWidth = ''
  state.transitionWidth = 'width .3s'

  state.leftBarBorderColor = '#ddd'
  state.moveBlockBackgroundColor = '#c6ba9d'
  state.iconClass = 'icon-right'
  state.isEnd = false

  getPictrue()
  setTimeout(() => {
    state.transitionWidth = ''
    state.transitionLeft = ''
    state.text = props.explain
  }, 300)
}

const getPictrue = () => {
  const data = {
    captchaType: props.captchaType,
    clinetUid: LocalStorage.getItem('slider'),
    ts: Date.now()
  }
  state.loading = true
  state.blockBackImgBase = ''
  state.errorMessage = ''
  reqGet(data).then(res => {
    if (res.repCode == '0000') {
      state.backImgBase = 'data:image/png;base64,' + res.repData.originalImageBase64
      state.blockBackImgBase = 'data:image/png;base64,' + res.repData.jigsawImageBase64
      state.backToken = res.repData.token
      state.secretKey = res.repData.secretKey
    } else {
      state.tipWords = res.repMsg
    }
    // 判断接口请求次数是否失效
    if (res.repCode == '6201') {
      state.backImgBase = ''
      state.blockBackImgBase = ''
    }
  })
  .catch(() => {
    state.blockBackImgBase = ''
    state.backImgBase = errorImg
    state.errorMessage = lang('网络连接失败，请稍后再试')
  })
  .finally(() => {
    state.loading = false
  })
}

const getNum = (str: string) => {
  const num = str.split('p')[0]
  return parseInt(num)
}

const resetSize = () => {
  let img_width
  let img_height
  let bar_width
  let bar_height	// 图片的宽度、高度，移动条的宽度、高度

  const parentEl = document.querySelector('.verify-box') as HTMLDivElement
  var parentWidth = parentEl.offsetWidth || window.innerWidth
  var parentHeight = parentEl.offsetHeight || window.innerHeight

  if (props.imgSize.width.indexOf('%') != -1) {
    img_width = parseInt(props.imgSize.width) / 100 * parentWidth + 'px'
  } else {
    img_width = props.imgSize.width
  }

  if (props.imgSize.height.indexOf('%') != -1) {
    img_height = parseInt(props.imgSize.height) / 100 * parentHeight + 'px'
  } else {
    img_height = props.imgSize.height
  }

  if (props.barSize.width.indexOf('%') != -1) {
    bar_width = parseInt(props.barSize.width) / 100 * parentWidth + 'px'
  } else {
    bar_width = props.barSize.width
  }

  if (props.barSize.height.indexOf('%') != -1) {
    bar_height = parseInt(props.barSize.height) / 100 * parentHeight + 'px'
  } else {
    bar_height = props.barSize.height
  }

  return { imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height }
}

const {
  setSize,
  loading,
  backImgBase,
  leftBarWidth,
  text,
  errorMessage,
  showRefresh,
  tipWords,
  finishText,
  passFlag,
  authSuccessShow,
  iconClass,
  blockBackImgBase,
  moveBlockBackgroundColor,
  moveBlockLeft,
  transitionWidth,
  transitionLeft,
} = toRefs(state)
</script>

<style lang="scss">
.verify-slide {
  .img-box {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
