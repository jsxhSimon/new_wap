<template>
  <div class="rcmd" v-if="hasdata">
    <h5 class="fxi"><img src="./images/Title-guide@2x.png">{{ $t('猜你喜欢') }}</h5>
    <van-swipe :autoplay="0" :show-indicators='false' :stop-propagation='false'>
      <van-swipe-item v-for="(_, i) in gamelist" :key="i">
        <ul class="item fxi"><li v-for="(_i,j) in _" :key="j" @click="enterGame(_i)"><img :src="_i.logo"><p>{{_i.gameName}}</p></li></ul>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in sportlistFb" :key="10+i">
        <div class="sport" @click="entergameFb(_)">
          <p class="tt fxi"><i>{{fmtFb(_)}}</i><span>{{_.name}}</span></p>
          <div class="tm fxi">
            <p class="fxi">
              <i>{{_.list[0].ts[0].na}}</i>
              <span><img :src="_.list[0].ts[0].lurl"></span></p>
            <i>VS</i>
            <p class="fxi">
              <span><img :src="_.list[0].ts[1].lurl">></span>
              <i>{{_.list[0].ts[1].na}}</i>
            </p>
          </div>
          <i class="line"></i><p class="bt">{{ $t('前往投注') }}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in sportlist" :key="100+i">
        <div class="sport" @click="entergame(_)">
          <p class="tt fxi"><i>{{fmt(_)}}</i><span>{{_.tn}}</span></p>
          <div class="tm fxi">
            <p class="fxi"><i>{{_.mhn}}</i><span><img :src="imgPrefix + _.mhlu[0]"></span></p>
            <i>VS</i>
            <p class="fxi"><span><img :src="imgPrefix + _.malu[0]"></span><i>{{_.man}}</i></p>
          </div>
          <i class="line"></i><p class="bt">{{ $t('前往投注') }}</p>
        </div>
      </van-swipe-item>
      <van-swipe-item v-for="(_, i) in gamelistl" :key="1000+i">
        <ul class="item fxi"><li v-for="(_i,j) in _" :key="j" @click="enterGame(_i)"><img :src="_i.logo"><p>{{_i.gameName}}</p></li></ul>
      </van-swipe-item>
    </van-swipe>
    <div class="loading" v-if="loading"><q-spinner-dots color="primary" size="40px" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import {Swipe as VanSwipe, SwipeItem as VanSwipeItem} from 'vant'
import { imgPrefix } from 'src/utils/sports'
import { LocalStorage, SessionStorage } from 'quasar'
import { SUB_LEVEL_GAMES } from 'src/assets/gameCategories'
import { groupBy, groupByKey } from 'src/utils'

const gamelist = ref([])

</script>

<style lang="scss" scoped>
.rcmd {
  padding: 0;
  height: 128px;
  padding: 0 14px;
  box-sizing: border-box;
  margin: -6px 0 14px;
  position: relative;
  .van-swipe {
    height: 119px;
  }
  .loading {
    position: absolute;
    left: calc(50% - 20px);
    top: 56px;
  }
  .sport {
    width: 99%;
    margin-left: 2px;
    margin-top: 5px;
    padding-top: 3px;
    color: #666;
    background: #FFFFFF;
    box-shadow: 0px 2px 5px rgba(136, 136, 136, 0.302);
    border-radius: 12px;
    .line {
      display: block;
      height: 1px;
      background: rgba(32, 32, 33, 0.08);
      margin: 0 12px;
      margin-top: 15px;
    }
    .bt {
      line-height: 32px;
      text-align: center;
      font-size: 13px;
      color: #D4B699;
    }
    .tm {
      justify-content: space-between;
      margin: 10px 0;
      >i {
        font-size: 18px;
        color: #D4B699;
      }
      p {
        width: 120px;
        background: #D0C3A6;
        height: 28px;
        position: relative;
        >span {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          box-sizing: border-box;
          border: 2px solid #a0846f;
        }
        i {
          line-height: 28px;
          width: 98px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }
        &:first-child {
          padding-left: 5px;
          span {
            right: -10px;
          }
          i {
            text-align: right;
            padding-right: 8px;
          }
        }
        &:last-child {
          padding-left: 18px;
          box-sizing: border-box;
          span {
            left: -10px;
          }
          i {
            padding-left: 8px;
          }
        }
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .tt {
      justify-content: space-between;
      padding: 0 10px;
      span {
        max-width: 139px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .item {
    height: 114px;
    justify-content: space-around;
    li {
      background: #FFFFFF;
      box-shadow: 0px 0px 10px rgba(18, 18, 18, 0.1);
      border-radius: 4px;
      height: 98px;
      width: 74px;
      text-align: center;
      font-size: 12px;
      color: #666;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      img {
        height: 58px;
        margin: 8px 0 5px 0;
        border-radius: 5px;
      }
    }
  }
  h5 {
    font-size: 13px;
    line-height: 20px;
    color: #222;
    margin: 0;
    padding: 0;
    img {
      height: 12px;
      margin-right: 5px;
    }
  }
}

h5,p {
  margin: 0;
  padding: 0;
}
i {
  font-style: normal;
}
.fxi {
  display: flex;
  align-items: center;
}
</style>