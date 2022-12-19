/* eslint-disable object-curly-newline */
/* eslint-disable */
function hdt(t: number) {
  return (`0${t}`).slice(-2)
}
export function format(time: Date, n = 0) {
  const t = new Date(time.getTime() - n * 24 * 3600000)
  return `${t.getFullYear()}-${hdt(t.getMonth() + 1)}-${hdt(t.getDate())}`
}

export const getheight = (key: string) => parseInt(getComputedStyle(document.documentElement).getPropertyValue(`--${key}`), 10)
export function getminheight(clas: string, height: number) {
  return (document.querySelector(clas) as HTMLDivElement).offsetHeight - getheight('sat') - getheight('sab') - getv(height)
}
export const getv = (v: number) => v / 375 * window.innerWidth
