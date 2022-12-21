<template>
  <q-page class="sponsor">
    <div class="header-container">
      <div class="iconfont icon-xiangzuo1"></div>
      <div class="title">{{ teamData.titleStr }}</div>
    </div>
    <div class="sidebar">
      <div :class="['sidebar-item', teamData.activeTeam === 'manlian' && 'on']" @click="changeTeam('manlian')">
        <div class="wrapper">
          <img src="~images/sponsor/manlian.png" alt="">
        </div>
      </div>
      <div :class="['sidebar-item', teamData.activeTeam === 'liwupu' && 'on']" @click="changeTeam('liwupu')">
        <div class="wrapper">
          <img src="~images/sponsor/liwupu.png" alt="">
        </div>
      </div>
      <div class="sidebar-item"></div>
    </div>
    <div class="top-logo">
      <img src="~images/sponsor/team_logo.png" alt="" class="team-logo">
      <span class="line"></span>
      <img class="plat-logo" src="~images/sponsor/plat_logo.png" alt="">
    </div>
    <div class="sdy-logo">
      <img class="sdy" src="~images/sponsor/SDY-Logo.png" alt="">
      <span class="line"></span>
      <img class="ml" :src="useImgPath(`sponsor/${teamData.activeTeam === 'manlian' ? 'ml' : 'lwp'}.png`)" alt="">
    </div>

    <div class="sponsor-details">
      <h3>{{ teamData.teamName }}</h3>
      <p class="subtitle">
        <span>.</span>
        {{ $t('亚洲区独家合作伙伴') }}
        <span>.</span>
      </p>
      <div class="video-wrapper" style="minHeight: 196px">
        <img src="~images/sponsor/video.png" class="video-img" alt="" style="width: 340px;height:210px">
        <video style="padding-top:8px; width: 280px; height: 165px" playsinline='true' webkit-playsinline='true'
          x5-playsinline='true' controls class="video absolute-center"
          src="https://video.51renqijie.com/video/SDY-CNY-8ver4.mp4" poster="~images/sponsor/nian.jpg" />
      </div>
      <div class="text">
        <p>{{ teamData.desc }}</p>
      </div>
    </div>

    <div class="sponsor-sub-details">
      <div class="sdy-sub-logo">
      </div>
      <div class="sub-text">
        {{
            $t('SDY体育是亚洲知名的体育线上娱乐品牌，经过多年的发展，SDY体育以其专业的技术团队、多年的运营经验，深受广大体育爱好者和商业合作伙伴好评。成立至今，SDY体育凭借不断进取与开拓的品牌精神，专注于技术、产品、服务三个重要维度的升级，以其良好的行业与用户口碑，经过多年的品牌打磨，在众多同类型行业产品当中脱颖而出，最终成为行业屈指可数的领先品牌；')
        }}
      </div>
    </div>

    <div class="right-title">
      <p class="t1">{{ $t('SDY体育权威认证') }}</p>
      <p class="t2">CERTIFICATION</p>
      <p class="t2">AUTHORITY</p>
    </div>

    <div class="bottom-icon">
      <div><img src="~images/sponsor/gc.png" alt="">
        <span>{{ $t('英国GC') }}</span>
      </div>
      <div><img src="~images/sponsor/mga.png" alt="">
        <span>{{ $t('马耳他博彩牌照') }}</span>
      </div>
      <div><img src="~images/sponsor/fsc.png" alt="">
        <span>{{ $t('英属维尔京群岛') }}</span>
      </div>
      <div><img src="~images/sponsor/flb.png" alt="">
        <span>{{ $t('菲律宾(PAGCOR)') }}</span>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>

import { i18n } from 'boot/i18n'
import { useImgPath } from 'src/utils/useImgpath';
import { computed, reactive, ref } from 'vue'
const { t: lang } = i18n.global

const teamData = reactive({
  titleStr: '曼城',
  teamName: '曼城足球俱乐部',
  bgUrl: 'bg',
  activeTeam: 'manlian',
  desc: lang('曼城俱乐部是最近十年里英超最成功的俱乐部，一共赢下十几座冠军奖杯，并且最近4年拿下了3个英超冠军，统治力十足。SDY体育同曼城俱乐部签约三年，在未来SDY体育将会和曼城俱乐部在体育层面展开多元化的探索与合作，共同推出基于娱乐体育领域的线上线下活动，为广大球迷带来畅快的游戏娱乐体验！随着这份合作协议的签署，SDY体育国际化战略将再上一个新台阶；')
})

const changeTeam = (type: string) => {
  teamData.activeTeam = type;
  teamData.teamName = type === 'manlian' ? '曼城足球俱乐部' : '利物浦足球俱乐部';
  teamData.desc = type === 'manlian' ? lang('曼城俱乐部是最近十年里英超最成功的俱乐部，一共赢下十几座冠军奖杯，并且最近4年拿下了3个英超冠军，统治力十足。SDY体育同曼城俱乐部签约三年，在未来SDY体育将会和曼城俱乐部在体育层面展开多元化的探索与合作，共同推出基于娱乐体育领域的线上线下活动，为广大球迷带来畅快的游戏娱乐体验！随着这份合作协议的签署，SDY体育国际化战略将再上一个新台阶；') : lang('作为英超传统豪门的利物浦，最近几年在克洛普教练的带领下重回巅峰，先后拿下18/19赛季的欧洲冠军联赛冠军和19/20赛季的英格兰超级联赛冠军，此次与利物浦俱乐部的合作，无疑是SDY体育全球化战略布局中的关键一步，同时也展现了SDY体育雄厚的资金实力。在未来，SDY体育将同利物浦俱乐部携手，进一步推进品牌升值、拓展市场，为广大用户带来最畅快的线上体育娱乐体验；')
  teamData.bgUrl = type === 'manlian' ? 'bg' : 'bg2';
}



const bg = computed(() => {
  return `url(${useImgPath(`sponsor/${teamData.bgUrl}.jpg`)})`;
}) 
</script>

<style lang="scss" scoped>
.sponsor {
  height: 1462px;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  padding-top: 44px;
  background-image: v-bind(bg);

  .sidebar {
    position: fixed;
    top: 143px;
    width: 40px;
    height: 100px;
    border-radius: 0 10px 10px 0;
    background-color: var(--bg9);
    overflow: hidden;
    z-index: 999;

    .sidebar-item {
      height: 50px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .wrapper {
        width: 25px;
        height: 25px;
        overflow: hidden;
        border-radius: 50%;
        background-color: var(--bg1);
      }

      &.on {
        background-color: #cfb79d;
      }

      img {
        width: 25px;
        height: 25px;
      }
    }
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 10px;
    left: 0;
    width: 100%;
    height: 28px;
    color: var(--t5);
    font-size: 18px;

    .icon-xiangzuo1 {
      position: absolute;
      left: 15px;
      font-size: 20px;
    }

    .title {
      flex-grow: 1;
      text-align: center;
    }
  }

  .top-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    .team-logo {
      width: 40px;
      height: 40px;
    }

    .line {
      background-color: var(--t5);
      font-size: 40px;
      width: 1px;
      height: 27px;
      margin: 0 18px 0 10px;
    }

    .plat-logo {
      width: 130px;
    }
  }

  .sdy-logo {
    position: absolute;
    top: 360px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 222px;
    height: 34px;
    background: var(--bg1);
    box-shadow: var(--box-shadow1);
    border-radius: 17px;

    .sdy {
      width: 93px;
      height: 23px;
    }

    .line {
      width: 1px;
      height: 20px;
      background-color: var(--bg7);
    }

    .ml {
      width: 40%;
    }
  }

  .sponsor-details {
    position: absolute;
    top: 440px;
    width: 100%;

    h3 {
      margin: 0 auto;
      line-height: initial;
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: bold;
      text-align: center;
      color: var(--t5);
    }

    .subtitle {
      margin-bottom: 5px;
      letter-spacing: 4px;
      text-align: center;
      font-size: 12px;
      color: var(--t5);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      span {
        transform: translateY(-3px);
      }

      &::before,
      &::after {
        content: "";
        position: absolute;
        background: var(--bg1);
        width: 20px;
        height: 1px;
        left: 82px;
      }

      &::after {
        left: auto;
        right: 87px;
      }

    }

    .video-wrapper {
      position: relative;
      display: block;
      margin: 29px auto 0;

      .video-img {
        display: block;
        margin: 0 auto;
      }

      .video {
        box-sizing: border-box;
      }
    }

    .text {
      margin: 30px auto;
      width: 355px;
      padding: 15px;
      color: var(--t5);
      border-radius: 15px;
      background: var(--bg8);


      p {
        text-indent: 20px;
        margin-bottom: 0;
        line-height: 1.3;
        letter-spacing: 0;
        font-size: 14px;
      }
    }
  }

  .sponsor-sub-details {
    position: absolute;
    top: 1000px;
    width: 100%;
    display: flex;
    justify-content: center;

    .sub-text {
      width: 355px;
      padding: 15px;
      color: var(--t5);
      border-radius: 15px;
      font-size: 14px;
      line-height: 1.2;

    }
  }

  .right-title {
    position: absolute;
    bottom: 190px;
    right: 18px;
    color: var(--t5);
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
