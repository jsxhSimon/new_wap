export { rules } from './rules';
import { date, Dialog, SessionStorage } from 'quasar';
import DialogPrimary from 'pages/common/DialogPrimary.vue';
import { i18n } from 'boot/i18n';
const { t: lang } = i18n.global;

export const enterGameErrorDialog = (msg: string, time: number) => {
  let count = time || 10;
  const dialogQuickclick = Dialog.create({
    component: DialogPrimary,
    message: msg,
    title: lang('温馨提示'),
    contentClass: 'dialog-primary-content--pre-line',
    okLabel: `${lang('知道了')}(${count})`,
    persistent: true,
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
  const currentDate = new Date(
    new Date().getTime().toString() +
      SessionStorage.getItem('timeGap') +
      (parseInt((new Date().getTimezoneOffset() / 60).toString(), 10) + 8) *
        3600 *
        1000
  );
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

export const lengthMap = {
  86: 11,
  886: 8,
  61: 9,
  84: 10,
};

export { getDomain } from './getDomain';
