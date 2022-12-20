<template>
  <q-page class="sponsor" :style="{ backgroundImage: 'url(' + imgs.bgImg + ')' }">
    <side-header></side-header>
    <div class="top-logo">
      <img :src="imgs.logoImg" alt="">
    </div>
    <div class="sdy-logo">
      <img class="sdy" :src="imgs.SDYLogoImg" alt="">
      <img class="ml" :src="imgs.mlImg" alt="">
    </div>

    <div class="sponsor-details">
      <h3>国际米兰足球俱乐部</h3>
      <p class="subtitle">亚洲区独家合作伙伴</p>
      <div class="video-wrapper" style="minHeight: 196px" v-if="activeVideoTab === 'game'">
        <img :src="imgs.videoImg" class="video-img" alt="" style="width: 340px;height:210px">
        <video style="width: 291px; height:165px" playsinline='true' webkit-playsinline='true' x5-playsinline='true'
          controls class="video absolute-center" src="https://video.longxiaoqz.com/video/SDY-Video-v1.mp4"
          :poster="imgs.sai">
        </video>
      </div>

      <div class="video-wrapper" style="minHeight: 196px" v-if="activeVideoTab === 'nian'">
        <img :src="imgs.videoNianImg" class="video-img" alt="" style="width: 340px;height:210px">
        <video style="padding-top:8px; width: 280px; height: 165px" playsinline='true' webkit-playsinline='true'
          x5-playsinline='true' controls class="video absolute-center"
          src="https://video.longxiaoqz.com/video/SDY-CNY-8ver4.mp4" :poster="imgs.nian" />
      </div>
      <div class="videowrapperbanner">
        <div :class="activeVideoTab === 'nian' ? 'videowrapper active' : 'videowrapper'" @click="videoswitch('nian')">
          球星拜年</div>
        <div :class="activeVideoTab === 'game' ? 'videowrapper active' : 'videowrapper'" @click="videoswitch('game')">
          精彩赛事</div>
      </div>

      <div class="text">
        <p>国际米兰足球俱乐部（Inter Milan，简称国米），是一家位于意大利伦巴第大区米兰市的足球俱乐部，成立于1908年3月9日。球队主场为梅阿查体育场，现征战于意大利足球甲级联赛。</p>
        <p>国际米兰是由来自“米兰板球与足球俱乐部”（即AC米兰俱乐部）的一部分会员分流出来后组建的足球俱乐部。球衣由蓝色和黑色两种主要颜色组成。因为俱乐部成立之初即向全世界所有球员敞开大门，所以称之为“国际”俱乐部。</p>
        <p>国际米兰曾为“意甲七姐妹”之一，也与AC米兰和尤文图斯两支球队 并称为北方三强。与AC米兰这支同样来自米兰的俱乐部之间的碰撞被称为“米兰德比”，和来自都灵的尤文图斯之间的对决则称为“意大利国家德
          比”。国际米兰是唯一一支拿过五冠王（欧冠、意甲、意大利杯、意大利超 级杯和世界俱乐部杯）的意大利联赛球队。</p>
      </div>
    </div>

    <div class="sponsor-sub-details">
      <div class="sdy-sub-logo">
        <img :src="imgs.SDYLogoImg" alt="">
      </div>
      <div class="sub-text">
        2020年，SDY体育正式签约赞助国际米兰足球俱乐部 <br>
        成为国际米兰足球俱乐部亚洲区独家合作伙伴 <br>
        此次战略合作的成功达成 <br>
        是双方追逐梦想，进军国际市场具有历史意义重要的一步 <br>
        致力于将自己打造成为具备专业服务的国际顶尖综合型体育 <br>
        投注平台， 正如这个从硝烟中不断过关斩将的蓝黑军团 <br>
        SDY体育势必破茧成竹 <br>
        成为全球范围内引领顾客体验新风潮的坚石
      </div>
    </div>

    <div class="right-title">
      <p class="t1">SDY体育权威认证</p>
      <p class="t2">CERTIFICATION</p>
      <p class="t2">AUTHORITY</p>
    </div>

    <div class="bottom-icon">
      <div><img :src="imgs.gcImg" alt="">
        <span>英国GC</span>
      </div>
      <div><img :src="imgs.mgaImg" alt="">
        <span>马耳他博彩牌照</span>
      </div>
      <div><img :src="imgs.fscImg" alt="">
        <span>英属维尔京群岛</span>
      </div>
      <div><img :src="imgs.flbImg" alt="">
        <span>菲律宾(PAGCOR)</span>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { mapActions, mapGetters } from 'vuex'
import SideHeader from './components/sideHeader.vue'

const logoImg = require('images/sponsor/logo@3x.png')
const SDYLogoImg = require('images/sponsor/SDY-Logo.png')
const mlImg = require('images/sponsor/ml.png')
const gcImg = require('images/sponsor/gc.png')
const mgaImg = require('images/sponsor/mga.png')
const fscImg = require('images/sponsor/fsc.png')
const flbImg = require('images/sponsor/flb.png')
const bgImg = require('images/sponsor/bg.jpg')
const videoImg = require('images/sponsor/video.png')
const videoNianImg = require('images/sponsor/video_nian.png')

const sai = require('images/sponsor/sai.jpg')
const nian = require('images/sponsor/nian.jpg')

export default {
  name: 'Index',
  components: {
    SideHeader,
  },
  data() {
    return {
      imgs: {
        logoImg,
        SDYLogoImg,
        mlImg,
        gcImg,
        mgaImg,
        fscImg,
        flbImg,
        bgImg,
        videoImg,
        videoNianImg,
        sai,
        nian,
      },
      persistent: true,
      activeVideoTab: 'nian',
      // loginBg: 'statics/sdy/sponsor/bg.jpg',
    }
  },
  methods: {
    ...mapActions('user', ['getMessageUnread']),
    hide() {
      this.persistent = false
      this.$router.go(-1)
    },
    videoswitch(tab) {
      this.activeVideoTab = tab
    },
  },
  created() {
    if (this.isLogin) {
      this.getMessageUnread()
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
  },
}
</script>

<style lang="scss" scoped>
.sponsor {
  height: 1462px;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  padding-top: 44px;

  .top-logo {
    img {
      display: block;
      margin: 23px auto 0 auto;
      width: 172px;
      height: 46px;
    }
  }

  .sdy-logo {
    position: absolute;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 222px;
    height: 34px;
    background: #FFFFFF;
    box-shadow: 0 1px 2px 0 #000000;
    border-radius: 17px;

    img {
      display: inline-block;
    }

    .sdy {
      width: 93px;
      height: 23px;
    }

    .ml {
      width: 40%;
    }
  }

  .sponsor-details {
    position: absolute;
    top: 345px;
    width: 100%;
    ;

    .videowrapperbanner {
      display: flex;
      margin: 0 auto;
      width: 50%;
      height: 40px;
      background-image: url('~images/sponsor/videotab_bed.png');
      background-size: contain;
      background-repeat: no-repeat;
      padding: 4px 4px 0 4px;
      text-align: center;
      color: #fff;

      .videowrapper {
        width: 50%;
        height: 100%;
      }

      .active {
        background-image: url('~images/sponsor/videotab_active.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    &.no-video {
      top: 395px;

      .text {
        margin-top: 30px;
      }
    }

    h3 {
      margin: 0 auto;
      line-height: initial;
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }

    .subtitle {
      margin-bottom: 5px;
      letter-spacing: 4px;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }

    .video-wrapper {
      position: relative;
      display: block;
      margin: 0 auto;

      .video-img {
        display: block;
        margin: 0 auto;
      }

      .video {
        box-sizing: border-box;
      }
    }

    .text {
      margin: 0 auto;
      width: 355px;
      height: 172px;
      overflow: scroll;
      padding: 10px;
      color: #fff;
      border-radius: 15px;
      background: rgba(0, 0, 0, 0.46);

      p {
        text-indent: 20px;
        margin-bottom: 0;
        line-height: 1.2;
        letter-spacing: 0;
        font-size: 12px;
      }
    }
  }

  .sponsor-sub-details {
    position: absolute;
    top: 840px;
    width: 100%;

    .sdy-sub-logo {
      margin: 0 auto 20px;
      width: 143px;
      height: 35px;

      img {
        width: 100%;
      }
    }

    .sub-text {
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
  }

  .right-title {
    position: absolute;
    bottom: 270px;
    right: 18px;
    color: #fff;
    text-align: right;

    p {
      margin-bottom: 0;
    }

    .t1 {
      font-size: 18px;
      font-weight: 700;
      text-decoration: underline;
    }

    .t2 {
      width: 109%;
      font-size: 10px;
      transform: scale(0.83);
    }
  }

  .bottom-icon {
    position: absolute;
    bottom: 62px;
    display: flex;
    width: 100%;
    height: auto;

    div {
      flex: 1;
      text-align: center;

      img {
        width: 80%;
      }

      span {
        display: block;
        font-size: 10px;
        color: #fff;
      }
    }
  }
}
</style>
