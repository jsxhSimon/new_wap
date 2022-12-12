<template>
  <div class="swiperAs row no-wrap">
    <span class="marquee-icon"><i class="iconfont icon-gonggao"></i></span>

    <template v-if="noticeList && !emptyNoticeList">
      <div class="marquee-box">
        <Vue3Marquee :duration="speed">
          <span @click.stop="showAlert(item)" v-for="(item, index) in noticeList" :key="index" :data-textval="item.noticeContent" :data-indexval="index">{{ `${item.noticeTitle}:${item.noticeContent}` }}</span>
        </Vue3Marquee>
      </div>
    </template>
    <p v-else class="text">{{ $t('暂时还没有系统公告哦！') }}</p>

    <!-- <span class="iconlingdang iconfont iconling"></span>这里是系统发送公告的地方，想发什就发什么吧... -->
    <q-dialog v-model="adAlert">
      <q-card class="asAlert">
        <q-card-section class="row items-center q-pb-none asAlert-header">
          <div class="text-header">{{ $t('公告消息') }}</div>
          <q-space/>
          <q-btn class="close-btn" icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <div class="ctt">
          <img class="_img" v-if="img" :src="img">
          <h5 class="adAlertTitle" v-if="title">{{ title }}</h5>
          <div class="content" v-html="content"></div>
          <div class="asAlertBtn" @click="adAlert=false">{{ $t('我知道了') }}</div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Vue3Marquee } from 'vue3-marquee'

interface Props {
  noticeList: INotice[],
  emptyNoticeList: any;
}
const props = defineProps<Props>()
const adAlert = ref(false)
const content = ref('')
const title = ref('')
const img = ref('')
const classOption = reactive({
  limitMoveNum: 1,
  direction: 2,
  step: 0.6,
  hoverStop: false,
})

const speed = computed(() => {
  const len = props.noticeList.reduce((a, b) => a + b.noticeTitle.length + b.noticeContent.length + 1, 0)
  return len / 1000 * 180
})


const showAlert = (notice: INotice) => {
  adAlert.value = true
  content.value = notice.noticeContent.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
  title.value = notice.noticeTitle
  img.value = notice.showType === '2' ? notice.mbPath : ''
}
</script>

<style lang="scss">
.swiperAs {
  width: 347px;
  height: 20px;
  display: flex;
  align-items: center;
  margin: 5px auto 20px;
  overflow: hidden;
  height: 20px;
  line-height: 20px;
  background: var(--bg1);
  font-size: 10px;
  .marquee-icon {
    display: block;
    width: 20px;
    height: 20px;
    background: var(--lg);
    border-radius: 4px 0 0 4px;
    color: #fff;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 10px;
    }
  }
  .marquee-box {
    margin-left: 5px;
    span {
      margin-right: 20px;
    }
  }
}
.q-dialog {
  .q-dialog__inner {
    .asAlert {
      width: 315px;
      border-radius: 8px;
      font-size: 14px;
      &-header {
        padding: 0;
        height: 40px;
        text-align: center;
      }
      .text-header {
        width: 100%;
      }
      .close-btn {
        position: absolute;
        right: 0;
        top: 0;
        min-height: 40px;
        color: var(--t4);
      }
      .ctt {
        background: var(--dialog-bg);
        padding: 20px 14px;
        max-height: 281px;
        @include overflow();
        word-break: break-all;
        color: var(--t2);
        h5 {
          margin: 0 0 8px 0;
          text-align: center;
          color: var(--t1);
          font-size: 14px;
          line-height: 1.3;
        }
        .asAlertBtn {
          width: fit-content;
          height: 24px;
          line-height: 24px;
          border-radius: 6px;
          background: var(--lg2);
          color: var(--t5);
          padding: 0 20px;
          margin: 20px auto 0;
        }
      }
    }
  }
}
</style>
