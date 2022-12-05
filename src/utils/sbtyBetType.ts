import { i18n}  from 'boot/i18n'
import { SbMatch } from 'src/@types/sports'
const { t: lang } = i18n.global

// 不通类型游戏对应的列表玩法集
export const getBetTypesBySportType = (sportType: number) => {
  switch (sportType) {
    case 1:
      return [5, 1, 3]
    case 5:
      return [20, 1, 3]
    case 9:
      return [20, 701, 704]
    case 50:
      return [9539, 9538, 9401]
    default:
      return [20, 1, 3]
  }
}

// 1, 3, 5, 20, 701, 704, 1308, 1306, 9539, 9538, 9401

export const betTypeNameMap = {
  1: lang('全场让球'),
  3: lang('全场大小'),
  5: lang('全场独赢'),
  20: lang('胜负盘'),
  701: lang('全场让局'),
  704: lang('全场让分'),
  1306: lang('局数大小'),
  1308: lang('局数获胜者'),
  9401: lang('赢得抛硬币盘'),
  9538: lang('全场独赢'),
  9539: lang('比赛获胜者盘'),
  // '9001,1': '地图1胜负盘',
  // '9001,2': '地图2胜负盘',
  // '9001,3': '地图3胜负盘',
  '9001,1': lang('第x局', [1]),
  '9001,2': lang('第x局', [2]),
  '9001,3': lang('第x局', [3]),
  '9001,4': lang('第x局', [4]),
  '9001,5': lang('第x局', [5]),
  '9001,6': lang('第x局', [6]),
  '9001,7': lang('第x局', [7]),
  '9001,8': lang('第x局', [8]),
  '9001,9': lang('第x局', [9]),
  '9001,10': lang('第x局', [10]),
  '9001,11': lang('第x局', [11]),
  '9001,12': lang('第x局', [12]),
  '9001,13': lang('第x局', [13]),
  '9001,14': lang('第x局', [14]),
  '9001,15': lang('第x局', [15]),
  '9001,16': lang('第x局', [16]),
  '9001,17': lang('第x局', [17]),
  '9001,18': lang('第x局', [18]),
  '9001,19': lang('第x局', [19]),
  '9001,20': lang('第x局', [20]),
}

export const formatMmp = (value: SbMatch) => {
  const {
    ht,
    livePeriod,
    delayLive,
  } = value.gameInfo
  const type = value.sportType
  let text = ''
  let cst = 0
  switch (type) {
    case 1:
      if (livePeriod === 0 && delayLive && !ht) text = lang('延迟开赛')
      else if (livePeriod === 1 && !delayLive && !ht) text = lang('上半场')
      else if (livePeriod === 2 && !delayLive && !ht) text = lang('下半场')
      else if (livePeriod === 0 && !delayLive && ht) text = lang('中场休息')
      break
    case 2:
      if (livePeriod === 0 && delayLive && !ht) text = lang('延迟开赛')
      else if (livePeriod === 1 && !delayLive && !ht) text = lang('第一节')
      else if (livePeriod === 2 && !delayLive && !ht) text = lang('第二节')
      else if (livePeriod === 3 && !delayLive && !ht) text = lang('第三节')
      else if (livePeriod === 4 && !delayLive && !ht) text = lang('第四节')
      else if (livePeriod === 99 && !delayLive && !ht) text = lang('延长赛')
      else if (livePeriod === 0 && !delayLive && ht) text = lang('中场休息')
      break
    case 5:
      cst = value.tennisInfo.currentSet
      if (cst === 1) text = lang('第一盘')
      else if (cst === 2) text = lang('第二盘')
      else if (cst === 3) text = lang('第三盘')
      else if (cst === 4) text = lang('第四盘')
      else if (cst === 5) text = lang('第五盘')
      break
    case 9:
      if (livePeriod === 1) text = lang('第一局')
      else if (livePeriod === 2) text = lang('第二局')
      else if (livePeriod === 3) text = lang('第三局')
      break
    default:
      text = ''
  }
  return text || lang('进行中')
}
