import { date } from 'quasar'

const useFilter = () => {
  const realNameFilter = (realName: string) => {
    if (realName) {
      return realName.slice(0, 1).padEnd(realName.length, '*')
    }
    return ''
  }
  const mobileFilter = (value: string | number) => {
    let str = ''
    switch (typeof value) {
      case 'string':
      case 'number':
        str = String(value)
        return `${str.slice(0, 3)}****${str.slice(-4)}`
      default:
        return value
    }
  }

  const emailFilter = (value: string | number) => {
    let str = ''
    switch (typeof value) {
      case 'string':
      case 'number':
        str = String(value)
        return `${str.slice(0, 3)}****${str.slice(-4)}`
      default:
        return value
    }
  }

  /* 给数字加千分符 */
  const amountFilter = (value: number) => {
    if (value) {
      return Number(value).toFixed(2).replace(/\d+/, s => s.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
    return '0.00'
  }

  /* 时间过滤器 */
  const timeFilter = (value: string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!value) return ''
    if (typeof value === 'string') {
      if (value.indexOf('.0') > -1) {
        value = value.slice(0, -2)
      }
      value = value.replace(/-/g, '/')
    }
    return date.formatDate(new Date(value), format)
  }
  return {
    realNameFilter,
    mobileFilter,
    emailFilter,
    amountFilter,
    timeFilter,
  }
}

export default useFilter
