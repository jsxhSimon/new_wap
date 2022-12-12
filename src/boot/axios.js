import axios from 'axios'
import { Notify, LocalStorage, Platform } from 'quasar'
import { report } from 'logan-web'
import crypto from 'src/utils/crypto'
import { LoganReqNot200 } from './loganlog'
import { enterGameErrorDialog, getTimeStamp } from 'src/utils/index'
import sbErrorMap from 'src/utils/sbErrorMap'
import fbErrorMap from 'src/utils/fbErrorMap'
import { i18n } from 'boot/i18n'
import { useSysStore } from 'src/stores/sys'
import { useUserStore } from 'src/stores/user'

const { t: lang } = i18n.global


const {
  APP_DEFAULT_SPTVTOKEN,
  APP_LANGUAGE,
} = process.env

const instance = axios.create({
  withCredentials: true,
  baseURL: '',
  headers: {
    dev: 'H5',
  },
  params: {
    terminal: 1,
  },
  timeout: 1000 * 20,
})

const { CancelToken } = axios

export default ({ store, router }) => {
  const sysStore = useSysStore()
  const userStore = useUserStore()

  function handleRequest(config) {
    const { url } = config
    if (url.indexOf('/n2') !== -1) {
      // eslint-disable-next-line no-empty
    } else if (url.indexOf('splive/') === -1) {
      // eslint-disable-next-line no-empty
    } else {
      const micsecond = getTimeStamp()
      console.log(micsecond)
      config.headers.sptvstoken = crypto.Encrypt(JSON.parse(APP_DEFAULT_SPTVTOKEN) + micsecond)
    }
    if (url.endsWith('pay/recoverBalance') || url.endsWith('sys/transit')) {
      if (sysStore.reqQueue.length && sysStore.reqQueue.includes('pay/recoverBalance') && sysStore.reqQueue.includes('sys/transit')) {
        // if (sysStore.reqQueue.length && !sysStore.reqQueue.includes(url)) {
        config.cancelToken = new CancelToken(c => c('不能同时请求回收和转入'))
      } else if (url.endsWith('pay/recoverBalance')) {
        const panding = sysStore.reqQueue.filter(item => item.url === url)
        if (panding.length) {
          config.cancelToken = new CancelToken(c => c('回收余额被重复调用'))
        } else {
          sysStore.$patch(state => state.reqQueue = sysStore.reqQueue.concat(['pay/recoverBalance']))
        }
      } else if (url.endsWith('sys/transit')) {
        sysStore.$patch(state => state.reqQueue = sysStore.reqQueue.concat(['sys/transit']))
      }
    }
  }
  function handleResponse(config) {
    const { url } = config
    if (url.endsWith('pay/recoverBalance') || url.endsWith('sys/transit')) {
      const temp = url.endsWith('pay/recoverBalance') ? 'pay/recoverBalance' : 'sys/transit'
      const arr = [...sysStore.reqQueue]
      const index = arr.indexOf(temp)
      if (index !== -1) {
        arr.splice(index, 1)
        sysStore.$patch(state => state.reqQueue = arr)
      }
    }
  }
  instance.interceptors.request.use(
    (config) => {
      handleRequest(config)
      const { domain, SToken } = sysStore
      const { token } = userStore
      if (!Platform.is.cordova) {
        domain && (config.headers.domain = window.location.host)
      }
      if (APP_LANGUAGE) config.headers.language = JSON.parse(APP_LANGUAGE)
      SToken && (config.headers.SToken = SToken)
      token && (config.headers.token = token)
      return config
    },
    error => Promise.reject(error),
  )

  // 返回数据不拦截
  const ignoreArr = [
    'sdyactivity/redPacketRainInfo', // 红包雨活动接口
    '/queryMarketMaxMinBetMoney', // 查询赔率接口
    '/panda/XM/bet', // 投注接口
    '/panda/XM/videoAnimationUrl',
  ]

  // 超时警告忽略
  const ignoreTimeoutArr = [
    '/panda/XM/matches',
    '/panda/XM/getSportsMenu',
    'panda/XM/bet',
  ]

  instance.interceptors.response.use(
    (response) => {
      handleResponse(response.config)
      const statusCode = response.data.code
      // 记录下非200日志
      if (response.status !== 200) {
        const msg = JSON.stringify({ url: response.config.url, data: response.data })
        LoganReqNot200('后端接口非200 '.concat(msg))
        report()
      }

      if (response.config.url.indexOf('splive/sbod/sbod') !== -1 && response.data.status === false) {
        let msg = response.data.message
        try {
          const jsonData = JSON.parse(response.data.message)
          msg = sbErrorMap[jsonData.errorCode] || '请求失败，请稍后再试'
        } catch (e) {
          // console.log(e)
          msg = '请求失败，请稍后再试'
        }
        Notify.create({
          message: lang(msg),
          timeout: 3000,
        })
        return Promise.reject(response)
      }

      if (response.config.url.indexOf('splive/fbob/fbob') !== -1 && response.data.status === false) {
        let msg = response.data.message
        try {
          const jsonData = JSON.parse(response.data.message)
          msg = fbErrorMap[jsonData.errorCode || jsonData.code] || '请求失败，请稍后再试'
        } catch (e) {
          // console.log(e)
          msg = '请求失败，请稍后再试'
        }
        Notify.create(lang(msg))
        return Promise.reject(response)
      }

      if (statusCode === 500 || statusCode === 2000) {
        if (response.config.url.indexOf('sys/transit') > 0) { //  多次进入游戏，因上一次游戏跳转的执行操作没完，新增弹窗提醒
          if (!window.location.hash.lastIndexOf('/sports')) {
            enterGameErrorDialog(response.data.msg, 3)
          } else {
            // 解决体育后台关闭后和前端的提示语重复
            !response.data.msg.includes('维护中') && enterGameErrorDialog(response.data.msg, 3)
          }
          return Promise.reject(response)
        }
        if (response.config.url.indexOf('splive/panda/XM/orderPreSettle') !== -1) {
          Notify.create(response.data.data.msg || lang('请求失败，请稍后再试'))
          return Promise.reject(response)
        }
        const isIgnore = ignoreArr.some(item => response.config.url.indexOf(item) !== -1)
        if (isIgnore) {
          return Promise.resolve(response)
        }
        Notify.create(response.data.msg)
        return Promise.reject(response)
      }
      if (statusCode === 401) {
        const { useFingerprintLogin } = userStore

        router
          .push('/')
          .finally(() => {
            if (store.getters['user/isLogin']) {
              Notify.create(lang('登录超时，请重新登录'))
            }
            if (useFingerprintLogin) {
              userStore.$patch(state => state.signMode = 'fingerprintLogin')
            } else {
              userStore.clearUserInfo()
              userStore.$patch(state => state.signMode = 'signIn')
            }
          })

        return Promise.reject(response)
      }
      // 勿直接返回response.data response里其他的东西对业务逻辑也有用
      return Promise.resolve(response)
    },
    (error) => {
      if (error.config) {
        handleResponse(error.config)
        const { url } = error.config
        const flag = ignoreTimeoutArr.some(item => url.indexOf(item) !== -1)
        if (!flag && error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          Notify.create(lang('网络超时，请稍后再试'))
        }
      }
      return Promise.reject(error)
    },
  )

}

const request = method => (url, params, config) => {
  const data = method === 'get' ? { params } : params
  return instance[method](url, data, { ...config }).then(res => ({ res: res.data, response: res }), err => ({ err, response: err }))
}

const POST = request('post')
const GET = request('get')
export {
  instance as axios,
  CancelToken,
  POST,
  GET,
}
