import { i18n } from 'boot/i18n'

const { t: lang } = i18n.global

export default {
  A001: lang('验证失败'),
  A002: lang('未找到用户信息'),
  E001: lang('服务器异常'),
  E002: lang('参数输入无效'),
  E003: lang('查询条件错误'),
  E004: lang('IP受限'),
  E005: lang('压缩格式错误'),
  E006: lang('视频讯号未经授权'),
  E007: lang('视频信号已关闭'),
  B001: lang('系统未知错误'),
  B002: lang('用户未存款'),
  B003: lang('交易编号重复'),
  B004: lang('无效交易编号'),
  B005: lang('赛事已关闭或者盘口失效'),
  B006: lang('赛事状态已改变'),
  B007: lang('分数已更新'),
  B008: lang('球头已更新'),
  B009: lang('球头已过期'),
  B010: lang('赔率已更新'),
  B011: lang('赔率正在调整'),
  B012: lang('赔率错误'),
  B013: lang('投注数量异常'),
  B014: lang('投注数量过多'),
  B015: lang('封盘中'),
  B016: lang('已封盘'),
  B017: lang('余额不足'),
  B018: lang('账号无法投注'),
  B019: lang('找不到对应注单编号'),
  B020: lang('无效的运动类型'),
  B021: lang('低于最低串关赛事数量'),
  B022: lang('串关错误'),
  B024: lang('赛事已关闭'),
  B028: lang('会员账号已停用'),
  B029: lang('串关最大投注额小于最小投注额'),
  B030: lang('当前盘口不支持串关'),
  B031: lang('超过最多可串关数量'),
  B032: lang('扣款失败，请重试'),
  B033: lang('请勿串关同一赛事'),
  UM99: lang('系统正在维护中'),
  B025: lang('这张注单不能提前结算'),
}
