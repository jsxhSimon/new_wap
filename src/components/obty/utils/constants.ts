export const MENU_MAP: Record<string, number> = {
  GUN_QIU: 1, // 滚球
  JIN_RI: 3, // 今日
  ZAO_PAN: 4, // 早盘
  CHUAN_GUAN: 11, // 串关
}

// 计算赔率
export const getOdds = (ov: number) => ov / 100000

/**
 * 比赛阶段
 * field1 体育种类ID : { 比赛阶段ID: string }
 */
export const MATCH_STAGE = {
  // 足球
  1: {
    0: '未开赛',
    100: '下半场结束',
    110: '加时赛结束',
    120: '点球大战结束',
    31: '中场休息',
    32: '即将加时',
    33: '加时中场休息',
    34: '等待点球大战',
    41: '加时上半场',
    42: '加时下半场',
    50: '点球大战',
    6: '上半场',
    7: '下半场',
    80: '比赛中断',
    90: '比赛放弃',
    999: '全场结束',
  },
  // 篮球
  2: {
    0: '未开赛',
    1: '上半场',
    100: '全场结束',
    1001: '第四节',
    1002: '下半场',
    110: '加时赛结束',
    13: '第一节',
    14: '第二节',
    15: '第三节',
    16: '第四节',
    2: '下半场',
    301: '第二节',
    302: '第三节',
    303: '第四节',
    31: '中场休息',
    32: '等待加时',
    40: '加时赛',
    61: '比赛推迟',
    80: '比赛中断',
    90: '比赛放弃',
    999: '全场结束',
  },
  10: {
    0: '未开赛',
    10: '第三局',
    100: '完赛',
    11: '第四局',
    12: '第五局',
    301: '第二局',
    302: '第三局',
    303: '第四局',
    304: '第五局',
    61: '比赛推迟',
    8: '第一局',
    80: '比赛中断',
    9: '第二局',
    90: '比赛取消',
    93: '客队球员未参赛',
    94: '主队球员未参赛',
    95: '主队球员退赛',
    96: '客队球员退赛',
    97: '主队球员未到场',
    98: '客队球员未到场',
    999: '完赛',
  },
  3: {
    0: '未开赛',
    100: '完赛 ',
    401: '第一局 上',
    402: '第一局 下',
    403: '第二局 上',
    404: '第二局 下',
    405: '第三局 上',
    406: '第三局 下',
    407: '第四局 上',
    408: '第四局 下',
    409: '第五局 上',
    410: '第五局 下',
    411: '第六局 上',
    412: '第六局 下',
    413: '第七局 上',
    414: '第七局 下',
    415: '第八局 上',
    416: '第八局 下',
    417: '第九局 上',
    418: '第九局 下',
    41910: '第十局 上',
    41911: '第十一局 上',
    41912: '第十二局 上',
    41913: '第十三局 上',
    41914: '第十四局 上',
    41915: '第十五局 上',
    41916: '第十六局 上',
    41917: '第十七局 上',
    41918: '第十八局 上',
    41919: '第十九局 上',
    41920: '第二十局 上',
    42010: '第十局 下',
    42011: '第十一局 下',
    42012: '第十二局 下',
    42013: '第十三局 下',
    42014: '第十四局 下',
    42015: '第十五局 下',
    42016: '第十六局 下',
    42017: '第十七局 下',
    42018: '第十八局 下',
    42019: '第十九局 下',
    42020: '第二十局 下',
    421: '第一局 下',
    422: '第二局 上',
    423: '第二局 下',
    424: '第三局 上',
    425: '第三局 下',
    426: '第四局 上',
    427: '第四局 下',
    428: '第五局 上',
    429: '第五局 下',
    430: '第六局 上',
    431: '第六局 下',
    432: '第七局 上',
    433: '第七局 下',
    434: '第八局 上',
    435: '第八局 下',
    436: '第九局 上',
    437: '第九局 下',
    438: '等待加时',
    43810: '第十一局 上',
    43811: '第十二局 上',
    43812: '第十三局 上',
    43813: '第十四局 上',
    43814: '第十五局 上',
    43815: '第十六局 上',
    43816: '第十七局 上',
    43817: '第十八局 上',
    43818: '第十九局 上',
    43819: '第二十局 上',
    43910: '第十局 下',
    43911: '第十一局 下',
    43912: '第十二局 下',
    43913: '第十三局 下',
    43914: '第十四局 下',
    43915: '第十五局 下',
    43916: '第十六局 下',
    43917: '第十七局 下',
    43918: '第十八局 下',
    43919: '第十九局 下',
    43920: '第二十局 下',
    80: '比赛中断',
    90: '比赛放弃',
    999: '比赛结束',
  },
  4: {
    0: '未开赛',
    1: '第一节',
    100: '完赛',
    110: '加时赛结束',
    120: '点球大战结束',
    2: '第二节',
    3: '第三节',
    301: '第二节',
    302: '第三节 ',
    32: '等待加时',
    34: '点球大战',
    40: '加时赛',
    50: '点球大战',
    80: '比赛中断',
    90: '比赛放弃',
    999: '完赛',
  },
  5: {
    0: '未开赛',
    10: '第三盘',
    100: '完赛',
    1e3: '第三盘',
    11: '第四盘',
    1100: '第四盘',
    12: '第五盘',
    1200: '第五盘',
    301: '第二盘',
    302: '第三盘',
    303: '第四盘',
    304: '第五盘',
    305: '完赛',
    61: '比赛推迟',
    8: '第一盘',
    80: '比赛中断',
    800: '第一盘',
    9: '第二盘',
    90: '比赛取消',
    900: '第二盘',
    93: '客队球员未参赛',
    94: '主队球员未参赛',
    95: '主队球员退赛',
    96: '客队球员退赛',
    97: '主队球员未到场',
    98: '客队球员未到场',
    999: '完赛',
  },
  6: {
    0: '未开赛',
    100: '完赛',
    110: '加时赛结束',
    13: '第一节',
    14: '第二节',
    15: '第三节',
    16: '第四节',
    301: '第二节',
    302: '第三节',
    303: '第四节',
    32: '等待加时',
    40: '加时赛',
    80: '比赛中断',
    90: '比赛放弃',
    999: '完赛',
  },
  7: {
    0: '未开赛',
    100: '完赛',
    21: '进行中',
    30: '暂停',
    419: '上',
    420: '下',
    439: '下',
    445: '局间休息',
    61: '比赛推迟',
    80: '比赛中断',
    90: '比赛取消',
    93: '客队球员未参赛',
    94: '主队球员未参赛',
    95: '主队退赛',
    96: '客队退赛',
    97: '主队弃权',
    98: '客队弃权',
    999: '完赛',
    x: '第%s局',
  },
  8: {
    0: '未开赛',
    10: '第三局',
    100: '完赛',
    11: '第四局',
    12: '第五局',
    301: '第二局',
    302: '第三局',
    303: '第四局',
    304: '第五局',
    305: '第六局',
    306: '第七局',
    441: '第六局',
    442: '第七局',
    61: '比赛推迟',
    8: '第一局',
    80: '比赛中断',
    9: '第二局',
    90: '比赛取消',
    93: '客队球员未参赛',
    94: '主队球员未参赛',
    95: '主队球员退赛',
    96: '客队球员退赛',
    97: '主队球员未到场',
    98: '客队球员未到场',
    999: '完赛',
  },
  9: {
    0: '未开赛',
    10: '第三局',
    100: '完赛',
    11: '第四局',
    12: '第五局',
    130: '完赛',
    17: '第五局',
    301: '第二局',
    302: '第三局',
    303: '第四局',
    304: '第五局',
    305: '第六局',
    306: '第七局',
    37: '第五局',
    441: '第六局',
    442: '第七局',
    61: '比赛推迟',
    8: '第一局',
    80: '比赛中断',
    9: '第二局',
    90: '比赛取消',
    93: '客队未参赛',
    94: '主队未参赛',
    95: '主队退赛',
    96: '客队退赛',
    999: '完赛',
  },
}
