export { rules } from './rules';
import { Dialog, SessionStorage } from 'quasar';
import DialogPrimary from 'pages/common/DialogPrimary.vue';
import { i18n } from 'boot/i18n';
const { t: lang } = i18n.global;
import { useSysStore } from 'src/stores/sys'

export const enterGameErrorDialog = (msg: string, time: number) => {
  let count = time || 10;
  const dialogQuickclick = Dialog.create({
    componentProps: {
      message: msg,
      title: lang('温馨提示'),
      contentClass: 'dialog-primary-content--pre-line',
      okLabel: `${lang('知道了')}(${count})`,
      persistent: true,
    },
    component: DialogPrimary,
  }).onOk(() => {
    // eslint-disable-next-line
    countdownInterval && clearInterval(countdownInterval);
    dialogQuickclick.hide();
  });
  const countdownInterval = setInterval(() => {
    count--;
    if (count < 1) {
      dialogQuickclick.hide();
      clearInterval(countdownInterval);
    } else {
      dialogQuickclick.update({
        okLabel: `${lang('知道了')}(${count})`,
      });
    }
  }, 1000);
};

export const getDownloadUrl = () => {
  const {
    APP_DOWNLOAD_LDY: ldy,
    APP_DOWNLOAD_URL_IOS: ios,
    APP_DOWNLOAD_URL_ANDROID: and,
  } = process.env;
  return `${JSON.parse(ldy ?? '""')}?ios=${encodeURIComponent(
    JSON.parse(ios ?? '[]').join(',')
  )}&and=${encodeURIComponent(JSON.parse(and ?? '[]'))}&spreadCode=${
    window.location.host
  }`;
};

// 获取北京时间时间戳
export const getTimeStamp = () => {
  const currentDate = new Date(new Date().getTime() + (SessionStorage.getItem('timeGap') as number) + (Math.floor(new Date().getTimezoneOffset() / 60) + 8) * 3600 * 1000);
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const d = currentDate.getDate();
  const h = currentDate.getHours();
  const mm = currentDate.getMinutes();
  const ss = currentDate.getSeconds();
  // Date.UTC() 方法接受的参数同日期构造函数接受最多参数时一样，返回从1970-1-1 00:00:00 UTC到指定日期的的毫秒数。
  const timeObj = Date.UTC(y, m, d, h, mm, ss, 0) / 1000 - 8 * 60 * 60;
  return timeObj * 1000;
};

export const lengthMap: Record<string, number> = {
  '86': 11,
  '886': 8,
  '61': 9,
  '84': 10,
};

export const checkURL = (URL: string) => {
  const str = URL
  // 判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
  // 下面的代码中应用了转义字符"\"输出一个字符"/"
  // eslint-disable-next-line
  const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  const objExp = new RegExp(Expression)
  if (objExp.test(str)) {
    return true
  }
  return false
}

/* 异步打开新窗口 */
export const openWindowAsync = (req: any, curSite: string) => {
  // const newWindow = window.open()
  // newWindow.document.write(loadingHTML)
  if (curSite === 'bog2') {
    curSite = 'bog'
  }
  if (curSite === 'ybo') {
    curSite = 'yboNew'
  }
  let openUrl = `https://download.injiepor.com/jumploading/${curSite}.html`
  // 加载动画
  if (curSite === 'hbx') {
    openUrl = `https://download.fvinbet.com/jumploading/${curSite}.html`
  }
  const newWindow: Window = window.open(openUrl) as Window
  req(
    (url: string, callback: () => void) => {
      const sysStore = useSysStore()
      newWindow.location.replace(url)
      const loop = window.setInterval(() => {
        if (newWindow.closed) {
          window.clearInterval(loop)
          if (callback && typeof (callback) === 'function' && !sysStore.reqQueue.includes('sys/transit')) {
            callback()
          }
        }
      }, 1000)
    },
    () => {
      newWindow.close()
    },
  )
}

export function cloneDeep(obj: any) {
  const isArr = Array.isArray(obj)
  try {
    if (isArr || typeof obj === 'object') {
      const cloneObj: any = isArr ? [] : {}
      Object.keys(obj).forEach((key) => {
        // console.log('key:', key)
        if (Array.isArray(obj[key]) || typeof obj[key] === 'object') {
          cloneObj[key] = cloneDeep(obj[key])
        } else {
          cloneObj[key] = obj[key]
        }
      })
      return cloneObj
    }
  } catch (error) {
    // console.log('error11:', error)
  }
  return obj
}

/**
 * 对列表分组
 * @param array
 * @param f
 * @param key
 * @returns {{key: *, list: *}[]}
 */
 export const groupBy = (array: any[], f: any, key: string) => {
  const groups: any = {}
  array.forEach((o) => {
    const group = f(o)
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(group => ({
    [key]: group,
    list: groups[group],
  }))
}

/**
 * 对列表分组 按照指定key
 * @param array
 * @param getKeys => { name: *, groupKey: *}
 * @returns {{name: *, list: *, groupKey: *}[]}
 */
 export const groupByKey = (array: any[], getKeys: any) => {
  const groups: any = {}
  array.forEach((o) => {
    const { groupKey, name, leagueId } = getKeys(o)
    if (groups[groupKey]) {
      groups[groupKey] = { list: [...groups[groupKey].list, o], name }
    } else {
      groups[groupKey] = { list: [o], name }
    }
    if (leagueId !== undefined) groups[groupKey] = { ...groups[groupKey], leagueId }
  })
  return Object.keys(groups).map(key => ({
    name: groups[key].name,
    list: groups[key].list,
    leagueId: groups[key].leagueId,
    groupKey: key,
  }))
}
export const alphaNum = (str: string) => {
  const reg = /^[a-z0-9]+$/i
  return reg.test(str)
}

export { getDomain } from './getDomain';
export { openAppBrowser, switchOrientation } from './appBrowser'
export { getAssetsFile } from './getAssetsFile'
export { useLoading } from './useLoading'
