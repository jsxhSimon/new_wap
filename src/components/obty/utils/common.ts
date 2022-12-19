import { XMMatch } from "src/types/sports"

export function formatMgtTime(value: XMMatch) {
  const timeValue = +value.mst
  let min: string | number = Math.floor(timeValue / 60)
  let sec: string | number = Math.floor(timeValue - min * 60)
  if (!min) {
    min = 0
  }
  if (!sec) {
    sec = 0
  }
  if (sec < 0) {
    sec = 0
  }
  if (min < 0) {
    min = 0
  }
  if (min < 10) {
    min = `0${min}`
  }
  if (sec < 10) {
    sec = `0${sec}`
  }
  return `${min}:${sec}`
}

export function transformScore(data: XMMatch) {
  const { msc } = data
  data.scopes = {}
  if (msc && msc.length) {
    msc.forEach((item) => {
      const temp = item.split('|')
      const scopes = temp[1].split(':')
      data.scopes[temp[0]] = {
        homeScore: scopes[0],
        awayScore: scopes[1],
      }
    })
  }
  if (data.csid === '10' || data.csid === '8' || data.csid === '7') {
    // 乒乓，羽毛，斯诺克
    if (data.mct) {
      data.scopes.S0 = data.scopes.S1
    }
  } else if (data.csid === '5') {
    // 网球
    if (data.mct) {
      data.scopes.S0 = data.scopes.S1
    }
  } else if (data.csid === '2') {
    // 篮球
    if (data.mct) {
      data.scopes.S0 = data.scopes.S1
    }
  }
}

export const imgPrefix = 'https://api.sportxxxwo8.com/file/fastdfs/download/image?filePath='
