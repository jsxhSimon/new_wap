const useFilter = () => {
  const realNameFilter = (realName: string) => {
    if (realName) {
      return realName.slice(0, 1).padEnd(realName.length, '*')
    }
    return ''
  }
  return {
    realNameFilter
  }
}

export default useFilter
