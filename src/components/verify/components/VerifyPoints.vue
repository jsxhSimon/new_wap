<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          backgroundSize: setSize.imgWidth + ' ' + setSize.imgHeight,
          marginBottom: vSpace + 'px',
        }"
      >
        <div v-show="showRefresh" class="verify-refresh" style="z-index:3" @click="refresh">
          <i class="iconfont icon-refresh" />
        </div>
        <img
          ref="convasRef"
          :src="pointBackImgBase?('data:image/png;base64,'+pointBackImgBase):defaultImg"
          alt=""
          style="width:100%;height:100%;display:block"
          @click="bindingClick?canvasClick($event):undefined"
        >
        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color':'#1abd6c',
            color:'#fff',
            'z-index':9999,
            width:'20px',
            height:'20px',
            'text-align':'center',
            'line-height':'20px',
            'border-radius': '50%',
            position:'absolute',
            top:Number(tempPoint.y-10) + 'px',
            left:Number(tempPoint.x-10) + 'px'
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <div
      class="verify-bar-area"
      :style="{
        'width': setSize.imgWidth,
        'color': barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height':barSize.height
      }"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage } from 'quasar'
import { ref, reactive, nextTick, getCurrentInstance, onMounted } from 'vue'
import { resetSize } from './../utils/util'
import { aesEncrypt } from './../utils/ase'
import { reqGet, reqCheck } from './../api/index'
import { useI18n } from 'vue-i18n'

interface Props {
  mode?: string;
  captchaType: string;
  vSpace?: number;
  imgSize?: {
    width: string;
    height: string;
  },
  barSize: {
    width: string;
    height: string;
  },
  defaultImg?: string; 
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'fixed',
  vSpace: 5,
  imgSize: () => ({
    width: '310px',
    height: '155px',
  }),
  barSize: () => ({
    width: '310px',
    height: '40px',
  }),
  defaultImg: '',
})

const emits = defineEmits(['changeClickShow'])
const { t: lang } = useI18n()

const currentInstance = getCurrentInstance()
const secretKey = ref('') // ???????????????ase????????????
const checkNum = ref(3) // ???????????????????????????
const fontPos = ref<number[]>([]) // ?????????????????????
const checkPosArr = ref<any[]>([])
const num = ref(1) // ????????????
const pointBackImgBase = ref('') // ???????????????????????????
const poinTextList = ref<string[]>([])
const backToken = ref('') // ???????????????token???
const setSize = ref({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0
})
const tempPoints = ref<any>([])
const text = ref('')
const barAreaColor = ref('')
const barAreaBorderColor = ref('')
const showRefresh = ref(true)
const bindingClick = ref(true)
const convasRef = ref<any>(null)

onMounted(() => {
  init()
})

const init = () => {
  fontPos.value.splice(0, fontPos.value.length)
  checkPosArr.value.splice(0, checkPosArr.value.length)
  num.value = 1
  getPictrue()
  nextTick(() => {
    setSize.value = resetSize(currentInstance)
  })
}

const canvasClick = (e: any) => {
  checkPosArr.value.push(getMousePos(e))
  if (num.value == checkNum.value) {
    num.value = createPoint(getMousePos(e))
    // ????????????????????????
    checkPosArr.value = pointTransfrom(checkPosArr.value, setSize.value)
    // ????????????????????????
    setTimeout(() => {
      // var flag = this.comparePos(this.fontPos, this.checkPosArr);
      // ??????????????????
      var captchaVerification = secretKey.value ? aesEncrypt(backToken.value + '---' + JSON.stringify(checkPosArr.value), secretKey.value) : backToken.value + '---' + JSON.stringify(checkPosArr.value)
      const data = {
        captchaType: props.captchaType,
        'pointJson': secretKey.value ? aesEncrypt(JSON.stringify(checkPosArr.value), secretKey.value) : JSON.stringify(checkPosArr.value),
        'token': backToken.value
      }
      reqCheck(data).then(res => {
        if (res.repCode == '0000') {
          barAreaColor.value = '#4cae4c'
          barAreaBorderColor.value = '#5cb85c'
          text.value = lang('????????????')
          bindingClick.value = false
          if (props.mode == 'pop') {
            setTimeout(() => {
              emits('changeClickShow', false)
              refresh()
            }, 1500)
          }
          currentInstance?.parent?.emit('success', { captchaVerification })
        } else {
          barAreaColor.value = '#d9534f'
          barAreaBorderColor.value = '#d9534f'
          text.value = lang('????????????')
          setTimeout(() => {
            refresh()
          }, 700)
        }
      })
    }, 400)
  }
  if (num.value < checkNum.value) {
    num.value = createPoint(getMousePos(e))
  }
}

const getMousePos = (e: any) => {
  const x = e.offsetX
  const y = e.offsetY
  return {x, y}
}

const createPoint = (pos: any) => {
  tempPoints.value.push(Object.assign({}, pos))
  return num.value += 1
}

const refresh = () => {
  tempPoints.value.splice(0, tempPoints.value.length)
  barAreaColor.value = '#000'
  barAreaBorderColor.value = '#ddd'
  bindingClick.value = true
  fontPos.value.slice(0, fontPos.value.length)
  checkPosArr.value.splice(0, checkPosArr.value.length)
  num.value += 1
  getPictrue()
  text.value = lang('????????????')
  showRefresh.value = true
}

const getPictrue = () => {
  const data = {
    captchaType: props.captchaType,
    clinetUid: LocalStorage.getItem('point'),
    ts: Date.now()
  }
  reqGet(data).then(res => {
    if (res.repCode == '0000') {
      pointBackImgBase.value = res.repData.originalImageBase64
      backToken.value = res.repData.token
      secretKey.value = res.repData.secretKey
      poinTextList.value = res.repData.wordList
      text.value = `${lang('???????????????')}???' + this.poinTextList.join(',') + '???`
    } else {
      text.value = res.repMsg
    }
    // ????????????????????????????????????
    if (res.repCode == '6201') {
      pointBackImgBase.value = ''
    }
  })
}

const pointTransfrom = (pointArr: any, imgSize: any) => {
  var newPointArr = pointArr.map((p: any) => {
    const x = Math.round(310 * p.x / parseInt(imgSize.imgWidth))
    const y = Math.round(310 * p.y / parseInt(imgSize.imgHeight))
    return { x, y }
  })
  return newPointArr
}

</script>