<template>
  <div class="side-list"  :class="sideShow? '' : 'hide-right'" >
    <div class="close-div" @click="$emit('close')">
      <span class="iconfont icon-yuyinguanbi"></span>
    </div>
    <ul>
      <router-link to="/matchResults">
        <li>
          <div>
            <img class="front" src="~images/side/icon-sg.png" alt="">
            <span class="name">{{ $t('赛果') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/proxyCooperation">
        <li>
          <div>
            <img class="front" src="~images/side/icon-dl.png" alt="">
            <span class="name">{{ $t('代理合作') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <!-- <router-link to="/" tag="li">
        <div>
          <img class="front" src="../sports/images/icon-Promotions@2x.png" alt="">
          <span class="name">优惠活动</span>
        </div>
        <div class="iconfont icon-xiangyou1"></div>
      </router-link> -->
      <!-- <router-link to="/beginnerGuide" tag="li">
        <div>
          <img class="front" src="../sports/images/icon-NEW-HELP@2x.png" alt="">
          <span class="name">{{ $t('新手指南') }}</span>
        </div>
        <div class="iconfont icon-xiangyou1"></div>
      </router-link> -->
      <router-link to="/gameHelp">
        <li>
          <div>
            <img class="front" src="~images/side/icon-yx.png" alt="">
            <span class="name">{{ $t('游戏帮助') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/gamingResponsibility">
        <li>
          <div>
            <img class="front" src="~images/side/icon-bc.png" alt="">
            <span class="name">{{ $t('博彩责任') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/privacyProtection">
        <li>
          <div>
            <img class="front front-security" src="~images/side/icon-ys.png" alt="">
            <span class="name">{{ $t('隐私保护') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/rules">
        <li>
          <div>
            <img class="front" src="~images/side/icon-gz.png" alt="">
            <span class="name">{{ $t('规则条款') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/aboutUs">
        <li>
          <div>
            <img class="front" src="~images/side/icon-gy.png" alt="">
            <span class="name">{{ $t('关于我们') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <router-link to="/shareApp">
        <li>
          <div>
            <img class="front" src="~images/side/icon-fx.png" alt="">
            <span class="name">{{ $t('分享APP') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link>
      <!-- <router-link to="/mySponsor">
        <li>
          <div>
            <img class="front" src="@/pages/ywb/sports/images/icon-history.png" alt="">
            <span class="name">{{ $t('历史赞助') }}</span>
          </div>
          <div class="iconfont icon-xiangyou1"></div>
        </li>
      </router-link> -->
    </ul>
    <div class="current-edition">
      <span>
        {{ $t('当前版本') }}：
      </span>
      <span>V{{envStore.envAppVersion}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEnvStore } from 'src/stores/env'
interface Props {
  sideShow: boolean;
}

const props = defineProps<Props>()
const envStore = useEnvStore()

</script>

<style lang="scss">
.side-list {
  position: fixed;
  width: 240px;
  height: 100%;
  box-shadow: 0px 2px 10px rgba(32, 59, 101, 0.15);
  background: var(--side-bar-bg);
  right: 0;
  top: 0;
  z-index: 9999;
  transition: .5s;
  padding-top: env(safe-area-inset-top);
  font-size: 14px;
  &.hide-right{
    transform:translateX(100%);
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 50px 0 0;
    a {
      text-decoration: none;
      color: var(--t1);
    }
    li {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px 0 18px;
      border-bottom: 1px solid var(--border-color);
      .iconfont {
        color: var(--t2);
      }
      > div:first-child {
        display: flex;
        align-items: center;
      }
      img {
        width: 18px;
        margin-right: 6px;
      }
    }
  }
  .close-div {
    position: absolute;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    color: var(--t2);
  }
  .current-edition {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--t2);
  }
}
</style>