import { Platform, SessionStorage } from 'quasar'
const { APP_API_URL, DEFAULT_DOMAIN } = process.env
import axios from 'axios'

const selectLine = () => {
  let urls: string[] = JSON.parse(APP_API_URL || '')
  if (!Array.isArray(urls)) {
    urls = [APP_API_URL as string]
  }
  if (urls.length === 0) {
    if (Platform.is.cordova) {
      urls = [`https://${DEFAULT_DOMAIN}`]
    } else {
      if (window.location?.origin.indexOf('localhost') === -1 && window.location.origin.indexOf('0.0.0.0') === -1) {
        urls = [`${window.location.origin}`]
      } else {
        urls = [`https://${DEFAULT_DOMAIN}`]
      }
    }
  }
  let errNum = 0
  const promiseArr = urls.map((apiUrl, apiIndex, apiArr) => {
    return new Promise((resolve, reject) => {
      axios.post(`${apiUrl}/splive/app/getCurrentTimeMillis?terminal=1`)
        .then((res) => {
          if (res.status == 200 && res.data?.code === 0 && res.data?.msg) {
            SessionStorage.set('timeGap', res.data.time - new Date().getTime())
            resolve(apiUrl)
          } else {
            errNum += 1
            if (apiArr.length === errNum) {
              resolve(urls[0])
            }
          }
        }).catch((err) => {
          errNum += 1
          if (apiArr.length === errNum) {
            resolve(urls[0])
          }
        })
    })
  })
  return Promise.race(promiseArr).then((value) => {
    console.log(value)
    return value
  }).catch((err) => {
    return err
  })
}

export { selectLine }
