<template>
  <div class="mySettingList">
    <div
      class="mySettingItem"
      v-for="(item, index) in settingList"
      :key="index"
      @click="itemClick(item)"
    >
      <div class="icon" :class="item.iconCls"></div>
      <div class="settingText">{{ item.text }}</div>
     </div>
    <!-- <q-dialog v-model="dialogVisible">
      <Share />
    </q-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t: lang } = useI18n()

const settingList = reactive([
  {
    text: lang('我的VIP'),
    path: '/vip',
    iconCls: 'vip',
  },
  {
    text: lang('交易记录'),
    path: '/mine/transaction-records',
    iconCls: 'record',
  },
  {
    text: lang('我的优惠'),
    path: '/mine/coupons',
    iconCls: 'coupons',
  },
  {
    text: lang('优惠活动'),
    path: '/activity',
    iconCls: 'activity',
  },
  {
    text: lang('新手任务'),
    path: '/activity/NewJobs',
    iconCls: 'newjobs',
  },
  {
    text: lang('安全中心'),
    path: '/mine/securityCenter',
    iconCls: 'security',
  },
  {
    text: lang('意见反馈'),
    path: '/mine/suggest',
    iconCls: 'suggest',
  },
  {
    text: lang('历史赞助'),
    path: '/mySponsor',
    iconCls: 'sponsor',
  },
  {
    text: lang('帮助中心'),
    path: '/mine/helpCenter',
    iconCls: 'help',
  },
])

const itemClick = (item: {text: string; path: string; iconCls: string;}) => {
  router.push(item.path)
}
</script>

<style lang="scss">
.mySettingList {
  background: var(--bg1);
  border-radius: 10px;
  padding: 20px 0 20px 20px;
  display: flex;
  flex-wrap: wrap;
  box-shadow: var(--box-shadow);
}
.mySettingItem {
  width: 80px;
  margin-right: 40px;
  font-size: 14px;
  color: var(--t2);
  text-align: center;
  margin-bottom: 40px;
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(9) {
    margin-bottom: 0;
  }
  &:nth-child(3n) {
    margin-right: 0;
  }
  .icon {
    width: 48px;
    height: 48px;
    background: var(--bg3);
    margin: 0 auto 8px;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 28px auto;
    @each $icon in vip record coupons activity newjobs security suggest sponsor help {
      &.#{$icon} {
        background-image: url('images/mine/vip/mine-icon-' + $icon + '.png');
      }
    } 
  }
}
</style>