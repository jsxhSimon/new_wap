/**
 * 封装这个方法是为了统一管理loading
 * 等所有正在发送的请求返回了再关闭loading
 */
import { Loading } from 'quasar'
import { i18n } from 'boot/i18n'

const { t: lang } = i18n.global

let pendingRequestCounts = 0

const handleRequestCompelete = () => {
  pendingRequestCounts && (pendingRequestCounts--)
  if (pendingRequestCounts === 0) { // 当所有请求结束后，再关闭loading
    setTimeout(() => { // 做一次防抖 避免出现闪现问题
      !pendingRequestCounts && Loading.hide()
    }, 200)
  }
}

export function useLoading(message = `${lang('加载中')}...`) {
  pendingRequestCounts++
  Loading.show({
    message,
  })
  return handleRequestCompelete
}