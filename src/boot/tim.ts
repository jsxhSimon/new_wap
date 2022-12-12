import Vue from 'vue'
import TIM from 'tim-js-sdk'

const { APP_TIM_SDK_APP_ID } = process.env

// 初始化 SDK 实例
const tim = TIM.create({
  SDKAppID: JSON.parse(APP_TIM_SDK_APP_ID as string),
})

tim.setLogLevel(1)

window.tim = tim
window.TIM = TIM

export { tim, TIM }
