/* eslint-disable */
import { LocalStorage, SessionStorage } from 'quasar'
const { LOGANLOG_URL } = process.env
const LOGAN_IPANDLOCATION = "logan_ipandlocation"
import { ajax_tool } from './../utils/httpRequest'
import Logan from 'logan-web'
import UA from 'ua-device'
Logan.initConfig({
  /* Demo Key */
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG2m5VVtZ4mHml3FB9foDRpDW7Pw\n' +
    'Foa+1eYN777rNmIdnmezQqHWIRVcnTRVjrgGt2ndP2cYT7MgmWpvr8IjgN0PZ6ng\n' +
    'MmKYGpapMqkxsnS/6Q8UZO4PQNlnsK2hSPoIDeJcHxDvo6Nelg+mRHEpD6K+1FIq\n' +
    'zvdwVPCcgK7UbZElAgMBAAE=\n' +
    '-----END PUBLIC KEY-----'
});
getorSetIPAndLocation();
/**
 * 捕获静态资源加载错误及常规错误 = 1
*/
export function LoganResouce(val) {
  // console.log("LoganResouce进入", val);
  Logan.log(val, 1)
}
/**
 *  后端接口非200 = 2
*/
export function LoganReqNot200(val) {
  Logan.log(val, 2)
}

/**
 * 全局捕获promise的异常 = 3
*/
export function LoganPromiseError(val) {
  Logan.log(val, 3)
}

/**
 * Vue提供了特有的异常捕获 = 4
*/
export function LoganVueError(val) {
  // console.log("LoganVueError :",val);
  Logan.log(val, 4)
}

export function LoganReport() {
  console.log("进入LoganReport");
  let userInfo = LocalStorage.getItem('userInfo')
  let userName = userInfo && userInfo.loginName

  if (!userName) return;
  let userAgent = navigator.userAgent
  let ip = getorSetIPAndLocation()
  let uaInfo = new UA(userAgent)
  let customInfo = Object.assign(ip, uaInfo)
  let timestamp = new Date().getTime();
  // let fromDayString = formatDate( new Date(new Date().getTime() - 24*60*60*1000)) //昨天和今天的日志
  let todayDate = formatDate(new Date())
  let reportData = {
    reportUrl: `${LOGANLOG_URL}/logan/web/upload.json`,
    deviceId: `${userName}_${timestamp}`, // 用户名作为设备号 方便后台查
    fromDayString: todayDate,
    toDayString: todayDate,
    webSource: uaInfo && uaInfo.browser && uaInfo.browser.name,
    environment: userAgent,
    customInfo: JSON.stringify(customInfo)
  }

  Logan.report(reportData).then((data) => {
    console.log('report回调', data)

    //删除本地db数据
    window.indexedDB.deleteDatabase('IDB_MANAGER_DB')
    window.indexedDB.deleteDatabase('logan_web_db')

  }).catch((error) => {
    console.log("report异常", error);
  });
}

function getorSetIPAndLocation() {
  if (SessionStorage.has(LOGAN_IPANDLOCATION)) {
    return SessionStorage.getItem(LOGAN_IPANDLOCATION);
  }
  try {
    ajax_tool('https://ifconfig.me/all.json', null, 'get', function (data) {
      if (data) {
        let { ip_addr } = JSON.parse(data)
        SessionStorage.set(LOGAN_IPANDLOCATION, { ip_addr })
      }
    });
  } catch (error) { }
  return {}
}

function formatDate(datetime) {
  // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
  let year = datetime.getFullYear(),
    month = ("0" + (datetime.getMonth() + 1)).slice(-2),
    date = ("0" + datetime.getDate()).slice(-2)
  // hour = ("0" + datetime.getHours()).slice(-2),
  // minute = ("0" + datetime.getMinutes()).slice(-2),
  // second = ("0" + datetime.getSeconds()).slice(-2);
  // 拼接
  // var result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  let result = year + "-" + month + "-" + date;
  // 返回
  return result;
}