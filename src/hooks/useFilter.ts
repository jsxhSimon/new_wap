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
  return {
    realNameFilter,
    mobileFilter,
    emailFilter
  }
}

export default useFilter
